import Image from "next/image";
import Link from "next/link";
import {
  Github,
  ArrowRight,
  GitBranch,
  MessageSquare,
  Users,
  Radio,
  MessageCircle,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ZernFlow" width={28} height={28} className="rounded-lg" />
            <span className="text-base font-bold text-gray-900 dark:text-white">ZernFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900 sm:flex dark:text-gray-400 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              Open source
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">MIT license</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            ManyChat, but you own it.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
            Visual chatbot builder for Instagram, Facebook, Telegram, X, Bluesky, and Reddit.
            Self-host it, fork it, ship it. No $15/mo per account, no feature gates, no vendor lock-in.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Try it now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-900"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </Link>
          </div>
        </div>

        {/* Terminal */}
        <div className="mt-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-950 shadow-xl dark:border-gray-800">
          <div className="flex items-center gap-1.5 border-b border-gray-800 px-4 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
            <span className="ml-2 text-[11px] text-gray-500">terminal</span>
          </div>
          <div className="p-5 font-mono text-sm leading-relaxed">
            <p className="text-gray-400">
              <span className="text-emerald-400">$</span> git clone https://github.com/getlate-dev/zernflow.git
            </p>
            <p className="text-gray-400">
              <span className="text-emerald-400">$</span> cd zernflow && npm install
            </p>
            <p className="text-gray-400">
              <span className="text-emerald-400">$</span> cp .env.example .env{" "}
              <span className="text-gray-600"># add your Supabase + Late API keys</span>
            </p>
            <p className="text-gray-400">
              <span className="text-emerald-400">$</span> npm run dev
            </p>
            <p className="mt-2 text-gray-500">
              Ready on http://localhost:3000
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-gray-100 bg-gray-50/80 py-20 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            What you get
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-gray-800 dark:bg-gray-800">
            {[
              {
                icon: GitBranch,
                title: "Flow builder",
                desc: "Drag-and-drop canvas with 15+ node types. Triggers, conditions, delays, HTTP calls, A/B splits. Connect them however you want.",
              },
              {
                icon: MessageSquare,
                title: "Live inbox",
                desc: "Real-time conversations across all platforms. Jump in when the bot needs help, hand back when you're done.",
              },
              {
                icon: Users,
                title: "Contact CRM",
                desc: "Tags, custom fields, segments. Know who you're talking to and filter your audience for broadcasts.",
              },
              {
                icon: Radio,
                title: "Broadcasts",
                desc: "Send messages to a segment of contacts across any platform. Schedule them or fire immediately.",
              },
              {
                icon: MessageCircle,
                title: "Comment-to-DM",
                desc: "Someone comments a keyword on your post? Auto-send them a DM. Works on Instagram and Facebook.",
              },
              {
                icon: Zap,
                title: "Webhooks",
                desc: "Hit external APIs from your flows. Pull data in, push data out. Your flows are as powerful as your imagination.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white p-6 dark:bg-gray-950"
                >
                  <Icon className="mb-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why not ManyChat */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Why not just use ManyChat?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                ManyChat is great if you only need Instagram and Facebook. But it starts at
                $15/mo per account, locks advanced features behind higher tiers, and you
                can't self-host or extend it.
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                ZernFlow gives you the same core features across 6 platforms, runs on your
                own infrastructure (or ours), and you can modify every line of code. The
                entire thing is MIT licensed.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "6 platforms", detail: "Instagram, Facebook, Telegram, X, Bluesky, Reddit" },
                { label: "Self-hostable", detail: "Deploy on Vercel, your VPS, or anywhere Node.js runs" },
                { label: "No per-account pricing", detail: "Connect as many accounts as you want" },
                { label: "Fully extensible", detail: "Add custom nodes, integrations, or logic. It's your code." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 px-5 py-4 dark:border-gray-800"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-gray-100 bg-gray-50/80 py-16 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Built with
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Next.js 16",
              "React 19",
              "Supabase",
              "React Flow",
              "Tailwind CSS",
              "TypeScript",
              "Late API",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-gray-900 p-10 sm:p-14 dark:bg-gray-800">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Stop paying for chatbot automation.
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Clone the repo, connect your accounts, build your first flow.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Sign up
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="https://github.com/getlate-dev/zernflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              ZernFlow
            </span>
            <span className="text-sm text-gray-300 dark:text-gray-700">|</span>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              GitHub
            </Link>
            <Link
              href="https://getlate.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Late API
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            MIT License. Built by{" "}
            <Link
              href="https://getlate.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-400"
            >
              Late
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
