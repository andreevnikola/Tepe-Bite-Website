"use client";

import { IconArrow, IconFb, IconInsta, IconLink, IconStar, IconTiktok } from "@/components/icons";
import {
  StatusBadge,
  pick,
  PARTNERSHIP_TYPE_LABELS,
} from "@/components/public/impactUi";
import { PhaseBarMini, PhaseBreakdown } from "@/components/public/PhaseBreakdown";
import type { PartnerDetail as PartnerDetailData } from "@/lib/public/initiatives";
import { formatDualMoney, formatMoneyEUR } from "@/lib/money";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

const LINK_META = [
  { key: "website", icon: <IconLink />, labelBg: "Уебсайт", labelEn: "Website" },
  { key: "instagram", icon: <IconInsta />, labelBg: "Instagram", labelEn: "Instagram" },
  { key: "facebook", icon: <IconFb />, labelBg: "Facebook", labelEn: "Facebook" },
  { key: "tiktok", icon: <IconTiktok />, labelBg: "TikTok", labelEn: "TikTok" },
] as const;

export default function PartnerDetail({ detail }: { detail: PartnerDetailData }) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";
  const { partner, initiatives, totalDonatedCents, financial } = detail;
  const name = pick(lang, partner.nameBg, partner.nameEn);
  const description = pick(lang, partner.descriptionBg, partner.descriptionEn);

  const links = LINK_META.filter((l) => partner.links[l.key]);

  return (
    <main>
      {/* Header */}
      <section
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 25% 20%, oklch(90% 0.05 230 / 0.4), transparent), var(--bg)",
          paddingTop: 128,
          paddingBottom: "clamp(40px, 5vw, 64px)",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <div className="section-inner" style={{ maxWidth: 1120 }}>
          <Link
            href="/initiatives/all"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.86rem",
              fontWeight: 600,
              color: "var(--text-mid)",
              textDecoration: "none",
              marginBottom: 28,
            }}
          >
            ← {bg ? "Всички инициативи" : "All initiatives"}
          </Link>

          <div
            className="partner-head"
            style={{
              display: "flex",
              gap: "clamp(24px, 3vw, 48px)",
              alignItems: "stretch",
            }}
          >
            {/* identity */}
            <div
              className="partner-id"
              style={{
                display: "flex",
                gap: "clamp(18px, 2.4vw, 32px)",
                alignItems: "flex-start",
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "var(--plum-lt)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow)",
                }}
              >
                {partner.image ? (
                  <Image src={partner.image.url} alt={name} fill sizes="96px" style={{ objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "2rem", color: "var(--plum)" }}>
                    {name.slice(0, 1)}
                  </span>
                )}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="label-tag" style={{ marginBottom: 10 }}>
                  {bg ? "Партньор" : "Partner"}
                </div>
                <h1 className="heading-xl" style={{ marginBottom: 14 }}>
                  {name}
                </h1>

                {partner.isStarPartner && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      background: "var(--caramel-lt)",
                      border: "1px solid oklch(84% 0.09 60)",
                      borderRadius: "var(--r-sm)",
                      padding: "10px 16px",
                      marginBottom: 18,
                    }}
                  >
                    <span style={{ color: "var(--caramel)", display: "inline-flex" }}>
                      <IconStar />
                    </span>
                    <span style={{ fontSize: "0.86rem", color: "oklch(42% 0.12 55)", fontWeight: 600, lineHeight: 1.4 }}>
                      {bg
                        ? "Звезден партньор — дългосрочен ангажимент и значителен принос."
                        : "Star partner — long-term commitment and a major contribution."}
                    </span>
                  </div>
                )}

                {description && (
                  <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--text-mid)", marginBottom: 20, maxWidth: 620 }}>
                    {description}
                  </p>
                )}

                {links.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {links.map((l) => (
                      <a
                        key={l.key}
                        href={partner.links[l.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                      >
                        {l.icon} {bg ? l.labelBg : l.labelEn}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* summary card — balances the header on wide screens */}
            {(totalDonatedCents > 0 || initiatives.length > 0) && (
              <aside
                className="partner-summary card"
                style={{
                  flex: "0 0 auto",
                  width: 280,
                  alignSelf: "center",
                  padding: "24px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {totalDonatedCents > 0 && (
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 6 }}>
                      {bg ? "Общо дарени" : "Total donated"}
                    </div>
                    <div style={{ fontFamily: "var(--font-head)", fontSize: "1.7rem", fontWeight: 800, color: "var(--caramel)", lineHeight: 1.05 }}>
                      {formatDualMoney(totalDonatedCents)}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    paddingTop: totalDonatedCents > 0 ? 16 : 0,
                    borderTop: totalDonatedCents > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <SummaryRow
                    label={bg ? "Инициативи" : "Initiatives"}
                    value={String(initiatives.length)}
                  />
                  {financial.total > 0 && (
                    <SummaryRow
                      label={bg ? "Обвързани средства" : "Committed"}
                      value={formatMoneyEUR(financial.total)}
                    />
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Financial contribution */}
      {financial.total > 0 && (
        <section className="section-spacing" style={{ background: "var(--bg)" }}>
          <div className="section-inner">
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "Финансов принос" : "Financial contribution"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 28 }}>
              {bg
                ? "Принос към нашето социално въздействие"
                : "Contribution to our social impact"}
            </h2>
            <div className="card" style={{ padding: "clamp(22px, 3vw, 32px)", maxWidth: 900 }}>
              <PhaseBreakdown
                totals={financial}
                lang={lang}
                note={
                  bg
                    ? `${name} е поел ${financial.recordCount} финансов${
                        financial.recordCount === 1 ? " ангажимент" : "и ангажимента"
                      } на обща стойност ${formatMoneyEUR(financial.total)} към нашите инициативи.`
                    : `${name} has made ${financial.recordCount} financial commitment${
                        financial.recordCount === 1 ? "" : "s"
                      } totalling ${formatMoneyEUR(financial.total)} to our initiatives.`
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* Initiatives they're on */}
      <section className="section-spacing" style={{ background: "var(--surface)" }}>
        <div className="section-inner">
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Съвместно" : "Together"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 28 }}>
            {bg ? "Инициативи с този партньор" : "Initiatives with this partner"}
          </h2>

          {initiatives.length === 0 ? (
            <p style={{ color: "var(--text-mid)" }}>
              {bg
                ? "Все още няма публикувани инициативи с този партньор."
                : "No published initiatives with this partner yet."}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {initiatives.map(({ initiative, partnershipType, contributionBg, contributionEn, financial: initFin }) => {
                const title = pick(lang, initiative.titleBg, initiative.titleEn);
                const contribution = pick(lang, contributionBg, contributionEn);
                const typeLabel = PARTNERSHIP_TYPE_LABELS[partnershipType];
                return (
                  <Link
                    key={initiative.id}
                    href={`/initiatives/${initiative.slug}`}
                    className="card card-hover"
                    style={{ padding: "22px 24px", textDecoration: "none", display: "block" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      <StatusBadge status={initiative.status} lang={lang} />
                      <span
                        style={{
                          background: "var(--plum-lt)",
                          color: "var(--plum)",
                          borderRadius: 100,
                          padding: "3px 11px",
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {lang === "en" ? typeLabel.en : typeLabel.bg}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.15rem", fontWeight: 700, color: "var(--plum)", marginBottom: contribution ? 8 : 0 }}>
                      {title}
                    </h3>
                    {contribution && (
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-mid)", margin: "0 0 10px" }}>
                        {contribution}
                      </p>
                    )}
                    {initFin.total > 0 && (
                      <div style={{ maxWidth: 360, marginBottom: 12 }}>
                        <PhaseBarMini
                          totals={initFin}
                          lang={lang}
                          label={bg ? "Принос по инициативата" : "Contribution here"}
                        />
                      </div>
                    )}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--caramel)", fontWeight: 600, fontSize: "0.85rem" }}>
                      {bg ? "Виж инициативата" : "See the initiative"} <IconArrow />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .partner-head { flex-direction: column !important; align-items: stretch !important; }
          .partner-summary { width: 100% !important; align-self: stretch !important; }
        }
        @media (max-width: 560px) {
          .partner-id { flex-direction: column !important; }
        }
      `}</style>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
      <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>{label}</span>
      <span style={{ fontWeight: 700, color: "var(--plum)", fontSize: "0.95rem" }}>{value}</span>
    </div>
  );
}
