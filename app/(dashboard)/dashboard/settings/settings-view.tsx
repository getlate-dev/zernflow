"use client";

import { useState } from "react";
import {
  Settings,
  Key,
  Hash,
  Save,
  Plus,
  X,
  Check,
  Eye,
  EyeOff,
  Plug,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface WorkspaceSettings {
  id: string;
  name: string;
  hasApiKey: boolean;
  globalKeywords: string[];
}

interface TestResult {
  success: boolean;
  accountCount?: number;
  error?: string;
}

export function SettingsView({
  workspace,
}: {
  workspace: WorkspaceSettings;
}) {
  const [name, setName] = useState(workspace.name);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(workspace.globalKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  function addKeyword() {
    const trimmed = newKeyword.trim().toLowerCase();
    if (!trimmed) return;
    if (keywords.includes(trimmed)) {
      setNewKeyword("");
      return;
    }
    setKeywords((prev) => [...prev, trimmed]);
    setNewKeyword("");
  }

  function removeKeyword(kw: string) {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  }

  async function handleTestConnection() {
    const keyToTest = apiKey.trim();
    if (!keyToTest) return;

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("https://getlate.dev/api/v1/accounts", {
        headers: {
          Authorization: `Bearer ${keyToTest}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setTestResult({
          success: false,
          error:
            res.status === 401
              ? "Invalid API key. Please check your key and try again."
              : `Connection failed (${res.status}). ${body?.error || ""}`.trim(),
        });
        return;
      }

      const data = await res.json();
      const accounts = data.accounts || [];
      setTestResult({
        success: true,
        accountCount: accounts.length,
      });
    } catch {
      setTestResult({
        success: false,
        error: "Could not reach the Late API. Please check your network connection.",
      });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient();

      const update: Record<string, unknown> = {
        name: name.trim(),
        global_keywords: keywords,
      };

      // Only update API key if user entered a new one
      if (apiKey.trim()) {
        update.late_api_key_encrypted = apiKey.trim();
      }

      const { error: updateError } = await supabase
        .from("workspaces")
        .update(update)
        .eq("id", workspace.id);

      if (updateError) throw updateError;

      setSaved(true);
      setApiKey("");
      setTestResult(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace settings
        </p>
      </div>

      {/* Settings form */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-2xl space-y-8 px-8 py-8">
          {/* Workspace name */}
          <section>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">General</h2>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </section>

          <hr className="border-border" />

          {/* Late API Key */}
          <section>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Late API Key</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your Late API key is used to connect with social media platforms.
              {workspace.hasApiKey && " A key is currently configured."}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              You can get your API key from your{" "}
              <a
                href="https://getlate.dev/dashboard/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-primary underline underline-offset-2 hover:opacity-80"
              >
                Late dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
              . Sign up at{" "}
              <a
                href="https://getlate.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                getlate.dev
              </a>{" "}
              if you don&apos;t have an account yet.
            </p>

            <div className="mt-4 relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  // Clear test result when key changes
                  if (testResult) setTestResult(null);
                }}
                placeholder={
                  workspace.hasApiKey
                    ? "Enter a new key to replace the current one"
                    : "Enter your Late API key"
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm font-mono placeholder:text-muted-foreground placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Test Connection button */}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleTestConnection}
                disabled={!apiKey.trim() || testing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plug className="h-3.5 w-3.5" />
                )}
                {testing ? "Testing..." : "Test Connection"}
              </button>

              {testResult && testResult.success && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3.5 w-3.5" />
                  Connected ({testResult.accountCount}{" "}
                  {testResult.accountCount === 1 ? "account" : "accounts"}{" "}
                  found)
                </span>
              )}

              {testResult && !testResult.success && (
                <span className="text-xs text-red-600">
                  {testResult.error}
                </span>
              )}
            </div>

            {workspace.hasApiKey && !testResult && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
                <Check className="h-3 w-3" />
                API key configured
              </p>
            )}
          </section>

          <hr className="border-border" />

          {/* Global Keywords */}
          <section>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Global Keywords</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Keywords that trigger flows across all channels. Flow-specific triggers take priority over global keywords.
            </p>

            {/* Keyword input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Add a keyword..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
                className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Keyword list */}
            {keywords.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    {kw}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground/70">
                No global keywords configured
              </p>
            )}
          </section>

          <hr className="border-border" />

          {/* Save button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>

            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />
                Settings saved
              </span>
            )}

            {error && (
              <span className="text-sm text-red-600">
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
