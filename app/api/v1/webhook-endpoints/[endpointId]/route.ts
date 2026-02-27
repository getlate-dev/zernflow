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
 * PUT /api/v1/webhook-endpoints/[endpointId]
 * Update a webhook endpoint (url, name, events, secret, is_active).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  const { endpointId } = await params;
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
  const { url, name, events, secret, is_active } = body;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};

  if (url !== undefined) {
    if (typeof url !== "string" || !url.startsWith("https://")) {
      return NextResponse.json({ error: "url must start with https://" }, { status: 400 });
    }
    updates.url = url;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name) {
      return NextResponse.json({ error: "name must be a non-empty string" }, { status: 400 });
    }
    updates.name = name;
  }

  if (events !== undefined) {
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "events must be a non-empty array" }, { status: 400 });
    }
    const invalidEvents = events.filter((e: string) => !VALID_EVENTS.includes(e as WebhookEventType));
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { error: `Invalid event types: ${invalidEvents.join(", ")}` },
        { status: 400 }
      );
    }
    updates.events = events;
  }

  if (secret !== undefined) {
    updates.secret = secret || null;
  }

  if (is_active !== undefined) {
    if (typeof is_active !== "boolean") {
      return NextResponse.json({ error: "is_active must be a boolean" }, { status: 400 });
    }
    updates.is_active = is_active;
    // Reset failure count when re-enabling
    if (is_active) {
      updates.failure_count = 0;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("webhook_endpoints")
    .update(updates)
    .eq("id", endpointId)
    .eq("workspace_id", membership.workspace_id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

/**
 * DELETE /api/v1/webhook-endpoints/[endpointId]
 * Delete a webhook endpoint.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  const { endpointId } = await params;
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

  const { error } = await supabase
    .from("webhook_endpoints")
    .delete()
    .eq("id", endpointId)
    .eq("workspace_id", membership.workspace_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
