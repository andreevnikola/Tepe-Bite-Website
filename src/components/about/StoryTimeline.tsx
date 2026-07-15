"use client";

import { TIMELINE, MENTORS } from "@/components/about/aboutContent";
import { renderWithFund } from "@/components/about/ImpactWord";
import { pick, StatusBadge, StepsProgress } from "@/components/public/impactUi";
import type { InitiativeDetail } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Global step index of the first step in each timeline group (static). */
const GROUP_OFFSETS = TIMELINE.reduce<number[]>((acc, _g, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + TIMELINE[i - 1].steps.length);
  return acc;
}, []);

/** prefers-reduced-motion as a subscription (SSR-safe, no setState-in-effect). */
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * The story timeline. Every step is always on the spine; the one nearest the
 * reading line expands to show its full body, the rest collapse to just their
 * title — so the section "opens up" as you scroll. The first step is open on
 * load. Under prefers-reduced-motion everything is expanded and the scroll
 * tracking is skipped.
 */
export default function StoryTimeline({
  lang,
  reconnect,
}: {
  lang: Lang;
  reconnect: InitiativeDetail | null;
}) {
  const bg = lang === "bg";

  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Compute the active step directly on scroll (no rAF): a single pass of
    // getBoundingClientRect over ~13 nodes is cheap, and avoiding rAF keeps the
    // timeline working even when rAF is throttled (background/hidden tabs),
    // instead of getting stuck with only the first step expanded.
    const onScroll = () => {
      const focusY = window.innerHeight * 0.42;
      let idx = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= focusY) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        {/* Section header */}
        <header style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Нашата история" : "Our story"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 720 }}>
            {bg ? "Историята, която пишем" : "The story we're writing"}
          </h2>
          <p style={{ maxWidth: 620, margin: "16px auto 0" }}>
            {bg
              ? "От първата идея в един ученически екип до първата ни инициатива за Пловдив — ето как стигнахме дотук и накъде продължаваме."
              : "From the first idea inside a student team to our first initiative for Plovdiv — here's how we got here, and where we go next."}
          </p>
        </header>

        {TIMELINE.map((group, gi) => (
          <div key={group.id} style={{ marginBottom: gi === 0 ? "clamp(48px, 6vw, 80px)" : 0 }}>
            <GroupHeader group={group} lang={lang} />

            <ol className="tl-steps" style={{ listStyle: "none", position: "relative" }}>
              {/* the spine */}
              <span className="tl-spine" aria-hidden="true" />
              {group.steps.map((step, si) => {
                const idx = GROUP_OFFSETS[gi] + si;
                const isActive = !reduced && idx === active;
                const isPast = !reduced && idx < active;
                const open = reduced || isActive;
                return (
                  <li
                    key={step.titleBg}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    className="tl-step"
                  >
                    <div className="tl-marker" aria-hidden="true">
                      <span
                        className="tl-dot"
                        style={{
                          background: isActive
                            ? "var(--plum)"
                            : isPast
                              ? "var(--caramel)"
                              : "var(--surface)",
                          borderColor: isActive
                            ? "var(--plum)"
                            : isPast
                              ? "var(--caramel)"
                              : "var(--border)",
                          boxShadow: isActive
                            ? "0 0 0 6px oklch(32% 0.09 315 / 0.12)"
                            : "none",
                          transform: isActive ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    </div>

                    <div style={{ paddingBottom: "clamp(20px, 3vw, 34px)" }}>
                      {(step.metaBg || step.metaEn) && (
                        <div
                          className="label-tag"
                          style={{
                            marginBottom: 6,
                            opacity: open ? 1 : 0.55,
                            transition: "opacity 0.3s",
                          }}
                        >
                          {pick(lang, step.metaBg ?? "", step.metaEn ?? "")}
                        </div>
                      )}
                      <h3
                        className="heading-md"
                        style={{
                          margin: 0,
                          color: open ? "var(--plum)" : "var(--text-soft)",
                          transition: "color 0.3s",
                        }}
                      >
                        {pick(lang, step.titleBg, step.titleEn)}
                      </h3>

                      <div
                        className="tl-body"
                        style={{
                          maxHeight: open ? 1400 : 0,
                          opacity: open ? 1 : 0,
                          overflow: "hidden",
                          transition:
                            "max-height 0.5s ease, opacity 0.35s ease, margin-top 0.35s ease",
                          marginTop: open ? 10 : 0,
                        }}
                      >
                        <p style={{ margin: 0, maxWidth: 620 }}>
                          {renderWithFund(pick(lang, step.bodyBg, step.bodyEn))}
                        </p>

                        {step.logo && (
                          <div style={{ marginTop: 16 }}>
                            <Image
                              src={step.logo.src}
                              alt={step.logo.alt}
                              width={916}
                              height={284}
                              style={{ height: step.logo.maxH, width: "auto", display: "block" }}
                            />
                          </div>
                        )}

                        {step.slot === "first-initiative" && reconnect && (
                          <FirstInitiativePanel detail={reconnect} lang={lang} />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      <style>{`
        .tl-steps { padding-left: 4px; }
        .tl-spine {
          position: absolute;
          left: 15px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(var(--border), var(--border));
          border-radius: 2px;
        }
        .tl-step {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: clamp(14px, 2.5vw, 26px);
          position: relative;
        }
        .tl-marker { display: flex; justify-content: center; padding-top: 4px; }
        .tl-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--border);
          display: block;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
}

/* ── Group header (phase + title + intro; group 1 also carries Teenovator) ─── */
function GroupHeader({
  group,
  lang,
}: {
  group: (typeof TIMELINE)[number];
  lang: Lang;
}) {
  const bg = lang === "bg";
  const isTeenovator = group.id === "teenovator";

  return (
    <div style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--caramel)",
            letterSpacing: "0.02em",
          }}
        >
          {pick(lang, group.phaseBg, group.phaseEn)}
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)", minWidth: 40 }} />
        {isTeenovator && (
          <Image
            src="/partners/Teenovator Logo.jpg"
            alt="Teenovator"
            width={42}
            height={42}
            style={{ height: 42, width: "auto", borderRadius: 10, display: "block" }}
          />
        )}
      </div>

      <h3 className="heading-lg" style={{ margin: "12px 0 0", fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)" }}>
        {pick(lang, group.titleBg, group.titleEn)}
      </h3>
      <p style={{ maxWidth: 660, marginTop: 12 }}>{pick(lang, group.introBg, group.introEn)}</p>

      {isTeenovator && (
        <div style={{ marginTop: 26 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Нашите ментори" : "Our mentors"}
          </div>
          <div className="mentor-grid">
            {MENTORS.map((m) => (
              <div
                key={m.name}
                className="card"
                style={{
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--plum-lt)",
                  }}
                >
                  <Image src={m.photo} alt={m.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: "1.02rem",
                      color: "var(--plum)",
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-soft)" }}>
                    {pick(lang, m.expertiseBg, m.expertiseEn)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ maxWidth: 660, marginTop: 16, fontSize: "0.95rem" }}>
            {bg
              ? "Благодарим на Маргарита и Антон за огромната подкрепа във всяка непозната ситуация — за юридическото лице, под което започнахме да продаваме, и за всеки контакт, който отвориха за нас."
              : "We thank Margarita and Anton for their immense support in every unfamiliar situation — for the legal entity under which we started selling, and for every contact they opened for us."}
          </p>
        </div>
      )}

      <style>{`
        .mentor-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          max-width: 620px;
        }
        @media (max-width: 560px) {
          .mentor-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ── First-initiative live panel (pulled by id, minimalistic) ──────────────── */
function FirstInitiativePanel({
  detail,
  lang,
}: {
  detail: InitiativeDetail;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const doneSteps = i.steps.filter((s) => s.done).length;

  return (
    <Link
      href={`/initiatives/${i.slug}`}
      className="card card-hover"
      style={{
        display: "flex",
        gap: 16,
        alignItems: "stretch",
        marginTop: 18,
        maxWidth: 560,
        padding: 0,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {i.coverImage && (
        <span
          style={{
            position: "relative",
            width: 120,
            flexShrink: 0,
            background: "var(--plum-lt)",
          }}
          className="fi-cover"
        >
          <Image
            src={i.coverImage.url}
            alt={pick(lang, i.titleBg, i.titleEn)}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
          />
        </span>
      )}
      <div style={{ padding: "16px 18px", minWidth: 0, flex: 1 }}>
        <div style={{ marginBottom: 8 }}>
          <StatusBadge status={i.status} lang={lang} />
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--plum)",
            lineHeight: 1.25,
          }}
        >
          {pick(lang, i.titleBg, i.titleEn)}
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginTop: 3 }}>
          {pick(lang, i.locationBg, i.locationEn)}
        </div>
        {i.steps.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <StepsProgress done={doneSteps} total={i.steps.length} lang={lang} />
          </div>
        )}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            color: "var(--caramel)",
            fontWeight: 600,
            fontSize: "0.84rem",
            marginTop: 12,
          }}
        >
          {bg ? "Виж инициативата" : "See the initiative"} →
        </span>
      </div>

      <style>{`
        @media (max-width: 460px) {
          .fi-cover { display: none !important; }
        }
      `}</style>
    </Link>
  );
}
