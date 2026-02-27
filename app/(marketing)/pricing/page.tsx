import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Github,
  Users,
  Workflow,
  MessageCircle,
  Sparkles,
  MessageSquare,
  Tag,
  Radio,
  Link2,
  Webhook,
  Import,
  Server,
  FileCode,
  X,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

/* ─────────────────────────────────────────────────────────────────────────────
 * SEO metadata.
 *
 * Targets keywords: "manychat alternative pricing", "manychat pricing",
 * "free chat automation", "open source manychat".
 * ────────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Pricing - Free Forever",
  description:
    "ZernFlow is free forever. Open source ManyChat alternative with unlimited contacts, unlimited flows, and 6 platforms. No credit card required.",
  keywords: [
    "manychat alternative pricing",
    "manychat pricing",
    "free chat automation",
    "open source manychat",
    "free instagram automation",
    "chat automation pricing",
  ],
  openGraph: {
    title: "ZernFlow Pricing - Free Forever",
    description:
      "Unlimited contacts, unlimited flows, 6 platforms. $0/month. Open source, self-hostable, MIT licensed.",
    url: "https://zernflow.com/pricing",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * Data: Features included in the free plan.
 * Each feature has an icon, label, and short description.
 * ────────────────────────────────────────────────────────────────────────── */

interface PlanFeature {
  icon: React.ElementType;
  label: string;
  detail: string;
}

