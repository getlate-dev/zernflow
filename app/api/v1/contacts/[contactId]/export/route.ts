import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/contacts/[contactId]/export
 * GDPR data export: downloads all stored data for a given contact as a JSON file.
 * Includes the contact record, channels, tags, custom fields, conversations,
 * messages, and sequence enrollments.
 *
 * @param contactId - The ID of the contact to export
 * @returns JSON file download with Content-Disposition attachment header
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params;
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

  // Verify the contact exists and belongs to the authenticated user's workspace
  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .eq("workspace_id", membership.workspace_id)
    .single();

  if (!contact)
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  // Fetch all related data in parallel for performance
  const [channels, tags, customFields, conversations, enrollments] =
    await Promise.all([
      supabase
        .from("contact_channels")
        .select("*")
        .eq("contact_id", contactId),
      supabase
        .from("contact_tags")
        .select("*, tags(name, color)")
        .eq("contact_id", contactId),
      supabase
        .from("contact_custom_fields")
        .select("*, custom_field_definitions(name, slug, type)")
        .eq("contact_id", contactId),
      supabase
        .from("conversations")
        .select("*")
        .eq("contact_id", contactId),
      supabase
        .from("sequence_enrollments")
        .select("*, sequences(name)")
        .eq("contact_id", contactId),
    ]);

  // Fetch all messages across all of the contact's conversations
  const conversationIds = (conversations.data || []).map((c) => c.id);
  let messages: unknown[] = [];
  if (conversationIds.length > 0) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true });
    messages = msgs || [];
  }

  // Assemble the full export payload
  const exportData = {
    exportedAt: new Date().toISOString(),
    contact,
    channels: channels.data || [],
    tags: tags.data || [],
    customFields: customFields.data || [],
    conversations: conversations.data || [],
    messages,
    sequenceEnrollments: enrollments.data || [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="contact-${contactId}-export.json"`,
    },
  });
}
