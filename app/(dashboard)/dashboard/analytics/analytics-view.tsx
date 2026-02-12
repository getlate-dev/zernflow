"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  GitBranch,
  Users,
  Send,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// --- Types ---

type TimeRange = "7d" | "30d" | "90d" | "custom";

interface Stats {
  totalFlows: number;
  totalContacts: number;
  messagesSent: number;
  messagesFailed: number;
}

interface FlowPerformance {
  id: string;
  name: string;
  starts: number;
  completions: number;
  dropOffRate: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface DailyMessages {
  date: string;
  sent: number;
  failed: number;
}

// --- Helpers ---

function getDateRange(range: TimeRange): { start: string; end: string } {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

// --- Simple bar chart ---

function MiniBarChart({
  data,
  maxVal,
  color,
}: {
  data: number[];
  maxVal: number;
  color: string;
}) {
  const safeMax = maxVal || 1;
  return (
    <div className="flex items-end gap-[2px] h-16">
      {data.map((val, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-t-sm min-h-[2px]", color)}
          style={{ height: `${(val / safeMax) * 100}%` }}
        />
      ))}
    </div>
  );
}

// --- Main component ---

export function AnalyticsView({ workspaceId }: { workspaceId: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    totalFlows: 0,
    totalContacts: 0,
    messagesSent: 0,
    messagesFailed: 0,
  });
  const [flowPerformance, setFlowPerformance] = useState<FlowPerformance[]>([]);
  const [contactGrowth, setContactGrowth] = useState<DailyCount[]>([]);
  const [messageVolume, setMessageVolume] = useState<DailyMessages[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, workspaceId]);

  async function fetchAnalytics() {
    setLoading(true);
    const supabase = createClient();

    const range =
      timeRange === "custom" && customStart && customEnd
        ? { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() }
        : getDateRange(timeRange);

    try {
      // Fetch stats in parallel
      const [flowsRes, contactsRes, sentRes, failedRes] = await Promise.all([
        supabase
          .from("flows")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId),
        supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("event_type", "message_sent")
          .gte("created_at", range.start)
          .lte("created_at", range.end),
        supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspaceId)
          .eq("event_type", "message_failed")
          .gte("created_at", range.start)
          .lte("created_at", range.end),
      ]);

      setStats({
        totalFlows: flowsRes.count ?? 0,
        totalContacts: contactsRes.count ?? 0,
        messagesSent: sentRes.count ?? 0,
        messagesFailed: failedRes.count ?? 0,
      });

      // Flow performance: starts and completions
      const [startsRes, completionsRes, flowsListRes] = await Promise.all([
        supabase
          .from("analytics_events")
          .select("flow_id")
          .eq("workspace_id", workspaceId)
          .eq("event_type", "flow_started")
          .gte("created_at", range.start)
          .lte("created_at", range.end)
          .not("flow_id", "is", null),
        supabase
          .from("analytics_events")
          .select("flow_id")
          .eq("workspace_id", workspaceId)
          .eq("event_type", "flow_completed")
          .gte("created_at", range.start)
          .lte("created_at", range.end)
          .not("flow_id", "is", null),
        supabase
          .from("flows")
          .select("id, name")
          .eq("workspace_id", workspaceId),
      ]);

      const flowNames = new Map(
        (flowsListRes.data ?? []).map((f) => [f.id, f.name])
      );

      // Count starts per flow
      const startCounts = new Map<string, number>();
      (startsRes.data ?? []).forEach((e) => {
        if (e.flow_id) {
          startCounts.set(e.flow_id, (startCounts.get(e.flow_id) ?? 0) + 1);
        }
      });

      // Count completions per flow
      const completionCounts = new Map<string, number>();
      (completionsRes.data ?? []).forEach((e) => {
        if (e.flow_id) {
          completionCounts.set(
            e.flow_id,
            (completionCounts.get(e.flow_id) ?? 0) + 1
          );
        }
      });

      // Merge into performance data
      const allFlowIds = new Set([
        ...startCounts.keys(),
        ...completionCounts.keys(),
      ]);
      const perfData: FlowPerformance[] = Array.from(allFlowIds)
        .map((fid) => {
          const starts = startCounts.get(fid) ?? 0;
          const completions = completionCounts.get(fid) ?? 0;
          const dropOffRate =
            starts > 0
              ? Math.round(((starts - completions) / starts) * 100)
              : 0;
          return {
            id: fid,
            name: flowNames.get(fid) ?? "Unknown Flow",
            starts,
            completions,
            dropOffRate,
          };
        })
        .sort((a, b) => b.starts - a.starts)
        .slice(0, 10);

      setFlowPerformance(perfData);

      // Contact growth by day
      const contactEvents = await supabase
        .from("analytics_events")
        .select("created_at")
        .eq("workspace_id", workspaceId)
        .eq("event_type", "contact_created")
        .gte("created_at", range.start)
        .lte("created_at", range.end)
        .order("created_at");

      const growthByDay = new Map<string, number>();
      (contactEvents.data ?? []).forEach((e) => {
        const day = e.created_at.split("T")[0];
        growthByDay.set(day, (growthByDay.get(day) ?? 0) + 1);
      });

