import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Webhook,
  Key,
  Globe,
  FileJson,
  Table,
  Zap,
  Database,
  MessageSquare,
  Github,
  Code2,
  Plug,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// -----------------------------------------------------------------
// SEO metadata targeting integration-focused keywords:
// "manychat integrations", "chat automation integrations",
// "chatbot webhook integrations", "social media api automation"
// -----------------------------------------------------------------
export const metadata: Metadata = {
  title: "Integrations - Connect ZernFlow to Everything",
  description:
    "Connect ZernFlow to your existing tools with webhooks, REST API, and HTTP Request nodes. Integrate with Instagram, Facebook, Telegram, X, Bluesky, Reddit, Google Sheets, Zapier, Slack, and any CRM. Open source chat automation.",
  openGraph: {
    title: "Integrations - Connect ZernFlow to Everything | ZernFlow",
    description:
      "Webhooks, REST API, HTTP Request nodes. Connect ZernFlow to Google Sheets, Zapier, Slack, your CRM, and more. Open source, free forever.",
    url: "https://zernflow.com/integrations",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZernFlow Integrations - Webhooks, API & More",
    description:
      "Connect ZernFlow to everything. Webhooks, REST API, HTTP Request nodes. Free, open source.",
  },
  alternates: {
    canonical: "https://zernflow.com/integrations",
  },
};

// -----------------------------------------------------------------
// Platform integration cards. Each platform ZernFlow supports with
// a short description of what automation is available, and a link
// to the dedicated product page for that platform.
// -----------------------------------------------------------------
const platformIntegrations = [
  {
    platform: "instagram",
    name: "Instagram",
    description: "Comment-to-DM, story replies, AI-powered DM automation, and live chat inbox.",
    href: "/product/instagram",
  },
  {
    platform: "facebook",
    name: "Facebook",
    description: "Page messaging, comment automation, lead generation flows, and broadcast campaigns.",
    href: "/product/facebook",
  },
  {
    platform: "telegram",
    name: "Telegram",
    description: "Bot conversations, group management, command triggers, and inline keyboards.",
    href: "/product/telegram",
  },
  {
    platform: "twitter",
    name: "X (Twitter)",
    description: "DM automation, mention triggers, keyword monitoring, and auto-replies.",
    href: "/product/x",
  },
  {
    platform: "bluesky",
    name: "Bluesky",
    description: "DM flows, mention tracking, and automated engagement on the decentralized network.",
    href: "/product/bluesky",
  },
  {
    platform: "reddit",
    name: "Reddit",
    description: "Message automation, post monitoring, keyword triggers, and community engagement.",
    href: "/product/reddit",
  },
];

// -----------------------------------------------------------------
// Developer integration cards. These are the technical building
// blocks that let developers connect ZernFlow to external systems.
// -----------------------------------------------------------------
const developerIntegrations = [
  {
    icon: Webhook,
    title: "Webhooks",
    description:
      "Real-time event notifications to any URL. 10 event types including new contacts, messages received, flow completions, and more.",
  },
  {
    icon: Key,
    title: "REST API",
    description:
      "Full API with key authentication for external access. Manage contacts, trigger flows, send messages, and read analytics programmatically.",
  },
  {
    icon: Globe,
    title: "HTTP Request node",
    description:
      "Call any external API directly from your flows. Send data to third-party services, fetch information, and use responses in your automation.",
  },
  {
    icon: FileJson,
    title: "Flow import / export",
    description:
      "Portable .zernflow.json format. Export flows from one workspace, import into another. Share templates with your team or the community.",
  },
];

