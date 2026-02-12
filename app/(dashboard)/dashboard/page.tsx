import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const [
    { count: flowCount },
    { count: contactCount },
    { count: conversationCount },
    { count: channelCount },
  ] = await Promise.all([
    supabase
      .from("flows")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("status", "open"),
    supabase
      .from("channels")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("is_active", true),
  ]);

  const stats = [
    { label: "Flows", value: flowCount ?? 0 },
    { label: "Contacts", value: contactCount ?? 0 },
    { label: "Open Conversations", value: conversationCount ?? 0 },
    { label: "Connected Channels", value: channelCount ?? 0 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome to {workspace.name}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {channelCount === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
          <h2 className="text-lg font-semibold">Get started</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your first social media channel to start building chatbot
            flows.
          </p>
          <a
            href="/dashboard/channels"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Connect a channel
          </a>
        </div>
      )}
    </div>
  );
}
