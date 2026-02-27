import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Terminal,
  LayoutGrid,
  Users,
  GitBranch,
  CheckCircle,
  TrendingUp,
  Github,
  Sparkles,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// ---------------------------------------------------------------------------
// SEO Metadata
// Targets: "telegram bot builder", "telegram automation",
//          "telegram chatbot", "telegram bot platform"
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Telegram Bot Builder - Visual Automation for Telegram",
  description:
    "Build powerful Telegram bots with a visual flow builder. No coding required. Command handlers, inline keyboards, group management, and AI-powered conversations. Free and open source.",
  openGraph: {
    title: "Telegram Bot Builder - Visual Automation for Telegram",
    description:
      "Build powerful Telegram bots with a visual flow builder. No coding required. Free, open source, self-hostable.",
    url: "https://zernflow.com/product/telegram",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telegram Bot Builder - Visual Automation for Telegram",
    description:
      "Build powerful Telegram bots with a visual flow builder. No coding required. Free, open source, self-hostable.",
  },
};

// ---------------------------------------------------------------------------
// Feature cards for the key features grid
// ---------------------------------------------------------------------------
const features = [
  {
    icon: Terminal,
    title: "Bot commands",
    description:
      "Set up keyword triggers and command handlers (/start, /help, custom commands). Your bot responds instantly with the right message, flow, or action.",
  },
  {
    icon: LayoutGrid,
    title: "Interactive keyboards",
    description:
      "Create inline buttons, quick reply keyboards, and callback queries. Guide users through menus, forms, and multi-step processes without typing.",
  },
  {
    icon: Users,
    title: "Group management",
    description:
      "Handle messages in groups and channels. Set up moderation rules, welcome new members, and run automations triggered by group events.",
  },
  {
    icon: GitBranch,
    title: "Flow automation",
    description:
      "The same visual drag-and-drop builder that works for Instagram and Facebook, now for Telegram. Build complex conversation trees without writing code.",
  },
];

// ---------------------------------------------------------------------------
// How it works steps
// ---------------------------------------------------------------------------
const steps = [
  {
    number: "1",
    icon: CheckCircle,
    title: "Create a Telegram bot",
    description:
      "Open @BotFather on Telegram and create a new bot. You will get a bot token. That is all you need.",
  },
  {
    number: "2",
    icon: GitBranch,
    title: "Connect to ZernFlow",
    description:
      "Paste your bot token into ZernFlow. We set up the webhook automatically so your bot starts receiving messages right away.",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "Build your flows",
    description:
      "Use the visual builder to create command handlers, conversation flows, and automated responses. Test in Telegram, iterate, and go live.",
  },
];

// ---------------------------------------------------------------------------
// "Why ZernFlow for Telegram" advantages
// ManyChat does NOT support Telegram, so this is a key differentiator
// ---------------------------------------------------------------------------
const advantages = [
  {
    icon: Globe,
    title: "ManyChat does not support Telegram",
    description:
      "ManyChat only works with Instagram and Facebook. If you need Telegram automation, they cannot help you. ZernFlow gives you full Telegram support with the same visual builder you would use for any other platform.",
  },
  {
    icon: Sparkles,
    title: "AI-powered conversations",
    description:
      "Connect your own AI API key (OpenAI, Anthropic, or Google) and let the bot handle complex conversations. It reads the full message history, understands context, and responds naturally.",
  },
  {
    icon: Shield,
    title: "Self-host for full control",
    description:
      "Telegram bots often handle sensitive data. Self-host ZernFlow on your own infrastructure so messages never leave your servers. MIT licensed, no vendor lock-in.",
  },
  {
    icon: Zap,
    title: "Same builder, all platforms",
    description:
      "Build a flow once for Telegram. Then reuse the same logic for Instagram, Facebook, X, Bluesky, or Reddit. One tool for all your chat automation across 6 platforms.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function TelegramProductPage() {
  return (
    <MarketingLayout>
      {/* ================================================================= */}
      {/* Hero Section                                                      */}
      {/* Telegram blue accent to evoke the Telegram brand                  */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
        {/* Gradient accent blob in Telegram blue */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #26A5E4 0%, #0088cc 50%, #229ED9 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Platform badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5">
              <PlatformIcon platform="telegram" size={16} />
              <span className="text-xs font-medium text-sky-700">Telegram Automation</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Build Powerful{" "}
              <span className="text-[#26A5E4]">Telegram Bots</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Create Telegram bots with a visual flow builder. Command handlers,
              inline keyboards, group automation, and AI conversations.
              No coding required.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
              >
                Build your Telegram bot
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
      {/* 4-card grid showcasing Telegram-specific capabilities             */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need to build Telegram bots
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Commands, keyboards, group handling, visual flows. All in one tool.
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
      {/* 3-step flow: Create bot -> Connect -> Build flows                 */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            From zero to live bot in 5 minutes
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
      {/* Why ZernFlow for Telegram Section                                 */}
      {/* Key differentiator: ManyChat doesn't support Telegram at all      */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why ZernFlow for Telegram
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ManyChat only supports Instagram and Facebook. ZernFlow gives you
              Telegram automation with the same powerful visual builder.
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
                Build your Telegram bot today
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Create a bot with @BotFather, connect it to ZernFlow, and build your
                first automation flow in minutes. Free forever, open source, self-hostable.
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
