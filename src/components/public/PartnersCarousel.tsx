"use client";

import { IconStar } from "@/components/icons";
import RailArrow from "@/components/rail/RailArrow";
import RailProgress from "@/components/rail/RailProgress";
import { pick, YouthBadge } from "@/components/public/impactUi";
import { PhaseBarMini } from "@/components/public/PhaseBreakdown";
import { useScrollRail } from "@/lib/hooks/useScrollRail";
import type { PartnerCarouselItem } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";

const CARD_W = 300;

export default function PartnersCarousel({
  items,
  lang,
  background = "var(--bg)",
}: {
  items: PartnerCarouselItem[];
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  const { ref: scroller, atStart, atEnd, scrollByVisible, maskImage, progress, overflows } =
    useScrollRail<HTMLDivElement>();

  if (items.length === 0) return null;
  const showArrows = !(atStart && atEnd); // only when overflowing

  return (
    <section className="section-spacing" style={{ background }}>
      <div className="section-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "Заедно" : "Together"}
            </div>
            <h2 className="heading-lg" style={{ margin: 0 }}>
              {bg ? "Партньорите зад инициативите" : "The partners behind the initiatives"}
            </h2>
          </div>
          {showArrows && (
            <div style={{ display: "flex", gap: 10 }}>
              <RailArrow dir="prev" disabled={atStart} onClick={() => scrollByVisible(-1)} label={bg ? "Назад" : "Back"} />
              <RailArrow dir="next" disabled={atEnd} onClick={() => scrollByVisible(1)} label={bg ? "Напред" : "Forward"} />
            </div>
          )}
        </div>

        <div
          ref={scroller}
          className="partners-scroller"
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
          {items.map(({ partner, initiativeCount, financial }) => {
            const name = pick(lang, partner.nameBg, partner.nameEn);
            const desc = pick(lang, partner.descriptionBg, partner.descriptionEn);
            const descFade = desc.length > 130;
            return (
              <Link
                key={partner.id}
                href={`/initiatives/partners/${partner.slug}`}
                className="card card-hover"
                style={{
                  flex: `0 0 ${CARD_W}px`,
                  width: CARD_W,
                  scrollSnapAlign: "start",
                  padding: "22px 22px 20px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      position: "relative",
                      width: 52,
                      height: 52,
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
                      <SmartImage src={partner.image.url} alt={name} fill sizes="52px" style={{ objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.3rem", color: "var(--plum)" }}>
                        {name.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "var(--plum)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {name}
                      </span>
                      {partner.isStarPartner && (
                        <span style={{ color: "var(--caramel)", display: "inline-flex", flexShrink: 0 }}>
                          <IconStar />
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}>
                      {initiativeCount}{" "}
                      {bg
                        ? initiativeCount === 1
                          ? "инициатива"
                          : "инициативи"
                        : initiativeCount === 1
                          ? "initiative"
                          : "initiatives"}
                    </span>
                  </div>
                </div>

                {partner.isYouthLed && (
                  <div>
                    <YouthBadge lang={lang} compact />
                  </div>
                )}

                {desc && (
                  <p
                    style={{
                      fontSize: "0.86rem",
                      lineHeight: 1.55,
                      color: "var(--text-mid)",
                      margin: 0,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      maskImage: descFade
                        ? "linear-gradient(180deg, black 55%, transparent 100%)"
                        : undefined,
                      WebkitMaskImage: descFade
                        ? "linear-gradient(180deg, black 55%, transparent 100%)"
                        : undefined,
                    }}
                  >
                    {desc}
                  </p>
                )}

                {financial.total > 0 && (
                  <PhaseBarMini totals={financial} lang={lang} />
                )}

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    color: "var(--caramel)",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    marginTop: "auto",
                  }}
                >
                  {bg ? "Профил" : "Profile"} →
                </span>
              </Link>
            );
          })}
        </div>

        <RailProgress progress={progress} overflows={overflows} />
      </div>

      <style>{`
        .partners-scroller::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .partners-scroller { scroll-padding-inline: clamp(16px, 6vw, 32px); }
          .partners-scroller > a { scroll-snap-align: center !important; }
        }
      `}</style>
    </section>
  );
}
