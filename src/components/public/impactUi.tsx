"use client";

import { IconStar } from "@/components/icons";
import {
  INITIATIVE_STATUS_LABELS,
  INITIATIVE_CATEGORY_LABELS,
  INFLOW_PHASE_LABELS,
  INFLOW_SOURCE_LABELS,
  ARRANGED_TYPE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
  type InitiativeStatus,
  type InitiativeCategory,
} from "@/lib/dashboard/constants";
import type { Lang } from "@/store/lang";

/* ─── lang picker ─────────────────────────────────────────────────────────── */
export const pick = (lang: Lang, bg: string, en: string) =>
  lang === "en" && en ? en : bg;

/* ─── status → colour ─────────────────────────────────────────────────────── */
export const STATUS_STYLE: Record<
  InitiativeStatus,
  { bg: string; color: string }
> = {
  planned: { bg: "var(--sky-lt)", color: "var(--sky-dk)" },
  in_progress: { bg: "var(--caramel-lt)", color: "oklch(42% 0.12 52)" },
  done: { bg: "oklch(93% 0.04 150)", color: "oklch(34% 0.1 150)" },
  frozen: { bg: "oklch(93% 0.035 235)", color: "oklch(40% 0.09 240)" },
};

export function StatusBadge({
  status,
  lang,
}: {
  status: InitiativeStatus;
  lang: Lang;
}) {
  const s = STATUS_STYLE[status];
  const label = INITIATIVE_STATUS_LABELS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.color,
        borderRadius: 100,
        padding: "4px 12px",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {status === "in_progress" && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "currentColor",
            animation: "pulse-dot 2s infinite",
          }}
          aria-hidden="true"
        />
      )}
      {lang === "en" ? label.en : label.bg}
    </span>
  );
}

export function CategoryChip({
  category,
  lang,
}: {
  category: InitiativeCategory;
  lang: Lang;
}) {
  const label = INITIATIVE_CATEGORY_LABELS[category];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--plum-lt)",
        color: "var(--plum)",
        borderRadius: 100,
        padding: "4px 12px",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {lang === "en" ? label.en : label.bg}
    </span>
  );
}

export function StarBadge({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "var(--caramel-lt)",
        color: "oklch(46% 0.13 60)",
        borderRadius: 100,
        padding: compact ? "3px 9px" : "5px 13px",
        fontSize: compact ? "0.64rem" : "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ color: "var(--caramel)", display: "inline-flex" }}>
        <IconStar />
      </span>
      {compact
        ? lang === "en"
          ? "Star"
          : "Звезден"
        : lang === "en"
          ? "Star partner"
          : "Звезден партньор"}
    </span>
  );
}

/* ─── progress bar from steps ─────────────────────────────────────────────── */
export function StepsProgress({
  done,
  total,
  lang,
}: {
  done: number;
  total: number;
  lang: Lang;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-soft)",
          }}
        >
          {lang === "en" ? "Progress" : "Напредък"}
        </span>
        <span
          style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--plum)" }}
        >
          {pct}% · {done}/{total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── freeze note ─────────────────────────────────────────────────────────── */
export function FreezeNote({
  reasonBg,
  reasonEn,
  lang,
}: {
  reasonBg: string;
  reasonEn: string;
  lang: Lang;
}) {
  const reason = pick(lang, reasonBg, reasonEn);
  const base =
    lang === "en"
      ? "This initiative is currently frozen."
      : "Тази инициатива е замразена към момента.";
  const reasonLabel = lang === "en" ? "Reason" : "Причина";
  return (
    <div
      style={{
        background: STATUS_STYLE.frozen.bg,
        border: "1px solid oklch(84% 0.05 235)",
        borderRadius: "var(--r-sm)",
        padding: "12px 16px",
        fontSize: "0.85rem",
        color: STATUS_STYLE.frozen.color,
        lineHeight: 1.55,
      }}
    >
      <strong>{base}</strong>
      {reason ? (
        <>
          {" "}
          {reasonLabel}: {reason}
        </>
      ) : null}
    </div>
  );
}

/* ─── date ────────────────────────────────────────────────────────────────── */
export function formatDate(dateISO: string, lang: Lang): string {
  if (!dateISO) return "";
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* label maps re-exported for convenience */
export {
  INFLOW_PHASE_LABELS,
  INFLOW_SOURCE_LABELS,
  ARRANGED_TYPE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
};
