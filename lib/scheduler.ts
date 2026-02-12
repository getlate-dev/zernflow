import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/types/database";

/**
 * Schedule a job to run at a specific time.
 */
export async function scheduleJob(
  supabase: SupabaseClient<Database>,
  type: string,
  payload: Record<string, unknown>,
  runAt: Date
) {
  const { data, error } = await supabase
    .from("scheduled_jobs")
    .insert({
      type,
      payload: payload as unknown as Json,
      run_at: runAt.toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Schedule broadcast delivery. Creates individual jobs for each recipient
 * with 100ms spacing to avoid rate limits.
 */
export async function scheduleBroadcastDelivery(
  supabase: SupabaseClient<Database>,
  broadcastId: string,
  recipientIds: string[]
) {
  const jobs = recipientIds.map((recipientId, index) => ({
    type: "send_broadcast",
    payload: { broadcastId, recipientId } as unknown as Json,
    run_at: new Date(Date.now() + index * 100).toISOString(),
    status: "pending" as const,
  }));

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    await supabase.from("scheduled_jobs").insert(batch);
  }

  // Update broadcast status
  await supabase
    .from("broadcasts")
    .update({
      status: "sending",
      total_recipients: recipientIds.length,
    })
    .eq("id", broadcastId);
}
