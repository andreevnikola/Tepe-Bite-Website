"use client";

import { TIMELINE, MENTORS, type TimelineGroup, type TimelineStep } from "@/components/about/aboutContent";
import { renderWithFund } from "@/components/about/ImpactWord";
import { pick, StatusBadge, StepsProgress } from "@/components/public/impactUi";
import type { InitiativeDetail } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Global step index of the first step in each timeline group (static). */
const GROUP_OFFSETS = TIMELINE.reduce<number[]>((acc, _g, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + TIMELINE[i - 1].steps.length);
  return acc;
}, []);

/**
 * The story timeline. Every step body is always visible — no scroll-driven
 * expand/collapse (that reflowed on every scroll and felt laggy). Instead a
 * lightweight IntersectionObserver only recolours the spine dot for the step
 * nearest the reading line, so the spine "progresses" as you read without any
 * layout shift. On desktop each chapter is a two-column block: a sticky aside
 * carrying the chapter's context (intro, mentors, partner logo) beside the
 * step spine, so the section never feels empty.
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

  useEffect(() => {
    // A thin band across the middle of the viewport: whichever step crosses it
    // becomes "active". Recolours dots only — no size/layout changes, so it is
    // cheap and never janks.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
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
          <GroupBlock
            key={group.id}
            group={group}
            gi={gi}
            lang={lang}
            active={active}
            stepRefs={stepRefs}
            reconnect={reconnect}
          />
        ))}
      </div>

      <style>{`
        .tl-group {
          display: grid;
          justify-content: center;
          gap: clamp(28px, 3vw, 52px);
          align-items: start;
          margin-bottom: clamp(56px, 7vw, 96px);
        }
        .tl-group:last-child { margin-bottom: 0; }
        .tl-group--left { grid-template-columns: minmax(0, 340px) minmax(0, 620px); }
        .tl-group--right { grid-template-columns: minmax(0, 620px) minmax(0, 340px); }
        .tl-group--right .tl-aside { order: 2; }
        .tl-group--right .tl-steps-col { order: 1; }
        .tl-aside { position: sticky; top: 88px; align-self: start; }

        .tl-steps { list-style: none; position: relative; padding-left: 0; margin: 0; }
        .tl-spine {
          position: absolute;
          left: 15px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: var(--border);
          border-radius: 2px;
        }
        .tl-step {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: clamp(14px, 2vw, 24px);
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
        .mentor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .mentor-photo { position: relative; aspect-ratio: 1 / 1; border-radius: var(--r-md); overflow: hidden; background: var(--plum-lt); }

        @media (max-width: 960px) {
          .tl-group--left, .tl-group--right { grid-template-columns: 1fr; }
          .tl-group--right .tl-aside, .tl-group--right .tl-steps-col { order: 0; }
          .tl-aside { position: static; margin-bottom: 4px; }
        }
        @media (max-width: 460px) {
          .mentor-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </section>
  );
}

/* ── One chapter: sticky context aside + step spine ────────────────────────── */
function GroupBlock({
  group,
  gi,
  lang,
  active,
  stepRefs,
  reconnect,
}: {
  group: TimelineGroup;
  gi: number;
  lang: Lang;
  active: number;
  stepRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  reconnect: InitiativeDetail | null;
}) {
  const isTeen = group.id === "teenovator";

  return (
    <div className={`tl-group ${isTeen ? "tl-group--left" : "tl-group--right"}`}>
      <aside className="tl-aside">
        <GroupAside group={group} lang={lang} />
      </aside>

      <div className="tl-steps-col">
        <ol className="tl-steps">
          <span className="tl-spine" aria-hidden="true" />
          {group.steps.map((step, si) => {
            const idx = GROUP_OFFSETS[gi] + si;
            const isActive = idx === active || step.highlight;
            const isPast = idx < active && !step.highlight;
            return (
              <li
                key={step.titleBg}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                data-idx={idx}
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
                      boxShadow: isActive ? "0 0 0 6px oklch(32% 0.09 315 / 0.12)" : "none",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                </div>

                <div style={{ paddingBottom: "clamp(22px, 3vw, 38px)" }}>
                  {step.highlight ? (
                    <NowPanel step={step} lang={lang} />
                  ) : (
                    <>
                      {(step.metaBg || step.metaEn) && (
                        <div className="label-tag" style={{ marginBottom: 6 }}>
                          {pick(lang, step.metaBg ?? "", step.metaEn ?? "")}
                        </div>
                      )}
                      <h3 className="heading-md" style={{ margin: 0, color: "var(--plum)" }}>
                        {pick(lang, step.titleBg, step.titleEn)}
                      </h3>
                      <div style={{ marginTop: 10 }}>
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
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* ── Chapter aside: phase, title, intro + chapter-specific context ─────────── */
function GroupAside({ group, lang }: { group: TimelineGroup; lang: Lang }) {
  const bg = lang === "bg";
  const isTeen = group.id === "teenovator";

  // Split the Teenovator intro so the "what Teenovator is" description sits in
  // its own callout (with the logo to its left), followed by the ТЕПЕ-bite
  // origin line as a normal paragraph.
  const intro = pick(lang, group.introBg, group.introEn);
  const marker = bg ? "Идеята за ТЕПЕ bite" : "The idea for ТЕПЕ bite";
  const mi = intro.indexOf(marker);
  const introLead = isTeen && mi > 0 ? intro.slice(0, mi).trim() : "";
  const introRest = isTeen && mi > 0 ? intro.slice(mi).trim() : intro;

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--caramel)",
          letterSpacing: "0.02em",
          marginBottom: 6,
        }}
      >
        {pick(lang, group.phaseBg, group.phaseEn)}
      </div>

      <h3 className="heading-lg" style={{ margin: "6px 0 0", fontSize: "clamp(1.5rem, 2.4vw, 2rem)" }}>
        {pick(lang, group.titleBg, group.titleEn)}
      </h3>

      {isTeen && introLead && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 18,
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            padding: "16px 18px",
          }}
        >
          <Image
            src="/partners/Teenovator Logo.jpg"
            alt="Teenovator"
            width={64}
            height={64}
            style={{ height: 56, width: "auto", borderRadius: 12, display: "block", flexShrink: 0 }}
          />
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.55 }}>{introLead}</p>
        </div>
      )}

      <p style={{ marginTop: 14 }}>{introRest}</p>

      {isTeen && (
        <div style={{ marginTop: 26 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Нашите ментори" : "Our mentors"}
          </div>
          <div className="mentor-grid">
            {MENTORS.map((m) => (
              <div key={m.name}>
                <div className="mentor-photo">
                  <Image src={m.photo} alt={m.name} fill sizes="180px" style={{ objectFit: "cover" }} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--plum)",
                    marginTop: 10,
                    lineHeight: 1.2,
                  }}
                >
                  {m.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginTop: 2 }}>
                  {pick(lang, m.expertiseBg, m.expertiseEn)}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: "0.92rem" }}>
            {bg
              ? "Благодарим на Маргарита и Антон — за юридическото лице, под което започнахме да продаваме, за всеки отворен контакт и за подкрепата във всяка непозната ситуация."
              : "Thank you to Margarita and Anton — for the legal entity we started selling under, for every contact they opened, and for their support in every unfamiliar situation."}
          </p>
        </div>
      )}

      {!isTeen && (
        <div style={{ marginTop: 26 }}>
          <Image
            src="/partners/FantasticoGroupLongLogo.png"
            alt="Fantastico Group"
            width={261}
            height={121}
            style={{ height: 48, width: "auto", display: "block" }}
          />
          <div
            style={{
              marginTop: 10,
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "var(--text-soft)",
            }}
          >
            {bg ? "Партньорът на тази глава" : "The partner of this chapter"}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Distinct "now" panel ──────────────────────────────────────────────────── */
function NowPanel({ step, lang }: { step: TimelineStep; lang: Lang }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 100%)",
        borderRadius: "var(--r-lg)",
        padding: "clamp(24px, 3vw, 34px)",
        color: "white",
        boxShadow: "var(--shadow-lg)",
        maxWidth: 640,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--caramel)",
          color: "white",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "5px 12px",
          borderRadius: 100,
        }}
      >
        <span className="now-dot" />
        {pick(lang, step.metaBg ?? "", step.metaEn ?? "")}
      </span>
      <h3
        className="heading-md"
        style={{ margin: "14px 0 0", color: "white", position: "relative", zIndex: 1 }}
      >
        {pick(lang, step.titleBg, step.titleEn)}
      </h3>
      <p style={{ margin: "10px 0 0", color: "oklch(90% 0.03 310)", position: "relative", zIndex: 1 }}>
        {renderWithFund(pick(lang, step.bodyBg, step.bodyEn), "cream")}
      </p>

      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: "absolute", left: 0, right: 0, bottom: -1, width: "100%", height: 90, opacity: 0.1 }}
      >
        <path
          d="M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z"
          fill="white"
        />
      </svg>

      <style>{`
        .now-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: white; display: inline-block;
          animation: pulse-dot 1.6s ease-in-out infinite;
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
