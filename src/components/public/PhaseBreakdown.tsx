"use client";

import { INFLOW_PHASE_LABELS } from "@/lib/dashboard/constants";
import type { InflowDTO } from "@/lib/dashboard/dto";
import { formatMoneyEUR } from "@/lib/money";
import type { Lang } from "@/store/lang";
import Image from "next/image";

/* Phase colours — shared across every financial visual. */
export const PHASE_COLOR = {
  available: "oklch(52% 0.13 150)",
  arranged: "var(--caramel)",
  planned: "var(--sky-dk)",
} as const;

export type PhaseTotals = {
  available: number;
  arranged: number;
  planned: number;
  total: number;
  recordCount: number;
};

export function inflowPhaseTotals(inflows: InflowDTO[]): PhaseTotals {
  const t: PhaseTotals = { available: 0, arranged: 0, planned: 0, total: 0, recordCount: 0 };
  for (const f of inflows) {
    t[f.phase] += f.amountCents;
    t.total += f.amountCents;
    t.recordCount += 1;
  }
  return t;
}

/* Ordered most-mature → least (Available, Arranged, Planned) for both boxes and bar. */
const ORDER = ["available", "arranged", "planned"] as const;

/* ═══ FULL breakdown: three boxes + segmented bar + note ═══ */
export function PhaseBreakdown({
  totals,
  lang,
  note,
}: {
  totals: PhaseTotals;
  lang: Lang;
  note?: string;
}) {
  const bg = lang === "bg";
  const grand = totals.available + totals.arranged + totals.planned;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Boxes */}
      <div className="phase-boxes" style={{ display: "grid", gap: 14 }}>
        <style>{`
          .phase-boxes { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          @media (max-width: 540px) { .phase-boxes { grid-template-columns: 1fr; } }
        `}</style>
        {ORDER.map((phase) => (
          <div
            key={phase}
            className="card"
            style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 4,
                background: PHASE_COLOR[phase],
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-soft)",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: PHASE_COLOR[phase],
                  flexShrink: 0,
                }}
              />
              {INFLOW_PHASE_LABELS[phase][bg ? "bg" : "en"]}
            </div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.55rem",
                fontWeight: 700,
                color: "var(--plum)",
                lineHeight: 1.05,
              }}
            >
              {formatMoneyEUR(totals[phase])}
            </div>
          </div>
        ))}
      </div>

      {/* Segmented bar */}
      <div
        style={{
          display: "flex",
          height: 12,
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--border)",
        }}
        role="img"
        aria-label={bg ? "Разпределение по фази" : "Distribution by phase"}
      >
        {grand > 0 &&
          ORDER.map((phase) =>
            totals[phase] > 0 ? (
              <div
                key={phase}
                style={{
                  width: `${(totals[phase] / grand) * 100}%`,
                  background: PHASE_COLOR[phase],
                }}
                title={`${INFLOW_PHASE_LABELS[phase][bg ? "bg" : "en"]}: ${formatMoneyEUR(totals[phase])}`}
              />
            ) : null,
          )}
      </div>

      {/* Note */}
      {note !== "" && (
        <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", margin: 0 }}>
          {note ??
            (bg
              ? `Общо ${formatMoneyEUR(grand)} обвързани средства по всички фази.`
              : `${formatMoneyEUR(grand)} committed in total across all phases.`)}
        </p>
      )}
    </div>
  );
}

/* ═══ MINIMAL inline version for cards: thin bar + tiny total ═══ */
export function PhaseBarMini({
  totals,
  lang,
  label,
}: {
  totals: PhaseTotals;
  lang: Lang;
  label?: string;
}) {
  const bg = lang === "bg";
  const grand = totals.available + totals.arranged + totals.planned;
  if (grand <= 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-soft)",
          }}
        >
          {label ?? (bg ? "Финансова подкрепа" : "Financial support")}
        </span>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--caramel)" }}>
          {formatMoneyEUR(grand)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          height: 7,
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--border)",
        }}
      >
        {ORDER.map((phase) =>
          totals[phase] > 0 ? (
            <div
              key={phase}
              style={{ width: `${(totals[phase] / grand) * 100}%`, background: PHASE_COLOR[phase] }}
              title={`${INFLOW_PHASE_LABELS[phase][bg ? "bg" : "en"]}: ${formatMoneyEUR(totals[phase])}`}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

/* ═══ Funding SPLIT bar: ТЕПЕ bite Impact vs partnering organisations ═══ */
export function FundingSplitBar({
  impactCents,
  partnersCents,
  lang,
}: {
  impactCents: number;
  partnersCents: number;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const total = impactCents + partnersCents;
  if (total <= 0) return null;
  const impactPct = (impactCents / total) * 100;
  const partnersPct = (partnersCents / total) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--sky-dk)" }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-mid)" }}>
            {bg ? "Фонд ТЕПЕ bite Impact" : "ТЕПЕ bite Impact fund"}:{" "}
            <strong style={{ color: "var(--plum)" }}>{formatMoneyEUR(impactCents)}</strong>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--caramel)" }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-mid)" }}>
            {bg ? "Партньорски организации" : "Partnering organisations"}:{" "}
            <strong style={{ color: "var(--plum)" }}>{formatMoneyEUR(partnersCents)}</strong>
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          height: 40,
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--border)",
        }}
        role="img"
        aria-label={bg ? "Разпределение на финансирането" : "Funding split"}
      >
        {impactCents > 0 && (
          <div
            style={{
              width: `${impactPct}%`,
              background: "linear-gradient(90deg, var(--sky-dk), var(--sky-mid))",
              display: "flex",
              alignItems: "center",
              paddingLeft: 8,
              minWidth: 0,
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: 6,
                padding: "3px 6px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Image
                src="/TEPEbiteImpact.png"
                alt="ТЕПЕ bite Impact"
                width={72}
                height={22}
                style={{ height: 16, width: "auto", display: "block" }}
              />
            </span>
          </div>
        )}
        {partnersCents > 0 && (
          <div
            style={{
              width: `${partnersPct}%`,
              background: "linear-gradient(90deg, oklch(70% 0.15 55), var(--caramel))",
            }}
          />
        )}
      </div>
    </div>
  );
}
