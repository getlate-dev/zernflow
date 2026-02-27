import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle,
  GitBranch,
  TrendingUp,
  Github,
  MousePointerClick,
  Zap,
  Users,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// ---------------------------------------------------------------------------
// SEO Metadata
// Targets: "facebook messenger automation", "messenger marketing",
//          "manychat messenger alternative", "facebook chatbot"
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Facebook Messenger Automation - Free ManyChat Alternative",
  description:
    "Automate Facebook Messenger conversations and page comments for free. Open source ManyChat alternative with visual flow builder, AI responses, broadcasts, and a live chat inbox. Unlimited contacts.",
  openGraph: {
    title: "Facebook Messenger Automation - Free ManyChat Alternative",
    description:
      "Automate Facebook Messenger conversations and page comments for free. Open source, self-hostable, unlimited contacts.",
    url: "https://zernflow.com/product/facebook",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Messenger Automation - Free ManyChat Alternative",
    description:
      "Automate Messenger conversations and page comments for free. Open source, self-hostable, unlimited contacts.",
  },
};

// ---------------------------------------------------------------------------
// Feature cards for the key features grid
// ---------------------------------------------------------------------------
const features = [
  {
    icon: GitBranch,
    title: "Messenger flows",
    description:
      "Build conversation flows with the visual drag-and-drop builder. Welcome messages, qualification questions, product recommendations, booking confirmations. No code required.",
  },
  {
    icon: MessageCircle,
    title: "Comment automation",
    description:
      "Auto-reply to comments on your Facebook Page posts. Set keyword triggers, send public replies, or slide into DMs with follow-up offers.",
  },
  {
    icon: MousePointerClick,
    title: "Quick replies and buttons",
    description:
      "Send rich interactive messages with quick reply buttons, carousels, and CTAs. Guide your audience through conversations without typing.",
  },
  {
    icon: Send,
    title: "Broadcast messages",
    description:
      "Send updates, promotions, and announcements to your subscriber list. Target by tags, segments, or conversation history.",
  },
];

// ---------------------------------------------------------------------------
// How it works steps
// ---------------------------------------------------------------------------
const steps = [
  {
    number: "1",
    icon: CheckCircle,
    title: "Connect your Facebook Page",
    description:
      "Link your Facebook Page in a few clicks. ZernFlow uses the official Meta API, so your page and data stay secure.",
  },
  {
    number: "2",
    icon: GitBranch,
    title: "Create your automation",
    description:
      "Build flows with the visual builder. Pick triggers (message keywords, post comments, page events), add actions, set conditions.",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "Engage customers 24/7",
    description:
      "Your flows handle Messenger conversations around the clock. Answer questions, qualify leads, and drive sales while you focus on your business.",
  },
];

// ---------------------------------------------------------------------------
// Social proof / stats highlights
// ---------------------------------------------------------------------------
const highlights = [
  {
    icon: Users,
    title: "Works with any Facebook Business Page",
    description:
      "Whether you have 100 followers or 1 million, ZernFlow connects to any Facebook Page with Messenger enabled. Set up in minutes.",
  },
  {
    icon: Zap,
    title: "Process thousands of messages per day",
    description:
      "ZernFlow is built to handle high volumes. Your flows run in real time, and the AI can handle concurrent conversations without slowing down.",
  },
  {
    icon: Sparkles,
    title: "AI that actually understands context",
    description:
      "Bring your own API key (OpenAI, Anthropic, or Google). The AI reads the full conversation history before responding, so answers are relevant and helpful.",
  },
  {
    icon: MessageSquare,
    title: "One inbox for everything",
    description:
      "Messenger DMs, page comments, and automated conversations all show up in one live chat inbox. Jump in when you need to, let the bot handle the rest.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function FacebookProductPage() {
  return (
    <MarketingLayout>
      {/* ================================================================= */}
      {/* Hero Section                                                      */}
      {/* Facebook blue accent to evoke the Meta/FB brand                   */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
        {/* Gradient accent blob in Facebook blue */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #1877F2 0%, #42A5F5 50%, #1565C0 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Platform badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5">
              <PlatformIcon platform="facebook" size={16} />
              <span className="text-xs font-medium text-blue-700">Facebook Messenger</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Messenger Marketing{" "}
              <span className="text-[#1877F2]">Without the Monthly Bill</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Automate Facebook Messenger conversations and page comment replies.
              Build flows, broadcast to subscribers, and let AI handle your support.
              Free and open source.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
              >
                Start automating Messenger
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
              Free forever. No credit card. Unlimited contacts.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Key Features Section                                              */}
      {/* 4-card grid showcasing Facebook/Messenger-specific capabilities   */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Full Messenger automation toolkit
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Flows, comment automation, rich messages, broadcasts. Everything you need to grow on Facebook.
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
      {/* 3-step flow: Connect Page -> Create automation -> Engage          */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Up and running in 5 minutes
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
      {/* Stats / Social Proof Section                                      */}
      {/* Highlights about scale, AI, and the unified inbox                 */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Built for serious Messenger marketing
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Whether you are a solopreneur or an agency, ZernFlow scales with you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {highlights.map((item) => {
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
                Automate Messenger for free
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Connect your Facebook Page, build your first Messenger flow, and start
                engaging customers in minutes. Free forever, open source, unlimited contacts.
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
