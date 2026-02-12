"use client";

import { useCallback } from "react";
import { Plus, X, GripVertical, Image, Type, MousePointer, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickReply {
  title: string;
  payload: string;
}

interface Button {
  title: string;
  type: "postback" | "url";
  payload?: string;
  url?: string;
}

interface Message {
  text?: string;
  imageUrl?: string;
  quickReplies?: QuickReply[];
  buttons?: Button[];
}

interface SendMessagePanelData {
  messages?: Message[];
  [key: string]: unknown;
}

interface SendMessagePanelProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function VariableHint() {
  return (
    <p className="text-[11px] text-gray-400 dark:text-gray-500">
      Use {"{{variable}}"} for dynamic content
    </p>
  );
}

export function SendMessagePanel({ data: rawData, onChange }: SendMessagePanelProps) {
  const data = rawData as SendMessagePanelData;
  const messages = data.messages || [];

  const updateMessage = useCallback(
    (index: number, updated: Message) => {
      const msgs = [...messages];
      msgs[index] = updated;
      onChange({ ...data, messages: msgs });
    },
    [data, messages, onChange]
  );

  const addMessage = useCallback(() => {
    onChange({ ...data, messages: [...messages, { text: "" }] });
  }, [data, messages, onChange]);

  const removeMessage = useCallback(
    (index: number) => {
      onChange({ ...data, messages: messages.filter((_, i) => i !== index) });
    },
    [data, messages, onChange]
  );

  return (
    <div className="space-y-4">
      {messages.map((message, msgIndex) => (
        <MessageEditor
          key={msgIndex}
          index={msgIndex}
          message={message}
          onChange={(updated) => updateMessage(msgIndex, updated)}
          onRemove={() => removeMessage(msgIndex)}
          canRemove={messages.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={addMessage}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
      >
        <Plus className="h-4 w-4" />
        Add Message
      </button>

      {messages.length === 0 && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Add at least one message to send.
        </p>
      )}

      {/* Platform hints */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Platform notes</p>
        <ul className="mt-1.5 space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
          <li>Facebook/Instagram: Max 3 buttons per message</li>
          <li>Telegram: Buttons appear as inline keyboards</li>
          <li>Quick replies disappear after user responds</li>
        </ul>
      </div>
    </div>
  );
}

function MessageEditor({
  index,
  message,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  message: Message;
  onChange: (m: Message) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  // Quick replies
  const addQuickReply = useCallback(() => {
    const replies = message.quickReplies || [];
    onChange({ ...message, quickReplies: [...replies, { title: "", payload: "" }] });
  }, [message, onChange]);

  const updateQuickReply = useCallback(
    (i: number, updated: QuickReply) => {
      const replies = [...(message.quickReplies || [])];
      replies[i] = updated;
      onChange({ ...message, quickReplies: replies });
    },
    [message, onChange]
  );

  const removeQuickReply = useCallback(
    (i: number) => {
      const replies = (message.quickReplies || []).filter((_, idx) => idx !== i);
      onChange({ ...message, quickReplies: replies.length > 0 ? replies : undefined });
    },
    [message, onChange]
  );

  // Buttons
  const addButton = useCallback(() => {
    const buttons = message.buttons || [];
    onChange({ ...message, buttons: [...buttons, { title: "", type: "postback", payload: "" }] });
  }, [message, onChange]);

  const updateButton = useCallback(
    (i: number, updated: Button) => {
      const buttons = [...(message.buttons || [])];
      buttons[i] = updated;
      onChange({ ...message, buttons });
    },
    [message, onChange]
  );

  const removeButton = useCallback(
    (i: number) => {
      const buttons = (message.buttons || []).filter((_, idx) => idx !== i);
      onChange({ ...message, buttons: buttons.length > 0 ? buttons : undefined });
    },
    [message, onChange]
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Message header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <GripVertical className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Message {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-4 p-3">
        {/* Text */}
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Type className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Text</label>
          </div>
          <textarea
            value={message.text || ""}
            onChange={(e) => onChange({ ...message, text: e.target.value })}
            placeholder="Type your message... Use {{name}} for variables"
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
          <VariableHint />
        </div>

        {/* Image URL */}
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Image className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Image URL</label>
          </div>
          <input
            type="url"
            value={message.imageUrl || ""}
            onChange={(e) =>
              onChange({ ...message, imageUrl: e.target.value || undefined })
            }
            placeholder="https://example.com/image.png"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
        </div>

        {/* Quick Replies */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Quick Replies
              </label>
            </div>
            <button
              type="button"
              onClick={addQuickReply}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {(message.quickReplies || []).map((qr, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input
                type="text"
                value={qr.title}
                onChange={(e) => updateQuickReply(i, { ...qr, title: e.target.value })}
                placeholder="Label"
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
              <input
                type="text"
                value={qr.payload}
                onChange={(e) => updateQuickReply(i, { ...qr, payload: e.target.value })}
                placeholder="Payload"
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeQuickReply(i)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MousePointer className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Buttons
              </label>
            </div>
            <button
              type="button"
              onClick={addButton}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {(message.buttons || []).map((btn, i) => (
            <div
              key={i}
              className="mb-2 rounded-lg border border-gray-100 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  value={btn.title}
                  onChange={(e) => updateButton(i, { ...btn, title: e.target.value })}
                  placeholder="Button label"
                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeButton(i)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={btn.type}
                  onChange={(e) => {
                    const type = e.target.value as "postback" | "url";
                    updateButton(i, {
                      ...btn,
                      type,
                      payload: type === "postback" ? btn.payload || "" : undefined,
                      url: type === "url" ? btn.url || "" : undefined,
                    });
                  }}
                  className="rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                >
                  <option value="postback">Postback</option>
                  <option value="url">URL</option>
                </select>
                {btn.type === "postback" ? (
                  <input
                    type="text"
                    value={btn.payload || ""}
                    onChange={(e) => updateButton(i, { ...btn, payload: e.target.value })}
                    placeholder="Payload value"
                    className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                ) : (
                  <input
                    type="url"
                    value={btn.url || ""}
                    onChange={(e) => updateButton(i, { ...btn, url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
