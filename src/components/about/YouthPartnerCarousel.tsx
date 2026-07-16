"use client";

import { IconStar } from "@/components/icons";
import { pick, YouthBadge } from "@/components/public/impactUi";
import type { PartnerCarouselItem } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

/**
 * Center-focused, endless carousel for the youth-led partners. Exactly one
 * partner card is centred and fully visible; its neighbours peek in at the
 * container edges (faded by a background-coloured mask). Arrows and dots move
 * between partners and wrap around infinitely. Used in the /about youth power
 * section. Renders nothing when there are no youth partners yet.
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

  const len = items.length;
  const clamped = ((idx % len) + len) % len;

  // Count-based rules. len === 1 -> no arrows / peeks / masks / dots (all the
  // flags below are false), so a single card renders centred and alone.
  const showLeftSide = len >= 3; // left peek + left arrow + left mask
  const showRightSide = len >= 2; // right peek + right arrow + right mask
  const showDots = len >= 3;

  const prevItem = items[(clamped - 1 + len) % len];
  const nextItem = items[(clamped + 1) % len];

  // Endless wrap: modulo keeps the index in range in both directions.
  const go = (dir: -1 | 1) => setIdx((i) => (((i + dir) % len) + len) % len);

  return (
    <div
      style={
        {
          maxWidth: "calc(var(--yp-card-w) + 140px)",
          margin: "0 auto",
          "--yp-card-w": "clamp(320px, 82vw, 560px)",
        } as CSSProperties
      }
    >
      <div className="yp-frame" style={{ position: "relative" }}>
        {/* Stage clips the off-screen portion of the peeking neighbours so the
            page never scrolls horizontally. */}
        <div className="yp-stage" style={{ position: "relative", overflow: "hidden" }}>
          {showLeftSide && (
            <div
              className="yp-peek yp-peek-l"
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "var(--yp-card-w)",
                transform: "translate(-84%, -50%) scale(0.9)",
                opacity: 0.5,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <PartnerCard item={prevItem} lang={lang} interactive={false} />
            </div>
          )}

          {showRightSide && (
            <div
              className="yp-peek yp-peek-r"
              aria-hidden
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                width: "var(--yp-card-w)",
                transform: "translate(84%, -50%) scale(0.9)",
                opacity: 0.5,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <PartnerCard item={nextItem} lang={lang} interactive={false} />
            </div>
          )}

          <div
            className="yp-center"
            style={{
              width: "var(--yp-card-w)",
              maxWidth: "100%",
              margin: "0 auto",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div key={clamped} className="yp-anim">
              <PartnerCard item={items[clamped]} lang={lang} interactive />
            </div>
          </div>
        </div>

        {/* Edge masks: fade the peeking neighbours from the page background at
            the outer edge to transparent toward the centre. */}
        {showLeftSide && (
          <div
            aria-hidden
            className="yp-mask"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "clamp(56px, 14%, 170px)",
              background: "linear-gradient(to right, var(--bg), transparent)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        )}
        {showRightSide && (
          <div
            aria-hidden
            className="yp-mask"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "clamp(56px, 14%, 170px)",
              background: "linear-gradient(to left, var(--bg), transparent)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        )}

        {/* Arrows sit over the edges, above the masks. */}
        {showLeftSide && (
          <ArrowBtn dir="prev" side="left" onClick={() => go(-1)} label={bg ? "Предишен" : "Previous"} />
        )}
        {showRightSide && (
          <ArrowBtn dir="next" side="right" onClick={() => go(1)} label={bg ? "Следващ" : "Next"} />
        )}
      </div>

      {showDots && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {items.map((it, i) => (
            <button
              key={it.partner.slug}
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

      <style>{`
        .yp-peek, .yp-center { transition: transform 0.35s ease, opacity 0.35s ease; }
        .yp-anim { animation: yp-in 0.35s ease both; }
        @keyframes yp-in {
          from { opacity: 0; transform: translateY(6px) scale(0.985); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .yp-peek, .yp-center { transition: none; }
          .yp-anim { animation: none; }
        }
      `}</style>
    </div>
  );
}

function PartnerCard({
  item,
  lang,
  interactive,
}: {
  item: PartnerCarouselItem;
  lang: Lang;
  interactive: boolean;
}) {
  const bg = lang === "bg";
  const { partner, initiativeCount } = item;
  const name = pick(lang, partner.nameBg, partner.nameEn);
  const desc = pick(lang, partner.descriptionBg, partner.descriptionEn);

  const countLabel =
    initiativeCount > 0
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
        : "Upcoming partnership";

  const profileLabel = `${bg ? "Виж профила" : "See profile"} →`;

  return (
    <article
      className="card"
      style={{
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

      {desc && <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.7 }}>{desc}</p>}

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
        <span style={{ fontSize: "0.84rem", color: "var(--text-soft)" }}>{countLabel}</span>
        {interactive ? (
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
            {profileLabel}
          </Link>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--caramel)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {profileLabel}
          </span>
        )}
      </div>
    </article>
  );
}

function ArrowBtn({
  dir,
  side,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  side: "left" | "right";
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
        position: "absolute",
        top: "50%",
        [side]: "clamp(4px, 1.5vw, 16px)",
        transform: "translateY(-50%)",
        width: 46,
        height: 46,
        zIndex: 4,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--plum)",
        cursor: "pointer",
        fontSize: "1.4rem",
        lineHeight: 1,
        boxShadow: "var(--shadow)",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
      <style>{`
        .yp-arrow:hover { transform: translateY(-50%) scale(1.06); box-shadow: var(--shadow-lg); }
        @media (prefers-reduced-motion: reduce) { .yp-arrow { transition: none; } }
      `}</style>
    </button>
  );
}
