import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

  // Validate format
  if (body._format !== "zernflow-v1") {
    return NextResponse.json(
      { error: "Invalid format. Expected a Zernflow export file (zernflow-v1)." },
      { status: 400 }
    );
  }

  if (!body.nodes || !body.edges) {
    return NextResponse.json(
      { error: "Invalid export: missing nodes or edges." },
      { status: 400 }
    );
  }

  // Create the flow as a draft
  const { data: flow, error } = await supabase
    .from("flows")
    .insert({
      workspace_id: membership.workspace_id,
      name: body.name || "Imported Flow",
      description: body.description || null,
      status: "draft",
      nodes: body.nodes,
      edges: body.edges,
      viewport: body.viewport || null,
      version: 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Import triggers (without channel_id, starts inactive)
  if (body.triggers && Array.isArray(body.triggers) && body.triggers.length > 0) {
    const importedTriggers = body.triggers.map((t: any) => ({
      flow_id: flow.id,
      channel_id: null, // Channel must be re-assigned by user
      type: t.type,
      config: t.config || {},
      priority: t.priority || 0,
      is_active: false, // Always start inactive
    }));

    await supabase.from("triggers").insert(importedTriggers);
  }

  return NextResponse.json(flow, { status: 201 });
}
