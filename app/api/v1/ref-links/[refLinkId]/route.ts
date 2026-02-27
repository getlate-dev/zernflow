import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/ref-links/[refLinkId]
 * Retrieve a single ref link by ID.
 * Scoped to the authenticated user's workspace.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ refLinkId: string }> }
) {
  const { refLinkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { data, error } = await supabase
    .from("ref_links")
    .select("*, flows(name, status)")
    .eq("id", refLinkId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

/**
 * PUT /api/v1/ref-links/[refLinkId]
 * Update an existing ref link.
 * Scoped to the authenticated user's workspace.
 *
 * Body params (all optional):
 *   - name (string): Display name for the ref link
 *   - flowId (string): ID of the flow to trigger
 *   - channelId (string | null): ID of the channel to associate
 *   - is_active (boolean): Whether the link is active
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ refLinkId: string }> }
) {
  const { refLinkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const body = await request.json();
  const { name, flowId, channelId, is_active } = body;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (flowId !== undefined) updates.flow_id = flowId;
  if (channelId !== undefined) updates.channel_id = channelId;
  if (is_active !== undefined) updates.is_active = is_active;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("ref_links")
    .update(updates)
    .eq("id", refLinkId)
    .eq("workspace_id", membership.workspace_id)
    .select("*, flows(name, status)")
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

/**
 * DELETE /api/v1/ref-links/[refLinkId]
 * Delete a ref link by ID.
 * Scoped to the authenticated user's workspace.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ refLinkId: string }> }
) {
  const { refLinkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { error } = await supabase
    .from("ref_links")
    .delete()
    .eq("id", refLinkId)
    .eq("workspace_id", membership.workspace_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
