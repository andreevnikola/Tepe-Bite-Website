import { SITE_URL } from "@/lib/config/site-info";
import type { MetadataRoute } from "next";

/**
 * Allow public content; keep crawlers (and Cloudflare AI Search) out of admin,
 * the Sanity Studio, API routes, and the transactional cart/checkout/order
 * flows. Points at the single sitemap, which carries the bg/en hreflang
 * alternates.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/studio", "/api", "/cart", "/checkout", "/order"],
    },
    sitemap: `${process.env.APP_BASE_URL}/sitemap.xml`,
    host: process.env.APP_BASE_URL,
  };
}
