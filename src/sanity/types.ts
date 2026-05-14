export type PortableTextBlock = { _type: "block"; [key: string]: unknown };

export interface SanityImageAsset {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}

export type LinkIcon = "instagram" | "tiktok" | "facebook" | "website" | "random";

export interface LocationLink {
  _key: string;
  url: string;
  labelBg: string;
  labelEn?: string;
  icon: LinkIcon;
}

export interface NewsPost {
  _id: string;
  titleBg: string;
  titleEn?: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageAsset & { altBg?: string; altEn?: string };
  excerptBg?: string;
  excerptEn?: string;
  bodyBg?: PortableTextBlock[];
  bodyEn?: PortableTextBlock[];
}

export interface Location {
  _id: string;
  _createdAt: string;
  nameBg: string;
  nameEn?: string;
  slug: { current: string };
  image: SanityImageAsset;
  neighborhood?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  descriptionBg?: Array<{ _type: "block"; [key: string]: unknown }>;
  descriptionEn?: Array<{ _type: "block"; [key: string]: unknown }>;
  links?: LocationLink[];
  partneringSince: string;
  isActive: boolean;
}
