"use client";

import { useState } from "react";
import {
  Plug,
  Plus,
  Power,
  PowerOff,
  X,
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
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  instagram: {
    label: "Instagram",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  twitter: {
    label: "X / Twitter",
    color: "text-foreground",
    bgColor: "bg-muted",
  },
  telegram: {
    label: "Telegram",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
  },
  bluesky: {
    label: "Bluesky",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  reddit: {
    label: "Reddit",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
};

const platformIcons: Record<Platform, string> = {
  facebook: "f",
  instagram: "ig",
  twitter: "X",
  telegram: "tg",
  bluesky: "bs",
  reddit: "r",
};

export function ChannelsView({
  channels: initialChannels,
  workspaceId,
}: {
  channels: Channel[];
  workspaceId: string;
}) {
  const [channels, setChannels] = useState(initialChannels);
  const [showConnect, setShowConnect] = useState(false);
  const [connectForm, setConnectForm] = useState({
    platform: "instagram" as Platform,
    late_account_id: "",
    username: "",
    display_name: "",
  });
  const [connecting, setConnecting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  async function handleConnect() {
    if (!connectForm.late_account_id.trim() || connecting) return;
    setConnecting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("channels")
        .insert({
          workspace_id: workspaceId,
          platform: connectForm.platform,
          late_account_id: connectForm.late_account_id.trim(),
          username: connectForm.username.trim() || null,
          display_name: connectForm.display_name.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setChannels((prev) => [data, ...prev]);
        setShowConnect(false);
        setConnectForm({
          platform: "instagram",
          late_account_id: "",
          username: "",
          display_name: "",
        });
      }
    } catch (err) {
      console.error("Failed to connect channel:", err);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Channels</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect and manage your social media channels
            </p>
          </div>
          <button
            onClick={() => setShowConnect(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Connect Channel
          </button>
        </div>
      </div>

      {/* Connect dialog */}
      {showConnect && (
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Connect a new channel</h2>
              <button
                onClick={() => setShowConnect(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Platform select */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Platform
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(Object.keys(platformConfig) as Platform[]).map(
                    (platform) => (
                      <button
                        key={platform}
                        onClick={() =>
                          setConnectForm((f) => ({ ...f, platform }))
                        }
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          connectForm.platform === platform
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-accent"
                        )}
                      >
                        {platformConfig[platform].label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Late Account ID */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Late Account ID
                </label>
                <input
                  type="text"
                  value={connectForm.late_account_id}
                  onChange={(e) =>
                    setConnectForm((f) => ({
                      ...f,
                      late_account_id: e.target.value,
                    }))
                  }
                  placeholder="The social account ID from Late"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Username (optional)
                </label>
                <input
                  type="text"
                  value={connectForm.username}
                  onChange={(e) =>
                    setConnectForm((f) => ({
                      ...f,
                      username: e.target.value,
                    }))
                  }
                  placeholder="@username"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Display Name (optional)
                </label>
                <input
                  type="text"
                  value={connectForm.display_name}
                  onChange={(e) =>
                    setConnectForm((f) => ({
                      ...f,
                      display_name: e.target.value,
                    }))
                  }
                  placeholder="Page or account name"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={!connectForm.late_account_id.trim() || connecting}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect Channel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Channel cards */}
      <div className="flex-1 overflow-auto p-8">
        {channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Plug className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No channels connected
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Connect your first social media channel to start receiving messages
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const config = platformConfig[channel.platform];
              return (
                <div
                  key={channel.id}
                  className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    {/* Platform icon and info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                          config.bgColor,
                          config.color
                        )}
                      >
                        {platformIcons[channel.platform]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {channel.display_name ?? channel.username ?? config.label}
                        </p>
                        {channel.username && (
                          <p className="text-xs text-muted-foreground">
                            @{channel.username}
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {config.label}
                        </p>
                      </div>
                    </div>

                    {/* Status toggle */}
                    <button
                      onClick={() => handleToggleActive(channel)}
                      disabled={togglingId === channel.id}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        channel.is_active
                          ? "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
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

                  {/* Status badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        channel.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          channel.is_active ? "bg-green-500" : "bg-muted-foreground"
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