const PLAN_FEATURES: PlanFeature[] = [
  {
    icon: Users,
    label: "Unlimited contacts",
    detail: "No caps. Grow as big as you want.",
  },
  {
    icon: Workflow,
    label: "Unlimited flows",
    detail: "Build as many automations as you need.",
  },
  {
    icon: MessageCircle,
    label: "6 platforms",
    detail: "Instagram, Facebook, Telegram, X, Bluesky, Reddit.",
  },
  {
    icon: Workflow,
    label: "Visual flow builder",
    detail: "Drag-and-drop conversation builder. No code.",
  },
  {
    icon: MessageCircle,
    label: "Comment-to-DM automation",
    detail: "Keyword triggers that auto-send DMs.",
  },
  {
    icon: Sparkles,
    label: "AI responses (BYO API key)",
    detail: "OpenAI, Anthropic, or Google. Your key, your choice.",
  },
  {
    icon: MessageSquare,
    label: "Live chat inbox",
    detail: "All conversations in one place.",
  },
  {
    icon: Tag,
    label: "Contact CRM with tags & segments",
    detail: "Organize your audience. Target the right people.",
  },
  {
    icon: Radio,
    label: "Broadcasts & sequences",
    detail: "Send updates and drip campaigns on autopilot.",
  },
  {
    icon: Link2,
    label: "Growth tools (QR codes, ref links)",
    detail: "Generate DM starters to share anywhere.",
  },
  {
    icon: Webhook,
    label: "Webhooks & API",
    detail: "Connect to any external tool or service.",
  },
  {
    icon: Import,
    label: "Flow import/export",
    detail: "Move flows between workspaces or share with others.",
  },
  {
    icon: Server,
    label: "Self-hostable",
    detail: "Deploy on your own infrastructure.",
  },
  {
    icon: FileCode,
    label: "MIT licensed",
    detail: "Use it however you want. Fork it, extend it, sell it.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Data: ManyChat pricing comparison tiers.
 * Used in the "But what about..." section to show how ManyChat pricing
 * scales vs ZernFlow's $0 flat rate.
 * ────────────────────────────────────────────────────────────────────────── */

interface ComparisonTier {
  name: string;
  price: string;
  contacts: string;
  features: string;
  highlighted?: boolean;
}

const COMPARISON_TIERS: ComparisonTier[] = [
  {
    name: "ManyChat Free",
    price: "$0/mo",
    contacts: "1,000 contacts",
    features: "Limited features, ManyChat branding, 2 platforms only",
  },
  {
    name: "ManyChat Pro",
    price: "$15/mo",
    contacts: "500 contacts",
    features:
      "Scales to $8,000+/mo for large audiences. Still only Instagram + Facebook.",
  },
  {
    name: "ManyChat Elite",
    price: "Custom",
    contacts: "Custom",
    features: "Dedicated support. Contact sales for pricing.",
  },
  {
    name: "ZernFlow",
    price: "$0 forever",
    contacts: "Unlimited",
    features:
      "All features included. 6 platforms. Self-hostable. No branding. MIT licensed.",
    highlighted: true,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Data: FAQ entries.
 * Common questions about pricing, hosting, and how ZernFlow works.
 * ────────────────────────────────────────────────────────────────────────── */

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is it really free?",
    answer:
      "Yes. ZernFlow is MIT licensed and completely free. You can self-host it on your own server or use our hosted version at zernflow.com. There are no hidden fees, no premium tiers, and no feature gates.",
  },
  {
    question: "What's the catch?",
    answer:
      "No catch. ZernFlow is built by the team behind Late (getlate.dev), a social media scheduling API for developers. ZernFlow drives awareness for Late, which is how we sustain development. The product itself is genuinely free.",
  },
  {
    question: "Can I use it for my agency?",
    answer:
      "Absolutely. You can create unlimited workspaces, connect unlimited accounts, and manage all your clients from one place. There are no per-seat or per-workspace charges.",
  },
  {
    question: "Do I need to self-host?",
    answer:
      "No. You can use our hosted version at zernflow.com for free. If you prefer to self-host for data privacy or customization, you can clone the repo, set your environment variables, and deploy to any platform that supports Next.js (Vercel, Railway, your own VPS, etc.).",
  },
  {
    question: "How does AI work?",
    answer:
      "ZernFlow supports AI-powered responses in your flows. You bring your own API key from OpenAI, Anthropic, or Google. This means you control the costs, the model, and the data. We never store or proxy your API keys through our servers.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Page component.
 * ────────────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <MarketingLayout>
      {/* ── Hero section ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
            <span className="text-xs font-medium text-emerald-700">
              100% free
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Free forever.{" "}
            <span className="text-indigo-600">No catches.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            ZernFlow is open source and completely free. Unlimited contacts,
            unlimited flows, 6 platforms. No credit card required, no
            feature limits, no per-contact pricing.
          </p>
        </div>
      </section>

      {/* ── Plan card section ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl">
            {/* Single plan card */}
            <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-lg">
              {/* Card header */}
              <div className="border-b border-indigo-100 bg-indigo-50/50 px-8 py-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Open Source
                </p>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Forever. Not a trial. Not a freemium tier.
                </p>
                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Get started free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature grid */}
              <div className="px-8 py-8">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Everything included
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {PLAN_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.label} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50">
                          <Icon className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {feature.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feature.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform support bar ── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
            All 6 platforms included for free
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { name: "Instagram", platform: "instagram" },
              { name: "Facebook", platform: "facebook" },
              { name: "Telegram", platform: "telegram" },
              { name: "X / Twitter", platform: "twitter" },
              { name: "Bluesky", platform: "bluesky" },
              { name: "Reddit", platform: "reddit" },
            ].map((p) => (
              <span
                key={p.platform}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500"
              >
                <PlatformIcon platform={p.platform} size={18} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── "But what about..." ManyChat comparison section ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              But what about ManyChat pricing?
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ManyChat charges per contact and limits you to 2 platforms. Here is
              how the pricing compares.
            </p>
          </div>

          {/* Comparison cards */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPARISON_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-6 ${
                  tier.highlighted
                    ? "border-indigo-200 bg-indigo-50/50 ring-1 ring-indigo-200"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    tier.highlighted ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {tier.name}
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    tier.highlighted ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {tier.price}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {tier.contacts}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {tier.features}
                </p>
              </div>
            ))}
          </div>

          {/* Summary callout */}
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">The math is simple:</span>{" "}
              ManyChat Pro with 100,000 contacts costs over{" "}
              <span className="font-semibold">$400/month</span>. ZernFlow with
              100,000 contacts costs{" "}
              <span className="font-semibold text-indigo-600">$0/month</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ section ── */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Everything you need to know about ZernFlow pricing.
            </p>
          </div>

          {/* FAQ items */}
          <div className="mx-auto mt-12 max-w-2xl divide-y divide-gray-200">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group py-5">
                {/* Question (clickable summary) */}
                <summary className="flex cursor-pointer items-center justify-between text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                {/* Answer (revealed on open) */}
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA section ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Stop paying for chat automation
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                ZernFlow gives you everything ManyChat charges hundreds for.
                Free forever, open source, MIT licensed. Get started in 5
                minutes.
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
