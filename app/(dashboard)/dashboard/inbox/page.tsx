import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { InboxView } from "./inbox-view";

export default async function InboxPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, contacts(*)")
    .eq("workspace_id", workspace.id)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(50);

  return (
    <InboxView
      conversations={conversations ?? []}
      workspaceId={workspace.id}
    />
  );
}
