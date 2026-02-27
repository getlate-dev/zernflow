import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper to authenticate the user and resolve their workspace ID.
 * Returns null if unauthenticated or no workspace found.
 */
async function getWorkspaceId(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return membership?.workspace_id || null;
}

/**
 * PUT /api/v1/bot-fields/[fieldId]
 * Update a bot field's name, value, and/or description.
 * Body: { name?, value?, description? }
 * The slug is immutable after creation (used in flow templates as {{bot.slug}}).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fieldId: string }> }
) {
  const { fieldId } = await params;
  const supabase = await createClient();
  const workspaceId = await getWorkspaceId(supabase);
  if (!workspaceId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Only allow updating name, value, and description (slug is immutable)
  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.value !== undefined) update.value = body.value;
  if (body.description !== undefined) update.description = body.description;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bot_fields")
    .update(update)
    .eq("id", fieldId)
    .eq("workspace_id", workspaceId)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json(
      { error: "Bot field not found" },
      { status: 404 }
    );

  return NextResponse.json(data);
}

/**
 * DELETE /api/v1/bot-fields/[fieldId]
 * Delete a bot field from the workspace.
 * Warning: any flows referencing {{bot.<slug>}} will stop resolving this field.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ fieldId: string }> }
) {
  const { fieldId } = await params;
  const supabase = await createClient();
  const workspaceId = await getWorkspaceId(supabase);
  if (!workspaceId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("bot_fields")
    .delete()
    .eq("id", fieldId)
    .eq("workspace_id", workspaceId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
