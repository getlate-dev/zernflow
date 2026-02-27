import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/bot-fields
 * List all bot fields for the authenticated user's workspace.
 * Returns fields ordered by creation date (oldest first).
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
    .from("bot_fields")
    .select("*")
    .eq("workspace_id", membership.workspace_id)
    .order("created_at", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/**
 * POST /api/v1/bot-fields
 * Create a new bot field for the workspace.
 * Body: { name, slug, value?, description? }
 * - name: display name (required)
 * - slug: unique identifier, must match /^[a-z][a-z0-9_]*$/ (required)
 * - value: initial value (defaults to "")
 * - description: optional human-readable description
 * Returns 409 if a field with the same slug already exists.
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
  const { name, slug, value, description } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "name and slug are required" },
      { status: 400 }
    );
  }

  // Validate slug format: must start with a letter, only lowercase letters, numbers, underscores
  if (!/^[a-z][a-z0-9_]*$/.test(slug)) {
    return NextResponse.json(
      {
        error:
          "slug must start with a letter and contain only lowercase letters, numbers, and underscores",
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bot_fields")
    .insert({
      workspace_id: membership.workspace_id,
      name,
      slug,
      value: value || "",
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    // 23505 = unique constraint violation (duplicate slug within workspace)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A bot field with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
