"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Rocket, Loader2, History, Play, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database, FlowStatus, Json } from "@/lib/types/database";

import { NodePalette } from "./node-palette";
import { TriggerNode } from "./nodes/trigger-node";
import { SendMessageNode } from "./nodes/send-message-node";
import { ConditionNode } from "./nodes/condition-node";
import { DelayNode } from "./nodes/delay-node";
import { ActionNode } from "./nodes/action-node";
import { AiResponseNode } from "./nodes/AiResponseNode";
import { NodeConfigSidebar } from "./panels/NodeConfigSidebar";
import { VersionHistoryPanel } from "./panels/VersionHistoryPanel";
import { TestPanel } from "./panels/TestPanel";
import { FlowAnalyticsProvider, useFlowAnalytics } from "./analytics-context";

type Flow = Database["public"]["Tables"]["flows"]["Row"];

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  sendMessage: SendMessageNode,
  condition: ConditionNode,
  delay: DelayNode,
  action: ActionNode,
  aiResponse: AiResponseNode,
};

interface FlowCanvasProps {
  flow: Flow;
}

let nodeId = 0;
function getNodeId() {
  return `node_${Date.now()}_${nodeId++}`;
}

function getDefaultData(type: string, actionType?: string): Record<string, unknown> {
  switch (type) {
    case "trigger":
      return { triggerType: "keyword", keywords: [] };
    case "sendMessage":
      return { messages: [] };
    case "condition":
      return { conditions: [], logic: "and" };
    case "delay":
      return { duration: 5, unit: "minutes" };
    case "aiResponse":
      return { systemPrompt: "", model: "openai/gpt-4o-mini", temperature: 0.7, maxTokens: 500, contextMessages: 10 };
    case "action":
      return { actionType: actionType || "addTag" };
    default:
      return {};
  }
}

/**
 * Summary bar displayed at the top of the canvas when analytics are active.
 * Shows flow-level stats: starts, completions, drop-off rate, messages sent/failed.
 */
