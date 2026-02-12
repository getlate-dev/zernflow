"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SegmentBuilder,
  createEmptyFilter,
  type SegmentFilter,
} from "@/components/segment-builder";
import type { Database, Platform } from "@/lib/types/database";

type Tag = Database["public"]["Tables"]["tags"]["Row"];
type ContactWithTags = Database["public"]["Tables"]["contacts"]["Row"] & {
  contact_tags: {
    tag_id: string;
    tags: Tag | null;
  }[];
};

const platformLabels: Record<Platform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  telegram: "Telegram",
  bluesky: "Bluesky",
  reddit: "Reddit",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ContactsView({
  contacts,
  tags,
  workspaceId,
}: {
  contacts: ContactWithTags[];
  tags: Tag[];
  workspaceId: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>(
    createEmptyFilter()
  );

  const filtered = contacts.filter((contact) => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const name = contact.display_name?.toLowerCase() ?? "";
      const email = contact.email?.toLowerCase() ?? "";
      if (!name.includes(q) && !email.includes(q)) return false;
    }
    // Tag filter
    if (selectedTagId) {
      const hasTag = contact.contact_tags.some(
        (ct) => ct.tag_id === selectedTagId
      );
      if (!hasTag) return false;
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {contacts.length} contact{contacts.length !== 1 ? "s" : ""} in your workspace
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setShowSegmentBuilder(!showSegmentBuilder)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              showSegmentBuilder
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
            Segment
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                showSegmentBuilder && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Segment builder */}
        {showSegmentBuilder && (
          <div className="mt-4">
            <SegmentBuilder
              value={segmentFilter}
              onChange={setSegmentFilter}
              workspaceId={workspaceId}
            />
          </div>
        )}

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTagId(null)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                selectedTagId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setSelectedTagId(tag.id === selectedTagId ? null : tag.id)
                }
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  selectedTagId === tag.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
                style={
                  tag.color && selectedTagId !== tag.id
                    ? {
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }
                    : undefined
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No contacts found
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Contacts are created automatically when someone messages your channels
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-8 py-3 text-xs font-medium uppercase text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                  Last Interaction
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                  Tags
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => {
                const contactTags = contact.contact_tags
                  .map((ct) => ct.tags)
                  .filter(Boolean) as Tag[];

                return (
                  <tr
                    key={contact.id}
                    className="border-b border-border transition-colors hover:bg-accent/50"
                  >
                    <td className="px-8 py-3">
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {contact.avatar_url ? (
                            <img
                              src={contact.avatar_url}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            contact.display_name?.[0]?.toUpperCase() ?? "?"
                          )}
                        </div>
                        <span className="text-sm font-medium hover:underline">
                          {contact.display_name ?? "Unknown"}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {contact.email ? (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          No email
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(contact.last_interaction_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {contactTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contactTags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex rounded-full border border-border px-2 py-0.5 text-[10px] font-medium"
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
                          {contactTags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{contactTags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          No tags
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contact.is_subscribed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <XCircle className="h-3.5 w-3.5" />
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
