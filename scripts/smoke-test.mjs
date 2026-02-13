#!/usr/bin/env node
/**
 * ZernFlow End-to-End Smoke Test
 *
 * This script:
 * 1. Creates a simple test flow (trigger -> send message)
 * 2. Creates a keyword trigger for "test"
 * 3. Sends a simulated Late webhook to the deployed app
 * 4. Verifies: contact created, conversation created, message stored, flow session ran
 * 5. Cleans up test data
 *
 * Usage:
 *   node scripts/smoke-test.mjs [base-url]
 *   node scripts/smoke-test.mjs https://zernflow.vercel.app
 *   node scripts/smoke-test.mjs http://localhost:3000
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env manually (no dotenv dependency)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  const val = trimmed.slice(eq + 1);
  if (!process.env[key]) process.env[key] = val;
}

const BASE_URL = process.argv[2] || "https://zernflow.vercel.app";
const WORKSPACE_ID = "1ed7f49a-79d9-42e5-a79d-0ea9e3b957b1";

// Use the telegram channel (simplest for testing)
const CHANNEL = {
  id: "0231f9d7-e6d2-45e4-931b-48543d492c9d",
  platform: "telegram",
  late_account_id: "69709fcdc955c6705a96ed84",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test IDs for cleanup
const testFlowId = randomUUID();
const testTriggerId = randomUUID();
const fakeSenderId = `smoke_test_${Date.now()}`;
const fakeConversationId = `conv_smoke_${Date.now()}`;

const log = (emoji, msg) => console.log(`${emoji}  ${msg}`);
const pass = (msg) => log("\x1b[32mPASS\x1b[0m", msg);
const fail = (msg) => log("\x1b[31mFAIL\x1b[0m", msg);
const info = (msg) => log("\x1b[36mINFO\x1b[0m", msg);

async function setup() {
  info("Setting up test flow and trigger...");

  // Create a simple flow: trigger -> sendMessage
  const flowNodes = [
    {
      id: "trigger-1",
      type: "trigger",
      position: { x: 250, y: 0 },
      data: {
        label: "Smoke Test Trigger",
        triggerType: "keyword",
        config: { keywords: ["smoketest"] },
      },
    },
    {
      id: "msg-1",
      type: "sendMessage",
      position: { x: 250, y: 150 },
      data: {
        label: "Smoke Test Reply",
        messages: [{ text: "Smoke test passed! ZernFlow is working." }],
      },
    },
  ];

  const flowEdges = [
    { id: "e1", source: "trigger-1", target: "msg-1" },
  ];

  const { error: flowErr } = await supabase.from("flows").insert({
    id: testFlowId,
    workspace_id: WORKSPACE_ID,
    name: "[SMOKE TEST] Auto-Reply Flow",
    status: "published",
    nodes: flowNodes,
    edges: flowEdges,
    published_at: new Date().toISOString(),
  });

  if (flowErr) throw new Error(`Failed to create flow: ${flowErr.message}`);
  pass("Created test flow (published)");

  // Create a keyword trigger
  const { error: triggerErr } = await supabase.from("triggers").insert({
    id: testTriggerId,
    flow_id: testFlowId,
    channel_id: null, // Global trigger (matches any channel)
    type: "keyword",
    config: {
      keywords: [{ value: "smoketest", matchType: "contains" }],
    },
    is_active: true,
    priority: 100,
  });

  if (triggerErr) throw new Error(`Failed to create trigger: ${triggerErr.message}`);
  pass("Created keyword trigger for 'smoketest'");
}

async function fireWebhook() {
  info(`Sending simulated webhook to ${BASE_URL}/api/webhooks/late ...`);

  const payload = {
    event: "message.received",
    message: {
      id: `msg_${Date.now()}`,
      conversationId: fakeConversationId,
      platform: "telegram",
      platformMessageId: `tg_${Date.now()}`,
      direction: "inbound",
      text: "hey smoketest please",
      attachments: [],
      sender: {
        id: fakeSenderId,
        name: "Smoke Test User",
        username: "smoke_tester",
        picture: null,
      },
      sentAt: new Date().toISOString(),
      isRead: false,
    },
    conversation: {
      id: fakeConversationId,
      platformConversationId: `tg_conv_${Date.now()}`,
      participantId: fakeSenderId,
      participantName: "Smoke Test User",
      participantUsername: "smoke_tester",
      participantPicture: null,
      status: "open",
    },
    account: {
      id: CHANNEL.late_account_id,
      platform: "telegram",
      username: "test_bot",
      displayName: "Test Bot",
    },
    metadata: {},
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(`${BASE_URL}/api/webhooks/late`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();

  if (!res.ok) {
    fail(`Webhook returned ${res.status}: ${JSON.stringify(body)}`);
    return false;
  }

  pass(`Webhook returned ${res.status}: ${JSON.stringify(body)}`);
  return true;
}

async function verify() {
  info("Verifying results (waiting 2s for async flow execution)...");
  await new Promise((r) => setTimeout(r, 2000));

  let allPassed = true;

  // 1. Check contact was created
  const { data: contactChannel } = await supabase
    .from("contact_channels")
    .select("contact_id, contacts(id, display_name)")
    .eq("channel_id", CHANNEL.id)
    .eq("platform_sender_id", fakeSenderId)
    .single();

  if (contactChannel?.contact_id) {
    pass(`Contact created: ${contactChannel.contacts?.display_name} (${contactChannel.contact_id})`);
  } else {
    fail("Contact was NOT created");
    allPassed = false;
  }

  // 2. Check conversation was created
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, late_conversation_id, status, last_message_preview")
    .eq("channel_id", CHANNEL.id)
    .eq("contact_id", contactChannel?.contact_id || "none")
    .single();

  if (conversation) {
    pass(`Conversation created: ${conversation.id} (preview: "${conversation.last_message_preview}")`);
  } else {
    fail("Conversation was NOT created");
    allPassed = false;
  }

  // 3. Check inbound message was stored
  const { data: messages } = await supabase
    .from("messages")
    .select("id, direction, text, status")
    .eq("conversation_id", conversation?.id || "none")
    .order("created_at", { ascending: true });

  const inbound = messages?.find((m) => m.direction === "inbound");
  const outbound = messages?.find((m) => m.direction === "outbound");

  if (inbound) {
    pass(`Inbound message stored: "${inbound.text}"`);
  } else {
    fail("Inbound message was NOT stored");
    allPassed = false;
  }

  // 4. Check flow session was created
  const { data: sessions } = await supabase
    .from("flow_sessions")
    .select("id, status, flow_id, current_node_id")
    .eq("flow_id", testFlowId)
    .eq("contact_id", contactChannel?.contact_id || "none");

  if (sessions?.length) {
    pass(`Flow session created: ${sessions[0].id} (status: ${sessions[0].status})`);
  } else {
    fail("Flow session was NOT created (trigger may not have matched)");
    allPassed = false;
  }

  // 5. Check outbound message (flow reply) was attempted
  if (outbound) {
    pass(`Outbound message sent: "${outbound.text}" (status: ${outbound.status})`);
  } else {
    info("Outbound message not found. This is expected if Late API key doesn't have inbox access for this channel.");
    info("The important thing is that the flow DID execute (check session above).");
  }

  // 6. Check analytics events
  const { data: events, count } = await supabase
    .from("analytics_events")
    .select("event_type, metadata", { count: "exact" })
    .eq("flow_id", testFlowId);

  if (count && count > 0) {
    pass(`Analytics events logged: ${count} events (types: ${events?.map((e) => e.event_type).join(", ")})`);
  } else {
    info("No analytics events found (may not have reached node execution)");
  }

  return allPassed;
}

async function cleanup() {
  info("Cleaning up test data...");

  // Find the contact created by this test
  const { data: contactChannel } = await supabase
    .from("contact_channels")
    .select("contact_id")
    .eq("channel_id", CHANNEL.id)
    .eq("platform_sender_id", fakeSenderId)
    .single();

  const contactId = contactChannel?.contact_id;

  if (contactId) {
    // Delete in order (respecting foreign keys)
    await supabase.from("analytics_events").delete().eq("flow_id", testFlowId);
    await supabase.from("flow_sessions").delete().eq("flow_id", testFlowId);

    const { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("contact_id", contactId)
      .eq("channel_id", CHANNEL.id)
      .single();

    if (conv) {
      await supabase.from("messages").delete().eq("conversation_id", conv.id);
      await supabase.from("conversations").delete().eq("id", conv.id);
    }

    await supabase.from("contact_channels").delete().eq("contact_id", contactId);
    await supabase.from("contact_tags").delete().eq("contact_id", contactId);
    await supabase.from("contacts").delete().eq("id", contactId);
  }

  await supabase.from("triggers").delete().eq("id", testTriggerId);
  await supabase.from("flows").delete().eq("id", testFlowId);

  pass("Test data cleaned up");
}

async function main() {
  console.log("\n========================================");
  console.log("  ZernFlow End-to-End Smoke Test");
  console.log(`  Target: ${BASE_URL}`);
  console.log("========================================\n");

  try {
    await setup();
    console.log("");

    const webhookOk = await fireWebhook();
    if (!webhookOk) {
      await cleanup();
      process.exit(1);
    }
    console.log("");

    const allPassed = await verify();
    console.log("");

    await cleanup();

    console.log("\n========================================");
    if (allPassed) {
      console.log("  \x1b[32mALL CHECKS PASSED\x1b[0m");
    } else {
      console.log("  \x1b[33mSOME CHECKS FAILED\x1b[0m (see above)");
    }
    console.log("========================================\n");

    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    fail(`Fatal error: ${err.message}`);
    console.error(err);
    await cleanup().catch(() => {});
    process.exit(1);
  }
}

main();
