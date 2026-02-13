import { getWorkspace } from "@/lib/workspace";
import { notFound } from "next/navigation";
import { FlowCanvas } from "@/components/flow-builder/flow-canvas";

export default async function FlowEditorPage({
  params,
}: {
  params: Promise<{ flowId: string }>;
}) {
  const { flowId } = await params;
  const { workspace, supabase } = await getWorkspace();

  const { data: flow } = await supabase
    .from("flows")
    .select("*")
    .eq("id", flowId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!flow) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <FlowCanvas flow={flow} aiProvider={workspace.ai_provider || "openai"} />
    </div>
  );
}
