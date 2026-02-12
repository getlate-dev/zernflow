import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/types/database";
import { executeFlow } from "@/lib/flow-engine/engine";
import { createLateClient } from "@/lib/late-client";

type Channel = Database["public"]["Tables"]["channels"]["Row"];
type Trigger = Database["public"]["Tables"]["triggers"]["Row"];

interface Comment {
  id: string;
  comment: string;
  created: string;
  platform: string;
  postId: string;
  commenter?: {
    id?: string;
    name?: string;
    username?: string;
  };
}

interface CommentKeywordConfig {
  keywords: Array<{
    value: string;
    matchType?: "exact" | "contains" | "startsWith";
  }>;
  postIds?: string[];
  replyText?: string;
}

/**
 * Process a single comment against all comment_keyword triggers for a channel.
 *
 * Steps:
 * 1. Match comment text against trigger keywords
 * 2. If matched: upsert contact, log the comment, optionally reply, send DM via flow
 */
export async function processComment(
  supabase: SupabaseClient<Database>,
  channel: Channel,
  comment: Comment,
  triggers: Trigger[]
): Promise<{ matched: boolean; triggerId?: string; error?: string }> {
  const text = comment.comment.toLowerCase().trim();
  if (!text) return { matched: false };

  // Find the first matching trigger
  let matchedTrigger: Trigger | null = null;

  for (const trigger of triggers) {
    const config = trigger.config as unknown as CommentKeywordConfig;
    if (!config.keywords?.length) continue;

    // If trigger is scoped to specific posts, check post ID
    if (config.postIds?.length && !config.postIds.includes(comment.postId)) {
      continue;
    }

    for (const kw of config.keywords) {
      const keyword = kw.value.toLowerCase();
      const matchType = kw.matchType || "contains";

      if (matchType === "exact" && text === keyword) {
        matchedTrigger = trigger;
        break;
      }
      if (matchType === "contains" && text.includes(keyword)) {
        matchedTrigger = trigger;
        break;
      }
      if (matchType === "startsWith" && text.startsWith(keyword)) {
        matchedTrigger = trigger;
        break;
      }
    }

    if (matchedTrigger) break;
  }

  if (!matchedTrigger) {
    // Log unmatched comment without trigger reference
    await supabase.from("comment_logs").upsert(
      {
        channel_id: channel.id,
        workspace_id: channel.workspace_id,
        post_id: comment.postId,
        platform_comment_id: comment.id,
        author_id: comment.commenter?.id || null,
        author_name: comment.commenter?.name || null,
        author_username: comment.commenter?.username || null,
        comment_text: comment.comment,
        matched_trigger_id: null,
        dm_sent: false,
        reply_sent: false,
      },
      { onConflict: "channel_id,platform_comment_id" }
    );
    return { matched: false };
  }

  const config = matchedTrigger.config as unknown as CommentKeywordConfig;

  try {
    // Upsert contact from commenter info
    const senderId = comment.commenter?.id || `comment_${comment.id}`;
    const senderName =
      comment.commenter?.name ||
      comment.commenter?.username ||
      "Unknown commenter";

    let contactId: string;

    const { data: existingContactChannel } = await supabase
      .from("contact_channels")
      .select("contact_id")
      .eq("channel_id", channel.id)
      .eq("platform_sender_id", senderId)
      .single();

    if (existingContactChannel) {
      contactId = existingContactChannel.contact_id;
      await supabase
        .from("contacts")
        .update({ last_interaction_at: new Date().toISOString() })
        .eq("id", contactId);
    } else {
      const { data: newContact } = await supabase
        .from("contacts")
        .insert({
          workspace_id: channel.workspace_id,
          display_name: senderName,
          last_interaction_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (!newContact) {
        return { matched: true, error: "Failed to create contact" };
      }

      contactId = newContact.id;

      await supabase.from("contact_channels").insert({
        contact_id: contactId,
        channel_id: channel.id,
        platform_sender_id: senderId,
        platform_username: comment.commenter?.username || null,
      });
    }

    // Get workspace API key for sending replies/DMs
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("late_api_key_encrypted")
      .eq("id", channel.workspace_id)
      .single();

    let replySent = false;
    let dmSent = false;

    // Post public reply if configured
    if (config.replyText && workspace?.late_api_key_encrypted) {
      try {
        const late = createLateClient(workspace.late_api_key_encrypted);
        await late.replyComment({
          commentId: comment.id,
          platforms: [comment.platform],
          comment: config.replyText,
        });
        replySent = true;
      } catch (err) {
        console.error("Failed to post comment reply:", err);
      }
    }

    // Upsert conversation for the DM flow
    const { data: conversation } = await supabase
      .from("conversations")
      .upsert(
        {
          workspace_id: channel.workspace_id,
          channel_id: channel.id,
          contact_id: contactId,
          platform: channel.platform,
          status: "open",
          last_message_at: new Date().toISOString(),
          last_message_preview: `[Comment] ${comment.comment.slice(0, 80)}`,
        },
        { onConflict: "channel_id,contact_id" }
      )
      .select("id")
      .single();

    if (conversation) {
      // Execute the flow (sends DM as part of flow traversal)
      try {
        await executeFlow(supabase, {
          triggerId: matchedTrigger.id,
          flowId: matchedTrigger.flow_id,
          channelId: channel.id,
          contactId,
          conversationId: conversation.id,
          workspaceId: channel.workspace_id,
          incomingMessage: {
            text: comment.comment,
            sender: {
              id: senderId,
              name: comment.commenter?.name,
              username: comment.commenter?.username,
            },
          },
          variables: {
            comment_text: comment.comment,
            commenter_name: senderName,
            post_id: comment.postId,
          },
        });
        dmSent = true;
      } catch (err) {
        console.error("Failed to execute comment flow:", err);
      }
    }

    // Track analytics
    await supabase.from("analytics_events").insert({
      workspace_id: channel.workspace_id,
      flow_id: matchedTrigger.flow_id,
      contact_id: contactId,
      event_type: "comment_matched",
      metadata: {
        triggerId: matchedTrigger.id,
        postId: comment.postId,
        commentId: comment.id,
        keyword: text,
        dmSent,
        replySent,
      } as unknown as Json,
    });

    // Log the processed comment
    await supabase.from("comment_logs").upsert(
      {
        channel_id: channel.id,
        workspace_id: channel.workspace_id,
        post_id: comment.postId,
        platform_comment_id: comment.id,
        author_id: comment.commenter?.id || null,
        author_name: comment.commenter?.name || null,
        author_username: comment.commenter?.username || null,
        comment_text: comment.comment,
        matched_trigger_id: matchedTrigger.id,
        dm_sent: dmSent,
        reply_sent: replySent,
      },
      { onConflict: "channel_id,platform_comment_id" }
    );

    return { matched: true, triggerId: matchedTrigger.id };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    // Log with error
    await supabase.from("comment_logs").upsert(
      {
        channel_id: channel.id,
        workspace_id: channel.workspace_id,
        post_id: comment.postId,
        platform_comment_id: comment.id,
        author_id: comment.commenter?.id || null,
        author_name: comment.commenter?.name || null,
        author_username: comment.commenter?.username || null,
        comment_text: comment.comment,
        matched_trigger_id: matchedTrigger.id,
        dm_sent: false,
        reply_sent: false,
        error: errorMessage,
      },
      { onConflict: "channel_id,platform_comment_id" }
    );

    return { matched: true, triggerId: matchedTrigger.id, error: errorMessage };
  }
}
