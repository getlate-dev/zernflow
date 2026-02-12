"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DelayNodeProps {
  label?: string;
  duration?: number;
  unit?: "seconds" | "minutes" | "hours" | "days";
}

export function DelayNode({ data, selected }: NodeProps) {
  const nodeData = data as DelayNodeProps;
  const label = nodeData.label || "Delay";
  const duration = nodeData.duration || 0;
  const unit = nodeData.unit || "minutes";

  const displayDuration =
    duration > 0 ? `${duration} ${unit}` : "Not configured";

  return (
    <div
      className={cn(
        "w-56 rounded-lg border bg-card shadow-sm transition-shadow",
        selected ? "border-purple-500 shadow-md" : "border-border"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-purple-500 !bg-white dark:!bg-gray-800"
      />
      <div className="flex items-center gap-2 rounded-t-lg bg-purple-500 px-3 py-2 text-white dark:bg-purple-600">
        <Clock className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold">Delay</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium">{label}</p>
        <p
          className={cn(
            "mt-1 text-xs",
            duration > 0 ? "text-muted-foreground" : "text-muted-foreground italic"
          )}
        >
          {displayDuration}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-purple-500 !bg-white dark:!bg-gray-800"
      />
    </div>
  );
}
