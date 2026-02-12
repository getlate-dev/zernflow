import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { conversationId, text } = body;

  if (!conversationId || !text) {
    return NextResponse.json(
      { error: "conversationId and text required" },
      { status: 400 }
    );
  }

  // Get conversation with channel info
  const { data: conversation } = await supabase
    .from("conversations")
    .select("*, channels(*)")
    .eq("id", conversationId)
    .single();

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Ensure we have the Late conversation ID
  if (!conversation.late_conversation_id) {
    return NextResponse.json(
      { error: "No Late conversation ID linked to this conversation" },
      { status: 400 }
    );
  }

  // Get the channel's late_account_id
  const channel = conversation.channels as { late_account_id: string } | null;
  if (!channel?.late_account_id) {
    return NextResponse.json({ error: "Channel not found or missing Late account ID" }, { status: 404 });
  }

  // Get workspace API key
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("late_api_key_encrypted")
    .eq("id", conversation.workspace_id)
    .single();

  if (!workspace?.late_api_key_encrypted) {
    return NextResponse.json({ error: "API key not configured" }, { status: 400 });
  }

  // Send via Late REST API
  try {
    const lateResponse = await fetch(
      `https://getlate.dev/api/v1/inbox/conversations/${conversation.late_conversation_id}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${workspace.late_api_key_encrypted}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: channel.late_account_id,
          message: text,
        }),
      }
    );

    if (!lateResponse.ok) {
      const lateError = await lateResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: lateError.error || `Late API error (${lateResponse.status})` },
        { status: lateResponse.status }
      );
    }

    const lateData = await lateResponse.json();

    // Store outbound message in Supabase
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        direction: "outbound",
        text,
        sent_by_user_id: user.id,
        platform_message_id: lateData?.data?.messageId || null,
        status: "sent",
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update conversation's last message info
    await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: text.slice(0, 100),
      })
      .eq("id", conversationId);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to send message via Late API:", error);
    return NextResponse.json(
      { error: `Failed to send message: ${error}` },
      { status: 500 }
    );
  }
}
