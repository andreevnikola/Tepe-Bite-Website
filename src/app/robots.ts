import { SITE_URL } from "@/lib/config/site-info";
import type { MetadataRoute } from "next";

/**
 * Allow public content; keep crawlers (and Cloudflare AI Search) out of admin,
 * the Sanity Studio, API routes, and the transactional cart/checkout/order
 * flows. Points at both sitemaps: `/sitemap.xml` (clean canonical URLs for
 * normal SEO) and `/ai-sitemap.xml` (explicit ?lang= variants for AI Search
 * retrieval).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/studio", "/api", "/cart", "/checkout", "/order"],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  };
}
