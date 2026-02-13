"use client";

import { useState } from "react";
import {
  Plug,
  Power,
  PowerOff,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database, Platform } from "@/lib/types/database";

type Channel = Database["public"]["Tables"]["channels"]["Row"];

const platformConfig: Record<
  Platform,
  { label: string; color: string; bgColor: string }
> = {
  facebook: {
    label: "Facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  instagram: {
    label: "Instagram",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  twitter: {
    label: "X / Twitter",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  telegram: {
    label: "Telegram",
    color: "text-sky-600",
    bgColor: "bg-sky-100",
  },
  bluesky: {
    label: "Bluesky",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  reddit: {
    label: "Reddit",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
};

const platformIcons: Record<string, string> = {
  facebook: "f",
  instagram: "ig",
  twitter: "X",
  telegram: "tg",
  bluesky: "bs",
  reddit: "r",
  tiktok: "tk",
  youtube: "yt",
  linkedin: "in",
  threads: "th",
};

function getPlatformLabel(platform: string): string {
  return (
    platformConfig[platform as Platform]?.label ||
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}

function getPlatformColor(platform: string): string {
  return (
    platformConfig[platform as Platform]?.color || "text-foreground"
  );
}

function getPlatformBgColor(platform: string): string {
  return (
    platformConfig[platform as Platform]?.bgColor || "bg-muted"
  );
}

export function ChannelsView({
  channels: initialChannels,
}: {
  channels: Channel[];
  workspaceId: string;
}) {
  const [channels, setChannels] = useState(initialChannels);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);

    try {
      const res = await fetch("/api/v1/channels/sync", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        setSyncMessage(data.error || "Sync failed");
        return;
      }

      setChannels(data.channels ?? []);
      const { created, updated, deactivated } = data.synced;
      if (created === 0 && updated === 0 && deactivated === 0) {
        setSyncMessage("All channels up to date");
      } else {
        const parts = [];
        if (created > 0) parts.push(`${created} added`);
        if (updated > 0) parts.push(`${updated} updated`);
        if (deactivated > 0) parts.push(`${deactivated} deactivated`);
        setSyncMessage(parts.join(", "));
      }
      setTimeout(() => setSyncMessage(null), 4000);
    } catch {
      setSyncMessage("Failed to sync. Check your connection.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleToggleActive(channel: Channel) {
    setTogglingId(channel.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("channels")
      .update({ is_active: !channel.is_active })
      .eq("id", channel.id);

    if (!error) {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channel.id ? { ...c, is_active: !c.is_active } : c
        )
      );
    }
    setTogglingId(null);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Channels</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your connected social media accounts from Late
            </p>
          </div>
          <div className="flex items-center gap-3">
            {syncMessage && (
              <span className="text-xs text-muted-foreground">
                {syncMessage}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={cn("h-4 w-4", syncing && "animate-spin")}
              />
              {syncing ? "Syncing..." : "Sync"}
            </button>
          </div>
        </div>
      </div>

      {/* Channel cards */}
      <div className="flex-1 overflow-auto p-8">
        {channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Plug className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No channels yet
            </p>
            <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground/70">
              Connect your Late API key in Settings. Your social accounts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const label = getPlatformLabel(channel.platform);
              const color = getPlatformColor(channel.platform);
              const bgColor = getPlatformBgColor(channel.platform);
              return (
                <div
                  key={channel.id}
                  className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                          bgColor,
                          color
                        )}
                      >
                        {platformIcons[channel.platform] ||
                          channel.platform.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {channel.display_name ??
                            channel.username ??
                            label}
                        </p>
                        {channel.username && (
                          <p className="text-xs text-muted-foreground">
                            @{channel.username}
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(channel)}
                      disabled={togglingId === channel.id}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        channel.is_active
                          ? "text-green-600 hover:bg-green-100"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      title={
                        channel.is_active
                          ? "Channel is active. Click to deactivate."
                          : "Channel is inactive. Click to activate."
                      }
                    >
                      {channel.is_active ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        channel.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          channel.is_active
                            ? "bg-green-500"
                            : "bg-muted-foreground"
                        )}
                      />
                      {channel.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Connected{" "}
                      {new Date(channel.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
