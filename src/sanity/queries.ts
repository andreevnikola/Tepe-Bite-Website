import { sanityClient } from "./client";
import type { Location } from "./types";

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
