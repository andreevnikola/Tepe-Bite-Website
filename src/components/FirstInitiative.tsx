"use client";
import { IconArrow, IconCheck } from "@/components/icons";
import Gallery from "@/components/public/Gallery";
import { pick, StatusBadge } from "@/components/public/impactUi";
import type { InitiativeDetail } from "@/lib/public/initiatives";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconBrush = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

export default function FirstInitiative({
  reconnect,
}: {
  reconnect: InitiativeDetail | null;
}) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const initiative = reconnect?.initiative ?? null;

  // Progress + milestones come straight from the database (single source of
  // truth — the same steps /initiatives and /about show), so the landing can
  // never drift from the record.
  const dbSteps = [...(initiative?.steps ?? [])].sort((a, b) => a.order - b.order);
  const doneCount = dbSteps.filter((s) => s.done).length;
  const totalCount = dbSteps.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const firstPendingIdx = dbSteps.findIndex((s) => !s.done);
  const cover =
    initiative?.coverImage ??
    (initiative && initiative.gallery.length > 0 ? initiative.gallery[0] : null);
  const gallery = initiative?.gallery ?? [];
  const initiativeHref = initiative?.slug
    ? `/initiatives/${initiative.slug}`
    : "/impact";

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)", position: "relative", overflow: "hidden" }}
    >
      {/* Decorative hill silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 160, opacity: 0.04, pointerEvents: "none" }}
      >
        <path d="M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z" fill="var(--plum)" />
      </svg>

      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, maxWidth: 680 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Отблизо — първата ни инициатива" : "Up close — our first initiative"}
          </div>
          <h2 className="heading-lg" style={{ margin: 0 }}>
            {bg ? "RE-CONNECT БУНАРДЖИКА" : "RE-CONNECT BUNARDZHIKA"}
          </h2>
          <p style={{ maxWidth: 600, margin: "16px 0 0", fontSize: "1rem" }}>
            {bg
              ? "Първата ни конкретна стъпка за Пловдив — реална намеса в едно от най-разпознаваемите му места, реализирана през фонд ТЕПЕ bite Impact."
              : "Our first concrete step for Plovdiv — a real intervention in one of its most recognizable places, delivered through the ТЕПЕ bite Impact fund."}
          </p>
        </div>

        <div className="fi-grid">
          {/* ── Media column ── */}
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                background: "var(--plum)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {cover ? (
                <Image
                  src={cover.url}
                  alt={bg ? "RE-CONNECT Бунарджика" : "RE-CONNECT Bunardzhika"}
                  fill
                  sizes="(max-width: 1000px) 100vw, 560px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 60%, oklch(52% 0.13 40) 100%)",
                  }}
                >
                  <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", opacity: 0.25 }}>
                    <path d="M0 200 L0 120 Q150 50 300 90 Q450 130 600 70 L600 200 Z" fill="oklch(100% 0 0)" />
                  </svg>
                </div>
              )}
            </div>

            {gallery.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <Gallery items={gallery} lang={lang} thumbMin={96} />
              </div>
            )}
          </div>

          {/* ── Facts column ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Live status straight from the record */}
            {initiative && (
              <div style={{ marginBottom: 22, alignSelf: "flex-start" }}>
                <StatusBadge status={initiative.status} lang={lang} />
              </div>
            )}

            {/* What we're doing */}
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                marginBottom: 20,
                borderLeft: "3px solid var(--caramel)",
                paddingLeft: 18,
                color: "var(--text-mid)",
              }}
            >
              {bg
                ? 'Съвременна графична намеса около чешмичката на „Кръгчето" в парк Бунарджика — превръщаме транзитна точка в място, което хората забелязват и преживяват.'
                : "Contemporary graphic art intervention around the fountain at 'Krugcheto' in Bunardzhika Park — turning a transit point into a place people notice and experience."}
            </p>

            {/* Location + format pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--caramel-lt)",
                  color: "oklch(42% 0.12 52)",
                  borderRadius: 100,
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                <IconPin />
                {bg ? "Бунарджика, Пловдив" : "Bunardzhika, Plovdiv"}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--plum-lt)",
                  color: "var(--plum)",
                  borderRadius: 100,
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                <IconBrush />
                {bg ? "Съвременно графично изкуство" : "Contemporary graphic art"}
              </span>
            </div>

            {/* Progress + milestones — DB-driven */}
            {totalCount > 0 && (
              <div className="card" style={{ padding: "24px 24px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.95rem" }}>
                      {bg ? "Напредък" : "Progress"}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-soft)", marginLeft: 8 }}>
                      {doneCount}/{totalCount} {bg ? "стъпки" : "steps"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.5rem", color: "var(--plum)" }}>
                    {pct}%
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <p style={{ marginTop: 8, marginBottom: 20, fontSize: "0.75rem", color: "var(--text-soft)", fontStyle: "italic" }}>
                  {bg ? "Напредък по подготовката — не финално одобрение." : "Preparation progress — not final approval."}
                </p>

                {dbSteps.map((step, i) => {
                  const active = i === firstPendingIdx;
                  const detail = pick(lang, step.detailBg, step.detailEn);
                  return (
                    <div key={step.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 26 }}>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: step.done ? "var(--caramel)" : "var(--plum-lt)",
                            border: active ? "2px solid var(--plum)" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: step.done ? "white" : "var(--plum-mid)",
                          }}
                        >
                          {step.done ? <IconCheck /> : <IconClock />}
                        </div>
                        {i < dbSteps.length - 1 && (
                          <div
                            style={{
                              width: 2,
                              flex: 1,
                              minHeight: 16,
                              background: step.done ? "oklch(76% 0.10 52)" : "var(--border)",
                              margin: "3px 0",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < dbSteps.length - 1 ? 16 : 0, flex: 1 }}>
                        <div
                          style={{
                            fontWeight: active ? 700 : 600,
                            fontSize: "0.88rem",
                            color: step.done ? "var(--text)" : active ? "var(--plum)" : "var(--text-soft)",
                            marginBottom: 2,
                            paddingTop: 4,
                          }}
                        >
                          {pick(lang, step.labelBg, step.labelEn)}
                        </div>
                        {detail && (
                          <p style={{ fontSize: "0.78rem", color: "var(--text-soft)", margin: 0, lineHeight: 1.5 }}>
                            {detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Why the hills */}
            <div style={{ background: "var(--plum-lt)", borderRadius: "var(--r-md)", padding: "22px 24px", marginBottom: 24 }}>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                {bg ? "Защо тепетата?" : "Why the hills?"}
              </div>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.72, margin: 0, color: "var(--plum)" }}>
                {bg
                  ? "Тепетата са един от най-силните символи на Пловдив — природни и социални пространства, заслужаващи постоянна грижа. ТЕПЕ bite е създаден с идеята тази грижа да е вградена в самия бизнес модел: всяко барче е стъпка напред."
                  : "The hills are one of Plovdiv's strongest symbols — natural and social spaces that deserve continuous care. ТЕПЕ bite was built with this idea embedded in the business model itself: every bar is a step forward."}
              </p>
            </div>

            {/* Partner badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                padding: "14px 18px",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "var(--caramel)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-head)",
                }}
              >
                O
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 2,
                  }}
                >
                  {bg ? "Техническо партньорство" : "Technical partner"}
                </div>
                <div style={{ fontWeight: 700, color: "var(--plum)", fontSize: "0.92rem" }}>Оргахим</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-soft)", textAlign: "right", lineHeight: 1.5, maxWidth: 140 }}>
                {bg ? "Материали и инструменти за реализация" : "Materials & tools for execution"}
              </div>
            </div>

            {/* Pledge quote + CTAs */}
            <div style={{ background: "var(--plum)", borderRadius: "var(--r-sm)", padding: "18px 20px", marginBottom: 20 }}>
              <p style={{ fontSize: "0.85rem", color: "oklch(94% 0.03 315)", fontStyle: "italic", margin: 0, lineHeight: 1.65 }}>
                {bg
                  ? '"Фиксирани 0.15 € от всяко барче отиват във фонд ТЕПЕ bite Impact — и директно захранват тази инициатива."'
                  : '"A fixed 0.15 € from every bar goes to the ТЕПЕ bite Impact fund — directly powering this initiative."'}
              </p>
            </div>

            <div className="flex gap-3 max-[560px]:flex-col">
              <Link href={initiativeHref} className="btn btn-primary justify-center">
                {bg ? "Виж пълната инициатива" : "See the full initiative"}
                <IconArrow />
              </Link>
              <Link href="/order" className="btn btn-caramel justify-center">
                {bg ? "Поръчай и подкрепи" : "Order & support"}
                <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fi-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(28px, 4vw, 56px);
          align-items: start;
        }
        @media (max-width: 1000px) {
          .fi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
