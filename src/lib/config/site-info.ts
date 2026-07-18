/**
 * Single source of truth for repeated, non-code site facts: legal/trader
 * identity, the public site URL, socials and contact emails. Backed by
 * site-info.json so non-developers can edit it without touching component
 * code. Import SITE_INFO (typed) or the small helpers below wherever this
 * data is needed instead of hardcoding it again.
 */
import raw from "./site-info.json";

export type SiteInfo = typeof raw;

export const SITE_INFO: SiteInfo = raw;

/** Builds a `mailto:` href, optionally with a subject/body (both auto-encoded). */
export function mailtoHref(
  email: string,
  opts?: { subject?: string; body?: string },
): string {
  const params = new URLSearchParams();
  if (opts?.subject) params.set("subject", opts.subject);
  if (opts?.body) params.set("body", opts.body);
  const query = params.toString();
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}

export const GENERAL_EMAIL = SITE_INFO.contact.generalEmail;
export const IMPACT_EMAIL = SITE_INFO.contact.impactEmail;
export const SITE_URL = SITE_INFO.website.url;
/** Contract manufacturer of the product (name + external website). */
export const MANUFACTURER = SITE_INFO.brand.manufacturer;
