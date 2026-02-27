import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Shield,
  Lock,
  Eye,
  Server,
  Key,
  RefreshCw,
  Globe,
  Database,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

/**
 * SEO metadata for the Security page.
 * Important for enterprise trust and compliance inquiries.
 */
export const metadata: Metadata = {
  title: "Security - ZernFlow",
  description:
    "Learn how ZernFlow protects your data with open source transparency, encryption, data isolation, and self-hosting options.",
  openGraph: {
    title: "Security - ZernFlow",
    description:
      "Learn how ZernFlow protects your data with open source transparency, encryption, data isolation, and self-hosting options.",
    url: "https://zernflow.com/security",
  },
};

/**
 * Security page - /security
 *
 * Builds enterprise trust by documenting ZernFlow's security practices,
 * infrastructure choices, and responsible disclosure process.
 *
 * Sections:
 *   1. Hero (headline + subtitle)
 *   2. Key security practices (6-card grid with icons)
 *   3. Infrastructure overview
 *   4. Responsible disclosure
 *   5. CTA (read the source code)
 */
export default function SecurityPage() {
  return (
    <MarketingLayout>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">
              Security first
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Security at{" "}
            <span className="text-indigo-600">ZernFlow</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            How we protect your data and your customers&apos; data. Open source
            means you can verify every claim yourself.
          </p>
        </div>
      </section>

      {/* ── Key security practices ── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Security practices
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Built with security as a core principle, not an afterthought.
            </p>
          </div>

          {/* 6-card grid */}
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_PRACTICES.map((practice) => {
              const Icon = practice.icon;
              return (
                <div
                  key={practice.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {practice.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {practice.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Infrastructure ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Infrastructure
            </h2>
            <p className="mt-3 text-base text-gray-500">
              ZernFlow&apos;s hosted version runs on trusted, enterprise-grade
              infrastructure.
            </p>
          </div>

          {/* Infrastructure points */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
            {INFRASTRUCTURE_ITEMS.map((item) => {
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
        </div>
      </section>

      {/* ── Responsible disclosure ── */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Responsible disclosure
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            Found a vulnerability? We take security reports seriously and will
            respond within 48 hours.
          </p>
          <p className="mt-3 text-base text-gray-500">
            Email us at{" "}
            <a
              href="mailto:security@zernflow.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              security@zernflow.com
            </a>{" "}
            with details about the issue. Please include steps to reproduce and
            any relevant logs or screenshots.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            We ask that you give us reasonable time to investigate and fix the
            issue before disclosing it publicly.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Read the source code
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Don&apos;t take our word for it. ZernFlow is fully open source.
                Audit every line, verify every claim, and run it on your own
                infrastructure.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="https://github.com/getlate-dev/zernflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-400 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Get started free
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
 * Extracted outside the component to keep the JSX clean and avoid
 * re-creating objects on every render.
 * ────────────────────────────────────────────────────────────────────────── */

/** Security practice cards for the main grid */
const SECURITY_PRACTICES = [
  {
    icon: Eye,
    title: "Open source transparency",
    desc: "Every line of code is publicly auditable on GitHub. No hidden backdoors, no obfuscated logic. You can verify exactly how your data is handled.",
  },
  {
    icon: Shield,
    title: "Data isolation",
    desc: "Each workspace is fully isolated. Row-level security policies ensure users can only access their own data. No cross-tenant data leakage.",
  },
  {
    icon: Lock,
    title: "Encryption",
    desc: "All data is encrypted in transit (TLS 1.3) and at rest. API keys are stored as SHA-256 hashes, never in plaintext.",
  },
  {
    icon: Key,
    title: "Authentication",
    desc: "Powered by Supabase Auth with support for email/password and OAuth (GitHub). Session tokens are httpOnly and secure.",
  },
  {
    icon: Server,
    title: "Self-hosting option",
    desc: "Don't trust any cloud? Self-host ZernFlow on your own infrastructure. You control the servers, the database, and the network.",
  },
  {
    icon: RefreshCw,
    title: "Webhook signing",
    desc: "All outbound webhooks are signed with HMAC-SHA256 so you can verify they came from ZernFlow. No spoofing, no tampering.",
  },
];

/** Infrastructure overview items */
const INFRASTRUCTURE_ITEMS = [
  {
    icon: Globe,
    title: "Vercel edge network",
    desc: "Hosted on Vercel with automatic scaling, DDoS protection, and a global CDN for fast response times.",
  },
  {
    icon: Database,
    title: "Supabase (PostgreSQL)",
    desc: "Database powered by Supabase with row-level security, automated backups, and encryption at rest.",
  },
  {
    icon: ShieldCheck,
    title: "No third-party tracking",
    desc: "No third-party analytics or tracking scripts on the platform. Your usage data stays between you and ZernFlow.",
  },
];
