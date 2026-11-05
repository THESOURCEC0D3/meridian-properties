import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

/**
 * Served at /robots.txt. Points crawlers at the sitemap and keeps Next's
 * internal asset routes out of the index — they waste crawl budget and can
 * surface as junk results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/_next/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
