import { getWorkspace } from "@/lib/workspace";
import { TemplatesView } from "./templates-view";

export default async function TemplatesPage() {
  const { workspace } = await getWorkspace();

  return <TemplatesView workspaceId={workspace.id} />;
}
