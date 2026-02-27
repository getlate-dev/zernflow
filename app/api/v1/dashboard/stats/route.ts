import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/dashboard/stats
 *
 * Returns aggregated dashboard statistics for the current user's workspace.
 * All counts are fetched in parallel for performance.
 *
 * Response shape:
 * - totalContacts: total contacts in workspace
 * - newContactsThisWeek: contacts created in the last 7 days
 * - activeConversations: conversations with status "open"
 * - messagesSentThisWeek: message_sent analytics events in last 7 days
 * - activeFlows: flows with status "published"
 * - recentActivity: last 20 analytics events (event_type, metadata, created_at)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership)
    return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const workspaceId = membership.workspace_id;
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Fetch all stats in parallel to minimize latency
  const [
    totalContacts,
    newContactsThisWeek,
    activeConversations,
    messagesSentThisWeek,
    activeFlows,
    recentActivity,
  ] = await Promise.all([
    // Total contacts in workspace
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),

    // Contacts created in the last 7 days
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .gte("created_at", sevenDaysAgo),

    // Conversations currently open
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "open"),

    // Messages sent in the last 7 days (tracked via analytics_events)
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("event_type", "message_sent")
      .gte("created_at", sevenDaysAgo),

    // Flows currently published
    supabase
      .from("flows")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "published"),

    // Last 20 analytics events for the activity feed
    supabase
      .from("analytics_events")
      .select("event_type, metadata, created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return NextResponse.json({
    totalContacts: totalContacts.count || 0,
    newContactsThisWeek: newContactsThisWeek.count || 0,
    activeConversations: activeConversations.count || 0,
    messagesSentThisWeek: messagesSentThisWeek.count || 0,
    activeFlows: activeFlows.count || 0,
    recentActivity: recentActivity.data || [],
  });
}
