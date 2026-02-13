import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createLateClient } from "@/lib/late-client";
import { processComment } from "@/lib/comment-processor";
import type { Database } from "@/lib/types/database";

type Channel = Database["public"]["Tables"]["channels"]["Row"];
type Trigger = Database["public"]["Tables"]["triggers"]["Row"];

/**
 * Comment polling cron handler.
 * Called by Vercel Cron or external scheduler every 60 seconds.
 *
 * GET /api/cron/comments?key=CRON_SECRET
 *
 * For each active channel with comment_keyword triggers:
 * 1. Fetch recent posts from Late API history
 * 2. Fetch comments for each post
 * 3. Filter to only new comments (after cursor)
 * 4. Match against comment_keyword triggers
 * 5. Process matches (upsert contact, reply, DM via flow)
 * 6. Update cursor
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret =
    request.nextUrl.searchParams.get("key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (cronSecret && providedSecret !== cronSecret) {
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
    return { processed: 0, matched: 0, errors: 0 };
  }

  const late = createLateClient(workspace.late_api_key_encrypted);

  // Fetch recent posts for this channel via Late API
  let posts: Array<{ id: string; platforms: string[] }>;
  try {
    const res = await late.posts.listPosts({
      query: {
        platform: channel.platform,
        status: "published",
        limit: 50,
      },
    });

    const postItems = (res.data as any)?.posts ?? [];
    posts = postItems
      .filter((item: any) => item?._id || item?.id)
      .map((item: any) => ({
        id: item._id || item.id,
        platforms: item.platforms?.map((p: any) => p.platform) || [channel.platform],
      }));
  } catch (err) {
    console.error(`Failed to fetch posts for channel ${channel.id}:`, err);
    return { processed: 0, matched: 0, errors: 1 };
  }

  if (posts.length === 0) {
    return { processed: 0, matched: 0, errors: 0 };
  }

  const cursor = channel.last_comment_cursor;
  let latestCommentId = cursor;
  let processed = 0;
  let matched = 0;
  let errors = 0;

  for (const post of posts) {
    try {
      const commentsRes = await late.comments.getInboxPostComments({
        path: { postId: post.id },
        query: { accountId: channel.late_account_id },
      });

      const comments = (commentsRes.data as any)?.comments ?? [];
      if (!comments.length) continue;

      // Sort by created date ascending so we process oldest first
      const sortedComments = comments.sort(
        (a: any, b: any) =>
          new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
      );

      // Filter to comments we have not seen yet (after cursor)
      let newComments = sortedComments;
      if (cursor) {
        const cursorIndex = sortedComments.findIndex((c: any) => c.id === cursor);
        if (cursorIndex >= 0) {
          newComments = sortedComments.slice(cursorIndex + 1);
        }
        // If cursor not found in this post, check if we already logged this comment
      }

      for (const comment of newComments) {
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

        // Track the latest comment ID we processed
        latestCommentId = comment.id;
      }
    } catch (err) {
      console.error(
        `Failed to fetch comments for post ${post.id}:`,
        err
      );
      errors++;
    }
  }

  // Update the cursor if we processed anything new
  if (latestCommentId && latestCommentId !== cursor) {
    await supabase
      .from("channels")
      .update({ last_comment_cursor: latestCommentId })
      .eq("id", channel.id);
  }

  return { processed, matched, errors };
}
