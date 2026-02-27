import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

/**
 * POST /api/v1/contacts/import
 *
 * Accepts a CSV file with contact data. Supported columns:
 * - name / display_name (required)
 * - email (optional)
 * - tags (optional, comma-separated within the field)
 *
 * The first row is treated as headers. Column matching is case-insensitive.
 */
export async function POST(request: NextRequest) {
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided. Send a CSV file as 'file' in multipart form data." }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json({ error: "Only CSV files are supported." }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV must have a header row and at least one data row." }, { status: 400 });
  }

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const dataRows = rows.slice(1);

  // Find column indices
  const nameIdx = headers.findIndex(h => h === "name" || h === "display_name" || h === "displayname");
  const emailIdx = headers.findIndex(h => h === "email" || h === "email_address");
  const tagsIdx = headers.findIndex(h => h === "tags" || h === "tag");

  if (nameIdx === -1) {
    return NextResponse.json(
      { error: "CSV must have a 'name' or 'display_name' column." },
      { status: 400 }
    );
  }

  let created = 0;
  let skipped = 0;
  let tagCount = 0;
  const errors: string[] = [];

  // Process in batches of 50
  for (let i = 0; i < dataRows.length; i += 50) {
    const batch = dataRows.slice(i, i + 50);

    const contactInserts = batch
      .map((row, rowIdx) => {
        const name = row[nameIdx]?.trim();
        if (!name) {
          skipped++;
          return null;
        }

        return {
          workspace_id: membership.workspace_id,
          display_name: name,
          email: emailIdx !== -1 ? row[emailIdx]?.trim() || null : null,
          is_subscribed: true,
        };
      })
      .filter(Boolean) as Array<{
        workspace_id: string;
        display_name: string;
        email: string | null;
        is_subscribed: boolean;
      }>;

    if (contactInserts.length === 0) continue;

    const { data: insertedContacts, error } = await supabase
      .from("contacts")
      .insert(contactInserts)
      .select("id, display_name");

    if (error) {
      errors.push(`Batch ${Math.floor(i / 50) + 1}: ${error.message}`);
      continue;
    }

    created += (insertedContacts || []).length;

    // Process tags for this batch
    if (tagsIdx !== -1 && insertedContacts) {
      for (let j = 0; j < batch.length; j++) {
        const tagsRaw = batch[j][tagsIdx]?.trim();
        if (!tagsRaw) continue;

        const tagNames = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
        if (tagNames.length === 0) continue;

        // Find the corresponding inserted contact
        const contactName = batch[j][nameIdx]?.trim();
        const contact = insertedContacts.find(c => c.display_name === contactName);
        if (!contact) continue;

        for (const tagName of tagNames) {
          // Upsert tag
          const { data: tag } = await supabase
            .from("tags")
            .upsert(
              { workspace_id: membership.workspace_id, name: tagName },
              { onConflict: "workspace_id,name" }
            )
            .select("id")
            .single();

          if (tag) {
            await supabase
              .from("contact_tags")
              .upsert({ contact_id: contact.id, tag_id: tag.id })
              .select();
            tagCount++;
          }
        }
      }
    }
  }

  return NextResponse.json({
    created,
    skipped,
    tagCount,
    total: dataRows.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

/**
 * Simple CSV parser that handles quoted fields and newlines within quotes.
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++; // Skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        current.push(field);
        field = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        current.push(field);
        field = "";
        if (current.some(f => f.trim())) {
          rows.push(current);
        }
        current = [];
        if (char === "\r") i++; // Skip \n after \r
      } else {
        field += char;
      }
    }
  }

  // Handle last field/row
  current.push(field);
  if (current.some(f => f.trim())) {
    rows.push(current);
  }

  return rows;
}
