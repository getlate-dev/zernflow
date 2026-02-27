import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LayoutGrid,
  Copy,
  Users,
  Webhook,
  DollarSign,
  CheckCircle,
  Link2,
  GitBranch,
  Eye,
  Calculator,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

// -----------------------------------------------------------------
// SEO metadata targeting agency-focused keywords:
// "chat automation for agencies", "white label chatbot",
// "manychat agency alternative", "social media agency automation"
// -----------------------------------------------------------------
export const metadata: Metadata = {
  title: "For Agencies - Manage All Your Clients in One Platform",
  description:
    "Manage multiple brands from one dashboard. Multi-workspace, flow templates, team collaboration, and API access. Free, open source ManyChat alternative for agencies. Save $17,000+ per year.",
  openGraph: {
    title: "For Agencies - Manage All Clients in One Platform | ZernFlow",
    description:
      "Multi-workspace, flow templates, team collaboration. Free, open source chat automation for agencies managing multiple client brands.",
    url: "https://zernflow.com/agencies",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZernFlow for Agencies - Free Multi-Client Chat Automation",
    description:
      "Manage all your clients from one platform. Free, open source ManyChat alternative for agencies.",
  },
  alternates: {
    canonical: "https://zernflow.com/agencies",
  },
};

// -----------------------------------------------------------------
// Key benefit cards for agencies. Each highlights a capability that
// makes ZernFlow suitable for multi-client agency workflows.
// -----------------------------------------------------------------
const agencyBenefits = [
  {
    icon: LayoutGrid,
    title: "Multi-workspace",
    description:
      "Separate workspace per client with clean data isolation. Each client gets their own contacts, flows, and analytics.",
  },
  {
    icon: Copy,
    title: "Flow templates",
    description:
      "Build a flow once, clone it across clients. Export and import flows as portable .zernflow.json files for instant setup.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Invite team members with role-based access. Account managers handle their clients, admins see everything.",
  },
  {
    icon: Webhook,
    title: "API & webhooks",
    description:
      "Connect to your existing tools and CRMs. Full REST API with key authentication, plus real-time webhook notifications.",
  },
];

// -----------------------------------------------------------------
// Agency workflow steps. Represents the onboarding process for
// adding a new client to the ZernFlow platform.
// -----------------------------------------------------------------
const workflowSteps = [
  {
    step: "1",
    icon: Building2,
    title: "Create a workspace for each client",
    description:
      "One workspace per brand. Clean separation of contacts, flows, conversations, and analytics. No cross-contamination.",
  },
  {
    step: "2",
    icon: Link2,
    title: "Connect their social accounts",
    description:
      "Link Instagram, Facebook, Telegram, X, Bluesky, and Reddit. OAuth setup takes a few clicks per account.",
  },
  {
    step: "3",
    icon: GitBranch,
    title: "Build or import automation flows",
    description:
      "Use the visual flow builder or import pre-built templates. Clone your best-performing flows from other clients.",
  },
  {
    step: "4",
    icon: Eye,
    title: "Invite client for visibility",
    description:
      "Give clients read-only access to their workspace. They see analytics and conversations without touching your automations.",
  },
];

// -----------------------------------------------------------------
// Cost comparison data for the savings calculator section.
// Based on ManyChat Pro pricing at 10,000 contacts per client.
// -----------------------------------------------------------------
const costComparison = {
  manychatPerClient: 145,
  numberOfClients: 10,
  monthsPerYear: 12,
};

export default function AgenciesPage() {
  // Calculate savings for the comparison section
  const manychatMonthly =
    costComparison.manychatPerClient * costComparison.numberOfClients;
  const manychatYearly = manychatMonthly * costComparison.monthsPerYear;

  return (
    <MarketingLayout>
      {/* ============================================================
          HERO SECTION
          Targets agency decision-makers. Lead with the multi-client
          management angle that differentiates from solo creator tools.
          ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Audience badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Built for agencies</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            One Platform for{" "}
            <span className="text-indigo-600">All Your Clients</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Manage multiple brands from one dashboard. Separate workspaces,
            reusable flow templates, team access controls, and full API
            integration. Free and open source.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
            >
              Start your agency on ZernFlow
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              View source code
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Free forever. Unlimited clients and contacts. No per-seat pricing.
          </p>
        </div>
      </section>

      {/* ============================================================
          KEY BENEFITS GRID
          Four core capabilities that matter most to agencies:
          workspace isolation, templates, team access, and API.
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Built for multi-client workflows
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Everything your agency needs to deliver chat automation at scale.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {agencyBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                      <Icon className="h-4.5 w-4.5 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          COST COMPARISON SECTION
          "Scale without scaling costs" - the primary financial
          argument for agencies switching from ManyChat. Shows real
          numbers based on typical agency client counts.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
              <Calculator className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Do the math
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Scale without scaling costs
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ManyChat Pro charges per client. With {costComparison.numberOfClients}{" "}
              clients, the bill adds up fast.
            </p>
          </div>

          {/* Cost breakdown cards */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* ManyChat costs */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  ManyChat Pro
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">Per client (10K contacts)</span>
                    <span className="text-sm font-medium text-gray-400">
                      ~${costComparison.manychatPerClient}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">
                      {costComparison.numberOfClients} clients
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                      ${manychatMonthly.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Annual total</span>
                    <span className="text-lg font-bold text-gray-300">
                      ${manychatYearly.toLocaleString()}/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* ZernFlow costs */}
              <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/30 p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                  ZernFlow
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <span className="text-sm text-indigo-500">Per client</span>
                    <span className="text-sm font-medium text-indigo-600">$0/mo</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <span className="text-sm text-indigo-500">Unlimited clients</span>
                    <span className="text-sm font-medium text-indigo-600">$0/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-700">Annual total</span>
                    <span className="text-lg font-bold text-indigo-600">$0/yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings callout */}
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <p className="text-sm text-emerald-700">
                <span className="font-bold">
                  Save ${manychatYearly.toLocaleString()}+ per year
                </span>{" "}
                by switching to ZernFlow. Free for unlimited clients and
                contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          AGENCY WORKFLOW SECTION
          Step-by-step guide for how agencies onboard new clients.
          Positioned as a simple 4-step process to show ease of use.
          ============================================================ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How it works for agencies
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Onboard a new client in under 10 minutes.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-6">
            {workflowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex items-start gap-5 rounded-xl border border-gray-200 bg-white p-6"
                >
                  {/* Step number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-indigo-500" />
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY AGENCIES CHOOSE ZERNFLOW
          Additional selling points beyond pricing. Focuses on
          operational benefits: open source, self-hosting, no lock-in.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why agencies choose ZernFlow
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {[
              {
                icon: DollarSign,
                title: "No per-client pricing",
                description:
                  "Add unlimited clients without worrying about scaling costs. Your margins stay healthy as you grow.",
              },
              {
                icon: CheckCircle,
                title: "White label ready",
                description:
                  "Self-host ZernFlow on your own domain. Your clients see your brand, not ours.",
              },
              {
                icon: Copy,
                title: "Reusable templates",
                description:
                  "Build automation flows once and deploy them across every client. Stop rebuilding the same thing.",
              },
              {
                icon: Webhook,
                title: "Full API access",
                description:
                  "Integrate with your project management, CRM, and reporting tools. Automate your agency workflows too.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM CTA SECTION
          Final conversion push for agency decision-makers.
          ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Start your agency on ZernFlow
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Unlimited clients, unlimited contacts, zero monthly fees. Set up
                your first client workspace in minutes and start delivering chat
                automation at scale.
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
