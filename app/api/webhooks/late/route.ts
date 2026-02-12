import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { executeFlow } from "@/lib/flow-engine/engine";
import { matchTrigger } from "@/lib/flow-engine/trigger-matcher";
import crypto from "crypto";

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

  const supabase = await createServiceClient();

  // Look up channel by late_account_id
  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("late_account_id", payload.accountId)
    .eq("is_active", true)
    .single();

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  // Verify HMAC signature if webhook_secret is set
  if (channel.webhook_secret && signature) {
    const expected = crypto
      .createHmac("sha256", channel.webhook_secret)
      .update(body)
      .digest("hex");

    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Upsert contact
  const senderId = payload.sender?.id || payload.from;
  const senderName = payload.sender?.name || payload.sender?.username || senderId;

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
        avatar_url: payload.sender?.avatar || null,
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
      platform_username: payload.sender?.username || null,
    });
  }

  // Upsert conversation
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
        last_message_preview: (payload.text || "").slice(0, 100),
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
    await supabase.rpc("increment_unread", {
      conv_id: conversation.id,
      preview: (payload.text || "").slice(0, 100),
    }).then(() => {});
  }

  // Insert message
  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    direction: "inbound",
    text: payload.text || null,
    attachments: payload.attachments || null,
    quick_reply_payload: payload.quickReplyPayload || null,
    postback_payload: payload.postbackPayload || null,
    callback_data: payload.callbackData || null,
    platform_message_id: payload.messageId || null,
    status: "delivered",
  });

  // Fire flow engine (non-blocking) if automation is not paused
  if (!conversation.is_automation_paused) {
    // Check global keywords first
    const globalKeywords = (channel as { workspace_id: string } & Record<string, unknown>).global_keywords;
    const handled = await handleGlobalKeywords(
      supabase,
      channel.workspace_id,
      contactId,
      payload.text,
      globalKeywords
    );

    if (!handled) {
      // Match trigger and execute flow
      const trigger = await matchTrigger(supabase, channel.id, payload);
      if (trigger) {
        executeFlow(supabase, {
          triggerId: trigger.id,
          flowId: trigger.flow_id,
          channelId: channel.id,
          contactId,
          conversationId: conversation.id,
          workspaceId: channel.workspace_id,
          incomingMessage: payload,
        }).catch(console.error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

async function handleGlobalKeywords(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  workspaceId: string,
  contactId: string,
  text: string | undefined,
  _globalKeywords: unknown
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

interface WebhookPayload {
  event: string;
  accountId: string;
  messageId?: string;
  text?: string;
  from: string;
  sender?: {
    id: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
  attachments?: Array<{ type: string; url: string }>;
  quickReplyPayload?: string;
  postbackPayload?: string;
  callbackData?: string;
}
