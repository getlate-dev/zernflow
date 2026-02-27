import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * DELETE /api/v1/conversations/[conversationId]/notes/[noteId]
 * Deletes an internal note by ID. Notes are append-only but can be removed if added by mistake.
 * Scoped to the caller's workspace via workspace_id check.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string; noteId: string }> }
) {
  const { noteId } = await params;
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
    .from("conversation_notes")
    .delete()
    .eq("id", noteId)
    .eq("workspace_id", membership.workspace_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
