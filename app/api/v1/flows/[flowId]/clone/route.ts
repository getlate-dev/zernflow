import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  const { flowId } = await params;
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

  // Load the source flow
  const { data: source } = await supabase
    .from("flows")
    .select("*")
    .eq("id", flowId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (!source) return NextResponse.json({ error: "Flow not found" }, { status: 404 });

  // Allow custom name from request body
  const body = await request.json().catch(() => ({}));
  const name = body.name || `${source.name} (copy)`;

  // Create the cloned flow as a draft
  const { data: cloned, error } = await supabase
    .from("flows")
    .insert({
      workspace_id: membership.workspace_id,
      name,
      description: source.description,
      status: "draft",
      nodes: source.nodes,
      edges: source.edges,
      viewport: source.viewport,
      version: 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Clone triggers (they reference the new flow, always start as inactive)
  const { data: triggers } = await supabase
    .from("triggers")
    .select("*")
    .eq("flow_id", flowId);

  if (triggers && triggers.length > 0) {
    const clonedTriggers = triggers.map(t => ({
      flow_id: cloned.id,
      channel_id: t.channel_id,
      type: t.type as any,
      config: t.config,
      priority: t.priority,
      is_active: false, // Start inactive to avoid conflicts
    }));

    await supabase.from("triggers").insert(clonedTriggers);
  }

  return NextResponse.json(cloned, { status: 201 });
}
