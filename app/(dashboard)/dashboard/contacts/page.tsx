import { getWorkspace } from "@/lib/workspace";
import { ContactsView } from "./contacts-view";

export default async function ContactsPage() {
  const { workspace, supabase } = await getWorkspace();

  const [contactsRes, tagsRes] = await Promise.all([
    supabase
      .from("contacts")
      .select("*, contact_tags(tag_id, tags(*))")
      .eq("workspace_id", workspace.id)
      .order("last_interaction_at", { ascending: false, nullsFirst: false })
      .limit(100),
    supabase
      .from("tags")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("name"),
  ]);

  return (
    <ContactsView
      contacts={contactsRes.data ?? []}
      tags={tagsRes.data ?? []}
      workspaceId={workspace.id}
    />
  );
}