      // Fill in missing days
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);
      const growthData: DailyCount[] = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dayStr = d.toISOString().split("T")[0];
        growthData.push({ date: dayStr, count: growthByDay.get(dayStr) ?? 0 });
      }
      setContactGrowth(growthData);

      // Message volume by day
      const msgEvents = await supabase
        .from("analytics_events")
        .select("event_type, created_at")
        .eq("workspace_id", workspaceId)
        .in("event_type", ["message_sent", "message_failed"])
        .gte("created_at", range.start)
        .lte("created_at", range.end)
        .order("created_at");

      const sentByDay = new Map<string, number>();
      const failedByDay = new Map<string, number>();
      (msgEvents.data ?? []).forEach((e) => {
        const day = e.created_at.split("T")[0];
        if (e.event_type === "message_sent") {
          sentByDay.set(day, (sentByDay.get(day) ?? 0) + 1);
        } else {
          failedByDay.set(day, (failedByDay.get(day) ?? 0) + 1);
        }
      });

      const msgData: DailyMessages[] = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dayStr = d.toISOString().split("T")[0];
        msgData.push({
          date: dayStr,
          sent: sentByDay.get(dayStr) ?? 0,
          failed: failedByDay.get(dayStr) ?? 0,
        });
      }
      setMessageVolume(msgData);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom" },
  ];

  const statCards = [
    {
      label: "Total Flows",
      value: stats.totalFlows,
      icon: GitBranch,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Messages Sent",
      value: stats.messagesSent,
      icon: Send,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Messages Failed",
      value: stats.messagesFailed,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  const maxContactGrowth = Math.max(...contactGrowth.map((d) => d.count), 0);
  const maxMessageVolume = Math.max(
    ...messageVolume.map((d) => d.sent + d.failed),
    0
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your workspace performance
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  timeRange === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range */}
        {timeRange === "custom" && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <span className="text-sm text-muted-foreground">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={fetchAnalytics}
              disabled={!customStart || !customEnd}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        card.bg
                      )}
                    >
                      <card.icon className={cn("h-4 w-4", card.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Contact growth */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Contact Growth</h3>
                  <span className="text-xs text-muted-foreground">
                    New contacts per day
                  </span>
                </div>
                {contactGrowth.length > 0 ? (
                  <>
                    <MiniBarChart
                      data={contactGrowth.map((d) => d.count)}
                      maxVal={maxContactGrowth}
                      color="bg-purple-500 dark:bg-purple-400"
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>{formatShortDate(contactGrowth[0].date)}</span>
                      <span>
                        {formatShortDate(
                          contactGrowth[contactGrowth.length - 1].date
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No data for this period
                  </p>
                )}
              </div>

              {/* Message volume */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Message Volume</h3>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
                      Sent
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
                      Failed
                    </span>
                  </div>
                </div>
                {messageVolume.length > 0 ? (
                  <>
                    <div className="flex items-end gap-[2px] h-16">
                      {messageVolume.map((d, i) => {
                        const total = d.sent + d.failed;
                        const sentPct =
                          total > 0
                            ? (d.sent / (maxMessageVolume || 1)) * 100
                            : 0;
                        const failedPct =
                          total > 0
                            ? (d.failed / (maxMessageVolume || 1)) * 100
                            : 0;
                        return (
                          <div
                            key={i}
                            className="flex flex-1 flex-col items-stretch justify-end"
                          >
                            {failedPct > 0 && (
                              <div
                                className="bg-red-500 dark:bg-red-400 rounded-t-sm min-h-[1px]"
                                style={{ height: `${failedPct}%` }}
                              />
                            )}
                            {sentPct > 0 && (
                              <div
                                className={cn(
                                  "bg-green-500 dark:bg-green-400 min-h-[1px]",
                                  failedPct === 0 && "rounded-t-sm"
                                )}
                                style={{ height: `${sentPct}%` }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>{formatShortDate(messageVolume[0].date)}</span>
                      <span>
                        {formatShortDate(
                          messageVolume[messageVolume.length - 1].date
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No data for this period
                  </p>
                )}
              </div>
            </div>

            {/* Flow performance table */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <h3 className="text-sm font-semibold">Flow Performance</h3>
              </div>
              {flowPerformance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <GitBranch className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No flow activity in this period
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left">
                      <th className="px-6 py-3 text-xs font-medium uppercase text-muted-foreground">
                        Flow Name
                      </th>
                      <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground text-right">
                        Starts
                      </th>
                      <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground text-right">
                        Completions
                      </th>
                      <th className="px-6 py-3 text-xs font-medium uppercase text-muted-foreground text-right">
                        Drop-off Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flowPerformance.map((flow) => (
                      <tr
                        key={flow.id}
                        className="border-b border-border last:border-0 transition-colors hover:bg-accent/50"
                      >
                        <td className="px-6 py-3">
                          <span className="text-sm font-medium">
                            {flow.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-muted-foreground">
                            {flow.starts}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-muted-foreground">
                            {flow.completions}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-medium",
                              flow.dropOffRate > 50
                                ? "text-red-600 dark:text-red-400"
                                : flow.dropOffRate > 25
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-green-600 dark:text-green-400"
                            )}
                          >
                            {flow.dropOffRate > 50 ? (
                              <TrendingDown className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingUp className="h-3.5 w-3.5" />
                            )}
                            {flow.dropOffRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
