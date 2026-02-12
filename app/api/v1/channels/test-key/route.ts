import { NextRequest, NextResponse } from "next/server";
import { createLateClient } from "@/lib/late-client";

/**
 * POST /api/v1/channels/test-key
 * Tests a Late API key by listing accounts.
 * Used by the settings page to validate keys before saving.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey } = body;

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "apiKey is required" },
      { status: 400 }
    );
  }

  try {
    const late = createLateClient(apiKey.trim());
    const accounts = await late.listAccounts();
    return NextResponse.json({ accounts });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid API key or connection error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
