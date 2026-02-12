import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { GrowthView } from "./growth-view";

export default async function GrowthPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  // Fetch channels for this workspace
  const { data: channels } = await supabase
    .from("channels")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch comment_keyword triggers with their flows
  const { data: triggers } = await supabase
    .from("triggers")
    .select("*, flows(id, name, status)")
    .eq("type", "comment_keyword")
    .in(
      "channel_id",
      (channels ?? []).map((c) => c.id)
    );

  // Also fetch global triggers (channel_id is null) for this workspace's flows
  const { data: globalTriggers } = await supabase
    .from("triggers")
    .select("*, flows!inner(id, name, status, workspace_id)")
    .eq("type", "comment_keyword")
    .is("channel_id", null)
    .eq("flows.workspace_id", workspace.id);

  const allTriggers = [...(triggers ?? []), ...(globalTriggers ?? [])];

  // Fetch published flows for the new rule form
  const { data: flows } = await supabase
    .from("flows")
    .select("id, name")
    .eq("workspace_id", workspace.id)
    .eq("status", "published")
    .order("name", { ascending: true });

  // Fetch comment log stats (last 30 days)
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [
    { count: totalComments },
    { count: matchedComments },
    { count: dmsSent },
  ] = await Promise.all([
    supabase
      .from("comment_logs")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("comment_logs")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .not("matched_trigger_id", "is", null)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("comment_logs")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("dm_sent", true)
      .gte("created_at", thirtyDaysAgo),
  ]);

  // Fetch recent comment logs
  const { data: recentLogs } = await supabase
    .from("comment_logs")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <GrowthView
      workspaceId={workspace.id}
      channels={channels ?? []}
      triggers={allTriggers}
      flows={flows ?? []}
      stats={{
        totalComments: totalComments ?? 0,
        matchedComments: matchedComments ?? 0,
        dmsSent: dmsSent ?? 0,
      }}
      recentLogs={recentLogs ?? []}
    />
  );
}
