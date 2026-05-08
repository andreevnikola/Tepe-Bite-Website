"use client";
import { IconArrow, IconCheck, IconLink } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const IconClock = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPin = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconBrush = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

/* Condensed milestones for the landing section — real data from the initiative */
const milestones = {
  bg: [
    {
      done: true,
      label: "Идентифицирахме каузата",
      detail: "Облагородяване на зона в парк Бунарджика",
    },
    {
      done: true,
      label: "Осигурихме партньорство с Оргахим",
      detail: "Материали и инструменти за реализация",
    },
    {
      done: true,
      label: "Намерихме артистичен екип",
      detail: "Разработени концептуални визуализации",
    },
    {
      done: false,
      label: 'Предстои координация с Район „Централен"',
      detail: "Последна стъпка преди реализация",
      active: true,
    },
  ],
  en: [
    {
      done: true,
      label: "We identified the cause",
      detail: "Improving an area in Bunardzhika Park",
    },
    {
      done: true,
      label: "Secured partnership with Orgachim",
      detail: "Materials and tools for execution",
    },
    {
      done: true,
      label: "Found the artist team",
      detail: "Concept visuals developed",
    },
    {
      done: false,
      label: "Coordination with Central District next",
      detail: "The final step before execution",
      active: true,
    },
  ],
};

const DONE_COUNT = 5;
const TOTAL_COUNT = 7;
const PCT = Math.round((DONE_COUNT / TOTAL_COUNT) * 100);

