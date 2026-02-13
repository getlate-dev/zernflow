"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { WORKSPACE_COOKIE } from "@/lib/workspace";

export async function switchWorkspace(workspaceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Validate user has access to this workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .eq("workspace_id", workspaceId)
    .single();

  if (!membership) return { error: "No access to this workspace" };

  const cookieStore = await cookies();
  cookieStore.set(WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return { ok: true };
}

export async function createWorkspace(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({ name: trimmed, slug })
    .select("id")
    .single();

  if (error || !workspace) {
    return { error: error?.message || "Failed to create workspace" };
  }

  // Add user as owner
  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  });

  // Switch to new workspace
  const cookieStore = await cookies();
  cookieStore.set(WORKSPACE_COOKIE, workspace.id, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return { ok: true, workspaceId: workspace.id };
}
