import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  MessageCircle,
  BookOpen,
  Sparkles,
  Globe,
  Send,
  Tag,
  Mail,
  Users,
  BarChart3,
  Star,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// -----------------------------------------------------------------
// SEO metadata targeting creator-focused keywords:
// "instagram automation for creators", "creator dm automation",
// "content creator chat tools", "manychat alternative for creators"
// -----------------------------------------------------------------
export const metadata: Metadata = {
  title: "For Creators - Free Instagram & Social Media Automation",
  description:
    "Automate comment-to-DM, lead magnets, and auto-replies across Instagram, Facebook, Telegram, X, Bluesky, and Reddit. Free forever, open source alternative to ManyChat for creators. Grow your audience on autopilot.",
  openGraph: {
    title: "For Creators - Free Instagram & Social Media Automation | ZernFlow",
    description:
      "Comment-to-DM, lead magnets, AI-powered replies. Everything creators need to monetize their social media presence. Free, self-hostable, open source.",
    url: "https://zernflow.com/creators",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZernFlow for Creators - Free Social Media Automation",
    description:
      "Comment-to-DM, lead magnets, AI replies. Free, open source ManyChat alternative for creators.",
  },
  alternates: {
    canonical: "https://zernflow.com/creators",
  },
};

// -----------------------------------------------------------------
// Pain point cards data. Each card represents a common frustration
// creators face that ZernFlow solves.
// -----------------------------------------------------------------
const painPoints = [
  {
    icon: Clock,
    text: "You spend hours replying to DMs manually",
  },
  {
    icon: AlertTriangle,
    text: "You lose leads because you can't respond fast enough",
  },
  {
    icon: DollarSign,
    text: "You're paying $100+/mo for ManyChat Pro just to handle your audience",
  },
  {
    icon: FileText,
    text: "You want to send lead magnets but it's too complicated",
  },
];

// -----------------------------------------------------------------
// Solution features. Each maps directly to a pain point above,
// showing how ZernFlow addresses the creator's problem.
// -----------------------------------------------------------------
const solutionFeatures = [
  {
    icon: MessageCircle,
    title: "Comment-to-DM",
    description:
      'Post "Comment LINK to get my free guide" and ZernFlow auto-DMs everyone who comments. No manual work, no missed leads.',
    color: "indigo",
  },
  {
    icon: BookOpen,
    title: "Lead magnet delivery",
    description:
      "Automatically send PDFs, links, and exclusive content via DM. Your audience comments a keyword, they get the resource instantly.",
    color: "emerald",
  },
  {
    icon: Sparkles,
    title: "AI-powered replies",
    description:
      "Your AI assistant answers questions 24/7 in your voice. Pick your provider (OpenAI, Anthropic, Google) and bring your own API key.",
    color: "violet",
  },
  {
    icon: Globe,
    title: "Multi-platform",
    description:
      "Same automation across Instagram, Facebook, X, Telegram, Bluesky, and Reddit. One flow, six platforms.",
    color: "amber",
  },
];

// -----------------------------------------------------------------
// Color utility for solution feature cards. Returns Tailwind classes
// for the icon background and icon color based on the color name.
// -----------------------------------------------------------------
function getFeatureColors(color: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  };
  return colors[color] || colors.indigo;
}

// -----------------------------------------------------------------
// Example use cases showing real creator workflows. Each represents
// a complete automation scenario from trigger to outcome.
// -----------------------------------------------------------------
const useCases = [
  {
    icon: BookOpen,
    title: "Free guide delivery",
    steps: [
      { icon: Send, label: "Post with CTA" },
      { icon: MessageCircle, label: "Comment trigger" },
      { icon: Mail, label: "DM with link" },
      { icon: Tag, label: "Tag as lead" },
    ],
    description:
      "Post your content, ask followers to comment a keyword, and ZernFlow delivers the guide via DM while tagging them as leads in your CRM.",
  },
  {
    icon: Users,
    title: "Course waitlist",
    steps: [
      { icon: Heart, label: "Story mention" },
      { icon: MessageCircle, label: "DM asks for email" },
      { icon: Tag, label: "Save to CRM" },
      { icon: Send, label: "Send sequence" },
    ],
    description:
      "When someone mentions your story or replies, ZernFlow DMs them asking for their email. It saves the contact and enrolls them in a drip sequence.",
  },
  {
    icon: BarChart3,
    title: "Affiliate links",
    steps: [
      { icon: MessageCircle, label: "Keyword trigger" },
      { icon: Sparkles, label: "Personalized DM" },
      { icon: Send, label: "Send recommendation" },
      { icon: BarChart3, label: "Track conversions" },
    ],
    description:
      "Followers DM a product name, ZernFlow sends them your affiliate link with a personalized recommendation. Track which keywords convert best.",
  },
];

// -----------------------------------------------------------------
// Platforms list used in the multi-platform badge strip
// -----------------------------------------------------------------
const platforms = [
  { name: "Instagram", platform: "instagram" },
  { name: "Facebook", platform: "facebook" },
  { name: "Telegram", platform: "telegram" },
  { name: "X / Twitter", platform: "twitter" },
  { name: "Bluesky", platform: "bluesky" },
  { name: "Reddit", platform: "reddit" },
];

