"use client";

import { IconStar } from "@/components/icons";
import RailArrow from "@/components/rail/RailArrow";
import RailProgress from "@/components/rail/RailProgress";
import { pick, YouthBadge } from "@/components/public/impactUi";
import { useScrollRail } from "@/lib/hooks/useScrollRail";
import type { PartnerCarouselItem } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";

const CARD_W = 340;

/**
 * Horizontal-scroll rail for the youth-led partners, matching
 * MoreInitiativesSection's pattern (edge-fade mask, header-row RailArrow
 * controls, scroll-progress bar, mobile snap-center) instead of the previous
 * index-driven center-peek carousel. Used in the /about and homepage youth
 * power sections, which already render their own centred heading above this
 * component. Renders nothing when there are no youth partners yet.
 */
export default function YouthPartnerCarousel({
  items,
  lang,
}: {
  items: PartnerCarouselItem[];
  lang: Lang;
}) {
  const bg = lang === "bg";
  const { ref: scroller, atStart, atEnd, scrollByVisible, maskImage, progress, overflows } =
    useScrollRail<HTMLDivElement>();

  if (items.length === 0) return null;
  const showArrows = !(atStart && atEnd);

  return (
    <div>
      {showArrows && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <RailArrow
            dir="prev"
            disabled={atStart}
            onClick={() => scrollByVisible(-1)}
            label={bg ? "Предишен" : "Previous"}
          />
          <RailArrow
            dir="next"
            disabled={atEnd}
            onClick={() => scrollByVisible(1)}
            label={bg ? "Следващ" : "Next"}
          />
        </div>
      )}

      <div
        ref={scroller}
        className="yp-scroller"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          overflowY: "visible",
          scrollSnapType: "x mandatory",
          paddingBottom: 6,
          scrollbarWidth: "none",
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {items.map((it) => (
          <div
            key={it.partner.slug}
            style={{
              flex: `0 0 ${CARD_W}px`,
              width: CARD_W,
              scrollSnapAlign: "start",
            }}
          >
            <PartnerCard item={it} lang={lang} />
          </div>
        ))}
      </div>

      <RailProgress progress={progress} overflows={overflows} />

      <style>{`
        .yp-scroller::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .yp-scroller { scroll-padding-inline: clamp(16px, 6vw, 32px); }
          .yp-scroller > div { scroll-snap-align: center !important; }
        }
      `}</style>
    </div>
  );
}

function PartnerCard({ item, lang }: { item: PartnerCarouselItem; lang: Lang }) {
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

  return (
    <Link
      href={`/initiatives/partners/${partner.slug}`}
      className="card card-hover"
      style={{
        padding: "clamp(24px, 4vw, 36px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        height: "100%",
        textDecoration: "none",
        color: "inherit",
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
            <SmartImage src={partner.image.url} alt={name} fill sizes="64px" style={{ objectFit: "cover" }} />
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
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "var(--text-mid)",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </p>
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
        <span style={{ fontSize: "0.84rem", color: "var(--text-soft)" }}>{countLabel}</span>
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
          {bg ? "Виж профила" : "See profile"} →
        </span>
      </div>
    </Link>
  );
}
