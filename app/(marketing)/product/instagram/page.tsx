import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Monitor,
  CheckCircle,
  GitBranch,
  TrendingUp,
  Heart,
  ShoppingBag,
  GraduationCap,
  Github,
  Check,
  X,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// ---------------------------------------------------------------------------
// SEO Metadata
// Targets: "instagram dm automation", "instagram comment automation",
//          "manychat instagram alternative", "instagram chatbot"
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Instagram DM & Comment Automation - Free ManyChat Alternative",
  description:
    "Automate Instagram DMs, comments, and story replies for free. Open source ManyChat alternative with comment-to-DM triggers, AI-powered conversations, and a live chat inbox. Unlimited contacts.",
  openGraph: {
    title: "Instagram DM & Comment Automation - Free ManyChat Alternative",
    description:
      "Automate Instagram DMs, comments, and story replies for free. Open source ManyChat alternative with unlimited contacts.",
    url: "https://zernflow.com/product/instagram",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram DM & Comment Automation - Free ManyChat Alternative",
    description:
      "Automate Instagram DMs, comments, and story replies for free. Open source, self-hostable, unlimited contacts.",
  },
};

// ---------------------------------------------------------------------------
// Feature cards for the key features grid
// ---------------------------------------------------------------------------
const features = [
  {
    icon: MessageCircle,
    title: "Comment-to-DM",
    description:
      "Set a keyword trigger on any post. When someone comments it, ZernFlow instantly sends them a DM with your link, offer, or lead magnet. Fully automatic.",
  },
  {
    icon: Heart,
    title: "Story mention replies",
    description:
      "When someone mentions you in their story, ZernFlow auto-replies with a thank you, a promo code, or whatever you want. Never miss a mention again.",
  },
  {
    icon: Sparkles,
    title: "AI-powered DMs",
    description:
      "Let AI handle conversations with your audience. Bring your own API key (OpenAI, Anthropic, or Google) and let the bot qualify leads, answer FAQs, and close sales.",
  },
  {
    icon: Monitor,
    title: "Live chat inbox",
    description:
      "All your Instagram DMs in one place. The bot handles routine conversations, and you can jump into any chat when a human touch is needed.",
  },
];

// ---------------------------------------------------------------------------
// How it works steps
// ---------------------------------------------------------------------------
const steps = [
  {
    number: "1",
    icon: CheckCircle,
    title: "Connect your Instagram Business account",
    description:
      "Link your Instagram Business or Creator account in a few clicks. ZernFlow uses the official Instagram API, so your account stays safe.",
  },
  {
    number: "2",
    icon: GitBranch,
    title: "Build your automation flow",
    description:
      "Use the visual drag-and-drop builder to create your flow. Pick a trigger (comment keyword, DM keyword, story mention), add messages, set conditions.",
  },
  {
    number: "3",
    icon: TrendingUp,
    title: "Go live and watch it work",
    description:
      "Turn on your flow and it runs 24/7. Capture leads, answer questions, and sell while you sleep. Monitor everything from the inbox.",
  },
];

// ---------------------------------------------------------------------------
// Use case examples
// ---------------------------------------------------------------------------
const useCases = [
  {
    icon: Heart,
    title: "Creators",
    subtitle: "Send lead magnets on autopilot",
    description:
      'Post a Reel and tell your audience to comment "GUIDE" to get your free PDF. ZernFlow DMs it to every single person who comments. No manual work.',
  },
  {
    icon: ShoppingBag,
    title: "E-commerce stores",
    subtitle: "Handle support at scale",
    description:
      "Customers DM you about order status, sizing, or returns. AI answers instantly with context from your FAQ. Escalate to a human only when needed.",
  },
  {
    icon: GraduationCap,
    title: "Coaches & consultants",
    subtitle: "Qualify leads automatically",
    description:
      "Ask qualifying questions via DM (budget, timeline, goals), tag contacts based on answers, and only get on calls with people who are a good fit.",
  },
];

// ---------------------------------------------------------------------------
// Comparison table: ZernFlow vs ManyChat for Instagram
// ---------------------------------------------------------------------------
const comparisonRows = [
  { feature: "Free contacts", manychat: "1,000", zernflow: "Unlimited" },
  { feature: "Platforms supported", manychat: "2", zernflow: "6" },
  { feature: "AI responses", manychat: "$29/mo add-on", zernflow: "BYO API key (free)" },
  { feature: "Self-hostable", manychat: "No", zernflow: "Yes" },
  { feature: "Open source", manychat: "No", zernflow: "MIT licensed" },
  { feature: "Comment-to-DM", manychat: "Yes", zernflow: "Yes" },
  { feature: "Visual flow builder", manychat: "Yes", zernflow: "Yes" },
  { feature: "Live chat inbox", manychat: "Yes", zernflow: "Yes" },
  { feature: "Starting price", manychat: "$15/mo", zernflow: "Free forever" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function InstagramProductPage() {
  return (
    <MarketingLayout>
      {/* ================================================================= */}
      {/* Hero Section                                                      */}
      {/* Instagram-gradient accent (pink/purple) to evoke the IG brand     */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
        {/* Gradient accent blob behind the hero text */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #E4405F 0%, #833AB4 50%, #C13584 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Platform badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5">
              <PlatformIcon platform="instagram" size={16} />
              <span className="text-xs font-medium text-pink-700">Instagram Automation</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Instagram Automation{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #E4405F, #833AB4)",
                }}
              >
                That Actually Works
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Automate DMs, comment replies, and story mentions on Instagram.
              Free, open source, and way more powerful than what you&apos;re paying for.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
              >
                Start automating Instagram
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
      {/* 4-card grid showcasing Instagram-specific capabilities            */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need for Instagram growth
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Comment-to-DM, story replies, AI conversations, live inbox. All in one tool.
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
      {/* 3-step flow: Connect -> Build -> Go live                          */}
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
      {/* Use Case Examples Section                                         */}
      {/* Shows real-world scenarios for creators, stores, and coaches      */}
      {/* ================================================================= */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How people use Instagram automation
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <Icon className="mb-3 h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {useCase.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-indigo-600">
                    {useCase.subtitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {useCase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Comparison Table: ZernFlow vs ManyChat for Instagram               */}
      {/* Side-by-side feature/pricing comparison to convert searchers       */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              ZernFlow vs ManyChat for Instagram
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Same Instagram features. More platforms. No monthly bill.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              {/* Table header */}
              <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50">
                <div className="px-6 py-4" />
                <div className="border-l border-gray-200 px-6 py-4 text-center">
                  <p className="text-sm font-semibold text-gray-400">ManyChat</p>
                </div>
                <div className="border-l border-gray-200 bg-indigo-50 px-6 py-4 text-center">
                  <p className="text-sm font-semibold text-indigo-600">ZernFlow</p>
                </div>
              </div>

              {/* Table rows */}
              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="px-6 py-3">
                    <p className="text-sm text-gray-700">{row.feature}</p>
                  </div>
                  <div className="flex items-center justify-center border-l border-gray-100 px-6 py-3">
                    <p className="text-sm text-gray-500">{row.manychat}</p>
                  </div>
                  <div className="flex items-center justify-center border-l border-gray-100 bg-indigo-50/30 px-6 py-3">
                    <p className="text-sm font-medium text-indigo-600">{row.zernflow}</p>
                  </div>
                </div>
              ))}
            </div>
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
                Start automating Instagram for free
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Connect your Instagram Business account, build your first flow, and go live
                in under 5 minutes. Free forever, open source, unlimited contacts.
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
