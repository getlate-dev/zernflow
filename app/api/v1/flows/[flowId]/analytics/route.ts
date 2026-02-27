import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/flows/[flowId]/analytics
 *
 * Returns per-node execution counts for a flow, aggregated from the
 * analytics_events table. Supports optional date range filtering via
 * `from` and `to` query params (ISO date strings).
 *
 * Response shape:
 * {
 *   flowId: string,
 *   summary: { starts, completions, dropOffRate, messagesSent, messagesFailed },
 *   nodes: Record<nodeId, { executions: number, nodeType: string }>
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  const { flowId } = await params;
  const supabase = await createClient();

  // Authenticate the user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get the user's workspace membership
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  // Verify the flow belongs to the user's workspace
  const { data: flow } = await supabase
    .from("flows")
    .select("id")
    .eq("id", flowId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (!flow)
    return NextResponse.json({ error: "Flow not found" }, { status: 404 });

  // Parse optional date range from query params
  const url = new URL(request.url);
  const fromDate = url.searchParams.get("from");
  const toDate = url.searchParams.get("to");

  // Get per-node execution counts from analytics_events.
  // The metadata JSON column stores { nodeId, nodeType } for node_executed events.
  let query = supabase
    .from("analytics_events")
    .select("metadata")
    .eq("flow_id", flowId)
    .eq("event_type", "node_executed");

  if (fromDate) query = query.gte("created_at", fromDate);
  if (toDate) query = query.lte("created_at", toDate);

  const { data: events, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate execution counts per node from the event metadata
  const nodeCounts: Record<string, { executions: number; nodeType: string }> =
    {};
  for (const event of events || []) {
    const meta = event.metadata as {
      nodeId?: string;
      nodeType?: string;
    } | null;
    if (meta?.nodeId) {
      if (!nodeCounts[meta.nodeId]) {
        nodeCounts[meta.nodeId] = {
          executions: 0,
          nodeType: meta.nodeType || "unknown",
        };
      }
      nodeCounts[meta.nodeId].executions++;
    }
  }

  // Build flow-level summary stats queries in parallel.
  // Each query uses head:true with count:"exact" to get just the count
  // without fetching row data.
  let flowStartsQuery = supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("flow_id", flowId)
    .eq("event_type", "flow_started");

  let flowCompletionsQuery = supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("flow_id", flowId)
    .eq("event_type", "flow_completed");

  let messageSentQuery = supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("flow_id", flowId)
    .eq("event_type", "message_sent");

  let messageFailedQuery = supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("flow_id", flowId)
    .eq("event_type", "message_failed");

  // Apply the same date range filters to all summary queries
  if (fromDate) {
    flowStartsQuery = flowStartsQuery.gte("created_at", fromDate);
    flowCompletionsQuery = flowCompletionsQuery.gte("created_at", fromDate);
    messageSentQuery = messageSentQuery.gte("created_at", fromDate);
    messageFailedQuery = messageFailedQuery.gte("created_at", fromDate);
  }
  if (toDate) {
    flowStartsQuery = flowStartsQuery.lte("created_at", toDate);
    flowCompletionsQuery = flowCompletionsQuery.lte("created_at", toDate);
    messageSentQuery = messageSentQuery.lte("created_at", toDate);
    messageFailedQuery = messageFailedQuery.lte("created_at", toDate);
  }

  const [starts, completions, sent, failed] = await Promise.all([
    flowStartsQuery,
    flowCompletionsQuery,
    messageSentQuery,
    messageFailedQuery,
  ]);

  return NextResponse.json({
    flowId,
    summary: {
      starts: starts.count || 0,
      completions: completions.count || 0,
      dropOffRate: starts.count
        ? Math.round(
            (1 - (completions.count || 0) / starts.count) * 100
          )
        : 0,
      messagesSent: sent.count || 0,
      messagesFailed: failed.count || 0,
    },
    nodes: nodeCounts,
  });
}
