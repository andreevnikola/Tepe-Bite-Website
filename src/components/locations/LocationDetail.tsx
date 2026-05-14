"use client";
import LocationOrderBridge from "@/components/locations/LocationOrderBridge";
import { urlFor } from "@/sanity/image";
import type { LinkIcon, Location } from "@/sanity/types";
import { langAtom } from "@/store/lang";
import { transliterateAddress } from "@/utils/transliterate";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const LocationMiniMap = dynamic(() => import("./LocationMiniMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 260,
        borderRadius: "var(--r-md)",
        background: "var(--surface2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-soft)",
        fontSize: "0.85rem",
      }}
    >
      Зарежда карта…
    </div>
  ),
});

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        style={{
          marginBottom: "1.1em",
          color: "var(--text-mid)",
          lineHeight: 1.75,
          fontSize: "1.02rem",
        }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="heading-md" style={{ marginTop: "1.4em", marginBottom: "0.5em" }}>
        {children}
      </h2>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600, color: "var(--text)" }}>{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--caramel)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </a>
    ),
  },
};

function IconForLink({ icon }: { icon: LinkIcon }) {
  if (icon === "instagram")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  if (icon === "tiktok")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
      </svg>
    );
  if (icon === "facebook")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  if (icon === "website")
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function formatDate(dateStr: string, lang: "bg" | "en") {
  const date = new Date(dateStr + "T12:00:00");
  if (lang === "bg") {
    return date.toLocaleDateString("bg-BG", { month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function LocationDetail({ location }: { location: Location }) {
  const lang = useAtomValue(langAtom);
  const name = lang === "en" && location.nameEn ? location.nameEn : location.nameBg;
  const description =
    lang === "en" && location.descriptionEn?.length
      ? location.descriptionEn
      : location.descriptionBg;
  const address = lang === "en" ? transliterateAddress(location.address) : location.address;
  const mapsUrl = `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`;
  const imgSrc = urlFor(location.image).width(1400).height(700).fit("crop").url();
  const hasContent =
    (description && description.length > 0) ||
    (location.links && location.links.length > 0);

  return (
    <>
      {/* Hero image — full width, name + breadcrumb overlaid */}
      <div
        style={{
          position: "relative",
          height: "clamp(340px, 48vw, 560px)",
          overflow: "hidden",
        }}
      >
        <Image
          src={imgSrc}
          alt={location.image.alt ?? name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        {/* Gradient overlay — darkens top for breadcrumb and bottom for name */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, oklch(10% 0.05 315 / 0.55) 0%, transparent 35%, transparent 55%, oklch(10% 0.05 315 / 0.72) 100%)",
          }}
        />

        {/* Breadcrumb — top left */}
        <div
          style={{
            position: "absolute",
            top: "clamp(80px, 10vw, 110px)",
            left: "clamp(20px, 5vw, 80px)",
            right: "clamp(20px, 5vw, 80px)",
          }}
        >
          <Link
            href="/partnering-locations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(255,255,255,0.92)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
              background: "oklch(10% 0.05 315 / 0.35)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 100,
              padding: "6px 14px 6px 10px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "oklch(10% 0.05 315 / 0.55)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "oklch(10% 0.05 315 / 0.35)";
              e.currentTarget.style.color = "rgba(255,255,255,0.92)";
            }}
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            {lang === "bg" ? "Всички локации" : "All locations"}
          </Link>
        </div>

        {/* Name + neighborhood — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(28px, 4vw, 48px)",
            left: "clamp(20px, 5vw, 80px)",
            right: "clamp(20px, 5vw, 80px)",
          }}
        >
          {location.neighborhood && (
            <div
              style={{
                display: "inline-block",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--caramel)",
                background: "oklch(10% 0.05 315 / 0.4)",
                border: "1px solid oklch(88% 0.16 52 / 0.4)",
                borderRadius: 100,
                padding: "4px 12px",
                marginBottom: 10,
                backdropFilter: "blur(4px)",
              }}
            >
              {location.neighborhood}
            </div>
          )}
          <h1
            className="heading-xl"
            style={{
              color: "white",
              marginBottom: 0,
              textShadow: "0 2px 12px oklch(10% 0.05 315 / 0.4)",
            }}
          >
            {name}
          </h1>
        </div>
      </div>

      {/* Info + map */}
      <div
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingTop: 48,
          paddingBottom: 48,
          background: "var(--bg)",
        }}
      >
        <div
          className="section-inner loc-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 4vw, 60px)",
            alignItems: "start",
          }}
        >
          {/* Left: info card + navigate */}
          <div>
            <div className="card" style={{ padding: "28px 30px", marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Address */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--r-sm)",
                      background: "var(--caramel-lt)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--caramel)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-soft)",
                        marginBottom: 3,
                      }}
                    >
                      {lang === "bg" ? "Адрес" : "Address"}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "var(--text)", fontWeight: 500 }}>
                      {address}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: "var(--border)" }} />

                {/* Partnering since */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--r-sm)",
                      background: "var(--plum-lt)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--plum)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-soft)",
                        marginBottom: 3,
                      }}
                    >
                      {lang === "bg" ? "Партньор от" : "Partner since"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--text)",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {formatDate(location.partneringSince, lang)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigate button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-caramel"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "0.95rem",
                padding: "13px 24px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              {lang === "bg" ? "Отвори в Google Maps" : "Open in Google Maps"}
            </a>
          </div>

          {/* Right: mini map */}
          <div>
            <LocationMiniMap
              lat={location.coordinates.lat}
              lng={location.coordinates.lng}
            />
          </div>
        </div>
      </div>

      {/* Description + links — unified background section */}
      {hasContent && (
        <section
          className="section-spacing"
          style={{ background: "var(--surface2)" }}
        >
          <div
            className="section-inner"
            style={{ maxWidth: 760, margin: "0 auto" }}
          >
            {description && description.length > 0 && (
              <div style={{ marginBottom: location.links?.length ? 40 : 0 }}>
                <div
                  className="label-tag"
                  style={{ color: "var(--caramel)", marginBottom: 20 }}
                >
                  {lang === "bg" ? "За магазина" : "About the store"}
                </div>
                <PortableText
                  value={description as Parameters<typeof PortableText>[0]["value"]}
                  components={ptComponents}
                />
              </div>
            )}

            {location.links && location.links.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 16,
                  }}
                >
                  {lang === "bg" ? "Намери магазина онлайн" : "Find the store online"}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {location.links.map((link) => (
                    <a
                      key={link._key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 18px",
                        borderRadius: 100,
                        border: "1.5px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.2s",
                        boxShadow: "var(--shadow)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--plum)";
                        e.currentTarget.style.color = "var(--plum)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <IconForLink icon={link.icon} />
                      {lang === "en" && link.labelEn ? link.labelEn : link.labelBg}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <LocationOrderBridge />

      <style>{`
        @media (max-width: 860px) {
          .loc-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
