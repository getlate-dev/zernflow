import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createLateClient } from "@/lib/late-client";
import { processComment } from "@/lib/comment-processor";
import type { Database } from "@/lib/types/database";

type Channel = Database["public"]["Tables"]["channels"]["Row"];
type Trigger = Database["public"]["Tables"]["triggers"]["Row"];

/**
 * Comment polling cron handler.
 * Called by Vercel Cron every 5 minutes.
 *
 * GET /api/cron/comments?key=CRON_SECRET
 *
 * For each active channel with comment_keyword triggers:
 * 1. Fetch posts via Late SDK inbox/comments (covers ALL posts, not just Late-published)
 * 2. Fetch comments for each post
 * 3. Match against comment_keyword triggers
 * 4. Process matches (upsert contact, reply, DM via flow)
 * 5. Update cursor
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret =
    request.nextUrl.searchParams.get("key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Find all channels that have active comment_keyword triggers
  const { data: triggers } = await supabase
    .from("triggers")
    .select("*, flows!inner(status, workspace_id)")
    .eq("type", "comment_keyword")
    .eq("is_active", true)
    .eq("flows.status", "published");

  if (!triggers?.length) {
    return NextResponse.json({ message: "No active comment triggers", processed: 0 });
  }

  // Group triggers by channel_id (null channel_id means global/all channels)
  const triggersByChannel = new Map<string | "global", Trigger[]>();

  for (const trigger of triggers) {
    const key = trigger.channel_id || "global";
    const existing = triggersByChannel.get(key) || [];
    existing.push(trigger);
    triggersByChannel.set(key, existing);
  }

  // Get unique channel IDs from triggers (non-global)
  const channelIds = Array.from(triggersByChannel.keys()).filter(
    (k) => k !== "global"
  );

  // Also fetch all active channels for global triggers
  const globalTriggers = triggersByChannel.get("global") || [];

  let channelQuery = supabase
    .from("channels")
    .select("*")
    .eq("is_active", true);

  if (globalTriggers.length === 0 && channelIds.length > 0) {
    // Only fetch channels that have specific triggers
    channelQuery = channelQuery.in("id", channelIds);
  }

  const { data: channels } = await channelQuery;

  if (!channels?.length) {
    return NextResponse.json({ message: "No active channels", processed: 0 });
  }

  let totalProcessed = 0;
  let totalMatched = 0;
  let totalErrors = 0;

  for (const channel of channels) {
    try {
      const result = await pollChannelComments(
        supabase,
        channel,
        triggersByChannel,
        globalTriggers
      );
      totalProcessed += result.processed;
      totalMatched += result.matched;
      totalErrors += result.errors;
    } catch (err) {
      console.error(
        `Error polling comments for channel ${channel.id}:`,
        err
      );
      totalErrors++;
    }
  }

  return NextResponse.json({
    processed: totalProcessed,
    matched: totalMatched,
    errors: totalErrors,
    channels: channels.length,
  });
}

async function pollChannelComments(
  supabase: ReturnType<typeof createServiceClient> extends Promise<infer T>
    ? T
    : never,
  channel: Channel,
  triggersByChannel: Map<string | "global", Trigger[]>,
  globalTriggers: Trigger[]
): Promise<{ processed: number; matched: number; errors: number }> {
  // Collect all applicable triggers for this channel
  const channelTriggers = triggersByChannel.get(channel.id) || [];
  const allTriggers = [...channelTriggers, ...globalTriggers];

  if (allTriggers.length === 0) {
    return { processed: 0, matched: 0, errors: 0 };
  }

  // Get workspace API key
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("late_api_key_encrypted")
    .eq("id", channel.workspace_id)
    .single();

  if (!workspace?.late_api_key_encrypted) {
    console.error(`No Late API key for workspace ${channel.workspace_id}`);
    return { processed: 0, matched: 0, errors: 0 };
  }

  const late = createLateClient(workspace.late_api_key_encrypted);

  // Fetch posts from the inbox/comments endpoint (covers ALL posts, not just Late-published)
  let posts: Array<{ id: string; commentCount: number }>;
  try {
    const res = await late.comments.listInboxComments({
      query: { accountId: channel.late_account_id },
    });

    const items = (res.data as any)?.data ?? [];
    posts = items.map((item: any) => ({
      id: item.id,
      commentCount: item.commentCount ?? 0,
    }));
  } catch (err) {
    console.error(`Failed to fetch inbox comments for channel ${channel.id}:`, err);
    return { processed: 0, matched: 0, errors: 1 };
  }

  if (posts.length === 0) {
    return { processed: 0, matched: 0, errors: 0 };
  }

  let processed = 0;
  let matched = 0;
  let errors = 0;

  for (const post of posts) {
    try {
      const commentsRes = await late.comments.getInboxPostComments({
        path: { postId: post.id },
        query: { accountId: channel.late_account_id },
      });

      // Flatten top-level comments and their replies
      const rawComments = (commentsRes.data as any)?.comments ?? [];
      const allComments: any[] = [];
      for (const c of rawComments) {
        allComments.push(c);
        if (c.replies?.length) {
          allComments.push(...c.replies);
        }
      }

      if (!allComments.length) continue;

      // Sort by created date ascending so we process oldest first
      const sortedComments = allComments.sort(
        (a: any, b: any) =>
          new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
      );

      // Skip comments from the account owner
      const nonOwnerComments = sortedComments.filter(
        (c: any) => !c.from?.isOwner
      );

      for (const comment of nonOwnerComments) {
        // Check if already processed (dedup via unique index)
        const { data: existing } = await supabase
          .from("comment_logs")
          .select("id")
          .eq("channel_id", channel.id)
          .eq("platform_comment_id", comment.id)
          .single();

        if (existing) continue;

        const result = await processComment(supabase, channel, {
          id: comment.id,
          comment: comment.message || "",
          created: comment.createdTime || "",
          platform: comment.platform || channel.platform,
          postId: post.id,
          commenter: comment.from ? {
            id: comment.from.id,
            name: comment.from.name,
            username: comment.from.username,
          } : undefined,
        }, allTriggers);

        processed++;
        if (result.matched) matched++;
        if (result.error) errors++;
      }
    } catch (err) {
      console.error(
        `Failed to fetch comments for post ${post.id}:`,
        err
      );
      errors++;
    }
  }

  return { processed, matched, errors };
}
