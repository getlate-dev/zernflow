import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLateClient } from "@/lib/late-client";

async function getWorkspace(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(*)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership?.workspaces) return null;
  return membership.workspaces;
}

export async function GET() {
  const supabase = await createClient();
  const workspace = await getWorkspace(supabase);
  if (!workspace)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!workspace.late_api_key_encrypted) {
    return NextResponse.json(
      { error: "Late API key not configured. Go to Settings first." },
      { status: 400 }
    );
  }

  const late = createLateClient(workspace.late_api_key_encrypted);

  try {
    // Fetch all accounts from Late API
    const accounts = await late.accounts.list();

    // Fetch already-connected channel late_account_ids for this workspace
    const { data: connectedChannels } = await supabase
      .from("channels")
      .select("late_account_id")
      .eq("workspace_id", workspace.id);

    const connectedIds = new Set(
      (connectedChannels ?? []).map((c) => c.late_account_id)
    );

    // Filter out already-connected accounts
    const available = accounts.filter((a) => !connectedIds.has(a._id));

    return NextResponse.json({ accounts: available });
  } catch (error) {
    console.error("Failed to fetch available accounts:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch accounts from Late: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
