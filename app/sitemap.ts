import type { MetadataRoute } from "next";

/**
 * Sitemap generator for all public-facing marketing pages.
 *
 * Priorities are assigned based on SEO importance:
 *   - 1.0:  Homepage (canonical URL)
 *   - 0.9:  Pricing + top product pages (high-value SEO targets)
 *   - 0.8:  Secondary product pages, use cases, registration
 *   - 0.7:  Integrations (medium value)
 *   - 0.5:  About, security, login (lower priority)
 *   - 0.3:  Legal pages (rarely searched)
 *
 * Change frequencies reflect how often content is expected to change:
 *   - weekly:  Pages updated with new features, comparisons, etc.
 *   - monthly: Mostly static pages (about, legal, etc.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zernflow.com";

  return [
    // ── Core pages ──
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ── Product pages (per-platform) ──
    {
      url: `${baseUrl}/product/instagram`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/product/facebook`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/product/telegram`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/product/x`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // ── Use case pages ──
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // ── Resources ──
    {
      url: `${baseUrl}/integrations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // ── Legal ──
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/tos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },

    // ── Auth pages ──
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
