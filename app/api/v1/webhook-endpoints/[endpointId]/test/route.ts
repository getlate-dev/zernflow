import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * POST /api/v1/webhook-endpoints/[endpointId]/test
 * Send a test event to the webhook endpoint to verify it works.
 * Returns the HTTP status code from the endpoint.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  const { endpointId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { data: endpoint } = await supabase
    .from("webhook_endpoints")
    .select("*")
    .eq("id", endpointId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payload = {
    event: "test",
    timestamp: new Date().toISOString(),
    data: { message: "This is a test event from Zernflow" },
  };

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Zernflow-Webhook/1.0",
  };

  if (endpoint.secret) {
    headers["X-Zernflow-Signature"] = crypto
      .createHmac("sha256", endpoint.secret)
      .update(body)
      .digest("hex");
  }

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(10000),
    });

    return NextResponse.json({
      success: response.ok,
      statusCode: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Connection failed",
    });
  }
}
