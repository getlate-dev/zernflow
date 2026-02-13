import {
  SiX,
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiPinterest,
  SiReddit,
  SiBluesky,
  SiThreads,
  SiTelegram,
  SiSnapchat,
  SiGoogle,
} from "@icons-pack/react-simple-icons";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// LinkedIn removed from Simple Icons (trademark). Google Business uses SiGoogle.
// Keep hand-coded SVG for LinkedIn only.
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number; color?: string }>> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  twitter: SiX,
  telegram: SiTelegram,
  bluesky: SiBluesky,
  reddit: SiReddit,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  linkedin: LinkedInIcon as unknown as typeof SiFacebook,
  threads: SiThreads,
  pinterest: SiPinterest,
  snapchat: SiSnapchat,
  googlebusiness: SiGoogle,
};

// Brand colors for platforms. Platforms not listed here use text-foreground.
const platformColors: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  telegram: "#26A5E4",
  bluesky: "#0085FF",
  reddit: "#FF4500",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  pinterest: "#BD081C",
  snapchat: "#FFFC00",
  googlebusiness: "#4285F4",
};

export function PlatformIcon({
  platform,
  className,
  size = 16,
}: {
  platform: string;
  className?: string;
  size?: number;
}) {
  const Icon = platformIcons[platform];

  if (!Icon) {
    return <MessageSquare className={cn("text-muted-foreground", className)} style={{ width: size, height: size }} />;
  }

  const brandColor = platformColors[platform];

  return (
    <Icon
      className={cn(!brandColor && "text-foreground", className)}
      size={size}
      {...(brandColor ? { color: brandColor } : {})}
    />
  );
}
