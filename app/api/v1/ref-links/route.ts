import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * Generate a random 8-character hex slug for ref links.
 * Uses crypto.randomBytes for cryptographic randomness.
 */
function generateSlug(): string {
  return crypto.randomBytes(4).toString("hex"); // 8 hex chars
}

/**
 * GET /api/v1/ref-links
 * List all ref links for the authenticated user's workspace.
 * Includes joined flow data (name, status) for display purposes.
 */
export async function GET(request: NextRequest) {
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
    .eq("workspace_id", membership.workspace_id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/**
 * POST /api/v1/ref-links
 * Create a new ref link for the authenticated user's workspace.
 *
 * Body params:
 *   - name (string, required): Display name for the ref link
 *   - flowId (string, required): ID of the flow to trigger when link is visited
 *   - channelId (string, optional): ID of the channel to associate with the link
 *
 * Returns the created ref link with joined flow data.
 */
export async function POST(request: NextRequest) {
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
  const { name, flowId, channelId } = body;

  if (!name || !flowId) {
    return NextResponse.json(
      { error: "name and flowId are required" },
      { status: 400 }
    );
  }

  const slug = generateSlug();

  const { data, error } = await supabase
    .from("ref_links")
    .insert({
      workspace_id: membership.workspace_id,
      flow_id: flowId,
      channel_id: channelId || null,
      name,
      slug,
    })
    .select("*, flows(name, status)")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
