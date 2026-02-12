"use client";

import { useState } from "react";
import {
  MessageCircle,
  Plus,
  Power,
  PowerOff,
  Trash2,
  X,
  TrendingUp,
  Send,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database, Json, Platform } from "@/lib/types/database";

type Channel = Database["public"]["Tables"]["channels"]["Row"];
type CommentLog = Database["public"]["Tables"]["comment_logs"]["Row"];

interface TriggerWithFlow {
  id: string;
  flow_id: string;
  channel_id: string | null;
  type: string;
  config: Json;
  priority: number;
  is_active: boolean;
  created_at: string;
  flows: { id: string; name: string; status: string } | null;
}

interface TriggerConfig {
  keywords: Array<{
    value: string;
    matchType?: "exact" | "contains" | "startsWith";
  }>;
  postIds?: string[];
  replyText?: string;
}

const platformLabels: Record<Platform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  telegram: "Telegram",
  bluesky: "Bluesky",
  reddit: "Reddit",
};

export function GrowthView({
  workspaceId,
  channels,
  triggers: initialTriggers,
  flows,
  stats,
  recentLogs,
}: {
  workspaceId: string;
  channels: Channel[];
  triggers: TriggerWithFlow[];
  flows: Array<{ id: string; name: string }>;
  stats: {
    totalComments: number;
    matchedComments: number;
    dmsSent: number;
  };
  recentLogs: CommentLog[];
}) {
  const [triggers, setTriggers] = useState(initialTriggers);
  const [showCreate, setShowCreate] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New rule form state
  const [form, setForm] = useState({
    channelId: channels[0]?.id || "",
    flowId: flows[0]?.id || "",
    keywords: "",
    matchType: "contains" as "exact" | "contains" | "startsWith",
    replyText: "",
    postIds: "",
  });
  const [creating, setCreating] = useState(false);

  const conversionRate =
    stats.totalComments > 0
      ? ((stats.dmsSent / stats.totalComments) * 100).toFixed(1)
      : "0.0";

  async function handleToggle(trigger: TriggerWithFlow) {
    setTogglingId(trigger.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("triggers")
      .update({ is_active: !trigger.is_active })
      .eq("id", trigger.id);

    if (!error) {
      setTriggers((prev) =>
        prev.map((t) =>
          t.id === trigger.id ? { ...t, is_active: !t.is_active } : t
        )
      );
    }
    setTogglingId(null);
  }

  async function handleDelete(triggerId: string) {
    if (!confirm("Delete this comment rule? This cannot be undone.")) return;
    setDeletingId(triggerId);
    const supabase = createClient();

    const { error } = await supabase
      .from("triggers")
      .delete()
      .eq("id", triggerId);

    if (!error) {
      setTriggers((prev) => prev.filter((t) => t.id !== triggerId));
    }
    setDeletingId(null);
  }

  async function handleCreate() {
    if (!form.channelId || !form.flowId || !form.keywords.trim() || creating) {
      return;
    }

    setCreating(true);
    const supabase = createClient();

    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .map((value) => ({ value, matchType: form.matchType }));

    const config: TriggerConfig = {
      keywords,
      ...(form.replyText.trim() ? { replyText: form.replyText.trim() } : {}),
      ...(form.postIds.trim()
        ? {
            postIds: form.postIds
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean),
          }
        : {}),
    };

    try {
      const { data, error } = await supabase
        .from("triggers")
        .insert({
          flow_id: form.flowId,
          channel_id: form.channelId,
          type: "comment_keyword" as const,
          config: config as unknown as Json,
          is_active: true,
          priority: 10,
        })
        .select("*, flows(id, name, status)")
        .single();

      if (error) throw error;

      if (data) {
        setTriggers((prev) => [
          data as unknown as TriggerWithFlow,
          ...prev,
        ]);
        setShowCreate(false);
        setForm({
          channelId: channels[0]?.id || "",
          flowId: flows[0]?.id || "",
          keywords: "",
          matchType: "contains",
          replyText: "",
          postIds: "",
        });
      }
    } catch (err) {
      console.error("Failed to create comment rule:", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Growth Tools
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comment-to-DM automation for lead capture and engagement
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            disabled={channels.length === 0 || flows.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New Comment Rule
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Comments Processed"
            value={stats.totalComments}
            icon={<Eye className="h-4 w-4" />}
            sublabel="Last 30 days"
          />
          <StatCard
            label="Keywords Matched"
            value={stats.matchedComments}
            icon={<MessageCircle className="h-4 w-4" />}
            sublabel="Last 30 days"
          />
          <StatCard
            label="DMs Sent"
            value={stats.dmsSent}
            icon={<Send className="h-4 w-4" />}
            sublabel="Last 30 days"
          />
          <StatCard
            label="Conversion Rate"
            value={`${conversionRate}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            sublabel="Comments to DMs"
          />
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="mt-6 rounded-xl border border-border bg-white p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Create Comment-to-DM Rule
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Channel */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Channel
                </label>
                <select
                  value={form.channelId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, channelId: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.display_name || ch.username || ch.late_account_id} (
                      {platformLabels[ch.platform]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Flow */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Response Flow
                </label>
                <select
                  value={form.flowId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, flowId: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {flows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, keywords: e.target.value }))
                  }
                  placeholder="info, price, details"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Match Type */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Match Type
                </label>
                <select
                  value={form.matchType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      matchType: e.target.value as
                        | "exact"
                        | "contains"
                        | "startsWith",
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="contains">Contains</option>
                  <option value="exact">Exact match</option>
                  <option value="startsWith">Starts with</option>
                </select>
              </div>

              {/* Public reply text (optional) */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Public Reply (optional)
                </label>
                <input
                  type="text"
                  value={form.replyText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, replyText: e.target.value }))
                  }
                  placeholder="Check your DMs! We just sent you more info."
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  If set, this will be posted as a public reply to the matching
                  comment before sending the DM.
                </p>
              </div>

              {/* Post IDs (optional) */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Specific Post IDs (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={form.postIds}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, postIds: e.target.value }))
                  }
                  placeholder="Leave empty to match comments on all posts"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  Limit this rule to specific Late post IDs. If empty, all posts
                  on this channel are monitored.
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={
                  !form.keywords.trim() || !form.channelId || !form.flowId || creating
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Rule"}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {channels.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
            <MessageCircle className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
              Connect a channel first
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You need at least one active channel to set up comment automation.
            </p>
            <a
              href="/dashboard/channels"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Channels
            </a>
          </div>
        )}

        {flows.length === 0 && channels.length > 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
            <MessageCircle className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
              Create a flow first
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Publish at least one flow to use as the DM response when comments
              match your keywords.
            </p>
            <a
              href="/dashboard/flows"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Flows
            </a>
          </div>
        )}

        {/* Active rules */}
        {triggers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Comment Rules
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              When a comment matches a keyword, the linked flow sends a DM to
              the commenter.
            </p>

            <div className="mt-4 space-y-3">
              {triggers.map((trigger) => {
                const config = trigger.config as unknown as TriggerConfig;
                const channel = channels.find(
                  (c) => c.id === trigger.channel_id
                );
                return (
                  <div
                    key={trigger.id}
                    className={cn(
                      "rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm dark:bg-gray-800",
                      trigger.is_active
                        ? "border-gray-200 dark:border-gray-700"
                        : "border-gray-200/60 opacity-60 dark:border-gray-700/60"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                              trigger.is_active
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                trigger.is_active
                                  ? "bg-green-500"
                                  : "bg-gray-400 dark:bg-gray-500"
                              )}
                            />
                            {trigger.is_active ? "Active" : "Paused"}
                          </span>

                          {channel && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {channel.display_name ||
                                channel.username ||
                                platformLabels[channel.platform]}
                            </span>
                          )}

                          {!trigger.channel_id && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              All channels
                            </span>
                          )}
                        </div>

                        {/* Keywords */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {config.keywords?.map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {kw.matchType === "exact" && "= "}
                              {kw.matchType === "startsWith" && "^ "}
                              {kw.value}
                            </span>
                          ))}
                        </div>

                        {/* Flow name */}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Flow:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {trigger.flows?.name || "Unknown"}
                          </span>
                        </p>

                        {/* Reply text preview */}
                        {config.replyText && (
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Public reply: &ldquo;{config.replyText}&rdquo;
                          </p>
                        )}

                        {/* Post IDs */}
                        {config.postIds?.length ? (
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Limited to {config.postIds.length} post
                            {config.postIds.length !== 1 ? "s" : ""}
                          </p>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex items-center gap-1">
                        <button
                          onClick={() => handleToggle(trigger)}
                          disabled={togglingId === trigger.id}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            trigger.is_active
                              ? "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                              : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
                          )}
                          title={
                            trigger.is_active ? "Pause rule" : "Activate rule"
                          }
                        >
                          {trigger.is_active ? (
                            <Power className="h-4 w-4" />
                          ) : (
                            <PowerOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(trigger.id)}
                          disabled={deletingId === trigger.id}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Delete rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent activity log */}
        {recentLogs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Latest processed comments and their outcomes.
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Author
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Comment
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Matched
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      DM
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-700/50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.author_name || log.author_username || "Unknown"}
                        </p>
                        {log.author_username && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            @{log.author_username}
                          </p>
                        )}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {log.comment_text}
                      </td>
                      <td className="px-4 py-3">
                        {log.matched_trigger_id ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {log.dm_sent ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Sent
                          </span>
                        ) : log.error ? (
                          <span
                            className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            title={log.error}
                          >
                            Error
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            --
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                        {formatRelativeTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  sublabel,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  sublabel: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        {sublabel}
      </p>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(dateStr).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}
