import Image from "next/image";
import Link from "next/link";
import {
  GitBranch,
  MessageSquare,
  Users,
  Radio,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Github,
  Zap,
  ExternalLink,
  Star,
  Send,
  Filter,
  Clock,
  Tag,
  Trash2,
  PenLine,
  Globe,
  Shuffle,
  UserCheck,
  UserMinus,
  Webhook,
  CornerDownRight,
  Lock,
  Reply,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Visual Flow Builder",
    description:
      "Design complex chatbot flows with a drag-and-drop canvas. 15+ node types, conditional logic, and branching paths with no code required.",
  },
  {
    icon: MessageSquare,
    title: "Live Chat Inbox",
    description:
      "Unified inbox across all platforms with real-time updates. Seamlessly take over from bots when human touch is needed.",
  },
  {
    icon: Users,
    title: "Contact CRM",
    description:
      "Track every conversation. Organize contacts with tags, custom fields, and smart segments to deliver personalized experiences.",
  },
  {
    icon: Radio,
    title: "Broadcasting",
    description:
      "Send targeted messages to contact segments across platforms. Schedule broadcasts or send them instantly to your audience.",
  },
  {
    icon: MessageCircle,
    title: "Comment-to-DM",
    description:
      "Automatically respond to post comments with direct messages. Set keyword triggers to capture leads from organic content.",
  },
  {
    icon: BarChart3,
    title: "A/B Testing",
    description:
      "Split test message paths to optimize conversions. Measure what resonates with your audience and iterate based on real data.",
  },
];

const nodeTypes = [
  { icon: Zap, name: "Trigger" },
  { icon: Send, name: "Send Message" },
  { icon: Filter, name: "Condition" },
  { icon: Clock, name: "Delay" },
  { icon: Tag, name: "Add Tag" },
  { icon: Trash2, name: "Remove Tag" },
  { icon: PenLine, name: "Set Custom Field" },
  { icon: Globe, name: "HTTP Request" },
  { icon: CornerDownRight, name: "Go To Flow" },
  { icon: UserCheck, name: "Human Takeover" },
  { icon: UserMinus, name: "Unsubscribe" },
  { icon: Shuffle, name: "A/B Split" },
  { icon: Clock, name: "Smart Delay" },
  { icon: Reply, name: "Comment Reply" },
  { icon: Lock, name: "Private Reply" },
  { icon: Webhook, name: "Webhook" },
];

const platforms = [
  { name: "Instagram", color: "from-purple-500 to-pink-500" },
  { name: "Facebook", color: "from-blue-600 to-blue-500" },
  { name: "Telegram", color: "from-sky-400 to-sky-500" },
  { name: "Twitter / X", color: "from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300" },
  { name: "Bluesky", color: "from-blue-400 to-blue-500" },
  { name: "Reddit", color: "from-orange-500 to-orange-600" },
];

