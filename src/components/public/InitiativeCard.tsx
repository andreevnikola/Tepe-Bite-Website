"use client";

import Image from "next/image";
import Link from "next/link";
import { IconMap } from "@/components/icons";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import type { Lang } from "@/store/lang";
import {
  CategoryChip,
  StatusBadge,
  StepsProgress,
  FreezeNote,
  pick,
} from "@/components/public/impactUi";

function CoverPlaceholder() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(145deg, var(--plum-lt) 0%, oklch(94% 0.05 52) 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, width: "100%", opacity: 0.22 }}
      >
        <path
          d="M0 200 L0 120 Q150 50 300 90 Q450 130 600 70 L600 200 Z"
          fill="var(--plum)"
        />
      </svg>
    </div>
  );
}

export default function InitiativeCard({
  initiative,
  lang,
  showPlannedBadge = false,
}: {
  initiative: InitiativeDTO;
  lang: Lang;
  showPlannedBadge?: boolean;
}) {
  const title = pick(lang, initiative.titleBg, initiative.titleEn);
  const desc = pick(lang, initiative.descriptionBg, initiative.descriptionEn);
  const location = pick(lang, initiative.locationBg, initiative.locationEn);
  const doneSteps = initiative.steps.filter((s) => s.done).length;

  return (
    <Link
      href={`/initiatives/${initiative.slug}`}
      className="card card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        height: "100%",
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background: "var(--surface2)",
        }}
      >
        {initiative.coverImage ? (
          <Image
            src={initiative.coverImage.url}
            alt={title}
            fill
            sizes="(max-width: 760px) 100vw, 380px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <CoverPlaceholder />
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <StatusBadge status={initiative.status} lang={lang} />
          {initiative.category && (
            <CategoryChip category={initiative.category} lang={lang} />
          )}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--plum)",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </h3>

        {location && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.8rem",
              color: "var(--text-soft)",
            }}
          >
            <span style={{ display: "inline-flex", color: "var(--caramel)" }}>
              <IconMap />
            </span>
            {location}
          </div>
        )}

        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "var(--text-mid)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </p>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {showPlannedBadge && (
            <div
              style={{
                background: "var(--sky-lt)",
                border: "1px solid oklch(86% 0.05 235)",
                borderRadius: "var(--r-sm)",
                padding: "8px 12px",
                fontSize: "0.76rem",
                fontWeight: 600,
                color: "var(--sky-dk)",
                lineHeight: 1.45,
              }}
            >
              {lang === "en"
                ? "Planned — not yet started"
                : "Планирана — изпълнението още не е започнало"}
            </div>
          )}

          {initiative.status === "frozen" && (
            <FreezeNote
              reasonBg={initiative.frozenReasonBg}
              reasonEn={initiative.frozenReasonEn}
              lang={lang}
            />
          )}

          {initiative.steps.length > 0 && initiative.status !== "frozen" && (
            <StepsProgress
              done={doneSteps}
              total={initiative.steps.length}
              lang={lang}
            />
          )}

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--caramel)",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {lang === "en" ? "See details" : "Виж детайли"} →
          </span>
        </div>
      </div>
    </Link>
  );
}
