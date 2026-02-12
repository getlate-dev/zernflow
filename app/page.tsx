import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  MessageSquare,
  Users,
  Radio,
  MessageCircle,
  Zap,
  CheckCircle,
  TrendingUp,
  Heart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ZernFlow" width={28} height={28} className="rounded-lg" />
            <span className="text-base font-bold text-gray-900">ZernFlow</span>
          </Link>
          <div className="flex items-center gap-2">
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Turn comments and DMs into{" "}
            <span className="text-indigo-600">customers</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Automate your Instagram, Facebook, Telegram, X, Bluesky, and Reddit
            conversations. Capture leads, close sales, and grow your audience on autopilot.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
            >
              Get started free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <p className="text-xs text-gray-400">No credit card required</p>
          </div>
        </div>

        {/* Flow builder preview */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
              <span className="ml-3 text-xs text-gray-400">Welcome Flow</span>
            </div>
            <div className="relative flex min-h-[300px] items-center justify-center gap-4 p-8 sm:gap-6 sm:p-12"
              style={{
                backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {/* Trigger */}
              <div className="w-40 rounded-xl border-2 border-indigo-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50">
                    <MessageCircle className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900">Comment trigger</span>
                </div>
                <p className="text-[10px] text-gray-500">Keyword: &quot;info&quot;</p>
              </div>

              <div className="hidden h-0.5 w-6 bg-gray-300 sm:block" />

              {/* Send DM */}
              <div className="hidden w-44 rounded-xl border-2 border-emerald-200 bg-white p-4 shadow-sm sm:block">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900">Send DM</span>
                </div>
                <p className="text-[10px] text-gray-500">&quot;Hey! Here&apos;s the link...&quot;</p>
              </div>

              <div className="hidden h-0.5 w-6 bg-gray-300 sm:block" />

              {/* Tag */}
              <div className="w-36 rounded-xl border-2 border-amber-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50">
                    <Users className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900">Tag as lead</span>
                </div>
                <p className="text-[10px] text-gray-500">Tag: &quot;interested&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["Instagram", "Facebook", "Telegram", "X / Twitter", "Bluesky", "Reddit"].map((p) => (
              <span key={p} className="text-sm font-medium text-gray-400">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need to grow on social
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Build automated conversations that capture leads, answer FAQs, and close sales across all your social accounts.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Comment-to-DM",
                desc: "Someone comments a keyword on your post? Instantly send them a DM with your link, offer, or lead magnet.",
              },
              {
                icon: GitBranch,
                title: "Visual flow builder",
                desc: "Build conversation flows by dragging and dropping. No code needed. Set up welcome messages, follow-ups, and sales funnels.",
              },
              {
                icon: MessageSquare,
                title: "Live chat inbox",
                desc: "See all your DMs in one place. Let the bot handle the easy stuff, jump in when a real conversation matters.",
              },
              {
                icon: Users,
                title: "Contact management",
                desc: "Tag your audience, track who they are, build segments. Send the right message to the right people.",
              },
              {
                icon: Radio,
                title: "Broadcasts",
                desc: "Send promotions, updates, or announcements to your audience. Target by tags, platform, or custom segments.",
              },
              {
                icon: Zap,
                title: "Integrations",
                desc: "Connect to your CRM, email tool, or any API. Push leads to Google Sheets, trigger Zapier workflows, and more.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white p-6">
                  <Icon className="mb-3 h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Up and running in 5 minutes
          </h2>
          <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-3">
            {[
              {
                step: "1",
                icon: CheckCircle,
                title: "Connect your accounts",
                desc: "Link your Instagram, Facebook, Telegram, or any other platform in a few clicks.",
              },
              {
                step: "2",
                icon: GitBranch,
                title: "Build a flow",
                desc: "Use the visual builder to create your automation. Pick a trigger, add messages, set conditions.",
              },
              {
                step: "3",
                icon: TrendingUp,
                title: "Watch it grow",
                desc: "Your flows run 24/7. Capture leads, answer questions, and sell while you sleep.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why ZernFlow */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                More platforms. No monthly fees.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Most chat automation tools only work with Instagram and Facebook,
                then charge you $15/mo or more per account. ZernFlow works across 6
                platforms and is completely free to use.
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Whether you're a creator, small business, or agency managing multiple
                accounts, you get the same powerful features without per-seat pricing.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "6 platforms in one place", detail: "Instagram, Facebook, Telegram, X, Bluesky, Reddit" },
                { label: "Free forever", detail: "No monthly fees. No per-account charges. No feature gates." },
                { label: "Unlimited accounts", detail: "Connect and manage as many social accounts as you need" },
                { label: "Open source", detail: "Fully transparent. Community-driven. MIT licensed." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-200 px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Built for creators, businesses, and agencies
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Creators",
                desc: "Auto-reply to comments, send lead magnets via DM, and grow your email list from social.",
              },
              {
                icon: TrendingUp,
                title: "Small businesses",
                desc: "Qualify leads through DM conversations, answer FAQs instantly, and book appointments on autopilot.",
              },
              {
                icon: Users,
                title: "Agencies",
                desc: "Manage all your clients' accounts in one workspace. Build flows once, reuse them across brands.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
                  <Icon className="mb-3 h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-indigo-600 p-10 sm:p-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to automate your social media?
              </h2>
              <p className="mt-3 text-sm text-indigo-100">
                Set up your first automation in minutes. Free forever, no credit card needed.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
              >
                Get started free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">ZernFlow</span>
            <span className="text-sm text-gray-300">|</span>
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              GitHub
            </Link>
            <Link
              href="https://getlate.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Late API
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            Open source, MIT licensed
          </p>
        </div>
      </footer>
    </div>
  );
}