const steps = [
  {
    number: "01",
    title: "Connect your accounts",
    description:
      "Link your Instagram, Facebook, Telegram, Twitter/X, Bluesky, or Reddit accounts in seconds through the Late API. Secure OAuth authentication with no passwords stored.",
  },
  {
    number: "02",
    title: "Build your flows",
    description:
      "Use the visual drag-and-drop builder to create conversation flows. Choose from 15+ node types, set conditions, add delays, and design branching logic.",
  },
  {
    number: "03",
    title: "Engage automatically",
    description:
      "Your flows trigger on keywords, comments, and DMs across all connected platforms. Monitor performance in real time and take over conversations when needed.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ─── Sticky Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ZernFlow"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ZernFlow
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/getlate-dev/zernflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:flex dark:text-gray-400 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-gray-950 dark:to-gray-950" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              <Star className="h-3.5 w-3.5" />
              Open source, MIT licensed
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Automate conversations across{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                every social platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-400">
              The open-source ManyChat alternative. Build visual chatbot flows,
              manage live conversations, and automate engagement across
              Instagram, Facebook, Telegram, X, Bluesky, and Reddit.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/getlate-dev/zernflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </div>
          </div>

          {/* Flow builder mockup */}
          <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400">
                  ZernFlow / My First Flow
                </span>
              </div>
              {/* Canvas area with styled nodes */}
              <div className="relative flex min-h-[320px] items-center justify-center gap-6 overflow-hidden p-8 sm:min-h-[380px] sm:gap-8 sm:p-12">
                {/* Grid pattern background */}
                <div
                  className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #6366f1 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Trigger node */}
                <div className="relative z-10 w-36 rounded-xl border-2 border-indigo-200 bg-white p-4 shadow-md sm:w-44 dark:border-indigo-800 dark:bg-gray-800">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900">
                      <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Trigger
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                    Keyword: &quot;pricing&quot;
                  </p>
                </div>

                {/* Connection line */}
                <div className="z-10 hidden h-0.5 w-8 bg-gradient-to-r from-indigo-300 to-violet-300 sm:block dark:from-indigo-700 dark:to-violet-700" />

                {/* Condition node */}
                <div className="relative z-10 hidden w-44 rounded-xl border-2 border-amber-200 bg-white p-4 shadow-md sm:block dark:border-amber-800 dark:bg-gray-800">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900">
                      <Filter className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Condition
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                    Has tag: &quot;VIP&quot;
                  </p>
                </div>

                {/* Connection line */}
                <div className="z-10 hidden h-0.5 w-8 bg-gradient-to-r from-violet-300 to-emerald-300 sm:block dark:from-violet-700 dark:to-emerald-700" />

                {/* Send message node */}
                <div className="relative z-10 w-36 rounded-xl border-2 border-emerald-200 bg-white p-4 shadow-md sm:w-44 dark:border-emerald-800 dark:bg-gray-800">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900">
                      <Send className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      Send Message
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                    &quot;Here are our plans...&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Logos Bar ─── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-12 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Works with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${platform.color}`}
                />
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Everything you need to automate social conversations
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From building flows to managing contacts, ZernFlow gives you
              full control over your social media automation.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-7 transition-all hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-600/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-900 dark:hover:shadow-indigo-400/5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950 dark:group-hover:bg-indigo-900">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-20 sm:py-28 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Three steps to automate your social media conversations.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4 text-5xl font-extrabold text-indigo-100 dark:text-indigo-900/50">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Open Source ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-10 sm:p-16 dark:from-gray-800 dark:to-gray-900">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
              <div className="flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Built in the open
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-300">
                  ZernFlow is fully open source under the MIT license. Self-host
                  it on your own infrastructure, fork it, customize it, or
                  contribute back to the community. No vendor lock-in, no hidden
                  costs, no surprises.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="https://github.com/getlate-dev/zernflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    <Github className="h-4 w-4" />
                    Star on GitHub
                  </Link>
                  <Link
                    href="https://github.com/getlate-dev/zernflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                  >
                    Read the source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-700/50">
                  <Github className="h-10 w-10 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Star className="h-4 w-4 text-yellow-400" />
                  MIT License
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Node Types Showcase ─── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-20 sm:py-28 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              15+ node types at your fingertips
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Every building block you need to create sophisticated automation
              flows, from simple message responses to complex branching logic.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {nodeTypes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div
                  key={`${node.name}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 transition-all hover:border-indigo-200 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-800"
                >
                  <Icon className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
                  <span className="truncate">{node.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Ready to automate your conversations?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Get started for free. No credit card required. Deploy in minutes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/getlate-dev/zernflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ZernFlow"
                width={24}
                height={24}
                className="rounded-md"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ZernFlow
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Open source chatbot builder
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/getlate-dev/zernflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                GitHub
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Docs
              </Link>
              <Link
                href="https://getlate.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Late API
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              &copy; 2025 Late Inc. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Powered by{" "}
              <Link
                href="https://getlate.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              >
                Late
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
