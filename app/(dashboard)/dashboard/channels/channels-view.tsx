"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plug,
  Plus,
  Power,
  PowerOff,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database, Platform } from "@/lib/types/database";

type Channel = Database["public"]["Tables"]["channels"]["Row"];

interface LateAccount {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  profileUrl: string | null;
  isActive: boolean;
  status: string;
}

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
  const [showConnect, setShowConnect] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<LateAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAvailableAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    setAccountsError(null);

    try {
      const res = await fetch("/api/v1/channels/available");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch accounts (${res.status})`);
      }
      const data = await res.json();
      setAvailableAccounts(data.accounts ?? []);
    } catch (err) {
      setAccountsError(
        err instanceof Error ? err.message : "Failed to fetch accounts"
      );
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    if (showConnect) {
      fetchAvailableAccounts();
    }
  }, [showConnect, fetchAvailableAccounts]);

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

  async function handleConnect(account: LateAccount) {
    if (connectingId) return;
    setConnectingId(account._id);
    setConnectError(null);

    try {
      const res = await fetch("/api/v1/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lateAccountId: account._id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to connect (${res.status})`);
      }

      const channel = await res.json();
      setChannels((prev) => [channel, ...prev]);
      // Remove connected account from available list
      setAvailableAccounts((prev) =>
        prev.filter((a) => a._id !== account._id)
      );
    } catch (err) {
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect channel"
      );
    } finally {
      setConnectingId(null);
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
            onClick={() => setShowConnect(!showConnect)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {showConnect ? (
              <>
                <X className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Connect Channel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Connect panel: available Late accounts */}
      {showConnect && (
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                Available accounts from Late
              </h2>
              <button
                onClick={fetchAvailableAccounts}
                disabled={loadingAccounts}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent disabled:opacity-50"
              >
                <RefreshCw
                  className={cn(
                    "h-3 w-3",
                    loadingAccounts && "animate-spin"
                  )}
                />
                Refresh
              </button>
            </div>

            {/* Error */}
            {accountsError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  {accountsError}
                </p>
              </div>
            )}

            {/* Connect error */}
            {connectError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  {connectError}
                </p>
              </div>
            )}

            {/* Loading */}
            {loadingAccounts && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Fetching accounts...
                </span>
              </div>
            )}

            {/* Account list */}
            {!loadingAccounts && !accountsError && (
              <div className="mt-4 space-y-2">
                {availableAccounts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No additional accounts available. All your Late accounts are
                    already connected, or no accounts were found.
                  </p>
                ) : (
                  availableAccounts.map((account) => {
                    const isConnecting = connectingId === account._id;
                    return (
                      <div
                        key={account._id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                              getPlatformBgColor(account.platform),
                              getPlatformColor(account.platform)
                            )}
                          >
                            {platformIcons[account.platform] ||
                              account.platform.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {account.displayName || account.username}
                            </p>
                            {account.username && (
                              <p className="text-xs text-muted-foreground">
                                @{account.username}
                              </p>
                            )}
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              {getPlatformLabel(account.platform)}
                              {account.status && account.status !== "active"
                                ? ` (${account.status})`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnect(account)}
                          disabled={!!connectingId}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              Connect
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connected channel cards */}
      <div className="flex-1 overflow-auto p-8">
        {channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Plug className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No channels connected
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Connect your first social media channel to start receiving
              messages
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
                    {/* Platform icon and info */}
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
