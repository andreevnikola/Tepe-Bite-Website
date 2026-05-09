"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export interface LegalSection {
  id: string;
  labelBg: string;
  labelEn: string;
}

interface LegalPageLayoutProps {
  titleBg: string;
  titleEn: string;
  subtitleBg?: string;
  subtitleEn?: string;
  sections?: LegalSection[];
  children: React.ReactNode;
  /** Hide the back-to-legal breadcrumb segment (e.g. on the index page itself) */
  isIndex?: boolean;
}

export default function LegalPageLayout({
  titleBg,
  titleEn,
  subtitleBg,
  subtitleEn,
  sections,
  children,
  isIndex = false,
}: LegalPageLayoutProps) {
  const lang = useAtomValue(langAtom);
  const title = lang === "bg" ? titleBg : titleEn;
  const subtitle = lang === "bg" ? subtitleBg : subtitleEn;
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!sections?.length) return;
    const onScroll = () => {
      const offset = 100;
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = s.id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <>
      {/* Plum header */}
      <div
        style={{
          background: "var(--plum)",
          paddingTop: "clamp(88px, 12vw, 130px)",
          paddingBottom: "clamp(40px, 5vw, 60px)",
          paddingLeft: "clamp(20px, 5vw, 60px)",
          paddingRight: "clamp(20px, 5vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav
            aria-label={lang === "bg" ? "Навигация" : "Breadcrumb"}
            style={{ marginBottom: 18, fontSize: "0.8rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2px 0" }}
          >
            <Link
              href="/"
              style={{ color: "oklch(72% 0.12 52)", textDecoration: "none" }}
            >
              {lang === "bg" ? "Начало" : "Home"}
            </Link>
            <span style={{ color: "oklch(50% 0.04 315)", margin: "0 7px" }}>›</span>
            {isIndex ? (
              <span style={{ color: "oklch(80% 0.04 310)" }}>
                {lang === "bg" ? "Правна информация" : "Legal Center"}
              </span>
            ) : (
              <>
                <Link
                  href="/legal"
                  style={{ color: "oklch(72% 0.12 52)", textDecoration: "none" }}
                >
                  {lang === "bg" ? "Правна информация" : "Legal"}
                </Link>
                <span style={{ color: "oklch(50% 0.04 315)", margin: "0 7px" }}>›</span>
                <span style={{ color: "oklch(80% 0.04 310)" }}>{title}</span>
              </>
            )}
          </nav>

          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "white",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                color: "oklch(78% 0.04 310)",
                fontSize: "1rem",
                margin: "0 0 0",
                maxWidth: 620,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}

          <div
            style={{
              marginTop: 20,
              fontSize: "0.78rem",
              color: "oklch(55% 0.04 315)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span aria-hidden="true">📅</span>
            <span>
              {lang === "bg"
                ? "Последна актуализация: 09.05.2026"
                : "Last updated: 09 May 2026"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main
        style={{ background: "var(--bg)", minHeight: "60vh" }}
        id="legal-content"
      >
        {sections && sections.length > 0 ? (
          <>
            {/* Mobile TOC — full-width, edge to edge */}
            <div className="legal-toc-mobile">
              <div style={{
                display: "flex",
                gap: 20,
                padding: "10px 16px",
                alignItems: "center",
                flexWrap: "nowrap",
              }}>
                <span style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-soft)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {lang === "bg" ? "Раздели" : "Sections"}
                </span>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} style={{
                    fontSize: "0.82rem",
                    color: "var(--plum)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}>
                    {lang === "bg" ? s.labelBg : s.labelEn}
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop: sidebar + content */}
            <div className="legal-two-col">
              <aside className="legal-toc-desktop">
                <div style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)",
                  paddingBottom: 8,
                  overflow: "hidden",
                }}>
                  <div style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "var(--text-soft)",
                    fontWeight: 700,
                    padding: "12px 16px 10px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 4,
                  }}>
                    {lang === "bg" ? "Раздели" : "Sections"}
                  </div>
                  {sections.map((s) => {
                    const active = s.id === activeId;
                    return (
                      <a key={s.id} href={`#${s.id}`} style={{
                        display: "block",
                        padding: "7px 16px",
                        fontSize: "0.84rem",
                        color: "var(--plum)",
                        textDecoration: active ? "underline" : "none",
                        fontWeight: active ? 700 : 500,
                        lineHeight: 1.4,
                      }}>
                        {lang === "bg" ? s.labelBg : s.labelEn}
                      </a>
                    );
                  })}
                </div>
              </aside>
              <div>{children}</div>
            </div>
          </>
        ) : (
          <div style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 56px) clamp(20px, 5vw, 60px) clamp(48px, 6vw, 72px)",
          }}>
            {children}
          </div>
        )}

        <style>{`
          .legal-toc-mobile {
            display: none;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            overflow-x: auto;
          }
          .legal-toc-desktop { display: block; }
          .legal-two-col {
            max-width: 1120px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 0 40px;
            align-items: start;
            padding: clamp(32px, 5vw, 56px) clamp(20px, 5vw, 60px) clamp(48px, 6vw, 72px);
          }
          .legal-toc-desktop {
            position: sticky;
            top: 90px;
            align-self: start;
          }
          @media (max-width: 767px) {
            .legal-toc-mobile { display: block; }
            .legal-toc-desktop { display: none; }
            .legal-two-col {
              display: block;
              max-width: 860px;
              padding: clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px) clamp(48px, 6vw, 72px);
            }
          }
        `}</style>
      </main>

      {/* Bottom nav */}
      {!isIndex && (
        <div
          style={{
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            padding: "20px clamp(20px, 5vw, 60px)",
          }}
        >
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link
              href="/legal"
              style={{
                color: "var(--plum)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← {lang === "bg" ? "Всички правни документи" : "All legal documents"}
            </Link>
            <a
              href="mailto:tepe@mail.bg"
              style={{
                color: "var(--text-soft)",
                fontSize: "0.82rem",
                textDecoration: "none",
              }}
            >
              {lang === "bg" ? "Въпроси: " : "Questions: "}
              <span style={{ color: "var(--plum)" }}>tepe@mail.bg</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Helper sub-components (exported for use in legal pages) ─────────── */

export function LegalSectionCard({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        padding: "clamp(22px, 3vw, 34px)",
        marginBottom: 18,
        boxShadow: "var(--shadow)",
        scrollMarginTop: 90,
      }}
    >
      {title && (
        <h2
          style={{
            fontFamily: "var(--font-head)",
            color: "var(--plum)",
            fontSize: "1.2rem",
            fontWeight: 700,
            margin: "0 0 14px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function LegalTodo({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "oklch(99% 0.025 75)",
        border: "1px dashed var(--caramel)",
        borderRadius: "var(--r-sm)",
        padding: "10px 14px",
        margin: "10px 0",
        fontSize: "0.78rem",
        color: "oklch(50% 0.12 55)",
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      {/* TODO business owner / legal / accountant confirmation */}
      <span style={{ flexShrink: 0 }}>⚠</span>
      <span>
        <strong>TODO:</strong> {label}
      </span>
    </div>
  );
}

export function LegalNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "oklch(97% 0.015 315)",
        border: "1px solid oklch(85% 0.05 315)",
        borderRadius: "var(--r-sm)",
        padding: "12px 16px",
        margin: "12px 0",
        fontSize: "0.85rem",
        color: "var(--text-mid)",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

export const bodyText: React.CSSProperties = {
  color: "var(--text)",
  lineHeight: 1.75,
  fontSize: "0.95rem",
  margin: "0 0 12px",
};

export const subheading: React.CSSProperties = {
  fontFamily: "var(--font-head)",
  color: "var(--plum)",
  fontSize: "1rem",
  fontWeight: 700,
  margin: "20px 0 8px",
};
