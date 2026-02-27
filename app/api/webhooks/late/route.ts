import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { executeFlow } from "@/lib/flow-engine/engine";
import { matchTrigger } from "@/lib/flow-engine/trigger-matcher";
import { dispatchWebhookEvent } from "@/lib/webhook-dispatcher";
import crypto from "crypto";

// ── Late API webhook payload (actual shape from status-webhook.ts) ───────────

interface WebhookPayload {
  event: string;
  message: {
    id: string;
    conversationId: string;
    platform: string;
    platformMessageId: string;
    direction: string;
    text: string | null;
    attachments: Array<{ type: string; url: string; payload?: string }>;
    sender: {
      id: string;
      name: string;
      username: string | null;
      picture: string | null;
    };
    sentAt: string;
    isRead: boolean;
  };
  conversation: {
    id: string;
    platformConversationId: string | null;
    participantId: string;
    participantName: string;
    participantUsername: string | null;
    participantPicture: string | null;
    status: string;
  };
  account: {
    id: string;
    platform: string;
    username: string;
    displayName: string;
  };
  metadata?: {
    quickReplyPayload?: string;
    callbackData?: string;
    postbackPayload?: string;
    postbackTitle?: string;
  };
  timestamp: string;
}

// ── Webhook handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    return await handleWebhook(request);
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleWebhook(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-late-signature");

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only handle message.received events
  if (payload.event !== "message.received") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { message: msg, conversation: conv, account, metadata } = payload;

  // Ignore outbound messages (sent by the bot itself) to prevent loops
  if (msg.direction === "outbound") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const supabase = await createServiceClient();

  // Idempotency: skip if this message was already processed
  if (msg.platformMessageId) {
    const { data: existing } = await supabase
      .from("messages")
      .select("id")
      .eq("platform_message_id", msg.platformMessageId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, skipped: true, reason: "duplicate" });
    }
  }

  // Look up channel by late_account_id
  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("late_account_id", account.id)
    .eq("is_active", true)
    .single();

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  // Prevent loops: if the sender is another connected account in this
  // workspace, skip. This happens when both sides of a DM conversation
  // are connected (e.g. during testing).
  if (msg.sender.username) {
    const { data: senderChannel } = await supabase
      .from("channels")
      .select("id")
      .eq("workspace_id", channel.workspace_id)
      .eq("username", msg.sender.username)
      .eq("is_active", true)
      .maybeSingle();

    if (senderChannel) {
      return NextResponse.json({ ok: true, skipped: true, reason: "sender_is_own_account" });
    }
  }

  // Verify HMAC-SHA256 signature
  if (channel.webhook_secret) {
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const expected = crypto
      .createHmac("sha256", channel.webhook_secret)
      .update(body)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
  }

  // ── Upsert contact ───────────────────────────────────────────────────────

  const senderId = msg.sender.id;
  const senderName = msg.sender.name || msg.sender.username || senderId;

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
        avatar_url: msg.sender.picture || null,
        last_interaction_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (!newContact) {
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 500 }
      );
    }

    contactId = newContact.id;

    await supabase.from("contact_channels").insert({
      contact_id: contactId,
      channel_id: channel.id,
      platform_sender_id: senderId,
      platform_username: msg.sender.username || null,
    });

    await supabase.from("analytics_events").insert({
      workspace_id: channel.workspace_id,
      contact_id: contactId,
      event_type: "contact_created",
    });

    // Fire-and-forget: notify outbound webhooks about the new contact
    dispatchWebhookEvent(channel.workspace_id, "contact.created", {
      contactId,
      displayName: senderName,
      platform: channel.platform,
    }).catch(() => {});
  }

  // ── Upsert conversation ──────────────────────────────────────────────────

  const messagePreview = (msg.text || "").slice(0, 100);

  const { data: conversation } = await supabase
    .from("conversations")
    .upsert(
      {
        workspace_id: channel.workspace_id,
        channel_id: channel.id,
        contact_id: contactId,
        platform: channel.platform,
        late_conversation_id: conv.id,
        status: "open",
        last_message_at: new Date().toISOString(),
        last_message_preview: messagePreview,
        unread_count: 1,
      },
      { onConflict: "channel_id,contact_id" }
    )
    .select("id, is_automation_paused")
    .single();

  if (!conversation) {
    return NextResponse.json(
      { error: "Failed to upsert conversation" },
      { status: 500 }
    );
  }

  if (existingContactChannel) {
    await supabase
      .rpc("increment_unread", {
        conv_id: conversation.id,
        preview: messagePreview,
      })
      .then(() => {});
  }

  // ── Auto-assign new conversations (round-robin) ──────────────────────────
  // When a brand-new contact sends their first message, the conversation is new.
  // If the workspace has round-robin auto-assignment enabled, assign the
  // conversation to the next team member in rotation.
  if (!existingContactChannel) {
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("auto_assign_mode, last_assigned_member_index")
      .eq("id", channel.workspace_id)
      .single();

    if (workspace?.auto_assign_mode === "round-robin") {
      // Get all active workspace members ordered by join date for stable rotation
      const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", channel.workspace_id)
        .order("created_at", { ascending: true });

      if (members && members.length > 0) {
        const nextIndex =
          ((workspace.last_assigned_member_index ?? -1) + 1) % members.length;
        const assigneeId = members[nextIndex].user_id;

        // Assign the conversation to the next member
        await supabase
          .from("conversations")
          .update({ assigned_to: assigneeId })
          .eq("id", conversation.id);

        // Advance the round-robin counter so the next conversation goes to the
        // following member
        await supabase
          .from("workspaces")
          .update({ last_assigned_member_index: nextIndex })
          .eq("id", channel.workspace_id);
      }
    }
  }

  // ── Insert message ────────────────────────────────────────────────────────

  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    direction: "inbound",
    text: msg.text || null,
    attachments: msg.attachments.length > 0 ? msg.attachments : null,
    quick_reply_payload: metadata?.quickReplyPayload || null,
    postback_payload: metadata?.postbackPayload || null,
    callback_data: metadata?.callbackData || null,
    platform_message_id: msg.platformMessageId || null,
    status: "delivered",
  });

  // Fire-and-forget: notify outbound webhooks about the received message
  dispatchWebhookEvent(channel.workspace_id, "message.received", {
    contactId,
    conversationId: conversation.id,
    text: msg.text || null,
    platform: channel.platform,
  }).catch(() => {});

  // ── Flow engine ───────────────────────────────────────────────────────────

  if (!conversation.is_automation_paused) {
    const incomingMessage = {
      text: msg.text || undefined,
      postbackPayload: metadata?.postbackPayload || undefined,
      quickReplyPayload: metadata?.quickReplyPayload || undefined,
      callbackData: metadata?.callbackData || undefined,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        username: msg.sender.username || undefined,
      },
    };

    const handled = await handleGlobalKeywords(
      supabase,
      channel.workspace_id,
      contactId,
      msg.text || undefined
    );

    if (!handled) {
      const trigger = await matchTrigger(
        supabase,
        channel.id,
        conversation.id,
        incomingMessage
      );
      if (trigger) {
        try {
          await executeFlow(supabase, {
            triggerId: trigger.id,
            flowId: trigger.flow_id,
            channelId: channel.id,
            contactId,
            conversationId: conversation.id,
            workspaceId: channel.workspace_id,
            incomingMessage,
            lateConversationId: conv.id,
            lateAccountId: account.id,
          });
        } catch (err) {
          console.error("Flow execution error:", err);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}

// ── Global keywords ─────────────────────────────────────────────────────────

// Built-in STOP keywords that always work, regardless of workspace configuration.
// These are a compliance requirement: users must always be able to opt out of
// messaging by sending any of these common unsubscribe phrases.
const STOP_KEYWORDS = ["stop", "unsubscribe", "cancel", "quit", "optout", "opt-out"];

// Built-in START keywords that always work. These allow users who previously
// opted out to re-subscribe by sending a common opt-in phrase.
const START_KEYWORDS = ["start", "subscribe", "optin", "opt-in"];

async function handleGlobalKeywords(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  workspaceId: string,
  contactId: string,
  text: string | undefined
): Promise<boolean> {
  if (!text) return false;

  const normalizedText = text.toLowerCase().trim();

  // Check built-in keywords first (always active, can't be disabled).
  // This ensures compliance-critical opt-out keywords work even if the
  // workspace hasn't configured any global keywords.
  if (STOP_KEYWORDS.includes(normalizedText)) {
    await supabase
      .from("contacts")
      .update({ is_subscribed: false })
      .eq("id", contactId);
    return true;
  }

  if (START_KEYWORDS.includes(normalizedText)) {
    await supabase
      .from("contacts")
      .update({ is_subscribed: true })
      .eq("id", contactId);
    return true;
  }

  // Then check workspace-configured keywords (custom keywords set by the user)
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("global_keywords")
    .eq("id", workspaceId)
    .single();

  if (!workspace?.global_keywords) return false;

  const keywords = workspace.global_keywords as Array<{
    keyword: string;
    action?: string;
    flowId?: string;
  }>;

  for (const kw of keywords) {
    if (normalizedText === kw.keyword.toLowerCase()) {
      if (kw.action === "unsubscribe") {
        await supabase
          .from("contacts")
          .update({ is_subscribed: false })
          .eq("id", contactId);
        return true;
      }
      if (kw.action === "subscribe") {
        await supabase
          .from("contacts")
          .update({ is_subscribed: true })
          .eq("id", contactId);
        return true;
      }
      return false;
    }
  }

  return false;
}
