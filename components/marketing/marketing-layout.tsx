import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

/**
 * MarketingLayout - Shared wrapper for all marketing/public pages.
 *
 * Provides a consistent sticky navigation bar and an expanded multi-column
 * footer across the homepage, pricing page, product pages, and other
 * public-facing routes.
 *
 * Usage:
 *   <MarketingLayout>
 *     <section>...page content...</section>
 *   </MarketingLayout>
 *
 * @param children - The page content rendered between the nav and footer.
 */
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky navigation bar ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="ZernFlow"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-base font-bold text-gray-900">ZernFlow</span>
          </Link>

          {/* Right side links */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900 sm:inline-flex"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      {children}

      {/* ── Expanded footer ── */}
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Footer columns configuration.
 * Each column has a heading and a list of links. External links include
 * `external: true` so they open in a new tab with proper rel attributes.
 * ────────────────────────────────────────────────────────────────────────── */

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Instagram", href: "/product/instagram" },
      { label: "Facebook", href: "/product/facebook" },
      { label: "Telegram", href: "/product/telegram" },
      { label: "X / Twitter", href: "/product/x" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Use Cases",
    links: [
      { label: "Creators", href: "/creators" },
      { label: "Agencies", href: "/agencies" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Integrations", href: "/integrations" },
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      {
        label: "GitHub",
        href: "https://github.com/getlate-dev/zernflow",
        external: true,
      },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/tos" },
    ],
  },
];

/**
 * Footer - Expanded multi-column footer for all marketing pages.
 *
 * Structure:
 *   - Top section: Logo + description on the left, 4 link columns on the right
 *   - Bottom bar: Copyright notice + MIT license badge
 */
function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/60">
      {/* Top section with logo and link columns */}
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column (takes 2 cols on lg) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="ZernFlow"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <span className="text-sm font-bold text-gray-900">ZernFlow</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              The open source ManyChat alternative. Automate DMs, comments, and
              flows across 6 platforms.
            </p>
            {/* GitHub link with icon */}
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </Link>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                {column.heading}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar with copyright and license */}
      <div className="border-t border-gray-200/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ZernFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://getlate.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Powered by Late
            </Link>
            <span className="text-xs text-gray-300">|</span>
            <p className="text-xs text-gray-400">Open source, MIT licensed</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
