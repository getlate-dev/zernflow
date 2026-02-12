import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { executeFlow } from "@/lib/flow-engine/engine";
import { matchTrigger } from "@/lib/flow-engine/trigger-matcher";
import crypto from "crypto";

// ── Late API webhook payload types ──────────────────────────────────────────

interface WebhookPayload {
  event: string;
  data: {
    messageId: string;
    conversationId: string;
    platform: string;
    platformMessageId: string;
    direction: "incoming";
    text: string | null;
    attachments: Array<{ type: string; url: string }> | null;
    sender: {
      id: string;
      name: string;
      username: string | null;
      picture: string | null;
    };
    sentAt: string;
    conversation: {
      id: string;
      participantId: string;
      participantName: string;
      participantUsername: string | null;
      participantPicture: string | null;
    };
    account: {
      id: string;
      platform: string;
      username: string;
      displayName: string;
    };
    metadata: {
      quickReplyPayload: string | null;
      callbackData: string | null;
      postbackPayload: string | null;
    };
  };
}

// ── Webhook handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-late-signature");

  // Parse payload
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

  const { data: eventData } = payload;

  const supabase = await createServiceClient();

  // Look up channel by late_account_id (maps to data.account.id)
  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("late_account_id", eventData.account.id)
    .eq("is_active", true)
    .single();

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
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

  const senderId = eventData.sender.id;
  const senderName =
    eventData.sender.name || eventData.sender.username || senderId;

  // Find or create contact via contact_channels
  let contactId: string;
  const { data: existingContactChannel } = await supabase
    .from("contact_channels")
    .select("contact_id")
    .eq("channel_id", channel.id)
    .eq("platform_sender_id", senderId)
    .single();

  if (existingContactChannel) {
    contactId = existingContactChannel.contact_id;
    // Update last interaction
    await supabase
      .from("contacts")
      .update({ last_interaction_at: new Date().toISOString() })
      .eq("id", contactId);
  } else {
    // Create new contact
    const { data: newContact } = await supabase
      .from("contacts")
      .insert({
        workspace_id: channel.workspace_id,
        display_name: senderName,
        avatar_url: eventData.sender.picture || null,
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

    // Link contact to channel
    await supabase.from("contact_channels").insert({
      contact_id: contactId,
      channel_id: channel.id,
      platform_sender_id: senderId,
      platform_username: eventData.sender.username || null,
    });
  }

  // ── Upsert conversation ──────────────────────────────────────────────────

  const messagePreview = (eventData.text || "").slice(0, 100);

  const { data: conversation } = await supabase
    .from("conversations")
    .upsert(
      {
        workspace_id: channel.workspace_id,
        channel_id: channel.id,
        contact_id: contactId,
        platform: channel.platform,
        late_conversation_id: eventData.conversation.id,
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

  // Increment unread count for existing conversations
  if (existingContactChannel) {
    await supabase
      .rpc("increment_unread", {
        conv_id: conversation.id,
        preview: messagePreview,
      })
      .then(() => {});
  }

  // ── Insert message ────────────────────────────────────────────────────────

  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    direction: "inbound",
    text: eventData.text || null,
    attachments: eventData.attachments || null,
    quick_reply_payload: eventData.metadata.quickReplyPayload || null,
    postback_payload: eventData.metadata.postbackPayload || null,
    callback_data: eventData.metadata.callbackData || null,
    platform_message_id: eventData.platformMessageId || null,
    status: "delivered",
  });

  // ── Flow engine ───────────────────────────────────────────────────────────

  if (!conversation.is_automation_paused) {
    // Build the message object used by the trigger matcher and flow engine
    const incomingMessage = {
      text: eventData.text || undefined,
      postbackPayload: eventData.metadata.postbackPayload || undefined,
      quickReplyPayload: eventData.metadata.quickReplyPayload || undefined,
      callbackData: eventData.metadata.callbackData || undefined,
      sender: {
        id: eventData.sender.id,
        name: eventData.sender.name,
        username: eventData.sender.username || undefined,
      },
    };

    // Check global keywords first
    const handled = await handleGlobalKeywords(
      supabase,
      channel.workspace_id,
      contactId,
      eventData.text || undefined
    );

    if (!handled) {
      // Match trigger and execute flow
      const trigger = await matchTrigger(supabase, channel.id, conversation.id, incomingMessage);
      if (trigger) {
        executeFlow(supabase, {
          triggerId: trigger.id,
          flowId: trigger.flow_id,
          channelId: channel.id,
          contactId,
          conversationId: conversation.id,
          workspaceId: channel.workspace_id,
          incomingMessage,
        }).catch(console.error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

// ── Global keywords ─────────────────────────────────────────────────────────

async function handleGlobalKeywords(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  workspaceId: string,
  contactId: string,
  text: string | undefined
): Promise<boolean> {
  if (!text) return false;

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

  const normalizedText = text.toLowerCase().trim();

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
      // flowId handling would trigger a flow
      return false;
    }
  }

  return false;
}
