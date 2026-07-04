import { sanityClient } from "./client";
import type { Location, NewsPost } from "./types";

/**
 * Race a Sanity fetch against a timeout so an unreachable/slow CMS never hangs
 * a page render. Returns `fallback` on timeout or error.
 */
async function safeFetch<T>(promise: Promise<T>, fallback: T, ms = 8000): Promise<T> {
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("sanity fetch timeout")), ms),
      ),
    ]);
  } catch {
    return fallback;
  }
}

const locationFields = `
  _id,
  _createdAt,
  nameBg,
  nameEn,
  slug,
  image { asset, hotspot, alt },
  neighborhood,
  address,
  coordinates,
  descriptionBg,
  descriptionEn,
  links[] { _key, url, labelBg, labelEn, icon },
  partneringSince,
  isActive
`;

export async function getAllLocations(): Promise<Location[]> {
  return safeFetch(
    sanityClient.fetch<Location[]>(
      `*[_type == "location" && isActive == true] | order(partneringSince asc) {
      ${locationFields}
    }`,
    ),
    [],
  );
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  return safeFetch(
    sanityClient.fetch<Location | null>(
      `*[_type == "location" && slug.current == $slug && isActive == true][0] {
      ${locationFields}
    }`,
      { slug },
    ),
    null,
  );
}

export async function getAllLocationSlugs(): Promise<Array<{ slug: { current: string } }>> {
  return safeFetch(
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "location" && isActive == true] { slug }`,
    ),
    [],
  );
}

const newsListingFields = `
  _id,
  titleBg,
  titleEn,
  slug,
  publishedAt,
  image { asset, hotspot, altBg, altEn },
  excerptBg,
  excerptEn
`;

export async function getAllNewsPosts(): Promise<NewsPost[]> {
  return safeFetch(
    sanityClient.fetch<NewsPost[]>(
      `*[_type == "newsPost"] | order(publishedAt desc) {
      ${newsListingFields}
    }`,
    ),
    [],
  );
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  return safeFetch(
    sanityClient.fetch<NewsPost | null>(
      `*[_type == "newsPost" && slug.current == $slug][0] {
      ${newsListingFields},
      bodyBg,
      bodyEn
    }`,
      { slug },
    ),
    null,
  );
}

export async function getAllNewsSlugs(): Promise<Array<{ slug: { current: string } }>> {
  return safeFetch(
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "newsPost"] { slug }`,
    ),
    [],
  );
}
