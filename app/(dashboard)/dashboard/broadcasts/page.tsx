import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { BroadcastsView } from "./broadcasts-view";

export default async function BroadcastsPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const { data: broadcasts } = await supabase
    .from("broadcasts")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <BroadcastsView
      broadcasts={broadcasts ?? []}
      workspaceId={workspace.id}
    />
  );
}
