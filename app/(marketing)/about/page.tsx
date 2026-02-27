import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Heart,
  Code2,
  Globe,
  GitPullRequest,
  Map,
  ExternalLink,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PlatformIcon } from "@/components/platform-icon";

/**
 * SEO metadata for the About page.
 * Uses the template from the root layout ("%s | ZernFlow").
 */
export const metadata: Metadata = {
  title: "About ZernFlow - Open Source Chat Automation",
  description:
    "ZernFlow is the open source ManyChat alternative built by Late. Learn about our mission, technology stack, and community.",
  openGraph: {
    title: "About ZernFlow - Open Source Chat Automation",
    description:
      "ZernFlow is the open source ManyChat alternative built by Late. Learn about our mission, technology stack, and community.",
    url: "https://zernflow.com/about",
  },
};

/**
 * About page - /about
 *
 * Communicates ZernFlow's mission, tech stack, relationship with Late,
 * and open-source community values. Structured as:
 *   1. Hero (headline + subtitle)
 *   2. Mission statement
 *   3. What is ZernFlow (features + platform list)
 *   4. Built by Late (parent company context)
 *   5. Open source community (GitHub, contributions, roadmap)
 *   6. CTA (join the community)
 */
export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge linking to GitHub */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Heart className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">
              Open source, community-driven
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Built by developers,{" "}
            <span className="text-indigo-600">for developers</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            ZernFlow is an open source chat automation platform that gives you
            full control over your DMs, comments, and flows. No vendor lock-in,
            no hidden fees, no black boxes.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Our mission
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-500">
            We believe chat automation should be free and open. ManyChat charges
            hundreds per month for features that should be accessible to
            everyone. ZernFlow is our answer.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            Every business, creator, and developer deserves access to powerful
            automation tools without being locked into expensive subscriptions.
            We built ZernFlow so you can own your automations, your contacts,
            and your data.
          </p>
        </div>
      </section>

      {/* ── What is ZernFlow ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              What is ZernFlow?
            </h2>
            <p className="mt-3 text-base text-gray-500">
              A full-featured chat automation platform you can inspect, modify,
              and self-host.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_IS_ITEMS.map((item) => {
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
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Supported platforms list */}
          <div className="mx-auto mt-12 max-w-2xl">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
              Supports 6 platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {PLATFORMS.map((p) => (
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
        </div>
      </section>

      {/* ── Built by Late ── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: description */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1">
                <Globe className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">
                  getlate.dev
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Built by Late
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Late (getlate.dev) is the social media API platform behind
                ZernFlow. Late provides the infrastructure for connecting to
                Instagram, Facebook, Telegram, X, and other platforms through a
                single, developer-friendly API.
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                ZernFlow is Late&apos;s open-source contribution to the
                community. Instead of keeping chat automation locked behind a
                SaaS paywall, we decided to open-source the entire platform so
                anyone can use it, improve it, and build on top of it.
              </p>
              <Link
                href="https://getlate.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Learn about Late
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right: key points */}
            <div className="space-y-3">
              {BUILT_BY_LATE_POINTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-4"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Open source community ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Open source, open community
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ZernFlow is built in public. Every feature, bug fix, and decision
              happens in the open on GitHub.
            </p>
          </div>

          {/* Community highlights */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
            {COMMUNITY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prominent GitHub link */}
          <div className="mt-12 text-center">
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Join the community
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Star the repo, open an issue, submit a PR, or just say hi.
                ZernFlow is built by people like you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="https://github.com/getlate-dev/zernflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-400 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Try ZernFlow free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Static data arrays.
 * Extracted outside the component to keep the JSX readable and avoid
 * re-creating objects on every render.
 * ────────────────────────────────────────────────────────────────────────── */

/** "What is ZernFlow" feature cards */
const WHAT_IS_ITEMS = [
  {
    icon: Code2,
    title: "Open source, MIT licensed",
    desc: "Every line of code is on GitHub. Fork it, audit it, extend it. No enterprise-only features hiding behind a paywall.",
  },
  {
    icon: Globe,
    title: "Fully self-hostable",
    desc: "Clone the repo, set your environment variables, deploy. Run ZernFlow on your own infrastructure with full control.",
  },
  {
    icon: Heart,
    title: "Modern tech stack",
    desc: "Built on Next.js, Supabase, and React Flow. Technologies you already know and love.",
  },
];

/** Supported platforms with their icon key */
const PLATFORMS = [
  { name: "Instagram", platform: "instagram" },
  { name: "Facebook", platform: "facebook" },
  { name: "Telegram", platform: "telegram" },
  { name: "X / Twitter", platform: "twitter" },
  { name: "Bluesky", platform: "bluesky" },
  { name: "Reddit", platform: "reddit" },
];

/** Key points for the "Built by Late" section */
const BUILT_BY_LATE_POINTS = [
  {
    label: "Social media API infrastructure",
    detail:
      "Late provides the connectivity layer that powers ZernFlow's platform integrations.",
  },
  {
    label: "6 platforms through one API",
    detail:
      "Instagram, Facebook, Telegram, X, Bluesky, and Reddit, all connected through Late.",
  },
  {
    label: "Open source contribution",
    detail:
      "ZernFlow is Late's way of giving back. Powerful automation, available to everyone.",
  },
  {
    label: "Backed by a real company",
    detail:
      "ZernFlow is not a weekend project. It is maintained full-time by the Late team.",
  },
];

/** Community section highlights */
const COMMUNITY_ITEMS = [
  {
    icon: Github,
    title: "GitHub-first",
    desc: "All development happens on GitHub. Issues, PRs, and discussions are open to everyone.",
  },
  {
    icon: GitPullRequest,
    title: "PRs welcome",
    desc: "Found a bug? Want a feature? Open a pull request. We review and merge community contributions regularly.",
  },
  {
    icon: Map,
    title: "Community-driven roadmap",
    desc: "The roadmap is shaped by the community. Upvote features, suggest ideas, and help set priorities.",
  },
];
