import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/invite/"],
      },
    ],
    sitemap: "https://zernflow.com/sitemap.xml",
  };
}
