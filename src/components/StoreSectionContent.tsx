"use client";
import LocationsMapSection from "@/components/locations/LocationsMapSection";
import type { Location } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { transliterateAddress } from "@/utils/transliterate";
import { useAtomValue } from "jotai";
import Link from "next/link";

const copy = {
  bg: {
    label: "Налично в Пловдив",
    heading: "Намери ни в магазин удобен за теб",
    desc: "ТЕПЕ bite се предлага в избрани оебкти из Пловдив.",
    cta: "Всички локации",
    navigate: "Навигирай",
    details: "Виж повече",
  },
  en: {
    label: "Available in Plovdiv",
    heading: "Find Us In a Store near You",
    desc: "ТЕПЕ bite is available at selected stores across Plovdiv.",
    cta: "All locations",
    navigate: "Navigate",
    details: "Learn more",
  },
};

function StoreRow({ loc, lang }: { loc: Location; lang: "bg" | "en" }) {
  const name = lang === "en" && loc.nameEn ? loc.nameEn : loc.nameBg;
  const address =
    lang === "en" ? transliterateAddress(loc.address) : loc.address;
  const mapsUrl = `https://maps.google.com/?q=${loc.coordinates.lat},${loc.coordinates.lng}`;
  const t = copy[lang];

  return (
    <div
      className="store-row"
      style={{
        padding: "16px 20px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-sm)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
        className="items-baseline relative grow justify-center"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {loc.neighborhood && (
            <span
              style={{
                background: "var(--plum)",
                color: "white",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: 100,
              }}
            >
              {loc.neighborhood}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--plum)",
            }}
          >
            {name}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-soft)",
            margin: 0,
            display: "flex",
            alignItems: "flex-start",
            gap: 5,
            lineHeight: 1.4,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 2 }}
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {address}
        </p>
      </div>

      <div className="flex flex-col relative gap-1 justify-center h-full w-fit items-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-caramel"
          style={{ fontSize: "0.78rem", padding: "7px 14px", width: "100%" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          {t.navigate}
        </a>
        <Link
          href={`/partnering-locations/${loc.slug.current}`}
          className="btn btn-secondary text-center justify-center"
          style={{ fontSize: "0.78rem", padding: "7px 14px", width: "100%" }}
        >
          {t.details}
        </Link>
      </div>
    </div>
  );
}

export default function StoreSectionContent({
  locations,
}: {
  locations: Location[];
}) {
  const lang = useAtomValue(langAtom);
  const t = copy[lang];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {t.label}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>
            {t.heading}
          </h2>
          <p style={{ fontSize: "1rem", maxWidth: 440, margin: "0 auto" }}>
            {t.desc}
          </p>
        </div>

        {/* Map + List */}
        <div
          className="stores-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          <LocationsMapSection locations={locations} small={true} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxHeight: "clamp(320px, 45vw, 520px)",
              overflowY: "auto",
            }}
          >
            {locations.slice(0, 3).map((loc) => (
              <StoreRow key={loc._id} loc={loc} lang={lang} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link href="/partnering-locations" className="btn btn-secondary">
            {t.cta}
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
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stores-layout {
            grid-template-columns: 1fr !important;
          }
        }
        .store-row {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .store-row:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
