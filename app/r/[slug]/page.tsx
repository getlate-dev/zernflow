import { createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

/**
 * Public ref link landing page.
 *
 * When someone scans a QR code or clicks a ref URL:
 * 1. Looks up the ref_link by slug (no auth required, uses service client)
 * 2. Increments the click counter via an RPC call
 * 3. Redirects to the platform's DM URL if a channel is associated
 * 4. Falls back to a simple landing page if no DM URL can be determined
 */
export default async function RefLinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  const { data: link } = await supabase
    .from("ref_links")
    .select("id, flow_id, channel_id, is_active, channels(platform, username)")
    .eq("slug", slug)
    .single();

  if (!link || !link.is_active) return notFound();

  // Track click via database RPC (increments ref_links.clicks atomically)
  await supabase.rpc("increment_ref_link_clicks", { link_id: link.id });

  // If we have a channel, redirect to the platform's DM URL
  const channel = link.channels as {
    platform: string;
    username: string | null;
  } | null;
  if (channel?.username) {
    const dmUrls: Record<string, string> = {
      instagram: `https://ig.me/m/${channel.username}`,
      facebook: `https://m.me/${channel.username}`,
      twitter: `https://twitter.com/messages/compose?recipient_id=${channel.username}`,
      telegram: `https://t.me/${channel.username}`,
    };
    const dmUrl = dmUrls[channel.platform];
    if (dmUrl) redirect(dmUrl);
  }

  // Fallback: show a simple landing page when no platform DM URL is available
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Start a conversation
        </h1>
        <p className="mt-2 text-gray-600">
          This link is ready to connect you.
        </p>
      </div>
    </div>
  );
}
