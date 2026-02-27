import { NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

interface AuthResult {
  workspaceId: string;
  userId: string | null; // null for API key auth (no user identity)
  authMethod: "session" | "api_key";
}

/**
 * Authenticate a request via Supabase session cookie or API key (Bearer token).
 * Returns workspace ID and auth method, or null if unauthenticated.
 *
 * API keys use the format: zf_{random_hex}
 * The key is hashed with SHA-256 and compared against stored hashes.
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResult | null> {
  // Check for API key in Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer zf_")) {
    const apiKey = authHeader.slice(7); // Remove "Bearer "
    return authenticateApiKey(apiKey);
  }

  // Fall back to Supabase session auth
  return authenticateSession();
}

async function authenticateSession(): Promise<AuthResult | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) return null;

  return {
    workspaceId: membership.workspace_id,
    userId: user.id,
    authMethod: "session",
  };
}

async function authenticateApiKey(apiKey: string): Promise<AuthResult | null> {
  const hash = crypto.createHash("sha256").update(apiKey).digest("hex");
  const supabase = await createServiceClient();

  const { data: key } = await supabase
    .from("api_keys")
    .select("workspace_id")
    .eq("key_hash", hash)
    .single();

  if (!key) return null;

  // Update last_used_at (fire and forget)
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", hash)
    .then(() => {});

  return {
    workspaceId: key.workspace_id,
    userId: null,
    authMethod: "api_key",
  };
}
