import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLateClient } from "@/lib/late-client";

/**
 * POST /api/v1/channels/test-key
 *
 * Tests a Late API key, saves it to the workspace, and auto-syncs channels.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey, workspaceId } = body;

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "apiKey is required" },
      { status: 400 }
    );
  }

  // Validate the key by listing accounts
  let accounts: Array<{ _id?: string; platform?: string; username?: string; displayName?: string }>;
  try {
    const late = createLateClient(apiKey.trim());
    const res = await late.accounts.listAccounts();
    accounts = res.data?.accounts ?? [];
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid API key or connection error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // If workspaceId provided, save the key and sync channels
  if (workspaceId) {
    const supabase = await createClient();

    // Save the API key
    const { error: saveErr } = await supabase
      .from("workspaces")
      .update({ late_api_key_encrypted: apiKey.trim() })
      .eq("id", workspaceId)
      .select("id")
      .single();

    if (saveErr) {
      return NextResponse.json(
        { error: `Key valid but failed to save: ${saveErr.message}` },
        { status: 500 }
      );
    }

    // Auto-sync channels
    const { data: existingChannels } = await supabase
      .from("channels")
      .select("*")
      .eq("workspace_id", workspaceId);

    const existingByLateId = new Map(
      (existingChannels ?? []).map((c) => [c.late_account_id, c])
    );

    for (const account of accounts) {
      if (!account._id) continue;
      if (existingByLateId.has(account._id)) continue;

      await supabase.from("channels").insert({
        workspace_id: workspaceId,
        platform: account.platform as "facebook" | "instagram" | "twitter" | "telegram" | "bluesky" | "reddit",
        late_account_id: account._id,
        username: account.username || null,
        display_name: account.displayName || account.username || null,
        profile_picture: null,
        is_active: true,
      });
    }
  }

  return NextResponse.json({ accounts });
}
