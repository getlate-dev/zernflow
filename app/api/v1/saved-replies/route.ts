import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/saved-replies
 * Returns all saved replies for the authenticated user's workspace,
 * ordered by most recently created first.
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
    .from("saved_replies")
    .select("*")
    .eq("workspace_id", membership.workspace_id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/**
 * POST /api/v1/saved-replies
 * Creates a new saved reply for the authenticated user's workspace.
 *
 * @body {string} title - Display title for the saved reply (required)
 * @body {string} content - The reply content/template text (required)
 * @body {string} [shortcut] - Optional slash-command shortcut (e.g. "greeting")
 * @returns The newly created saved reply record
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
  const { title, content, shortcut } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("saved_replies")
    .insert({
      workspace_id: membership.workspace_id,
      title,
      content,
      shortcut: shortcut || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
