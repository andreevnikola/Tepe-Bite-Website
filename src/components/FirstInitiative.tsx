"use client";
import { IconArrow } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const PCT = 42;

const timelineSteps = {
  bg: [
    { done: true, label: "Инициативата е обявена" },
    { done: true, label: "Набиране на средства стартирало" },
    { done: false, label: "Достигане на 50% от целта", active: true },
    { done: false, label: "Реализация на проектите" },
    { done: false, label: "Финален отчет" },
  ],
  en: [
    { done: true, label: "Initiative announced" },
    { done: true, label: "Fundraising started" },
    { done: false, label: "Reaching 50% of goal", active: true },
    { done: false, label: "Projects implementation" },
    { done: false, label: "Final report" },
  ],
};

const keyStats = {
  bg: [
    ["Целева сума", "5 000 лв."],
    ["Събрани до момента", "2 100 лв."],
    ["Подкрепени млади хора", "12"],
    ["Следваща цел", "3 000 лв."],
  ],
  en: [
    ["Target amount", "5 000 BGN"],
    ["Raised so far", "2 100 BGN"],
    ["Young people supported", "12"],
    ["Next milestone", "3 000 BGN"],
  ],
};

export default function FirstInitiative() {
  const lang = useAtomValue(langAtom);
  const steps = timelineSteps[lang];
  const stats = keyStats[lang];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "В процес" : "In Progress"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg" ? "Първата ни инициатива" : "Our First Initiative"}
          </h2>
          <p style={{ maxWidth: 520, margin: "16px auto 0", fontSize: "1rem" }}>
            {lang === "bg"
              ? "Започваме с конкретна кауза и я проследяваме открито — от първата идея до реалния резултат."
              : "We start with a concrete cause and track it openly — from the first idea to the real result."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.2fr) minmax(280px, 1fr)",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "start",
          }}
          className="initiative-grid"
        >
          {/* Left: info */}
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
                marginBottom: 20,
              }}
            >
              <span
                className="animate-pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "oklch(52% 0.15 150)",
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

            <h3
              className="heading-md"
              style={{
                fontSize: "1.5rem",
                marginBottom: 16,
                color: "var(--plum)",
              }}
            >
              {lang === "bg"
                ? "Млади и активни — Пловдив 2025"
                : "Young and Active — Plovdiv 2025"}
            </h3>
            <p style={{ marginBottom: 24 }}>
              {lang === "bg"
                ? "Подкрепяме млади хора от Пловдив, които развиват социални и творчески проекти в общността. Целта е да покажем, че малки стъпки водят до реална промяна."
                : "We support young people from Plovdiv who develop social and creative projects in the community. The goal is to show that small steps lead to real change."}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {stats.map(([k, v], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{ color: "var(--text-soft)", fontSize: "0.9rem" }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--plum)",
                      fontFamily: "var(--font-head)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <Link href="initiatives#transition" className="btn btn-primary">
              {lang === "bg" ? "Виж напредъка" : "View Progress"} <IconArrow />
            </Link>
          </div>

          {/* Right: progress card */}
          <div className="card" style={{ padding: 36 }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 10,
                }}
              >
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
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "var(--plum)",
                  }}
                >
                  {PCT}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${PCT}%` }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <span
                  style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}
                >
                  0
                </span>
                <span
                  style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}
                >
                  5 000 лв.
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: 28 }}>
              <div className="label-tag" style={{ marginBottom: 14 }}>
                {lang === "bg" ? "Времева линия" : "Timeline"}
              </div>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 2,
                      background: step.done
                        ? "var(--caramel)"
                        : step.active
                          ? "var(--plum-lt)"
                          : "var(--border)",
                      border: step.active ? "2px solid var(--plum)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.done && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <polyline
                          points="2,7 5,10 12,3"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: step.done
                        ? "var(--text)"
                        : step.active
                          ? "var(--plum)"
                          : "var(--text-soft)",
                      fontWeight: step.active ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div
              style={{
                background: "var(--plum-lt)",
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--plum)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                {lang === "bg"
                  ? '"Всяко закупено барче ТЕПЕ bite е пряк принос към тази инициатива."'
                  : '"Every ТЕПЕ bite bar purchased is a direct contribution to this initiative."'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .initiative-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