// -----------------------------------------------------------------
// "Works with your stack" use cases. Common integration patterns
// that developers and teams set up with ZernFlow.
// -----------------------------------------------------------------
const stackUseCases = [
  {
    icon: Table,
    title: "Push leads to Google Sheets",
    how: "Via HTTP Request node or webhook",
    description:
      "When a contact is captured, automatically add their info to a Google Sheet. Use the HTTP Request node in your flow or set up an outbound webhook.",
  },
  {
    icon: Zap,
    title: "Trigger Zapier automations",
    how: "Via outbound webhooks",
    description:
      "Connect ZernFlow events to any of Zapier's 6,000+ apps. New contact? Trigger a Zap. Message received? Update your CRM automatically.",
  },
  {
    icon: Database,
    title: "Sync with your CRM",
    how: "Via API",
    description:
      "Use the REST API to sync contacts, tags, and conversation data with Salesforce, HubSpot, Pipedrive, or any CRM that accepts HTTP requests.",
  },
  {
    icon: MessageSquare,
    title: "Send data to Slack",
    how: "Via webhooks",
    description:
      "Get notified in Slack when important events happen. New lead captured, conversation escalated, or flow completed. Set up in minutes.",
  },
];

export default function IntegrationsPage() {
  return (
    <MarketingLayout>
      {/* ============================================================
          HERO SECTION
          Targets developers and technical decision-makers. Lead with
          the extensibility angle: webhooks, API, and integrations.
          ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Integration badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Plug className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">
              Webhooks, API, and more
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Connect ZernFlow{" "}
            <span className="text-indigo-600">to Everything</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            6 social platforms, outbound webhooks, a full REST API, and HTTP
            Request nodes inside your flows. ZernFlow fits into any stack.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
            >
              Start integrating for free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              <Github className="h-4 w-4" />
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          PLATFORM INTEGRATIONS SECTION
          Grid of all 6 supported social platforms. Each card shows
          the platform icon (using PlatformIcon component with brand
          colors), name, description, and links to the dedicated
          product page for that platform.
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Platform integrations
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Automate conversations across 6 social platforms. ManyChat only
              supports 2.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformIntegrations.map((platform) => (
              <Link
                key={platform.platform}
                href={platform.href}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/20"
              >
                <div className="mb-3 flex items-center gap-3">
                  <PlatformIcon platform={platform.platform} size={22} />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {platform.name}
                  </h3>
                  {/* Arrow that appears on hover */}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-gray-300 transition-colors group-hover:text-indigo-500" />
                </div>
                <p className="text-sm leading-relaxed text-gray-500">
                  {platform.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DEVELOPER INTEGRATIONS SECTION
          Technical integration capabilities: webhooks, REST API,
          HTTP Request node, and flow import/export. Targeted at
          developers who want to extend ZernFlow programmatically.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5">
              <Code2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">
                Developer tools
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Developer integrations
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Webhooks, API, and extensibility built into the core. Not bolted
              on as an afterthought.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {developerIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                      <Icon className="h-4.5 w-4.5 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {integration.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {integration.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          "WORKS WITH YOUR STACK" SECTION
          Common real-world integration patterns. Shows developers
          concrete examples of how to connect ZernFlow to popular
          tools they already use (Sheets, Zapier, CRMs, Slack).
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Works with your stack
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Common integration patterns you can set up in minutes.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
            {stackUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      {useCase.title}
                    </h3>
                  </div>
                  {/* Shows how the integration works (via which mechanism) */}
                  <p className="mb-2 text-xs font-medium text-indigo-500">
                    {useCase.how}
                  </p>
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
          DEVELOPER CTA SECTION
          Targets developers specifically. Links to GitHub repo and
          API documentation. Uses a more technical tone.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5">
              <Github className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">
                MIT licensed, open source
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Built for developers
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Read every line of code. Fork it, extend it, self-host it. Full
              API documentation in the repo. No black boxes, no proprietary
              lock-in.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="https://github.com/getlate-dev/zernflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Github className="h-4 w-4" />
                Read the API docs on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM CTA SECTION
          Final conversion section. Broad CTA that works for both
          developers and non-technical users.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Start integrating for free
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Connect your social accounts, set up webhooks, and start
                building automation flows. Full API access included, no
                paid tier required.
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
