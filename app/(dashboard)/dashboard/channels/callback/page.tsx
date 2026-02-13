"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ChannelCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"syncing" | "success" | "error">("syncing");
  const [message, setMessage] = useState("Syncing your new channel...");

  useEffect(() => {
    async function syncAndRedirect() {
      const connected = searchParams.get("connected");

      if (!connected) {
        setStatus("error");
        setMessage("Connection was cancelled or failed.");
        setTimeout(() => router.push("/dashboard/channels"), 2000);
        return;
      }

      try {
        const res = await fetch("/api/v1/channels/sync", { method: "POST" });
        const data = await res.json();

        if (!res.ok || data.error) {
          setStatus("error");
          setMessage(data.error || "Failed to sync channels.");
          setTimeout(() => router.push("/dashboard/channels"), 2000);
          return;
        }

        const { created } = data.synced;
        setStatus("success");
        setMessage(
          created > 0
            ? `${connected} account connected successfully!`
            : "Account connected! Channel is already synced."
        );
        setTimeout(() => router.push("/dashboard/channels"), 1500);
      } catch {
        setStatus("error");
        setMessage("Failed to sync. You can try syncing manually.");
        setTimeout(() => router.push("/dashboard/channels"), 2000);
      }
    }

    syncAndRedirect();
  }, [router, searchParams]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === "syncing" && (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
        {status === "success" && (
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        )}
        {status === "error" && (
          <XCircle className="h-8 w-8 text-red-500" />
        )}
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">Redirecting to channels...</p>
      </div>
    </div>
  );
}
