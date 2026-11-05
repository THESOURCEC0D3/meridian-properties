import type { MetadataRoute } from "next";
import { properties } from "@/lib/data/properties";
import { areas } from "@/lib/data/areas";
import { siteUrl } from "@/lib/config/site";

/**
 * Next serves this at /sitemap.xml automatically — this is the file submitted
 * to Google Search Console on launch day. Without it, indexing depends entirely
 * on crawlers finding every page by following links.
 *
 * Built from the data rather than hand-listed, so a new property appears in the
 * sitemap the moment it is added. A hand-maintained sitemap is a sitemap that
 * silently goes stale.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/properties", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ].map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const propertyRoutes = properties.map((property) => ({
    url: `${siteUrl}/properties/${property.id}`,
    changeFrequency: "weekly" as const,
    // Featured listings get a higher priority — they are the inventory the
    // business most wants surfaced.
    priority: property.featured ? 0.8 : 0.7,
  }));

  /**
   * Filtered area views are now real, shareable URLs (see the URL-driven filter
   * work), which makes them worth declaring. These are the pages that match how
   * people actually search: "3 bedroom flat for rent GRA Port Harcourt".
   */
  const areaRoutes = areas.map((area) => ({
    url: `${siteUrl}/properties?area=${area.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...areaRoutes];
}
