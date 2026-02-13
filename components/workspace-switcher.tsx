"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { switchWorkspace, createWorkspace } from "@/lib/actions/workspace";

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export function WorkspaceSwitcher({
  current,
  workspaces,
}: {
  current: { id: string; name: string };
  workspaces: WorkspaceItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [switching, setSwitching] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setNewName("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus input when create form opens
  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  async function handleSwitch(workspaceId: string) {
    if (workspaceId === current.id) {
      setOpen(false);
      return;
    }
    setSwitching(workspaceId);
    await switchWorkspace(workspaceId);
    router.refresh();
    setOpen(false);
    setSwitching(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSwitching("new");
    const result = await createWorkspace(newName.trim());
    if (result.ok) {
      router.refresh();
      setOpen(false);
      setCreating(false);
      setNewName("");
    }
    setSwitching(null);
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-sidebar-accent transition-colors"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          {current.name.charAt(0).toUpperCase()}
        </div>
        <span className="flex-1 truncate text-sm font-semibold text-sidebar-foreground">
          {current.name}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-popover p-1 shadow-lg">
          {/* Workspace list */}
          {workspaces.map((ws) => {
            const isActive = ws.id === current.id;
            const isLoading = switching === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => handleSwitch(ws.id)}
                disabled={!!switching}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-popover-foreground hover:bg-accent"
                )}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 truncate text-left">{ws.name}</span>
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isActive ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Create workspace */}
          {creating ? (
            <form onSubmit={handleCreate} className="p-1">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Workspace name"
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                disabled={switching === "new"}
              />
              <div className="mt-1.5 flex gap-1.5">
                <button
                  type="submit"
                  disabled={!newName.trim() || switching === "new"}
                  className="flex-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                >
                  {switching === "new" ? (
                    <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setNewName("");
                  }}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Create workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
}
