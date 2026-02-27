import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
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

  const { data: flow } = await supabase
    .from("flows")
    .select("*")
    .eq("id", flowId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (!flow) return NextResponse.json({ error: "Flow not found" }, { status: 404 });

  // Load triggers for this flow
  const { data: triggers } = await supabase
    .from("triggers")
    .select("type, config, priority, is_active")
    .eq("flow_id", flowId);

  // Build portable export (no workspace/flow IDs, those are assigned on import)
  const exportData = {
    _format: "zernflow-v1",
    _exportedAt: new Date().toISOString(),
    name: flow.name,
    description: flow.description,
    nodes: flow.nodes,
    edges: flow.edges,
    viewport: flow.viewport,
    triggers: triggers || [],
  };

  const filename = `${flow.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.zernflow.json`;

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
