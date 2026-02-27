import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { WebhookEventType } from "@/lib/webhook-dispatcher";

// All valid event types that can be subscribed to
const VALID_EVENTS: WebhookEventType[] = [
  "contact.created",
  "contact.updated",
  "message.received",
  "message.sent",
  "flow.started",
  "flow.completed",
  "tag.added",
  "tag.removed",
  "conversation.opened",
  "conversation.closed",
];

/**
 * GET /api/v1/webhook-endpoints
 * List all webhook endpoints for the current workspace.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { data, error } = await supabase
    .from("webhook_endpoints")
    .select("*")
    .eq("workspace_id", membership.workspace_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/**
 * POST /api/v1/webhook-endpoints
 * Create a new webhook endpoint.
 * Body: { url, name, events, secret? }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const body = await request.json();
  const { url, name, events, secret } = body;

  // Validate required fields
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }
  if (!url.startsWith("https://")) {
    return NextResponse.json({ error: "url must start with https://" }, { status: 400 });
  }
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "events must be a non-empty array" }, { status: 400 });
  }

  // Validate each event type
  const invalidEvents = events.filter((e: string) => !VALID_EVENTS.includes(e as WebhookEventType));
  if (invalidEvents.length > 0) {
    return NextResponse.json(
      { error: `Invalid event types: ${invalidEvents.join(", ")}. Valid types: ${VALID_EVENTS.join(", ")}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("webhook_endpoints")
    .insert({
      workspace_id: membership.workspace_id,
      url,
      name,
      events,
      secret: secret || null,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
