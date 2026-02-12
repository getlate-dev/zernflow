import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { ChannelsView } from "./channels-view";

export default async function ChannelsPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const { data: channels } = await supabase
    .from("channels")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <ChannelsView
      channels={channels ?? []}
      workspaceId={workspace.id}
    />
  );
}