function AnalyticsSummaryBar() {
  const { analytics, showAnalytics, loading } = useFlowAnalytics();

  if (!showAnalytics) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center border-b border-border bg-blue-50 dark:bg-blue-950/30 px-4 py-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
        <span className="ml-2 text-xs text-blue-600">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) return null;

  const { summary } = analytics;

  return (
    <div className="flex items-center gap-6 border-b border-border bg-blue-50 dark:bg-blue-950/30 px-4 py-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Starts</span>
        <span className="text-sm font-semibold text-foreground">{summary.starts.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Completions</span>
        <span className="text-sm font-semibold text-foreground">{summary.completions.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Drop-off</span>
        <span className="text-sm font-semibold text-red-600">{summary.dropOffRate}%</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Sent</span>
        <span className="text-sm font-semibold text-emerald-600">{summary.messagesSent.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Failed</span>
        <span className="text-sm font-semibold text-red-600">{summary.messagesFailed.toLocaleString()}</span>
      </div>
    </div>
  );
}

function FlowCanvasInner({ flow }: FlowCanvasProps) {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const supabase = createClient();

  const initialNodes: Node[] = Array.isArray(flow.nodes)
    ? (flow.nodes as unknown as Node[])
    : [];
  const initialEdges: Edge[] = Array.isArray(flow.edges)
    ? (flow.edges as unknown as Edge[])
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState(flow.name);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [versionPanelOpen, setVersionPanelOpen] = useState(false);
  const [testPanelOpen, setTestPanelOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Analytics toggle and data fetching from the context provider
  const { showAnalytics, setShowAnalytics, fetchAnalytics, loading: analyticsLoading } = useFlowAnalytics();

  /** Toggle analytics overlay on/off. Fetches data on first enable. */
  const handleToggleAnalytics = useCallback(() => {
    const next = !showAnalytics;
    setShowAnalytics(next);
    if (next) {
      fetchAnalytics(flow.id);
    }
  }, [showAnalytics, setShowAnalytics, fetchAnalytics, flow.id]);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "var(--border)", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const { type, nodeType, actionType } = JSON.parse(raw) as {
        type: string;
        nodeType: string;
        actionType?: string;
      };

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: getDefaultData(type, actionType || nodeType),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onNodeDataChange = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: newData } : n
        )
      );
    },
    [setNodes]
  );

  const closeSidebar = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  const saveFlow = useCallback(
    async (status?: FlowStatus) => {
      if (status === "published") {
        setPublishing(true);
      } else {
        setSaving(true);
      }

      try {
        const update: Database["public"]["Tables"]["flows"]["Update"] = {
          name: flowName,
          nodes: nodes as unknown as Json,
          edges: edges as unknown as Json,
          updated_at: new Date().toISOString(),
        };

        if (status) {
          update.status = status;
          if (status === "published") {
            update.published_at = new Date().toISOString();
          }
        }

        const { error } = await supabase
          .from("flows")
          .update(update)
          .eq("id", flow.id);

        if (error) {
          console.error("Failed to save flow:", error);
          setSaveError("Failed to save");
          setTimeout(() => setSaveError(null), 3000);
          return;
        }

        setSaveError(null);
        setLastSaved(new Date());
      } finally {
        setSaving(false);
        setPublishing(false);
      }
    },
    [flowName, nodes, edges, flow.id, supabase]
  );

  const handleSave = useCallback(() => saveFlow(), [saveFlow]);
  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      // First save the current state
      await saveFlow();
      // Then call the publish API which increments version and saves snapshot
      const res = await fetch(`/api/v1/flows/${flow.id}/publish`, {
        method: "POST",
      });
      if (!res.ok) {
        console.error("Failed to publish flow");
        setSaveError("Failed to publish");
        setTimeout(() => setSaveError(null), 3000);
        return;
      }
      setSaveError(null);
      setLastSaved(new Date());
      router.refresh();
    } finally {
      setPublishing(false);
    }
  }, [saveFlow, flow.id]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/flows")}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-5 w-px bg-border" />
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-auto max-w-[200px] border-none bg-transparent text-sm font-semibold outline-none focus:ring-0"
            style={{ width: `${Math.max(flowName.length, 8)}ch` }}
            placeholder="Flow name"
          />
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
              flow.status === "published"
                ? "bg-emerald-100 text-emerald-800"
                : flow.status === "archived"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {flow.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-xs font-medium text-destructive">
              {saveError}
            </span>
          )}
          {!saveError && lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleToggleAnalytics}
            disabled={analyticsLoading}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              showAnalytics
                ? "border-blue-500 bg-blue-500/10 text-blue-600"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {analyticsLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <BarChart3 className="h-3.5 w-3.5" />
            )}
            Analytics
          </button>
          <button
            onClick={() => {
              setTestPanelOpen(!testPanelOpen);
              if (!testPanelOpen) {
                setVersionPanelOpen(false);
                setSelectedNodeId(null);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              testPanelOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            <Play className="h-3.5 w-3.5" />
            Test
          </button>
          <button
            onClick={() => {
              setVersionPanelOpen(!versionPanelOpen);
              if (!versionPanelOpen) {
                setTestPanelOpen(false);
                setSelectedNodeId(null);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              versionPanelOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            <History className="h-3.5 w-3.5" />
            History
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {publishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Rocket className="h-3.5 w-3.5" />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Analytics summary bar (visible when analytics toggle is on) */}
      <AnalyticsSummaryBar />

      {/* Canvas area */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={["Backspace", "Delete"]}
            proOptions={{ hideAttribution: true }}
            className="bg-background"
          >
            <Background gap={16} size={1} className="!bg-background" />
            <Controls
              className="!border-border !bg-card !shadow-sm [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-foreground [&>button:hover]:!bg-accent"
            />
            <MiniMap
              className="!border-border !bg-card"
              nodeColor={() => "var(--primary)"}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
        {selectedNode && !versionPanelOpen && !testPanelOpen && (
          <NodeConfigSidebar
            node={selectedNode}
            onChange={onNodeDataChange}
            onClose={closeSidebar}
            onDelete={deleteNode}
          />
        )}
        {versionPanelOpen && (
          <VersionHistoryPanel
            flowId={flow.id}
            currentVersion={flow.version}
            onClose={() => setVersionPanelOpen(false)}
            onRestore={() => router.refresh()}
          />
        )}
        {testPanelOpen && (
          <TestPanel
            nodes={nodes}
            edges={edges}
            onClose={() => setTestPanelOpen(false)}
            onHighlightNode={(nodeId) => {
              // Scroll to and highlight the node
              const node = nodes.find((n) => n.id === nodeId);
              if (node) setSelectedNodeId(nodeId);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function FlowCanvas({ flow }: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowAnalyticsProvider>
        <FlowCanvasInner flow={flow} />
      </FlowAnalyticsProvider>
    </ReactFlowProvider>
  );
}
