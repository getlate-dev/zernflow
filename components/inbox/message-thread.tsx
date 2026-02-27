"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send, Paperclip, Bot, User, MessageSquare, CheckCircle, Clock, RotateCcw, Loader2, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/platform-icon";
import type { Database, ConversationStatus } from "@/lib/types/database";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Conversation = Database["public"]["Tables"]["conversations"]["Row"] & {
  contacts: Database["public"]["Tables"]["contacts"]["Row"] | null;
};

/** Represents a saved reply (canned response) fetched from the API */
type SavedReply = {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  shortcut: string | null;
  created_by: string;
  created_at: string;
};

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function shouldShowDateSeparator(
  current: Message,
  previous: Message | undefined
): boolean {
  if (!previous) return true;
  const currentDate = new Date(current.created_at).toDateString();
  const previousDate = new Date(previous.created_at).toDateString();
  return currentDate !== previousDate;
}

function MessageBubble({ message }: { message: Message }) {
  const isInbound = message.direction === "inbound";
  const isBot = message.sent_by_flow_id !== null;

  return (
    <div
      className={cn(
        "flex gap-2",
        isInbound ? "justify-start" : "justify-end"
      )}
    >
      {isInbound && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}

      <div className="max-w-[70%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm",
            isInbound
              ? "rounded-tl-md bg-muted text-foreground"
              : "rounded-tr-md bg-primary text-primary-foreground"
          )}
        >
          {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
          {message.attachments && (
            <div className="mt-1">
              <Paperclip className="inline h-3 w-3" />
              <span className="ml-1 text-xs opacity-70">Attachment</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground",
            isInbound ? "justify-start" : "justify-end"
          )}
        >
          {isBot && (
            <Bot className="h-3 w-3" />
          )}
          <span>{formatMessageTime(message.created_at)}</span>
          {!isInbound && message.status !== "sent" && (
            <span className="capitalize">
              {message.status === "delivered"
                ? "Delivered"
                : message.status === "failed"
                ? "Failed"
                : ""}
            </span>
          )}
        </div>
      </div>

      {!isInbound && !isBot && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      {!isInbound && isBot && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
    </div>
  );
}

export function MessageThread({
  conversation,
  messages: initialMessages,
}: {
  conversation: Conversation | null;
  messages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Saved replies (canned responses) state
  const [showReplies, setShowReplies] = useState(false);
  const [savedReplies, setSavedReplies] = useState<SavedReply[]>([]);
  // Tracks the slash-command filter text (e.g. typing "/greet" filters by shortcut)
  const [slashFilter, setSlashFilter] = useState<string | null>(null);
  const repliesDropdownRef = useRef<HTMLDivElement>(null);

  const updateConversationStatus = useCallback(async (status: ConversationStatus) => {
    if (!conversation || statusUpdating) return;
    setStatusUpdating(status);
    try {
      const { error } = await createClient()
        .from("conversations")
        .update({ status })
        .eq("id", conversation.id);
      if (error) throw error;
      router.refresh();
    } catch {
      alert(`Failed to update conversation status`);
    } finally {
      setStatusUpdating(null);
    }
  }, [conversation, statusUpdating, router]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, []);

  // Fetch saved replies on mount so they're ready when the user clicks the picker
  useEffect(() => {
    async function fetchReplies() {
      try {
        const res = await fetch("/api/v1/saved-replies");
        if (res.ok) {
          const json = await res.json();
          setSavedReplies(json.data || []);
        }
      } catch {
        // Silently fail; saved replies are non-critical UI convenience
      }
    }
    fetchReplies();
  }, []);

  // Close the saved replies dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        repliesDropdownRef.current &&
        !repliesDropdownRef.current.contains(e.target as Node)
      ) {
        setShowReplies(false);
        setSlashFilter(null);
      }
    }
    if (showReplies) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReplies]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to new messages via Realtime
  useEffect(() => {
    if (!conversation) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // If this message already exists (from API response), skip
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            // If there's an optimistic message with matching text, replace it
            const optimisticIdx = prev.findIndex(
              (m) =>
                m.id.startsWith("optimistic-") &&
                m.text === newMessage.text &&
                m.direction === newMessage.direction
            );
            if (optimisticIdx !== -1) {
              const updated = [...prev];
              updated[optimisticIdx] = newMessage;
              return updated;
            }
            return [...prev, newMessage];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  /**
   * Inserts a saved reply's content into the textarea.
   * If the user was typing a slash command (e.g. "/greet"), the slash command
   * text is replaced with the reply content. Otherwise, the content is simply
   * set as the textarea value.
   */
  function insertSavedReply(reply: SavedReply) {
    if (slashFilter !== null) {
      // Replace the slash command text with the reply content
      setInput(reply.content);
    } else {
      // Append or set the reply content
      setInput((prev) => (prev ? prev + reply.content : reply.content));
    }
    setShowReplies(false);
    setSlashFilter(null);
    // Focus the textarea so the user can continue typing or send
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  /**
   * Computes the list of saved replies to display, filtered by slash command
   * shortcut when the user is typing a "/" prefix.
   */
  function getFilteredReplies(): SavedReply[] {
    if (slashFilter === null || slashFilter === "") return savedReplies;
    const query = slashFilter.toLowerCase();
    return savedReplies.filter(
      (r) =>
        r.shortcut?.toLowerCase().startsWith(query) ||
        r.title.toLowerCase().includes(query)
    );
  }

  async function handleSend() {
    if (!input.trim() || !conversation || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    // Optimistic update: add a temporary message immediately
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      conversation_id: conversation.id,
      direction: "outbound",
      text,
      attachments: null,
      quick_reply_payload: null,
      postback_payload: null,
      callback_data: null,
      platform_message_id: null,
      sent_by_flow_id: null,
      sent_by_node_id: null,
      sent_by_user_id: null,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conversation.id, text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Send failed (${res.status})`);
      }

      const confirmedMessage: Message = await res.json();

      // Replace optimistic message with confirmed one
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? confirmedMessage : m))
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      // Mark optimistic message as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, status: "failed" as const } : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
        <h3 className="mt-4 text-sm font-medium text-muted-foreground">
          Select a conversation
        </h3>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Choose a conversation from the list to view messages
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {conversation.contacts?.avatar_url ? (
              <img
                src={conversation.contacts.avatar_url}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {conversation.contacts?.display_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-background">
              <PlatformIcon
                platform={conversation.platform}
                className="h-2.5 w-2.5"
                size={10}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">
              {conversation.contacts?.display_name ?? "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
              conversation.status === "open"
                ? "bg-green-100 text-green-700"
                : conversation.status === "snoozed"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-muted text-muted-foreground"
            )}
          >
            {conversation.status}
          </span>
          {conversation.is_automation_paused && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
              Bot paused
            </span>
          )}
          <div className="flex items-center gap-1">
            {conversation.status !== "closed" && (
              <button
                onClick={() => updateConversationStatus("closed")}
                disabled={!!statusUpdating}
                title="Close conversation"
                aria-label="Close conversation"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
              >
                {statusUpdating === "closed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
              </button>
            )}
            {conversation.status !== "snoozed" && (
              <button
                onClick={() => updateConversationStatus("snoozed")}
                disabled={!!statusUpdating}
                title="Snooze conversation"
                aria-label="Snooze conversation"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
              >
                {statusUpdating === "snoozed" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
              </button>
            )}
            {conversation.status !== "open" && (
              <button
                onClick={() => updateConversationStatus("open")}
                disabled={!!statusUpdating}
                title="Reopen conversation"
                aria-label="Reopen conversation"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
              >
                {statusUpdating === "open" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message, i) => (
            <div key={message.id}>
              {shouldShowDateSeparator(message, messages[i - 1]) && (
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] text-muted-foreground">
                    {formatDateSeparator(message.created_at)}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              <MessageBubble message={message} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border p-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                autoResize();

                // Detect slash command: if the input starts with "/" and has no spaces yet,
                // show the saved replies dropdown filtered by the text after the slash
                if (value.startsWith("/") && !value.includes(" ")) {
                  const filter = value.slice(1); // strip the leading "/"
                  setSlashFilter(filter);
                  setShowReplies(true);
                } else if (slashFilter !== null) {
                  // User moved past the slash command (e.g. typed a space), close the dropdown
                  setSlashFilter(null);
                  setShowReplies(false);
                }
              }}
              onKeyDown={(e) => {
                // Close dropdown on Escape
                if (e.key === "Escape" && showReplies) {
                  e.preventDefault();
                  setShowReplies(false);
                  setSlashFilter(null);
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // If the slash dropdown is open and there's exactly one match, insert it
                  if (showReplies) {
                    const filtered = getFilteredReplies();
                    if (filtered.length === 1) {
                      insertSavedReply(filtered[0]);
                      return;
                    }
                  }
                  handleSend();
                }
              }}
              placeholder="Type a message... (/ for saved replies)"
              rows={1}
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ maxHeight: 150 }}
            />

            {/* Saved replies dropdown, positioned above the textarea */}
            {showReplies && (
              <div
                ref={repliesDropdownRef}
                className="absolute bottom-full left-0 z-50 mb-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
              >
                {getFilteredReplies().length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No saved replies found
                  </div>
                ) : (
                  getFilteredReplies().map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => insertSavedReply(reply)}
                      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-sm font-medium">{reply.title}</span>
                        {reply.shortcut && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            /{reply.shortcut}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {reply.content}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Saved replies picker button */}
          <button
            onClick={() => {
              setShowReplies((prev) => !prev);
              if (showReplies) setSlashFilter(null);
            }}
            aria-label="Saved replies"
            title="Saved replies"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              showReplies
                ? "bg-accent text-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              input.trim() && !sending
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
