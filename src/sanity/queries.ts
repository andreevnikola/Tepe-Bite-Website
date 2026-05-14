import { sanityClient } from "./client";
import type { Location, NewsPost } from "./types";

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
  return sanityClient.fetch(
    `*[_type == "location" && isActive == true] | order(partneringSince asc) {
      ${locationFields}
    }`
  );
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  return sanityClient.fetch(
    `*[_type == "location" && slug.current == $slug && isActive == true][0] {
      ${locationFields}
    }`,
    { slug }
  );
}

export async function getAllLocationSlugs(): Promise<Array<{ slug: { current: string } }>> {
  return sanityClient.fetch(
    `*[_type == "location" && isActive == true] { slug }`
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
  return sanityClient.fetch(
    `*[_type == "newsPost"] | order(publishedAt desc) {
      ${newsListingFields}
    }`
  );
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  return sanityClient.fetch(
    `*[_type == "newsPost" && slug.current == $slug][0] {
      ${newsListingFields},
      bodyBg,
      bodyEn
    }`,
    { slug }
  );
}

export async function getAllNewsSlugs(): Promise<Array<{ slug: { current: string } }>> {
  return sanityClient.fetch(`*[_type == "newsPost"] { slug }`);
}