export default function FirstInitiative() {
  const lang = useAtomValue(langAtom);
  const steps = milestones[lang];

  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative hill silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 160,
          opacity: 0.04,
          pointerEvents: "none",
        }}
      >
        <path
          d="M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z"
          fill="var(--plum)"
        />
      </svg>

      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "В процес" : "In Progress"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg" ? "RE-CONNECT БУНАРДЖИКА" : "RE-CONNECT BUNARDZHIKA"}
          </h2>
          <p style={{ maxWidth: 560, margin: "16px auto 0", fontSize: "1rem" }}>
            {lang === "bg"
              ? "Първата ни конкретна стъпка за Пловдив — реална намеса в едно от най-разпознаваемите му места."
              : "Our first concrete step for Plovdiv — a real intervention in one of its most recognizable places."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.15fr) minmax(280px, 1fr)",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "start",
          }}
          className="fi-grid"
        >
          {/* ── Left: story + facts ── */}
          <div>
            {/* Active badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "oklch(92% 0.05 150)",
                borderRadius: 100,
                padding: "6px 14px",
                marginBottom: 24,
              }}
            >
              <span
                className="animate-pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "oklch(52% 0.15 150)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "oklch(34% 0.1 150)",
                  letterSpacing: "0.08em",
                }}
              >
                {lang === "bg" ? "АКТИВНА" : "ACTIVE"}
              </span>
            </div>

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
              {lang === "bg"
                ? 'Съвременна графична намеса около чешмичката на „Кръгчето" в парк Бунарджика — превръщаме транзитна точка в място, което хората забелязват и преживяват.'
                : "Contemporary graphic art intervention around the fountain at 'Krugcheto' in Bunardzhika Park — turning a transit point into a place people notice and experience."}
            </p>

            {/* Location + format pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 28,
                position: "relative",
              }}
              className="max-sm:-bottom-3!"
            >
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
                }}
                className="text-[0.72rem] max-sm:text-[0.52rem] max-sm:grow grow-0 justify-center"
              >
                <IconPin />
                {lang === "bg" ? "Бунарджика, Пловдив" : "Bunardzhika, Plovdiv"}
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
                }}
                className="text-[0.72rem] max-sm:text-[0.52rem] max-sm:grow grow-0 justify-center"
              >
                <IconBrush />
                {lang === "bg"
                  ? "Съвременно графично изкуство"
                  : "Contemporary graphic art"}
              </span>
            </div>

            {/* Mission connection */}
            <div
              style={{
                background: "var(--plum-lt)",
                borderRadius: "var(--r-md)",
                padding: "22px 24px",
                marginBottom: 28,
              }}
            >
              <div className="label-tag" style={{ marginBottom: 10 }}>
                {lang === "bg" ? "Защо тепетата?" : "Why the hills?"}
              </div>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.72,
                  margin: 0,
                  color: "var(--plum)",
                }}
              >
                {lang === "bg"
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
                marginBottom: 32,
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
                  {lang === "bg"
                    ? "Техническо партньорство"
                    : "Technical partner"}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--plum)",
                    fontSize: "0.92rem",
                  }}
                >
                  Оргахим
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "0.72rem",
                  color: "var(--text-soft)",
                  textAlign: "right",
                  lineHeight: 1.5,
                  maxWidth: 140,
                }}
              >
                {lang === "bg"
                  ? "Материали и инструменти за реализация"
                  : "Materials & tools for execution"}
              </div>
            </div>

            <div className="flex gap-2 max-[700px]:flex-col">
              <Link
                href="/initiatives#first-initiative"
                className="btn btn-primary justify-center"
              >
                {lang === "bg" ? "Виж инициативата" : "View the initiative"}{" "}
                <IconArrow />
              </Link>
              <Link
                href="/initiatives"
                className="btn btn-secondary max-[1200px]:w-full w-fit justify-center"
              >
                {lang === "bg"
                  ? "Разбери повече за приноса ни"
                  : "Learn more about our contribution"}{" "}
                <IconLink />
              </Link>
            </div>
          </div>

          {/* ── Right: progress card ── */}
          <div className="card" style={{ padding: "32px 28px" }}>
            {/* Progress summary */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 10,
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {lang === "bg" ? "Напредък" : "Progress"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-soft)",
                      marginLeft: 8,
                    }}
                  >
                    {DONE_COUNT}/{TOTAL_COUNT}{" "}
                    {lang === "bg" ? "стъпки" : "steps"}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "var(--plum)",
                  }}
                >
                  {PCT}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${PCT}%` }} />
              </div>
              <p
                style={{
                  marginTop: 8,
                  fontSize: "0.75rem",
                  color: "var(--text-soft)",
                  fontStyle: "italic",
                }}
              >
                {lang === "bg"
                  ? "Напредък по подготовката — не финално одобрение."
                  : "Preparation progress — not final approval."}
              </p>
            </div>

            {/* Milestone list */}
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {lang === "bg" ? "Ключови стъпки" : "Key steps"}
            </div>
            <div style={{ marginBottom: 28 }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    position: "relative",
                  }}
                >
                  {/* Dot + connector */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: 26,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: step.done
                          ? "var(--caramel)"
                          : "var(--plum-lt)",
                        border: step.active ? "2px solid var(--plum)" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: step.done ? "white" : "var(--plum-mid)",
                        zIndex: 1,
                      }}
                    >
                      {step.done ? <IconCheck /> : <IconClock />}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 16,
                          background: step.done
                            ? "oklch(76% 0.10 52)"
                            : "var(--border)",
                          margin: "3px 0",
                        }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div
                    style={{
                      paddingBottom: i < steps.length - 1 ? 18 : 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: step.active ? 700 : 600,
                        fontSize: "0.88rem",
                        color: step.done
                          ? "var(--text)"
                          : step.active
                            ? "var(--plum)"
                            : "var(--text-soft)",
                        marginBottom: 2,
                        paddingTop: 4,
                      }}
                    >
                      {step.label}
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: step.done
                          ? "var(--text-soft)"
                          : "var(--text-soft)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote / CTA */}
            <div
              style={{
                background: "var(--plum)",
                borderRadius: "var(--r-sm)",
                padding: "18px 20px",
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "oklch(94% 0.03 315)",
                  fontStyle: "italic",
                  margin: "0 0 10px",
                  lineHeight: 1.65,
                }}
              >
                {lang === "bg"
                  ? '"Всяко закупено барче ТЕПЕ bite е пряк принос към тази инициатива."'
                  : '"Every ТЕПЕ bite bar purchased is a direct contribution to this initiative."'}
              </p>
              <Link
                href="/order"
                className="btn"
                style={{
                  background: "var(--caramel)",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "0.82rem",
                  borderRadius: 100,
                  display: "inline-flex",
                  gap: 6,
                  alignItems: "center",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {lang === "bg" ? "Поръчай и подкрепи" : "Order & support"}{" "}
                <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .fi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
