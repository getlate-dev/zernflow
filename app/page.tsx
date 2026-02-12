import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">FlowChat</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Open-source chatbot builder for social media
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
