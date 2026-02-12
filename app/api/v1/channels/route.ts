import { NextRequest, NextResponse } from "next/server";
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

function getWebhookUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  return `${base}/api/webhooks/late`;
}

export async function GET() {
  const supabase = await createClient();
  const workspace = await getWorkspace(supabase);
  if (!workspace)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: channels, error } = await supabase
    .from("channels")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(channels);
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { lateAccountId, platform, username, displayName, profileUrl } = body;

  if (!lateAccountId || !platform) {
    return NextResponse.json(
      { error: "lateAccountId and platform are required" },
      { status: 400 }
    );
  }

  const late = createLateClient(workspace.late_api_key_encrypted);

  try {
    // Check if this account is already connected
    const { data: existing } = await supabase
      .from("channels")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("late_account_id", lateAccountId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "This account is already connected as a channel." },
        { status: 409 }
      );
    }

    // Generate a random webhook secret
    const webhookSecret = crypto.randomUUID();

    // Register webhook with Late API
    let webhookId: string | null = null;
    try {
      const res = await late.registerWebhook({
        action: "message.received",
        url: getWebhookUrl(),
      });
      webhookId = (res as any)?.id || (res as any)?.webhook?._id || null;
    } catch (e) {
      console.error("Failed to register webhook:", e);
      // Continue without webhook, channel can still be used for outbound
    }

    // Create channel record in Supabase
    const { data: channel, error } = await supabase
      .from("channels")
      .insert({
        workspace_id: workspace.id,
        platform: platform as "facebook" | "instagram" | "twitter" | "telegram" | "bluesky" | "reddit",
        late_account_id: lateAccountId,
        username: username || null,
        display_name: displayName || username || null,
        profile_picture: profileUrl || null,
        webhook_id: webhookId,
        webhook_secret: webhookSecret,
      })
      .select("*")
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error("Failed to connect channel:", error);
    return NextResponse.json(
      { error: `Failed to connect channel: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
