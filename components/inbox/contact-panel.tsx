"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Mail,
  Calendar,
  Tag,
  User,
  Hash,
  StickyNote,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/platform-icon";
import type { Database, Platform } from "@/lib/types/database";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type TagRow = Database["public"]["Tables"]["tags"]["Row"];
type CustomFieldDef =
  Database["public"]["Tables"]["custom_field_definitions"]["Row"];
type CustomFieldValue =
  Database["public"]["Tables"]["contact_custom_fields"]["Row"];
type ConversationNote =
  Database["public"]["Tables"]["conversation_notes"]["Row"];

interface ContactDetails {
  contact: Contact;
  tags: TagRow[];
  customFields: { definition: CustomFieldDef; value: string }[];
  channels: {
    platform: Platform;
    platform_username: string | null;
  }[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ContactPanel({
  contactId,
  conversationId,
  workspaceId,
  onClose,
}: {
  contactId: string | null;
  conversationId: string | null;
  workspaceId: string;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Internal notes state ---
  const [notes, setNotes] = useState<ConversationNote[]>([]);
  const [notesOpen, setNotesOpen] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  /** Fetch notes for the current conversation */
  const fetchNotes = useCallback(async () => {
    if (!conversationId) {
      setNotes([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/v1/conversations/${conversationId}/notes`
      );
      if (res.ok) {
        const json = await res.json();
        setNotes(json.data ?? []);
      }
    } catch {
      // Silently fail; notes are non-critical
    }
  }, [conversationId]);

  // Re-fetch notes when conversation changes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /** Add a new note */
  async function handleAddNote() {
    if (!conversationId || !noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(
        `/api/v1/conversations/${conversationId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: noteText.trim() }),
        }
      );
      if (res.ok) {
        setNoteText("");
        await fetchNotes();
      }
    } catch {
      // Silently fail
    } finally {
      setAddingNote(false);
    }
  }

  /** Delete a note by ID */
  async function handleDeleteNote(noteId: string) {
    if (!conversationId) return;
    setDeletingNoteId(noteId);
    try {
      const res = await fetch(
        `/api/v1/conversations/${conversationId}/notes/${noteId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch {
      // Silently fail
    } finally {
      setDeletingNoteId(null);
    }
  }

  useEffect(() => {
    if (!contactId) {
      setDetails(null);
      return;
    }

    async function loadContact() {
      setLoading(true);
      const supabase = createClient();

      const [contactRes, tagsRes, fieldsRes, channelsRes] = await Promise.all([
        supabase.from("contacts").select("*").eq("id", contactId!).single(),
        supabase
          .from("contact_tags")
          .select("tag_id, tags(*)")
          .eq("contact_id", contactId!),
        supabase
          .from("contact_custom_fields")
          .select("*, custom_field_definitions(*)")
          .eq("contact_id", contactId!),
        supabase
          .from("contact_channels")
          .select("platform_username, channels(platform)")
          .eq("contact_id", contactId!),
      ]);

      if (contactRes.data) {
        const tags = (tagsRes.data ?? [])
          .map((ct) => ct.tags)
          .filter(Boolean) as TagRow[];

        const customFields = (fieldsRes.data ?? [])
          .map((cf) => ({
            definition: cf.custom_field_definitions as unknown as CustomFieldDef,
            value: cf.value,
          }))
          .filter((cf) => cf.definition);

        const channels = (channelsRes.data ?? []).map((cc) => ({
          platform: (cc.channels as unknown as { platform: Platform }).platform,
          platform_username: cc.platform_username,
        }));

        setDetails({
          contact: contactRes.data,
          tags,
          customFields,
          channels,
        });
      }

      setLoading(false);
    }

    loadContact();
  }, [contactId, workspaceId]);

  if (!contactId) return null;

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <h3 className="text-sm font-semibold">Contact Info</h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      ) : details ? (
        <div className="flex-1 overflow-y-auto">
          {/* Profile section */}
          <div className="flex flex-col items-center border-b border-border p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
              {details.contact.avatar_url ? (
                <img
                  src={details.contact.avatar_url}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                details.contact.display_name?.[0]?.toUpperCase() ?? "?"
              )}
            </div>
            <p className="mt-3 text-sm font-semibold">
              {details.contact.display_name ?? "Unknown"}
            </p>
            {details.contact.email && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {details.contact.email}
              </p>
            )}
            <span
              className={cn(
                "mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                details.contact.is_subscribed
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {details.contact.is_subscribed ? "Subscribed" : "Unsubscribed"}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4 p-4">
            {/* Connected platforms */}
            {details.channels.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase text-muted-foreground">
                  Platforms
                </h4>
                <div className="mt-2 space-y-1.5">
                  {details.channels.map((ch, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm"
                    >
                      <PlatformIcon
                        platform={ch.platform}
                        className="h-3.5 w-3.5"
                        size={14}
                      />
                      <span className="capitalize text-muted-foreground">
                        {ch.platform}
                      </span>
                      {ch.platform_username && (
                        <span className="truncate text-foreground">
                          @{ch.platform_username}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            {details.contact.email && (
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Email
                </h4>
                <p className="mt-1 text-sm">{details.contact.email}</p>
              </div>
            )}

            {/* Last interaction */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Last Interaction
              </h4>
              <p className="mt-1 text-sm">
                {formatDate(details.contact.last_interaction_at)}
              </p>
            </div>

            {/* Joined */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <User className="h-3 w-3" />
                Created
              </h4>
              <p className="mt-1 text-sm">
                {formatDate(details.contact.created_at)}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Tag className="h-3 w-3" />
                Tags
              </h4>
              {details.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {details.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs"
                      style={
                        tag.color
                          ? {
                              backgroundColor: `${tag.color}20`,
                              borderColor: `${tag.color}40`,
                              color: tag.color,
                            }
                          : undefined
                      }
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">No tags</p>
              )}
            </div>

            {/* Custom fields */}
            {details.customFields.length > 0 && (
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  Custom Fields
                </h4>
                <div className="mt-2 space-y-2">
                  {details.customFields.map((cf) => (
                    <div key={cf.definition.id}>
                      <p className="text-xs text-muted-foreground">
                        {cf.definition.name}
                      </p>
                      <p className="text-sm">{cf.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          {conversationId && (
            <div className="border-t border-border">
              {/* Collapsible header */}
              <button
                onClick={() => setNotesOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium uppercase text-muted-foreground hover:bg-accent/50 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <StickyNote className="h-3 w-3" />
                  Internal Notes
                  {notes.length > 0 && (
                    <span className="ml-1 rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      {notes.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    notesOpen && "rotate-180"
                  )}
                />
              </button>

              {notesOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Existing notes */}
                  {notes.length > 0 ? (
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="group relative rounded-md border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800/50 dark:bg-amber-950/30"
                        >
                          <p className="whitespace-pre-wrap text-xs text-amber-900 dark:text-amber-200">
                            {note.content}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] text-amber-600/70 dark:text-amber-400/60">
                              {new Date(note.created_at).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={deletingNoteId === note.id}
                              className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-amber-500 hover:bg-amber-200/60 hover:text-amber-700 dark:hover:bg-amber-800/40 dark:hover:text-amber-300 transition-opacity"
                              aria-label="Delete note"
                            >
                              {deletingNoteId === note.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No notes yet</p>
                  )}

                  {/* Add note form */}
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add an internal note..."
                      rows={2}
                      className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:focus:border-amber-600 dark:focus:ring-amber-600"
                      onKeyDown={(e) => {
                        // Cmd/Ctrl+Enter to submit
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleAddNote();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={addingNote || !noteText.trim()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60 transition-colors"
                    >
                      {addingNote ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <StickyNote className="h-3 w-3" />
                      )}
                      {addingNote ? "Adding..." : "Add note"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Contact not found
        </div>
      )}
    </div>
  );
}
