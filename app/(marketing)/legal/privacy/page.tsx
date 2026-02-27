import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

/**
 * SEO metadata for the Privacy Policy page.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ZernFlow's privacy policy. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - ZernFlow",
    description:
      "ZernFlow's privacy policy. Learn how we collect, use, and protect your personal information.",
    url: "https://zernflow.com/legal/privacy",
  },
};

/**
 * Privacy Policy page - /legal/privacy
 *
 * A comprehensive privacy policy for ZernFlow's hosted service.
 * Uses prose-style typography (max-w-3xl, relaxed leading) for readability.
 *
 * Sections follow standard privacy policy structure:
 *   1. Introduction
 *   2. Information We Collect
 *   3. How We Use Information
 *   4. Data Storage & Security
 *   5. Third-Party Services
 *   6. Your Rights
 *   7. Data Retention
 *   8. Self-Hosted Instances
 *   9. Changes to This Policy
 *  10. Contact
 */
export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-16 sm:pt-20">
        {/* ── Page header ── */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Last updated: February 2026
          </p>
        </header>

        {/* ── Policy content ──
         * Each section uses h2 for main headings and h3 for subsections.
         * Prose styling: text-base, leading-relaxed, gray-600 body text,
         * with gray-900 headings for clear visual hierarchy.
         */}
        <div className="space-y-10 text-base leading-relaxed text-gray-600">
          {/* 1. Introduction */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Introduction
            </h2>
            <p>
              ZernFlow (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates
              the website at{" "}
              <Link
                href="https://zernflow.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                zernflow.com
              </Link>{" "}
              and the ZernFlow platform. This Privacy Policy describes how we
              collect, use, store, and share information when you use our
              services.
            </p>
            <p className="mt-3">
              By using ZernFlow, you agree to the collection and use of
              information as described in this policy. If you do not agree, please
              do not use the service.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Information We Collect
            </h2>

            <h3 className="mb-2 mt-6 text-base font-semibold text-gray-800">
              Account information
            </h3>
            <p>
              When you register for ZernFlow, we collect your email address and
              name. If you sign up via OAuth (e.g., GitHub), we receive basic
              profile information from that provider.
            </p>

            <h3 className="mb-2 mt-6 text-base font-semibold text-gray-800">
              Social media account tokens
            </h3>
            <p>
              To connect your social media platforms, we store OAuth access tokens
              and refresh tokens. These tokens allow ZernFlow to interact with
              platforms (Instagram, Facebook, Telegram, X, Bluesky, Reddit) on
              your behalf. All tokens are stored encrypted.
            </p>

            <h3 className="mb-2 mt-6 text-base font-semibold text-gray-800">
              Usage data
            </h3>
            <p>
              We collect basic usage data such as pages visited, features used,
              and interactions with the platform. This helps us understand how
              people use ZernFlow and where to focus improvements.
            </p>

            <h3 className="mb-2 mt-6 text-base font-semibold text-gray-800">
              Contact data
            </h3>
            <p>
              If you import contacts into the ZernFlow platform (e.g., people who
              message your social media accounts), that data is stored in your
              workspace. You are the data controller for any contact data you
              import.
            </p>
          </section>

          {/* 3. How We Use Information */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              How We Use Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide, maintain, and improve the ZernFlow service</li>
              <li>Authenticate you and manage your account</li>
              <li>
                Connect to social media platforms on your behalf using stored
                tokens
              </li>
              <li>
                Send service-related communications (e.g., security alerts,
                account notifications)
              </li>
              <li>Monitor and prevent abuse, fraud, and security threats</li>
              <li>
                Respond to your support requests and provide customer service
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties. We do not
              use your data for advertising purposes.
            </p>
          </section>

          {/* 4. Data Storage & Security */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored on Supabase infrastructure, which uses
              PostgreSQL databases hosted in the United States. All data is
              encrypted in transit using TLS 1.3 and encrypted at rest.
            </p>
            <p className="mt-3">
              We implement row-level security (RLS) policies in the database to
              ensure that each workspace&apos;s data is fully isolated. API keys
              are stored as SHA-256 hashes, never in plaintext.
            </p>
            <p className="mt-3">
              While we take reasonable measures to protect your data, no method of
              electronic transmission or storage is 100% secure. We cannot
              guarantee absolute security.
            </p>
          </section>

          {/* 5. Third-Party Services */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Third-Party Services
            </h2>
            <p>ZernFlow uses the following third-party services:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Supabase</strong> - Database hosting, authentication, and
                file storage
              </li>
              <li>
                <strong>Vercel</strong> - Application hosting and edge network
                delivery
              </li>
              <li>
                <strong>Late API</strong> (getlate.dev) - Social media platform
                connectivity for sending and receiving messages
              </li>
              <li>
                <strong>AI providers</strong> (OpenAI, Anthropic, Google) - Only
                used if you configure AI features. You provide your own API key,
                and requests go directly to the provider. We do not store AI
                conversation logs.
              </li>
            </ul>
            <p className="mt-3">
              Each third-party service has its own privacy policy. We encourage
              you to review them.
            </p>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Access your data</strong> - Request a copy of the
                personal data we hold about you
              </li>
              <li>
                <strong>Export your data</strong> - Download your data through our
                GDPR export endpoint in your account settings
              </li>
              <li>
                <strong>Delete your account</strong> - Delete your account and all
                associated data at any time from your account settings
              </li>
              <li>
                <strong>Opt out</strong> - Opt out of non-essential
                communications at any time
              </li>
              <li>
                <strong>Rectification</strong> - Request correction of inaccurate
                personal data
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@zernflow.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                privacy@zernflow.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active and as
              needed to provide the service. If you delete your account, all
              associated data (including contacts, flows, conversation history,
              and stored tokens) will be permanently purged within 30 days.
            </p>
            <p className="mt-3">
              We may retain certain anonymized, aggregated data for analytics
              purposes, but this data cannot be used to identify you.
            </p>
          </section>

          {/* 8. Self-Hosted Instances */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Self-Hosted Instances
            </h2>
            <p>
              If you self-host ZernFlow on your own infrastructure, you are the
              data controller for all data stored in your instance. This Privacy
              Policy only applies to the hosted version at{" "}
              <Link
                href="https://zernflow.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                zernflow.com
              </Link>
              .
            </p>
            <p className="mt-3">
              Self-hosted instances do not send data to ZernFlow or Late unless
              you explicitly configure an integration that does so.
            </p>
          </section>

          {/* 9. Changes to This Policy */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or by posting a
              notice on the platform before the changes take effect.
            </p>
            <p className="mt-3">
              We encourage you to review this page periodically for the latest
              information about our privacy practices.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy or how we
              handle your data, contact us at:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Email:{" "}
                <a
                  href="mailto:privacy@zernflow.com"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  privacy@zernflow.com
                </a>
              </li>
              <li>
                General support:{" "}
                <a
                  href="mailto:support@zernflow.com"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  support@zernflow.com
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-gray-400">
              ZernFlow is operated by Late Technologies.
            </p>
          </section>
        </div>
      </article>
    </MarketingLayout>
  );
}
