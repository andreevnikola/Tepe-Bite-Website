"use client";

import { IconInfo } from "@/components/icons";
import { INFLOW_PHASE_LABELS } from "@/lib/dashboard/constants";
import type { InflowDTO } from "@/lib/dashboard/dto";
import { formatMoneyEUR } from "@/lib/money";
import type { Lang } from "@/store/lang";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* Plain-language explanation of each phase, for the info popover — written for
   someone with zero prior context on how the fund works. */
const PHASE_INFO: Record<(typeof ORDER)[number], { bg: string; en: string }> = {
  available: {
    bg: "Средствата вече са реално преведени и достъпни — могат да се използват веднага за реализация на инициатива.",
    en: "The money has actually been transferred and is on hand — ready to be used for an initiative right away.",
  },
  arranged: {
    bg: "Финансирането е договорено и конкретно (напр. подписано партньорство или одобрен бюджет), но все още не е физически преведено.",
    en: "The funding is contracted and specific (e.g. a signed partnership or approved budget) but hasn't been physically transferred yet.",
  },
  planned: {
    bg: "Очакваме тези средства въз основа на предварителна оценка, но те още не са формално обвързани — сумата може да се променя.",
    en: "We expect this money based on an early estimate, but it isn't formally committed yet — the amount may still change.",
  },
};

/* Small click-to-toggle info button + popover — works on both hover-less
   touch screens and desktop, unlike a pure CSS :hover tooltip. */
function PhaseInfoButton({
  phase,
  lang,
}: {
  phase: (typeof ORDER)[number];
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const ref = useRef<HTMLDivElement>(null);
  const bg = lang === "bg";

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        marginLeft: "auto",
        display: "inline-flex",
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => {
            const next = !o;
            if (next && ref.current) {
              const r = ref.current.getBoundingClientRect();
              if (r.left < 120) setAlign("left");
              else if (window.innerWidth - r.right < 120) setAlign("right");
              else setAlign("center");
            }
            return next;
          });
        }}
        aria-label={bg ? "Какво означава това?" : "What does this mean?"}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "none",
          background: open ? "var(--border)" : "transparent",
          color: "var(--text-soft)",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <IconInfo size={13} />
      </button>
      {open && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 30,
            top: "calc(100% + 8px)",
            ...(align === "left"
              ? { left: 0 }
              : align === "right"
                ? { right: 0 }
                : { left: "50%", transform: "translateX(-50%)" }),
            width: 220,
            maxWidth: "calc(100vw - 32px)",
            background: "var(--plum)",
            color: "white",
            borderRadius: "var(--r-sm)",
            padding: "12px 14px",
            fontSize: "0.78rem",
            lineHeight: 1.55,
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: "normal",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {PHASE_INFO[phase][bg ? "bg" : "en"]}
        </div>
      )}
    </div>
  );
}

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
  const t: PhaseTotals = {
    available: 0,
    arranged: 0,
    planned: 0,
    total: 0,
    recordCount: 0,
  };
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
            style={{
              padding: "18px 20px",
              position: "relative",
              borderRadius: "var(--r-md)",
              // top accent drawn as an inset shadow so it follows the rounded
              // corners exactly (no overflow:hidden needed → popover can escape)
              boxShadow: `inset 0 4px 0 ${PHASE_COLOR[phase]}, var(--shadow)`,
            }}
          >
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
              <PhaseInfoButton phase={phase} lang={lang} />
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 10,
        }}
      >
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
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--caramel)",
          }}
        >
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
              style={{
                width: `${(totals[phase] / grand) * 100}%`,
                background: PHASE_COLOR[phase],
              }}
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
    <div
      style={{
        position: "relative",
        display: "flex",
        height: 60,
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--border)",
      }}
      role="img"
      aria-label={
        bg
          ? `Разпределение на финансирането: ТЕПЕ bite Impact ${formatMoneyEUR(impactCents)}, партньори ${formatMoneyEUR(partnersCents)}`
          : `Funding split: ТЕПЕ bite Impact ${formatMoneyEUR(impactCents)}, partners ${formatMoneyEUR(partnersCents)}`
      }
    >
      {impactCents > 0 && (
        <div
          title={`${bg ? "Фонд ТЕПЕ bite Impact" : "ТЕПЕ bite Impact fund"}: ${formatMoneyEUR(impactCents)}`}
          style={{
            width: `${impactPct}%`,
            background: "linear-gradient(90deg, var(--sky-dk), var(--sky-mid))",
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: 14,
            paddingRight: 10,
            minWidth: 0,
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 7,
              padding: "5px 8px",
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Image
              src="/brand/TEPEbiteImpact-crop.png"
              alt="ТЕПЕ bite Impact"
              width={90}
              height={42}
              style={{ height: 30, width: "auto", display: "block" }}
            />
          </span>
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {formatMoneyEUR(impactCents)}
          </span>
        </div>
      )}
      {partnersCents > 0 && (
        <div
          title={`${bg ? "Партньорски организации" : "Partnering organisations"}: ${formatMoneyEUR(partnersCents)}`}
          style={{
            width: `${partnersPct}%`,
            background:
              "linear-gradient(90deg, oklch(70% 0.15 55), var(--caramel))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            padding: "0 10px",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {bg ? "Партньори" : "Partners"} · {formatMoneyEUR(partnersCents)}
          </span>
        </div>
      )}
    </div>
  );
}
