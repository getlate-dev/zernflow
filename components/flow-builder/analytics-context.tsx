"use client";

import { createContext, useContext, useState, useCallback } from "react";

/** Per-node execution analytics returned by the API */
interface NodeAnalytics {
  executions: number;
  nodeType: string;
}

/** Full flow analytics response, including summary stats and per-node counts */
interface FlowAnalytics {
  summary: {
    starts: number;
    completions: number;
    dropOffRate: number;
    messagesSent: number;
    messagesFailed: number;
  };
  nodes: Record<string, NodeAnalytics>;
}

/** Shape of the analytics context consumed by child components */
interface AnalyticsContextValue {
  analytics: FlowAnalytics | null;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  fetchAnalytics: (flowId: string) => Promise<void>;
  loading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  analytics: null,
  showAnalytics: false,
  setShowAnalytics: () => {},
  fetchAnalytics: async () => {},
  loading: false,
});

/**
 * Hook to consume flow analytics data from the nearest FlowAnalyticsProvider.
 * Used by NodeAnalyticsBadge and the summary bar in the flow canvas.
 */
export function useFlowAnalytics() {
  return useContext(AnalyticsContext);
}

/**
 * Provider that manages flow analytics state: fetching from the API,
 * toggling visibility on/off, and exposing loading status.
 * Wrap the flow canvas content in this provider.
 */
export function FlowAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [analytics, setAnalytics] = useState<FlowAnalytics | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (flowId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/flows/${flowId}/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Failed to fetch flow analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        showAnalytics,
        setShowAnalytics,
        fetchAnalytics,
        loading,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
