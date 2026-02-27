import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { scheduleBroadcastDelivery } from "@/lib/scheduler";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface SegmentRule {
  field: string;
  operator: string;
  value: string;
}

interface SegmentGroup {
  combinator: "and" | "or";
  rules: SegmentRule[];
}

interface SegmentFilter {
  combinator: "and" | "or";
  groups: SegmentGroup[];
}

/**
 * Cron job: Process scheduled broadcasts that are due.
 * Runs every minute. Picks up broadcasts with status='scheduled' and scheduled_for <= now().
 * For each broadcast, resolves the segment filter into contacts, creates broadcast_recipients,
 * and schedules delivery jobs via scheduleBroadcastDelivery (same flow as the manual send route).
 *
 * Auth: CRON_SECRET via query param or Authorization header (same pattern as /api/cron/jobs).
 *
 * GET /api/cron/broadcasts?key=CRON_SECRET
 */
export async function GET(request: NextRequest) {
  // Simple auth via query param or header (same pattern as /api/cron/jobs)
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret =
    request.nextUrl.searchParams.get("key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Find broadcasts that are scheduled and due (limit 5 per tick to avoid timeouts)
  const { data: broadcasts, error: fetchError } = await supabase
    .from("broadcasts")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(5);

  if (fetchError) {
    console.error("Failed to fetch scheduled broadcasts:", fetchError);
    return NextResponse.json({ error: "Failed to fetch broadcasts" }, { status: 500 });
  }

  if (!broadcasts || broadcasts.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;
  let failed = 0;

  for (const broadcast of broadcasts) {
    try {
      // Mark as sending immediately to prevent double-processing (optimistic lock on status)
      const { data: updated } = await supabase
        .from("broadcasts")
        .update({ status: "sending" })
        .eq("id", broadcast.id)
        .eq("status", "scheduled")
        .select("id")
        .single();

      // If update returned nothing, another process already picked it up
      if (!updated) {
        continue;
      }

      // Validate message content
      const messageContent = broadcast.message_content as { text?: string } | null;
      if (!messageContent?.text?.trim()) {
        console.error(`Broadcast ${broadcast.id} has no message content, marking as cancelled`);
        await supabase
          .from("broadcasts")
          .update({ status: "cancelled" })
          .eq("id", broadcast.id);
        processed++;
        continue;
      }

      // Resolve contacts from segment filter (same logic as the manual send route)
      const filter = broadcast.segment_filter as unknown as SegmentFilter | null;
      const contactIds = await resolveContacts(
        supabase,
        broadcast.workspace_id,
        filter
      );

      if (contactIds.length === 0) {
        console.warn(`Broadcast ${broadcast.id} matched 0 contacts, marking as completed`);
        await supabase
          .from("broadcasts")
          .update({ status: "completed", total_recipients: 0 })
          .eq("id", broadcast.id);
        processed++;
        continue;
      }

      // For each contact, find their first active channel link (via contact_channels)
      const { data: contactChannels } = await supabase
        .from("contact_channels")
        .select("contact_id, channel_id")
        .in("contact_id", contactIds);

      if (!contactChannels?.length) {
        console.warn(`Broadcast ${broadcast.id}: no contacts have channel connections, marking as completed`);
        await supabase
          .from("broadcasts")
          .update({ status: "completed", total_recipients: 0 })
          .eq("id", broadcast.id);
        processed++;
        continue;
      }

      // Deduplicate: one recipient per contact (first channel found)
      const seen = new Set<string>();
      const recipientPairs: { contactId: string; channelId: string }[] = [];
      for (const cc of contactChannels) {
        if (!seen.has(cc.contact_id)) {
          seen.add(cc.contact_id);
          recipientPairs.push({
            contactId: cc.contact_id,
            channelId: cc.channel_id,
          });
        }
      }

      // Create broadcast_recipients rows
      const recipientRows = recipientPairs.map((r) => ({
        broadcast_id: broadcast.id,
        contact_id: r.contactId,
        channel_id: r.channelId,
        status: "pending",
      }));

      // Insert in batches of 500
      const recipientIds: string[] = [];
      for (let i = 0; i < recipientRows.length; i += 500) {
        const batch = recipientRows.slice(i, i + 500);
        const { data: inserted, error: insertErr } = await supabase
          .from("broadcast_recipients")
          .insert(batch)
          .select("id");

        if (insertErr) {
          console.error(`Broadcast ${broadcast.id}: failed to insert recipients:`, insertErr);
          throw new Error(`Failed to create recipients: ${insertErr.message}`);
        }

        if (inserted) {
          recipientIds.push(...inserted.map((r) => r.id));
        }
      }

      if (recipientIds.length === 0) {
        throw new Error("Failed to create broadcast recipients");
      }

      // Schedule delivery jobs (creates scheduled_jobs with 100ms spacing,
      // which get picked up by /api/cron/jobs)
      await scheduleBroadcastDelivery(supabase, broadcast.id, recipientIds);

      processed++;
    } catch (error) {
      console.error(`Failed to process broadcast ${broadcast.id}:`, error);
      // Revert to scheduled so it can be retried on the next tick
      await supabase
        .from("broadcasts")
        .update({ status: "scheduled" })
        .eq("id", broadcast.id);
      failed++;
    }
  }

  return NextResponse.json({ processed, failed, total: broadcasts.length });
}

// ---------------------------------------------------------------------------
// Segment resolution (mirrors the logic in /api/v1/broadcasts/[broadcastId]/send)
// ---------------------------------------------------------------------------

/**
 * Resolve segment filter into contact IDs.
 * If no filter, returns all subscribed contacts in the workspace.
 */
async function resolveContacts(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  filter: SegmentFilter | null
): Promise<string[]> {
  // No filter = all subscribed contacts
  if (!filter || !filter.groups?.length) {
    const { data } = await supabase
      .from("contacts")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("is_subscribed", true)
      .limit(10000);
    return (data ?? []).map((c) => c.id);
  }

  // Start with all subscribed contacts
  const { data: allContacts } = await supabase
    .from("contacts")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("is_subscribed", true)
    .limit(10000);

  if (!allContacts?.length) return [];

  const allIds = new Set(allContacts.map((c) => c.id));

  // Evaluate each group
  const groupResults: Set<string>[] = [];

  for (const group of filter.groups) {
    const ruleResults: Set<string>[] = [];

    for (const rule of group.rules) {
      const ids = await evaluateRule(supabase, workspaceId, rule, allIds);
      ruleResults.push(ids);
    }

    // Combine rules within group
    let groupIds: Set<string>;
    if (group.combinator === "and") {
      groupIds = intersectSets(ruleResults);
    } else {
      groupIds = unionSets(ruleResults);
    }
    groupResults.push(groupIds);
  }

  // Combine groups
  let finalIds: Set<string>;
  if (filter.combinator === "and") {
    finalIds = intersectSets(groupResults);
  } else {
    finalIds = unionSets(groupResults);
  }

  return Array.from(finalIds);
}

/**
 * Evaluate a single segment rule against a set of contact IDs.
 * Supports: has_tag, missing_tag, platform, is_subscribed, last_interaction, custom_field.
 */
async function evaluateRule(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  rule: SegmentRule,
  allContactIds: Set<string>
): Promise<Set<string>> {
  const contactIds = Array.from(allContactIds);

  switch (rule.field) {
    case "has_tag": {
      const { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("name", rule.value)
        .single();

      if (!tag) return new Set();

      const { data: tagged } = await supabase
        .from("contact_tags")
        .select("contact_id")
        .eq("tag_id", tag.id)
        .in("contact_id", contactIds);

      return new Set((tagged ?? []).map((t) => t.contact_id));
    }

    case "missing_tag": {
      const { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("name", rule.value)
        .single();

      if (!tag) return new Set(contactIds); // Tag doesn't exist, all contacts "miss" it

      const { data: tagged } = await supabase
        .from("contact_tags")
        .select("contact_id")
        .eq("tag_id", tag.id)
        .in("contact_id", contactIds);

      const taggedSet = new Set((tagged ?? []).map((t) => t.contact_id));
      return new Set(contactIds.filter((id) => !taggedSet.has(id)));
    }

    case "platform": {
      const { data: channels } = await supabase
        .from("channels")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("platform", rule.value as "facebook" | "instagram" | "twitter" | "telegram" | "bluesky" | "reddit");

      if (!channels?.length) {
        return rule.operator === "not_equals" ? new Set(contactIds) : new Set();
      }

      const channelIds = channels.map((c) => c.id);
      const { data: links } = await supabase
        .from("contact_channels")
        .select("contact_id")
        .in("channel_id", channelIds)
        .in("contact_id", contactIds);

      const linkedSet = new Set((links ?? []).map((l) => l.contact_id));
      if (rule.operator === "not_equals") {
        return new Set(contactIds.filter((id) => !linkedSet.has(id)));
      }
      return linkedSet;
    }

    case "is_subscribed": {
      // Already filtered to subscribed, but handle explicit false
      if (rule.value === "false") {
        return new Set(); // We only target subscribed contacts
      }
      return new Set(contactIds);
    }

    case "last_interaction": {
      const date = new Date(rule.value).toISOString();
      let query = supabase
        .from("contacts")
        .select("id")
        .eq("workspace_id", workspaceId)
        .in("id", contactIds);

      if (rule.operator === "before") {
        query = query.lt("last_interaction_at", date);
      } else {
        query = query.gt("last_interaction_at", date);
      }

      const { data } = await query;
      return new Set((data ?? []).map((c) => c.id));
    }

    case "custom_field": {
      // rule.value format: "field_slug:actual_value"
      const [slug, ...rest] = rule.value.split(":");
      const fieldValue = rest.join(":");

      const { data: fieldDef } = await supabase
        .from("custom_field_definitions")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("slug", slug)
        .single();

      if (!fieldDef) return new Set();

      let cfQuery = supabase
        .from("contact_custom_fields")
        .select("contact_id")
        .eq("field_id", fieldDef.id)
        .in("contact_id", contactIds);

      switch (rule.operator) {
        case "equals":
          cfQuery = cfQuery.eq("value", fieldValue);
          break;
        case "not_equals":
          cfQuery = cfQuery.neq("value", fieldValue);
          break;
        case "contains":
          cfQuery = cfQuery.ilike("value", `%${fieldValue}%`);
          break;
        case "gt":
          cfQuery = cfQuery.gt("value", fieldValue);
          break;
        case "lt":
          cfQuery = cfQuery.lt("value", fieldValue);
          break;
      }

      const { data } = await cfQuery;
      return new Set((data ?? []).map((c) => c.contact_id));
    }

    default:
      return new Set(contactIds);
  }
}

/** Intersect multiple sets (AND logic). */
function intersectSets(sets: Set<string>[]): Set<string> {
  if (sets.length === 0) return new Set();
  const result = new Set(sets[0]);
  for (let i = 1; i < sets.length; i++) {
    for (const item of result) {
      if (!sets[i].has(item)) result.delete(item);
    }
  }
  return result;
}

/** Union multiple sets (OR logic). */
function unionSets(sets: Set<string>[]): Set<string> {
  const result = new Set<string>();
  for (const s of sets) {
    for (const item of s) {
      result.add(item);
    }
  }
  return result;
}
