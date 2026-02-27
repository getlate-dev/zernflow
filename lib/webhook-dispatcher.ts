import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

// Supported event types
export type WebhookEventType =
  | "contact.created"
  | "contact.updated"
  | "message.received"
  | "message.sent"
  | "flow.started"
  | "flow.completed"
  | "tag.added"
  | "tag.removed"
  | "conversation.opened"
  | "conversation.closed";

interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Fire outbound webhooks for a given event.
 * This is fire-and-forget: errors are caught and logged, never thrown.
 * Endpoints that fail 10 times in a row are auto-disabled.
 */
export async function dispatchWebhookEvent(
  workspaceId: string,
  event: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    // Find all active endpoints that subscribe to this event
    const { data: endpoints } = await supabase
      .from("webhook_endpoints")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("is_active", true)
      .contains("events", [event]);

    if (!endpoints || endpoints.length === 0) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const body = JSON.stringify(payload);

    // Fire all webhooks in parallel (fire-and-forget)
    await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "User-Agent": "Zernflow-Webhook/1.0",
          };

          // Sign the payload with HMAC-SHA256 if a secret is configured
          if (endpoint.secret) {
            const signature = crypto
              .createHmac("sha256", endpoint.secret)
              .update(body)
              .digest("hex");
            headers["X-Zernflow-Signature"] = signature;
          }

          const response = await fetch(endpoint.url, {
            method: "POST",
            headers,
            body,
            signal: AbortSignal.timeout(10000), // 10s timeout
          });

          if (response.ok) {
            // Reset failure count on success
            await supabase
              .from("webhook_endpoints")
              .update({ last_triggered_at: new Date().toISOString(), failure_count: 0 })
              .eq("id", endpoint.id);
          } else {
            // Increment failure count
            const newCount = (endpoint.failure_count || 0) + 1;
            const updates: Record<string, unknown> = { failure_count: newCount };

            // Auto-disable after 10 consecutive failures
            if (newCount >= 10) {
              updates.is_active = false;
              console.warn(`Webhook endpoint ${endpoint.id} disabled after ${newCount} failures`);
            }

            await supabase
              .from("webhook_endpoints")
              .update(updates)
              .eq("id", endpoint.id);
          }
        } catch (err) {
          // Network error, timeout, etc.
          const newCount = (endpoint.failure_count || 0) + 1;
          const updates: Record<string, unknown> = { failure_count: newCount };
          if (newCount >= 10) {
            updates.is_active = false;
          }
          await supabase
            .from("webhook_endpoints")
            .update(updates)
            .eq("id", endpoint.id);

          console.error(`Webhook delivery failed for ${endpoint.url}:`, err);
        }
      })
    );
  } catch (err) {
    // Never let webhook dispatch crash the caller
    console.error("Webhook dispatch error:", err);
  }
}
