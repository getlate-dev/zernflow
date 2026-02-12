import { getWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, GitBranch, Sparkles } from "lucide-react";
import type { FlowStatus } from "@/lib/types/database";

const statusConfig: Record<FlowStatus, { label: string; classes: string }> = {
  draft: {
    label: "Draft",
    classes:
      "bg-muted text-muted-foreground",
  },
  published: {
    label: "Published",
    classes:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  archived: {
    label: "Archived",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function createFlow(formData: FormData) {
  "use server";

  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const { data: flow, error } = await supabase
    .from("flows")
    .insert({
      workspace_id: workspace.id,
      name: "Untitled Flow",
      status: "draft",
      nodes: [],
      edges: [],
    })
    .select("id")
    .single();

  if (error || !flow) {
    throw new Error("Failed to create flow");
  }

  redirect(`/dashboard/flows/${flow.id}`);
}

export default async function FlowsPage() {
  const { workspace } = await getWorkspace();
  const supabase = await createClient();

  const { data: flows } = await supabase
    .from("flows")
    .select("id, name, status, updated_at, nodes")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flows</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build automated chatbot flows for your channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/flows/templates"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Templates
          </Link>
          <form action={createFlow}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              New Flow
            </button>
          </form>
        </div>
      </div>

      {!flows || flows.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center">
          <GitBranch className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No flows yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first flow to start automating conversations.
          </p>
          <form action={createFlow} className="mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Create your first flow
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => {
            const status = statusConfig[flow.status as FlowStatus] ?? statusConfig.draft;
            const nodeCount = Array.isArray(flow.nodes) ? flow.nodes.length : 0;

            return (
              <Link
                key={flow.id}
                href={`/dashboard/flows/${flow.id}`}
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {flow.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.classes}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Updated {formatDate(flow.updated_at)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
