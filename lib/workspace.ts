import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(*)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership?.workspaces) redirect("/login");

  return {
    user,
    workspace: membership.workspaces,
    role: membership.role,
  };
}
