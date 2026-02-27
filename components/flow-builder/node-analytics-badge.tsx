"use client";

import { useFlowAnalytics } from "./analytics-context";

/**
 * Small badge that overlays on a flow builder node showing its execution count.
 * Positioned absolutely in the top-right corner of the node.
 * Only renders when analytics are toggled on and data exists for this node.
 *
 * @param nodeId - The React Flow node ID to look up in analytics data
 */
export function NodeAnalyticsBadge({ nodeId }: { nodeId: string }) {
  const { analytics, showAnalytics } = useFlowAnalytics();

  // Don't render if analytics are hidden or no data for this node
  if (!showAnalytics || !analytics?.nodes[nodeId]) return null;

  const { executions } = analytics.nodes[nodeId];

  return (
    <div className="absolute -top-3 -right-3 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
      {executions > 999 ? `${(executions / 1000).toFixed(1)}k` : executions}
    </div>
  );
}
