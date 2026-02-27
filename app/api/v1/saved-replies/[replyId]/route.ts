import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PUT /api/v1/saved-replies/[replyId]
 * Updates an existing saved reply. Only replies belonging to the
 * authenticated user's workspace can be updated.
 *
 * @param replyId - The ID of the saved reply to update
 * @body {string} [title] - Updated display title
 * @body {string} [content] - Updated reply content/template text
 * @body {string} [shortcut] - Updated slash-command shortcut
 * @returns The updated saved reply record
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  const { replyId } = await params;
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
  const { title, content, shortcut } = body;

  // Build the update payload, only including fields that were provided
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (shortcut !== undefined) updates.shortcut = shortcut || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("saved_replies")
    .update(updates)
    .eq("id", replyId)
    .eq("workspace_id", membership.workspace_id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json(
      { error: "Saved reply not found" },
      { status: 404 }
    );

  return NextResponse.json(data);
}

/**
 * DELETE /api/v1/saved-replies/[replyId]
 * Deletes a saved reply. Only replies belonging to the authenticated
 * user's workspace can be deleted.
 *
 * @param replyId - The ID of the saved reply to delete
 * @returns Success confirmation message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  const { replyId } = await params;
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
    .from("saved_replies")
    .delete()
    .eq("id", replyId)
    .eq("workspace_id", membership.workspace_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