export default function CreatorsPage() {
  return (
    <MarketingLayout>
      {/* ============================================================
          HERO SECTION
          Primary headline targeting creators. Communicates the core
          value prop: automation for audience growth and monetization.
          ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Audience badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Heart className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Built for creators</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Grow Your Audience{" "}
            <span className="text-indigo-600">on Autopilot</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Comment-to-DM, lead magnets, auto-replies. Everything creators need
            to monetize their social media presence.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
            >
              Start growing for free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Free forever. No credit card required. Self-host or use our cloud.
          </p>
        </div>
      </section>

      {/* ============================================================
          PLATFORM STRIP
          Shows all 6 supported platforms to establish breadth of
          coverage vs ManyChat's 2-platform limitation.
          ============================================================ */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
            One automation, six platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {platforms.map((p) => (
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

      {/* ============================================================
          PAIN POINTS SECTION
          "Sound familiar?" resonance section. Each card targets a
          specific frustration creators experience daily.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Sound familiar?
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Most creators hit these walls. ZernFlow removes them.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {painPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.text}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Icon className="h-4.5 w-4.5 text-red-500" />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SOLUTION FEATURES SECTION
          Directly maps to the pain points above. Each feature card
          shows how ZernFlow solves the corresponding problem.
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How ZernFlow solves it
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Automation tools built specifically for creator workflows.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {solutionFeatures.map((feature) => {
              const Icon = feature.icon;
              const colors = getFeatureColors(feature.color);
              return (
                <div
                  key={feature.title}
                  className={`rounded-xl border ${colors.border} bg-white p-6`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg}`}>
                      <Icon className={`h-4.5 w-4.5 ${colors.text}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          USE CASES SECTION
          Three concrete creator workflows with step-by-step flow
          visualization. Shows the automation pipeline from trigger
          to outcome so creators can visualize their own setup.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How creators use ZernFlow
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Real workflows you can set up in minutes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => {
              const UseCaseIcon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  {/* Use case header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                      <UseCaseIcon className="h-4.5 w-4.5 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {useCase.title}
                    </h3>
                  </div>

                  {/* Step flow visualization */}
                  <div className="mb-4 flex items-center gap-1">
                    {useCase.steps.map((step, i) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.label} className="flex items-center gap-1">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 border border-gray-100">
                              <StepIcon className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                            <span className="text-[9px] text-gray-400 text-center leading-tight w-14">
                              {step.label}
                            </span>
                          </div>
                          {/* Arrow connector between steps (not after last) */}
                          {i < useCase.steps.length - 1 && (
                            <ArrowRight className="h-3 w-3 shrink-0 text-gray-300 mt-[-12px]" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-500">
                    {useCase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIAL / SOCIAL PROOF SECTION
          Placeholder section styled and ready for real testimonials.
          Uses a quote-card layout with star ratings.
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Creators are switching to ZernFlow
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Join thousands of creators who ditched expensive tools for a free, open source alternative.
            </p>
          </div>

          {/* Testimonial placeholder cards */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              {
                quote: "I was paying $120/mo for ManyChat. Now I do the same thing for free with ZernFlow. The comment-to-DM feature alone is worth it.",
                name: "Coming soon",
                handle: "@creator",
              },
              {
                quote: "My lead magnet delivery went from 2 hours of manual DMs to completely automated. I just post and let ZernFlow handle the rest.",
                name: "Coming soon",
                handle: "@creator",
              },
              {
                quote: "The AI replies feel so natural that my audience thinks I'm personally responding. It handles 90% of my DMs now.",
                name: "Coming soon",
                handle: "@creator",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                {/* Star rating placeholder */}
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-400">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-300">{testimonial.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING CALLOUT SECTION
          Direct cost comparison with ManyChat. Highlights the free
          tier advantage for creators on a budget.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Free forever</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Stop overpaying for chat automation
            </h2>
            <p className="mt-4 text-base text-gray-500">
              ManyChat charges $15+/mo for 500 contacts (and up to $435/mo for
              100K contacts). ZernFlow is free for unlimited contacts.
            </p>

            {/* Price comparison visual */}
            <div className="mx-auto mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
              {/* ManyChat pricing */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  ManyChat Pro
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-300">
                  $15<span className="text-base font-normal">/mo</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">500 contacts limit</p>
                <p className="mt-1 text-xs text-gray-400">2 platforms only</p>
              </div>

              {/* ZernFlow pricing */}
              <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/30 p-6 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                  ZernFlow
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  $0<span className="text-base font-normal">/mo</span>
                </p>
                <p className="mt-1 text-xs text-indigo-500">Unlimited contacts</p>
                <p className="mt-1 text-xs text-indigo-500">6 platforms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM CTA SECTION
          Final conversion section with strong call-to-action.
          Uses the indigo background pattern from the homepage.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Start growing for free
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Set up your first automation in minutes. Comment-to-DM, lead
                magnets, AI replies. Everything you need, no credit card
                required.
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
                  View on GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
