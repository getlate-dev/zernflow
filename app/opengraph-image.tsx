import { ImageResponse } from "next/og";

/**
 * OG Image route handler.
 *
 * Generates a 1200x630 Open Graph image for social media sharing.
 * Uses Next.js built-in `ImageResponse` from `next/og` (no external deps).
 *
 * The image features:
 *   - White background with a subtle indigo gradient accent
 *   - ZernFlow branding (bold logo text)
 *   - "The Open Source ManyChat Alternative" subtitle
 *   - "Free. Self-hostable. 6 platforms." tagline
 *   - Indigo-600 accent color matching the brand
 *
 * This file is automatically picked up by Next.js as the default OG image
 * for the root route and any child routes that don't define their own.
 */

export const runtime = "edge";

/** Standard Open Graph image dimensions */
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(to right, #4f46e5, #818cf8)",
          }}
        />

        {/* Subtle background pattern (decorative circles) */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79, 70, 229, 0.04) 0%, transparent 70%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Logo text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Logo icon placeholder (indigo square with Z) */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              Z
            </div>
            <span
              style={{
                fontSize: "56px",
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-1px",
              }}
            >
              ZernFlow
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#4f46e5",
              margin: 0,
              textAlign: "center",
            }}
          >
            The Open Source ManyChat Alternative
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: "22px",
              color: "#6b7280",
              margin: 0,
              textAlign: "center",
            }}
          >
            Free. Self-hostable. 6 platforms.
          </p>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "#9ca3af",
            }}
          >
            zernflow.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
