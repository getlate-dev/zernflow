import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

/**
 * SEO metadata for the Terms of Service page.
 */
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "ZernFlow's terms of service. Read the terms that govern your use of the ZernFlow platform.",
  openGraph: {
    title: "Terms of Service - ZernFlow",
    description:
      "ZernFlow's terms of service. Read the terms that govern your use of the ZernFlow platform.",
    url: "https://zernflow.com/legal/tos",
  },
};

/**
 * Terms of Service page - /legal/tos
 *
 * Standard terms of service for ZernFlow's hosted platform.
 * Uses the same prose-style typography as the privacy policy
 * (max-w-3xl, relaxed leading) for readability.
 *
 * Sections:
 *   1.  Acceptance of Terms
 *   2.  Description of Service
 *   3.  Account Registration
 *   4.  Acceptable Use
 *   5.  Social Media Platform Compliance
 *   6.  Intellectual Property
 *   7.  Limitation of Liability
 *   8.  Service Availability
 *   9.  Termination
 *   10. Changes to Terms
 *   11. Governing Law
 *   12. Contact
 */
export default function TermsOfServicePage() {
  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-16 sm:pt-20">
        {/* ── Page header ── */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Last updated: February 2026
          </p>
        </header>

        {/* ── Terms content ──
         * Each section is numbered to match standard ToS formatting.
         * Prose styling: text-base, leading-relaxed, gray-600 body text,
         * with gray-900 headings for clear visual hierarchy.
         */}
        <div className="space-y-10 text-base leading-relaxed text-gray-600">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using ZernFlow at{" "}
              <Link
                href="https://zernflow.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                zernflow.com
              </Link>{" "}
              (&quot;the Service&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). If you do not agree to these Terms, do
              not use the Service.
            </p>
            <p className="mt-3">
              These Terms apply to all users, including visitors, registered
              users, and anyone who accesses the Service.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              2. Description of Service
            </h2>
            <p>
              ZernFlow is an open-source chat automation platform that allows you
              to automate conversations, manage DMs, and build flows across
              multiple social media platforms. We provide:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                A hosted version of the platform at{" "}
                <Link
                  href="https://zernflow.com"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  zernflow.com
                </Link>
              </li>
              <li>
                The source code, available under the MIT license on{" "}
                <Link
                  href="https://github.com/getlate-dev/zernflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  GitHub
                </Link>
              </li>
            </ul>
            <p className="mt-3">
              These Terms govern your use of the hosted version at zernflow.com.
              The open-source code is governed by the MIT license.
            </p>
          </section>

          {/* 3. Account Registration */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              3. Account Registration
            </h2>
            <p>
              To use certain features of the Service, you must create an account.
              When registering, you agree to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide accurate, current, and complete information</li>
              <li>
                Maintain the security of your account credentials (password, API
                keys, tokens)
              </li>
              <li>
                Notify us immediately if you suspect unauthorized access to your
                account
              </li>
              <li>
                Accept responsibility for all activity that occurs under your
                account
              </li>
            </ul>
            <p className="mt-3">
              You must be at least 18 years old (or the age of majority in your
              jurisdiction) to create an account.
            </p>
          </section>

          {/* 4. Acceptable Use */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              4. Acceptable Use
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Send spam, unsolicited messages, or bulk automated messages that
                violate applicable laws (e.g., CAN-SPAM, GDPR)
              </li>
              <li>
                Violate the terms of service of any connected social media
                platform (Instagram, Facebook, Telegram, X, Bluesky, Reddit)
              </li>
              <li>
                Use the Service for any illegal purpose, including fraud, phishing,
                or distributing malware
              </li>
              <li>
                Attempt to circumvent rate limits, security measures, or access
                controls
              </li>
              <li>
                Impersonate others or misrepresent your identity or affiliation
                with any person or organization
              </li>
              <li>
                Interfere with or disrupt the Service, servers, or networks
                connected to the Service
              </li>
              <li>
                Scrape, harvest, or collect information from other users without
                their consent
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate
              these rules, with or without notice.
            </p>
          </section>

          {/* 5. Social Media Platform Compliance */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              5. Social Media Platform Compliance
            </h2>
            <p>
              When you connect social media accounts to ZernFlow, you are
              responsible for complying with the terms of service of each platform.
              This includes (but is not limited to):
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Instagram and Facebook&apos;s Platform Terms and Community Guidelines</li>
              <li>Telegram&apos;s Terms of Service</li>
              <li>X (Twitter)&apos;s Terms of Service and Developer Agreement</li>
              <li>Bluesky&apos;s Community Guidelines</li>
              <li>Reddit&apos;s User Agreement and Content Policy</li>
            </ul>
            <p className="mt-3">
              ZernFlow is not responsible for account suspensions, bans, or
              restrictions imposed by social media platforms due to your use of
              the Service. You use the Service at your own risk.
            </p>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              6. Intellectual Property
            </h2>
            <p>
              The ZernFlow software is open source and released under the{" "}
              <Link
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                MIT License
              </Link>
              . You are free to use, modify, and distribute the source code in
              accordance with that license.
            </p>
            <p className="mt-3">
              Your content and data remain yours. ZernFlow does not claim
              ownership of the messages, flows, contacts, or other content you
              create or store using the Service. You grant us a limited license to
              store and transmit your content solely for the purpose of providing
              the Service.
            </p>
            <p className="mt-3">
              The ZernFlow name, logo, and branding are trademarks of Late
              Technologies. The MIT license does not grant rights to use these
              trademarks.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              7. Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, whether express or
              implied, including (but not limited to) implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p className="mt-3">
              To the fullest extent permitted by law, ZernFlow and its operators
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including (but not limited to):
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Lost messages or failed message delivery</li>
              <li>Failed automations or flow executions</li>
              <li>Social media account suspensions or restrictions</li>
              <li>Loss of data or revenue</li>
              <li>Service downtime or interruptions</li>
            </ul>
            <p className="mt-3">
              Our total liability for any claims arising from the Service shall
              not exceed the amount you paid us in the 12 months preceding the
              claim (or $100 USD if you have not paid anything).
            </p>
          </section>

          {/* 8. Service Availability */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              8. Service Availability
            </h2>
            <p>
              We aim for high availability but do not guarantee 100% uptime. The
              Service may be temporarily unavailable due to maintenance, updates,
              or circumstances beyond our control.
            </p>
            <p className="mt-3">
              If you self-host ZernFlow, availability and uptime are your
              responsibility. We do not provide support or SLAs for self-hosted
              instances.
            </p>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              9. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these Terms,
              engage in abusive behavior, or use the Service in ways that could
              harm other users or the platform.
            </p>
            <p className="mt-3">
              You may delete your account at any time from your account settings.
              Upon deletion, all your data will be permanently removed within 30
              days, as described in our{" "}
              <Link
                href="/legal/privacy"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-3">
              Sections that by their nature should survive termination (including
              Limitation of Liability, Intellectual Property, and Governing Law)
              will remain in effect after termination.
            </p>
          </section>

          {/* 10. Changes to Terms */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material
              changes, we will notify you by email or by posting a prominent
              notice on the Service at least 30 days before the changes take
              effect.
            </p>
            <p className="mt-3">
              Your continued use of the Service after the effective date of any
              changes constitutes your acceptance of the updated Terms. If you do
              not agree with the changes, you should stop using the Service and
              delete your account.
            </p>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              11. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the
              laws of the State of Delaware, United States, without regard to its
              conflict of law provisions.
            </p>
            <p className="mt-3">
              Any disputes arising from or relating to these Terms or the Service
              shall be resolved in the courts located in the State of Delaware.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              12. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Email:{" "}
                <a
                  href="mailto:legal@zernflow.com"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  legal@zernflow.com
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
