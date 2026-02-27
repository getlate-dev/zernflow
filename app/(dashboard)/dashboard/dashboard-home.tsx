"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Zap,
  Radio,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  UserPlus,
  Send,
  GitBranch,
  AlertTriangle,
  Bot,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalContacts: number;
  newContactsThisWeek: number;
  activeConversations: number;
  messagesSentThisWeek: number;
  activeFlows: number;
  recentActivity: Array<{
    event_type: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
  }>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats an ISO timestamp into a human-readable relative time string.
 * Examples: "just now", "2 min ago", "3 hours ago", "5 days ago"
 */
function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60);
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(diffSeconds / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/**
 * Returns a human-readable label for an analytics event type.
 */
function getEventLabel(eventType: string): string {
  const labels: Record<string, string> = {
    flow_started: "Flow started",
    flow_completed: "Flow completed",
    message_sent: "Message sent",
    message_failed: "Message failed",
    contact_created: "New contact created",
    broadcast_sent: "Broadcast sent",
    broadcast_failed: "Broadcast failed",
  };
  return labels[eventType] || eventType.replace(/_/g, " ");
}

/**
 * Returns the appropriate Lucide icon component for a given event type.
 */
function getEventIcon(eventType: string) {
  switch (eventType) {
    case "flow_started":
      return GitBranch;
    case "flow_completed":
      return Zap;
    case "message_sent":
      return Send;
    case "message_failed":
      return AlertTriangle;
    case "contact_created":
      return UserPlus;
    case "broadcast_sent":
      return Radio;
    case "broadcast_failed":
      return AlertTriangle;
    default:
      return Bot;
  }
}

/**
 * Returns Tailwind color classes (text + bg) for a given event type,
 * providing visual differentiation in the activity feed.
 */
function getEventColor(eventType: string): { text: string; bg: string } {
  switch (eventType) {
    case "flow_started":
      return { text: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" };
    case "flow_completed":
      return {
        text: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/30",
      };
    case "message_sent":
      return {
        text: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/30",
      };
    case "message_failed":
      return { text: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
    case "contact_created":
      return {
        text: "text-purple-600",
        bg: "bg-purple-100 dark:bg-purple-900/30",
      };
    case "broadcast_sent":
      return {
        text: "text-indigo-600",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
      };
    case "broadcast_failed":
      return { text: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
    default:
      return { text: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/30" };
  }
}

// ── Main Component ───────────────────────────────────────────────────────────

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/v1/dashboard/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data: DashboardStats = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Stat cards configuration: icon, label, value, trend info, and colors
  const statCards = stats
    ? [
        {
          label: "Total Contacts",
          value: stats.totalContacts,
          trend: `+${stats.newContactsThisWeek} this week`,
          icon: Users,
          color: "text-purple-600",
          bg: "bg-purple-100 dark:bg-purple-900/30",
        },
        {
          label: "Active Conversations",
          value: stats.activeConversations,
          trend: "Currently open",
          icon: MessageSquare,
          color: "text-blue-600",
          bg: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
          label: "Messages Sent",
          value: stats.messagesSentThisWeek,
          trend: "Last 7 days",
          icon: Send,
          color: "text-green-600",
          bg: "bg-green-100 dark:bg-green-900/30",
        },
        {
          label: "Active Flows",
          value: stats.activeFlows,
          trend: "Published",
          icon: Zap,
          color: "text-orange-600",
          bg: "bg-orange-100 dark:bg-orange-900/30",
        },
      ]
    : [];

  // Quick action links shown at the bottom of the dashboard
  const quickActions = [
    {
      label: "Create Flow",
      description: "Build an automation flow",
      href: "/dashboard/flows",
      icon: GitBranch,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Send Broadcast",
      description: "Message your contacts",
      href: "/dashboard/broadcasts",
      icon: Radio,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      label: "View Inbox",
      description: "Check conversations",
      href: "/dashboard/inbox",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your workspace activity
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat cards */}
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
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" />
                    {card.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Two-column layout: Activity feed + Quick actions */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Activity Feed (takes 2/3 width on large screens) */}
              <div className="rounded-xl border border-border bg-card lg:col-span-2">
                <div className="border-b border-border px-6 py-4">
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                </div>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="divide-y divide-border">
                    {stats.recentActivity.map((event, index) => {
                      const Icon = getEventIcon(event.event_type);
                      const color = getEventColor(event.event_type);
                      return (
                        <div
                          key={`${event.event_type}-${event.created_at}-${index}`}
                          className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-accent/50"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              color.bg
                            )}
                          >
                            <Icon className={cn("h-4 w-4", color.text)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                              {getEventLabel(event.event_type)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(event.created_at)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Zap className="h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No activity yet
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions (takes 1/3 width on large screens) */}
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <h3 className="text-sm font-semibold">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          action.bg
                        )}
                      >
                        <action.icon
                          className={cn("h-4 w-4", action.color)}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
