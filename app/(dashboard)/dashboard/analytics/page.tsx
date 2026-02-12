import { getWorkspace } from "@/lib/workspace";
import { AnalyticsView } from "./analytics-view";

export default async function AnalyticsPage() {
  const { workspace } = await getWorkspace();

  return <AnalyticsView workspaceId={workspace.id} />;
}
