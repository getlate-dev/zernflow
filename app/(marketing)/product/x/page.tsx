import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  AtSign,
  Search,
  GitBranch,
  CheckCircle,
  TrendingUp,
  Github,
  Globe,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// ---------------------------------------------------------------------------
// SEO Metadata
// Targets: "twitter automation", "x dm automation", "twitter chatbot",
//          "x automation tool", "twitter auto reply"
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "X (Twitter) DM & Reply Automation - Free Chatbot Builder",
  description:
    "Automate X (Twitter) DMs, replies, and mentions for free. Open source automation tool with visual flow builder, keyword triggers, AI-powered conversations, and a unified inbox. ManyChat does not support X.",
  openGraph: {
    title: "X (Twitter) DM & Reply Automation - Free Chatbot Builder",
    description:
      "Automate X (Twitter) DMs, replies, and mentions for free. Open source, self-hostable, unlimited contacts.",
    url: "https://zernflow.com/product/x",
  },
  twitter: {
    card: "summary_large_image",
    title: "X (Twitter) DM & Reply Automation - Free Chatbot Builder",
    description:
      "Automate X DMs, replies, and mentions for free. Open source, self-hostable, unlimited contacts.",
  },
};

// ---------------------------------------------------------------------------
// Feature cards for the key features grid
// ---------------------------------------------------------------------------
const features = [
  {
    icon: MessageSquare,
    title: "DM automation",
    description:
      "Auto-respond to direct messages based on keywords, intent, or conversation stage. Welcome new followers, answer FAQs, and qualify leads through automated DM conversations.",
  },
  {
    icon: AtSign,
    title: "Reply management",
    description:
      "Handle mentions and replies at scale. Set up auto-replies for common questions, route important mentions to your inbox, and never miss a conversation.",
  },
  {
    icon: Search,
    title: "Keyword triggers",
    description:
      "Route conversations based on message content. Different keywords trigger different flows, so your audience always gets the right response.",
  },
  {
    icon: GitBranch,
    title: "Visual flow builder",
    description:
      "The same drag-and-drop builder that works for Instagram and Facebook, now for X. Build complex conversation trees, add conditions, and connect to external tools.",
  },
];

// ---------------------------------------------------------------------------
// How it works steps
// ---------------------------------------------------------------------------
const steps = [
  {
    number: "1",
    icon: CheckCircle,
    title: "Connect your X account",
    description:
      "Link your X (Twitter) account through OAuth. ZernFlow uses the official X API, so your account stays safe and compliant.",
  },
  {
    number: "2",
    icon: GitBranch,
    title: "Build your automation",
    description:
      "Create flows for DM conversations, mention replies, and keyword triggers. Use the visual builder to set up your logic, no coding required.",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "Engage your audience",
    description:
      "Your flows run 24/7. Handle DM conversations, respond to mentions, and grow your presence on X while you focus on creating content.",
  },
];

// ---------------------------------------------------------------------------
// "Why ZernFlow for X" advantages
// ManyChat does NOT support X/Twitter, so this is a key differentiator
// ---------------------------------------------------------------------------
const advantages = [
  {
    icon: Globe,
    title: "ManyChat does not support X",
    description:
      "ManyChat only works with Instagram and Facebook. If you need automation on X (Twitter), they simply cannot help. ZernFlow gives you full X automation with the same visual builder and AI features.",
  },
  {
    icon: Sparkles,
    title: "AI-powered conversations",
    description:
      "Bring your own API key (OpenAI, Anthropic, or Google) and let AI handle DM conversations. It reads the full thread, understands context, and responds naturally. Perfect for support and lead qualification.",
  },
  {
    icon: Shield,
    title: "Self-host for compliance",
    description:
      "Run ZernFlow on your own infrastructure. Your DMs, contacts, and conversation data never leave your servers. MIT licensed, full source code access, zero vendor lock-in.",
  },
  {
    icon: Zap,
    title: "One tool for all platforms",
    description:
      "Automate X alongside Instagram, Facebook, Telegram, Bluesky, and Reddit. Build flows once and adapt them across platforms. One inbox for every conversation.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function XProductPage() {
  return (
    <MarketingLayout>
      {/* ================================================================= */}
      {/* Hero Section                                                      */}
      {/* X/Twitter black accent to match the X brand identity              */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
        {/* Gradient accent blob in dark gray/black for X brand */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #14171A 0%, #657786 50%, #14171A 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Platform badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5">
              <PlatformIcon platform="twitter" size={16} />
              <span className="text-xs font-medium text-gray-700">X (Twitter) Automation</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Automate{" "}
              <span className="text-gray-900">X (Twitter)</span>{" "}
              DMs and Replies
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Auto-respond to DMs, handle mentions at scale, and build conversation
              flows for X. The automation tool that ManyChat refuses to build.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
              >
                Start automating X
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://github.com/getlate-dev/zernflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
              >
                <Github className="h-4 w-4" />
                View source code
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Free forever. No credit card. Open source and self-hostable.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Key Features Section                                              */}
      {/* 4-card grid showcasing X/Twitter-specific capabilities            */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Full X automation toolkit
            </h2>
            <p className="mt-3 text-base text-gray-500">
              DMs, replies, keyword triggers, visual flows. Everything you need
              to automate your presence on X.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <Icon className="mb-3 h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* How It Works Section                                              */}
      {/* 3-step flow: Connect -> Build -> Engage                           */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Live on X in 5 minutes
          </h2>
          <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Why ZernFlow for X Section                                        */}
      {/* Key differentiator: ManyChat doesn't support X at all             */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why ZernFlow for X
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ManyChat does not support X. We do. Full DM and reply automation
              with the same powerful builder you would use for any platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <Icon className="mb-3 h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Final CTA Section                                                 */}
      {/* Indigo-600 background matching the homepage pattern               */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Start automating X for free
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Connect your X account, build your first DM flow, and go live in minutes.
                Free forever, open source, unlimited contacts.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  Get started free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="https://github.com/getlate-dev/zernflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-400 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
