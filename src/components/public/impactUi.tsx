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

/* youth-led organisation emblem (small, matches icon style) */
function IconYouth() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ─── youth-led organisation badge ────────────────────────────────────────── */
export function YouthBadge({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "var(--plum-lt)",
        color: "var(--plum)",
        borderRadius: 100,
        padding: compact ? "3px 9px" : "5px 13px",
        fontSize: compact ? "0.64rem" : "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ display: "inline-flex" }}>
        <IconYouth />
      </span>
      {compact
        ? lang === "en"
          ? "Youth"
          : "Младежка"
        : lang === "en"
          ? "Youth-led"
          : "Младежка организация"}
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
          {done}/{total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── completion date pill (done initiatives) ─────────────────────────────── */
export function CompletedDateBadge({
  dateISO,
  lang,
  tone = "caramel",
}: {
  dateISO: string;
  lang: Lang;
  /** "green" reads as a success/done state (used where it stands in for the status badge). */
  tone?: "caramel" | "green";
}) {
  if (!dateISO) return null;
  const palette =
    tone === "green"
      ? { bg: "oklch(93% 0.04 150)", color: "oklch(34% 0.1 150)" }
      : { bg: "var(--caramel-lt)", color: "oklch(44% 0.13 55)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: palette.bg,
        color: palette.color,
        borderRadius: 100,
        padding: "4px 12px",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {lang === "en" ? "Completed" : "Завършена"} · {formatDate(dateISO, lang)}
    </span>
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
