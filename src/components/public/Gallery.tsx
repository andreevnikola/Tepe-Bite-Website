"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { pick } from "@/components/public/impactUi";
import type { GalleryItemDTO } from "@/lib/dashboard/dto";
import type { Lang } from "@/store/lang";

/**
 * Reusable image gallery: a thumbnail grid + a full-screen lightbox.
 * Used by the initiative detail page and the /initiatives up-close section.
 *
 * `heading`/`eyebrow` render an optional section header; omit them for an
 * embedded gallery (e.g. beneath a cover). `thumbMin` controls the thumbnail
 * grid density.
 */
export default function Gallery({
  items,
  lang,
  heading,
  eyebrow,
  thumbMin = 180,
}: {
  items: GalleryItemDTO[];
  lang: Lang;
  heading?: string;
  eyebrow?: string;
  thumbMin?: number;
}) {
  const bg = lang === "bg";
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback(
    (idx: number) => setOpen(((idx % items.length) + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") show(open + 1);
      else if (e.key === "ArrowLeft") show(open - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, show]);

  if (items.length === 0) return null;
  const current = open !== null ? items[open] : null;

  return (
    <div>
      {(eyebrow || heading) && (
        <div style={{ marginBottom: 24 }}>
          {eyebrow && (
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="heading-lg" style={{ margin: 0 }}>
              {heading}
            </h2>
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${thumbMin}px, 1fr))`,
          gap: 12,
        }}
      >
        {items.map((g, idx) => (
          <button
            key={g.id}
            type="button"
            onClick={() => show(idx)}
            className="card-hover"
            style={{
              position: "relative",
              aspectRatio: "4 / 3",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              cursor: "pointer",
              padding: 0,
              background: "var(--surface2)",
            }}
            aria-label={
              pick(lang, g.captionBg, g.captionEn) ||
              (bg ? `Снимка ${idx + 1}` : `Photo ${idx + 1}`)
            }
          >
            <Image
              src={g.url}
              alt={pick(lang, g.captionBg, g.captionEn)}
              fill
              sizes="(max-width: 760px) 50vw, 240px"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {/* ─── Lightbox ─────────────────────────────────────────────────────── */}
      {current && open !== null && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(20,12,26,0.94)",
            display: "flex",
            flexDirection: "column",
            animation: "page-fade-in 0.2s ease both",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Top bar: counter + close */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px clamp(14px, 3vw, 28px)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 600 }}>
              {open + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={bg ? "Затвори" : "Close"}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.14)",
                color: "white",
                fontSize: "1.3rem",
                cursor: "pointer",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Stage: arrows overlay the image, never push it out of view */}
          <div
            onClick={() => setOpen(null)}
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 clamp(8px, 2vw, 28px)",
            }}
          >
            {items.length > 1 && (
              <LightboxNav dir="prev" onClick={(e) => { e.stopPropagation(); show(open - 1); }} label={bg ? "Предишна" : "Previous"} />
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 1100,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <div style={{ position: "relative", width: "100%", flex: 1, minHeight: 0 }}>
                <Image
                  src={current.url}
                  alt={pick(lang, current.captionBg, current.captionEn)}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              {pick(lang, current.captionBg, current.captionEn) && (
                <p
                  style={{
                    margin: 0,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.88rem",
                    lineHeight: 1.5,
                    maxWidth: "90%",
                    flexShrink: 0,
                  }}
                >
                  {pick(lang, current.captionBg, current.captionEn)}
                </p>
              )}
            </div>

            {items.length > 1 && (
              <LightboxNav dir="next" onClick={(e) => { e.stopPropagation(); show(open + 1); }} label={bg ? "Следваща" : "Next"} />
            )}
          </div>

          {/* Bottom: all images as a centered, scrollable thumbnail strip */}
          {items.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="lightbox-strip"
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "safe center",
                overflowX: "auto",
                padding: "14px clamp(12px, 3vw, 28px) 18px",
                flexShrink: 0,
                scrollbarWidth: "none",
              }}
            >
              {items.map((g, idx) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => show(idx)}
                  aria-label={bg ? `Към снимка ${idx + 1}` : `Go to photo ${idx + 1}`}
                  style={{
                    position: "relative",
                    flex: "0 0 auto",
                    width: 68,
                    height: 50,
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    border: idx === open ? "2px solid white" : "2px solid transparent",
                    opacity: idx === open ? 1 : 0.55,
                    transition: "opacity 0.2s",
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Image src={g.url} alt="" fill sizes="68px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .lightbox-strip::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function LightboxNav({
  dir,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={
        {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          [dir === "prev" ? "left" : "right"]: "clamp(6px, 1.5vw, 20px)",
          zIndex: 2,
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.16)",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        } as React.CSSProperties
      }
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
