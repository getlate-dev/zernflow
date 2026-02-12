import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  const { flowId } = await params;
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

  // Update flow status to published
  const { data: flow, error } = await supabase
    .from("flows")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      version: undefined, // Will be handled by the increment below
    })
    .eq("id", flowId)
    .eq("workspace_id", membership.workspace_id)
    .select("*")
    .single();

  if (error || !flow)
    return NextResponse.json(
      { error: error?.message || "Flow not found" },
      { status: 404 }
    );

  // Increment version
  await supabase
    .from("flows")
    .update({ version: flow.version + 1 })
    .eq("id", flowId);

  // Activate all triggers for this flow
  await supabase
    .from("triggers")
    .update({ is_active: true })
    .eq("flow_id", flowId);

  return NextResponse.json({ ...flow, version: flow.version + 1 });
}
