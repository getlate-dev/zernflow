import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/workspace/settings
 *
 * Returns the current workspace settings for the authenticated user's workspace.
 * Currently exposes: autoAssignMode (manual | round-robin).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Resolve the user's workspace via their membership
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("auto_assign_mode")
    .eq("id", membership.workspace_id)
    .single();

  if (!workspace)
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    );

  return NextResponse.json({ autoAssignMode: workspace.auto_assign_mode });
}

/**
 * PUT /api/v1/workspace/settings
 *
 * Updates workspace settings. Only owners and admins are allowed.
 * Body: { autoAssignMode: "manual" | "round-robin" }
 */
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  // Only admins and owners can change settings
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { autoAssignMode } = body;

  if (!["manual", "round-robin"].includes(autoAssignMode)) {
    return NextResponse.json(
      { error: "autoAssignMode must be 'manual' or 'round-robin'" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("workspaces")
    .update({ auto_assign_mode: autoAssignMode })
    .eq("id", membership.workspace_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ autoAssignMode });
}
