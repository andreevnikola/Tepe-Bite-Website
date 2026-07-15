"use client";

import { IconStar } from "@/components/icons";
import { pick, YouthBadge } from "@/components/public/impactUi";
import type { PartnerCarouselItem } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * One-at-a-time carousel for the youth-led partners: a small "partner detail"
 * card with arrows and dots to move between them. Used in the /about youth
 * power section. Renders nothing when there are no youth partners yet.
 */
export default function YouthPartnerCarousel({
  items,
  lang,
}: {
  items: PartnerCarouselItem[];
  lang: Lang;
}) {
  const bg = lang === "bg";
  const [idx, setIdx] = useState(0);

  if (items.length === 0) return null;

  const clamped = Math.min(idx, items.length - 1);
  const { partner, initiativeCount } = items[clamped];
  const name = pick(lang, partner.nameBg, partner.nameEn);
  const desc = pick(lang, partner.descriptionBg, partner.descriptionEn);
  const many = items.length > 1;

  const go = (dir: -1 | 1) =>
    setIdx((i) => (i + dir + items.length) % items.length);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
        {many && (
          <ArrowBtn dir="prev" onClick={() => go(-1)} label={bg ? "Предишен" : "Previous"} />
        )}

        <article
          className="card"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "clamp(24px, 4vw, 36px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                position: "relative",
                width: 64,
                height: 64,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "var(--plum-lt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {partner.image ? (
                <Image src={partner.image.url} alt={name} fill sizes="64px" style={{ objectFit: "cover" }} />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    color: "var(--plum)",
                  }}
                >
                  {name.slice(0, 1)}
                </span>
              )}
            </span>
            <div style={{ minWidth: 0 }}>
              <h3
                className="heading-md"
                style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}
              >
                {name}
                {partner.isStarPartner && (
                  <span style={{ color: "var(--caramel)", display: "inline-flex", flexShrink: 0 }}>
                    <IconStar />
                  </span>
                )}
              </h3>
              <div style={{ marginTop: 8 }}>
                <YouthBadge lang={lang} compact />
              </div>
            </div>
          </div>

          {desc && (
            <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.7 }}>{desc}</p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginTop: "auto",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.84rem", color: "var(--text-soft)" }}>
              {initiativeCount > 0
                ? `${initiativeCount} ${
                    bg
                      ? initiativeCount === 1
                        ? "съвместна инициатива"
                        : "съвместни инициативи"
                      : initiativeCount === 1
                        ? "shared initiative"
                        : "shared initiatives"
                  }`
                : bg
                  ? "Предстоящо партньорство"
                  : "Upcoming partnership"}
            </span>
            <Link
              href={`/initiatives/partners/${partner.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                color: "var(--caramel)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              {bg ? "Виж профила" : "See profile"} →
            </Link>
          </div>
        </article>

        {many && (
          <ArrowBtn dir="next" onClick={() => go(1)} label={bg ? "Следващ" : "Next"} />
        )}
      </div>

      {many && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {items.map((it, i) => (
            <button
              key={it.partner.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`${bg ? "Партньор" : "Partner"} ${i + 1}`}
              aria-current={i === clamped}
              style={{
                width: i === clamped ? 26 : 9,
                height: 9,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === clamped ? "var(--caramel)" : "var(--border)",
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowBtn({
  dir,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="yp-arrow"
      style={{
        width: 46,
        height: 46,
        alignSelf: "center",
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--plum)",
        cursor: "pointer",
        fontSize: "1.4rem",
        lineHeight: 1,
        boxShadow: "var(--shadow)",
        transition: "transform 0.2s, box-shadow 0.2s",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
      <style>{`
        .yp-arrow:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
      `}</style>
    </button>
  );
}
