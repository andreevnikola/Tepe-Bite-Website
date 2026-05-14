"use client";
import { urlFor } from "@/sanity/image";
import type { Location } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { transliterateAddress } from "@/utils/transliterate";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function LocationCard({ loc }: { loc: Location }) {
  const lang = useAtomValue(langAtom);
  const name = lang === "en" && loc.nameEn ? loc.nameEn : loc.nameBg;
  const address = lang === "en" ? transliterateAddress(loc.address) : loc.address;
  const mapsUrl = `https://maps.google.com/?q=${loc.coordinates.lat},${loc.coordinates.lng}`;
  const imgSrc = urlFor(loc.image).width(720).height(540).fit("crop").url();

  return (
    <article
      className="card card-hover"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image
          src={imgSrc}
          alt={loc.image.alt ?? name}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          className="location-card-img"
        />
        {loc.neighborhood && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "var(--plum)",
              color: "white",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 100,
            }}
          >
            {loc.neighborhood}
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: "22px 24px 24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 6,
        }}
      >
        <h3
          className="heading-md"
          style={{ fontSize: "1.2rem", lineHeight: 1.25 }}
        >
          {name}
        </h3>

        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--text-soft)",
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {address}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-caramel"
            style={{ fontSize: "0.82rem", padding: "9px 16px", flex: 1, justifyContent: "center" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {lang === "bg" ? "Навигирай" : "Navigate"}
          </a>
          <Link
            href={`/partnering-locations/${loc.slug.current}`}
            className="btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "9px 16px", flex: 1, justifyContent: "center" }}
          >
            {lang === "bg" ? "Виж повече" : "Learn more"}
          </Link>
        </div>
      </div>

      <style>{`
        .location-card-img { transition: transform 0.4s ease; }
        article:hover .location-card-img { transform: scale(1.04); }
      `}</style>
    </article>
  );
}
