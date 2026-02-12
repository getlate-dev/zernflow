"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SendMessageNodeProps {
  label?: string;
  messages?: Array<{
    text?: string;
    imageUrl?: string;
    quickReplies?: Array<{ title: string; payload: string }>;
    buttons?: Array<{ title: string; type: string; payload?: string; url?: string }>;
  }>;
}

export function SendMessageNode({ data, selected }: NodeProps) {
  const nodeData = data as SendMessageNodeProps;
  const label = nodeData.label || "Send Message";
  const firstMessage = nodeData.messages?.[0];
  const messageCount = nodeData.messages?.length || 0;
  const buttonCount =
    nodeData.messages?.reduce(
      (acc, m) => acc + (m.buttons?.length || 0) + (m.quickReplies?.length || 0),
      0
    ) || 0;

  return (
    <div
      className={cn(
        "w-56 rounded-lg border bg-card shadow-sm transition-shadow",
        selected ? "border-blue-500 shadow-md" : "border-border"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-blue-500 !bg-white dark:!bg-gray-800"
      />
      <div className="flex items-center gap-2 rounded-t-lg bg-blue-500 px-3 py-2 text-white dark:bg-blue-600">
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold">Send Message</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium">{label}</p>
        {firstMessage?.text && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {firstMessage.text}
          </p>
        )}
        {!firstMessage?.text && firstMessage?.imageUrl && (
          <p className="mt-1 text-xs text-muted-foreground">Image message</p>
        )}
        {!firstMessage && (
          <p className="mt-1 text-xs text-muted-foreground italic">No message configured</p>
        )}
        <div className="mt-2 flex gap-2">
          {messageCount > 1 && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {messageCount} messages
            </span>
          )}
          {buttonCount > 0 && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {buttonCount} {buttonCount === 1 ? "button" : "buttons"}
            </span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-blue-500 !bg-white dark:!bg-gray-800"
      />
    </div>
  );
}
