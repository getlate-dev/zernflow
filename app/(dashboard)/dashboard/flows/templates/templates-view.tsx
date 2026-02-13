"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  MessageSquare,
  HelpCircle,
  UserPlus,
  GitBranch,
  Loader2,
  BookmarkPlus,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Template types ---

interface TemplateNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface TemplateEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  nodes: TemplateNode[];
  edges: TemplateEdge[];
}

// --- Built-in templates ---

const templates: FlowTemplate[] = [
  {
    id: "welcome-flow",
    name: "Welcome Flow",
    description:
      "Greet new users with a welcome message, wait a minute, then send a follow-up to keep them engaged.",
    category: "Onboarding",
    icon: MessageSquare,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 0 },
        data: {
          label: "Welcome Trigger",
          triggerType: "welcome",
          config: {},
        },
      },
      {
        id: "msg-1",
        type: "sendMessage",
        position: { x: 250, y: 150 },
        data: {
          label: "Greeting",
          text: "Hey there! Welcome! We're glad to have you here. How can we help you today?",
        },
      },
      {
        id: "delay-1",
        type: "delay",
        position: { x: 250, y: 300 },
        data: {
          label: "Wait 1 minute",
          duration: 60,
          unit: "seconds",
        },
      },
      {
        id: "msg-2",
        type: "sendMessage",
        position: { x: 250, y: 450 },
        data: {
          label: "Follow-up",
          text: "By the way, feel free to ask me anything. I'm here to help!",
        },
      },
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "msg-1" },
      { id: "e2", source: "msg-1", target: "delay-1" },
      { id: "e3", source: "delay-1", target: "msg-2" },
    ],
  },
  {
    id: "faq-bot",
    name: "FAQ Bot",
    description:
      'Respond to "help" or "faq" keywords by checking the message and routing to different answer branches.',
    category: "Support",
    icon: HelpCircle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 0 },
        data: {
          label: "FAQ Trigger",
          triggerType: "keyword",
          config: { keywords: ["help", "faq"] },
        },
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 150 },
        data: {
          label: "Check keyword",
          conditions: [
            {
              id: "c1",
              field: "trigger_keyword",
              operator: "equals",
              value: "help",
            },
          ],
        },
      },
      {
        id: "msg-help",
        type: "sendMessage",
        position: { x: 50, y: 350 },
        data: {
          label: "Help response",
          text: "Here are some things I can help you with:\n- Pricing info\n- Account setup\n- Technical support\n\nJust type your question and I'll do my best!",
        },
      },
      {
        id: "msg-faq",
        type: "sendMessage",
        position: { x: 450, y: 350 },
        data: {
          label: "FAQ response",
          text: "Here are our most frequently asked questions:\n\n1. How do I get started?\n2. What plans are available?\n3. How do I contact support?\n\nReply with a number for more details!",
        },
      },
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "condition-1" },
      {
        id: "e2",
        source: "condition-1",
        target: "msg-help",
        sourceHandle: "true",
      },
      {
        id: "e3",
        source: "condition-1",
        target: "msg-faq",
        sourceHandle: "false",
      },
    ],
  },
  {
    id: "lead-capture",
    name: "Lead Capture",
    description:
      "Collect lead information step by step: ask for name, wait for response, save it, then ask for email and tag the contact.",
    category: "Marketing",
    icon: UserPlus,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 250, y: 0 },
        data: {
          label: "Lead Trigger",
          triggerType: "keyword",
          config: { keywords: ["interested", "info", "pricing"] },
        },
      },
      {
        id: "msg-name",
        type: "sendMessage",
        position: { x: 250, y: 120 },
        data: {
          label: "Ask name",
          text: "Great, I'd love to help! What's your name?",
        },
      },
      {
        id: "wait-name",
        type: "smartDelay",
        position: { x: 250, y: 240 },
        data: {
          label: "Wait for name",
          waitForInput: true,
          timeout: 300,
        },
      },
      {
        id: "set-name",
        type: "setCustomField",
        position: { x: 250, y: 360 },
        data: {
          label: "Save name",
          fieldSlug: "name",
          value: "{{last_message}}",
        },
      },
      {
        id: "msg-email",
        type: "sendMessage",
        position: { x: 250, y: 480 },
        data: {
          label: "Ask email",
          text: "Thanks, {{name}}! What's your email address so we can send you more details?",
        },
      },
      {
        id: "wait-email",
        type: "smartDelay",
        position: { x: 250, y: 600 },
        data: {
          label: "Wait for email",
          waitForInput: true,
          timeout: 300,
        },
      },
      {
        id: "set-email",
        type: "setCustomField",
        position: { x: 250, y: 720 },
        data: {
          label: "Save email",
          fieldSlug: "email",
          value: "{{last_message}}",
        },
      },
      {
        id: "tag-lead",
        type: "addTag",
        position: { x: 250, y: 840 },
        data: {
          label: 'Add "lead" tag',
          tagName: "lead",
        },
      },
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "msg-name" },
      { id: "e2", source: "msg-name", target: "wait-name" },
      { id: "e3", source: "wait-name", target: "set-name" },
      { id: "e4", source: "set-name", target: "msg-email" },
      { id: "e5", source: "msg-email", target: "wait-email" },
      { id: "e6", source: "wait-email", target: "set-email" },
      { id: "e7", source: "set-email", target: "tag-lead" },
    ],
  },
];

// --- Component ---

export function TemplatesView({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [creating, setCreating] = useState<string | null>(null);
  const pendingRef = useRef(false);

  async function handleUseTemplate(template: FlowTemplate) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setCreating(template.id);

    try {
      const res = await fetch("/api/v1/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          nodes: template.nodes,
          edges: template.edges,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create flow");
      }

      const flow = await res.json();
      router.push(`/dashboard/flows/${flow.id}`);
    } catch (err) {
      console.error("Failed to create flow from template:", err);
      pendingRef.current = false;
      setCreating(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/dashboard/flows"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Flows
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Flow Templates</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with a pre-built flow and customize it to your needs
            </p>
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60"
            title="Coming soon"
          >
            <BookmarkPlus className="h-4 w-4" />
            Save Current Flow as Template
          </button>
        </div>
      </div>

      {/* Template gallery */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const isCreating = creating === template.id;
            const Icon = template.icon;
            const nodeCount = template.nodes.length;

            return (
              <div
                key={template.id}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                {/* Icon + category */}
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      template.iconBg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", template.iconColor)} />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {template.category}
                  </span>
                </div>

                {/* Name + description */}
                <h3 className="mt-4 text-sm font-semibold group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {template.description}
                </p>

                {/* Node count */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  <span>
                    {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
                  </span>
                </div>

                {/* Use template button */}
                <button
                  onClick={() => handleUseTemplate(template)}
                  disabled={!!creating}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isCreating ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Use Template
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
