"use client";

import { IconArrow, IconStar } from "@/components/icons";
import InitiativeCard from "@/components/public/InitiativeCard";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import { PhaseBreakdown } from "@/components/public/PhaseBreakdown";
import { pick } from "@/components/public/impactUi";
import { formatMoneyBGN, formatMoneyEUR } from "@/lib/money";
import type { OverviewData } from "@/lib/public/initiatives";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

/* ─── small building blocks ───────────────────────────────────────────────── */

function SectionHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div style={{ marginBottom: 36, maxWidth: 640 }}>
      <div className="label-tag" style={{ marginBottom: 12 }}>
        {label}
      </div>
      <h2 className="heading-lg" style={{ marginBottom: intro ? 12 : 0 }}>
        {title}
      </h2>
      {intro && <p style={{ fontSize: "1rem", margin: 0 }}>{intro}</p>}
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}
    >
      {children}
    </div>
  );
}

function CountPill({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 9,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 100,
        padding: "8px 18px",
        boxShadow: "var(--shadow)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "var(--caramel)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "0.82rem",
          color: "var(--text-mid)",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── top stats band ──────────────────────────────────────────────────────── */

function TopBand({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const { stats } = data;
  const invested = stats.investedTotalCents;
  const totals = {
    available: invested,
    arranged: stats.arrangedTotalCents,
    planned: stats.plannedTotalCents,
    total: invested + stats.arrangedTotalCents + stats.plannedTotalCents,
    recordCount: 0,
  };
  const hasFinance = totals.total > 0;

  const pills: { value: number | string; label: string }[] = [];
  if (stats.realisedCount > 0)
    pills.push({
      value: stats.realisedCount,
      label: bg ? "завършени инициативи" : "completed initiatives",
    });
  if (data.byStatus.in_progress.length > 0)
    pills.push({
      value: data.byStatus.in_progress.length,
      label: bg ? "инициатива в прогрес" : "initiative in motion",
    });
  if (stats.partnerCount > 0)
    pills.push({
      value: stats.partnerCount,
      label: bg ? "партньори" : "partners",
    });

  return (
    <section
      style={{
        background:
          "radial-gradient(ellipse 62% 60% at 22% 15%, oklch(90% 0.05 230 / 0.5), transparent), radial-gradient(ellipse 55% 50% at 95% 90%, oklch(92% 0.06 52 / 0.4), transparent), var(--bg)",
        paddingTop: 132,
        paddingBottom: "clamp(52px, 6vw, 84px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="label-tag"
          style={{ color: "var(--sky-dk)", marginBottom: 18 }}
        >
          {bg ? "Нашето въздействие" : "Our impact"}
        </div>

        {invested > 0 ? (
          <>
            <h1
              className="heading-xl"
              style={{ maxWidth: 860, marginBottom: 14 }}
            >
              {bg ? "Вложихме " : "We've invested "}
              <span style={{ color: "var(--caramel)" }}>
                {formatMoneyEUR(invested)}
              </span>
              {bg ? " в социални инициативи" : " in social initiatives"}
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-mid)",
                marginBottom: 26,
              }}
            >
              {formatMoneyBGN(invested)} ·{" "}
              {bg
                ? "реално вложени средства за Пловдив"
                : "actually invested for Plovdiv"}
            </p>
          </>
        ) : (
          <>
            <h1
              className="heading-xl"
              style={{ maxWidth: 780, marginBottom: 18 }}
            >
              {bg
                ? "Изграждаме видима промяна за Пловдив"
                : "Building visible change for Plovdiv"}
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-mid)",
                marginBottom: 26,
                maxWidth: 620,
              }}
            >
              {bg
                ? "Всяко барче добавя фиксираните 0.15 € към фонда. Ето какво вече задвижихме — открито и проследимо."
                : "Every bar adds the fixed 0.15 € to the fund. Here's what we've already set in motion — openly and traceably."}
            </p>
          </>
        )}

        {pills.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: hasFinance ? 40 : 0,
            }}
          >
            {pills.map((p) => (
              <CountPill key={p.label} value={p.value} label={p.label} />
            ))}
          </div>
        )}

        {hasFinance && (
          <div
            className="card"
            style={{ padding: "clamp(22px, 3vw, 32px)", maxWidth: 900 }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-soft)",
                marginBottom: 18,
              }}
            >
              {bg ? "Средства по фази" : "Funds by phase"}
            </div>
            <PhaseBreakdown
              totals={totals}
              lang={lang}
              note={
                bg
                  ? `Общо ${formatMoneyEUR(totals.total)} обвързани средства — от налични до планирани.`
                  : `${formatMoneyEUR(totals.total)} committed in total — from available to planned.`
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── spotlight ───────────────────────────────────────────────────────────── */

function Spotlight({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const f = data.featured;
  if (!f) return null;
  const title = pick(lang, f.titleBg, f.titleEn);
  const desc = pick(lang, f.descriptionBg, f.descriptionEn);
  const doneSteps = f.steps.filter((s) => s.done).length;
  const pct = f.steps.length
    ? Math.round((doneSteps / f.steps.length) * 100)
    : 0;

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div
          className="spotlight-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "stretch",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 320,
              background: "var(--surface2)",
            }}
          >
            {f.coverImage ? (
              <Image
                src={f.coverImage.url}
                alt={title}
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(145deg, var(--plum-lt), oklch(94% 0.05 52))",
                }}
              />
            )}
          </div>

          <div
            style={{
              padding: "clamp(28px, 3.5vw, 44px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                alignSelf: "flex-start",
                background: "var(--caramel-lt)",
                color: "oklch(46% 0.13 60)",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "var(--caramel)", display: "inline-flex" }}>
                <IconStar />
              </span>
              {bg ? "На фокус" : "In focus"}
            </div>

            <h2 className="heading-lg" style={{ margin: 0 }}>
              {title}
            </h2>
            <p
              style={{
                fontSize: "0.98rem",
                lineHeight: 1.7,
                color: "var(--text-mid)",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {desc}
            </p>

            {f.steps.length > 0 && f.status !== "frozen" && (
              <div>
                <div className="progress-track" style={{ marginBottom: 6 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span
                  style={{ fontSize: "0.82rem", color: "var(--text-soft)" }}
                >
                  {pct}% · {doneSteps}/{f.steps.length}{" "}
                  {bg ? "стъпки" : "steps"}
                </span>
              </div>
            )}

            <Link
              href={`/initiatives/${f.slug}`}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
            >
              {bg ? "Разгледай инициативата" : "Explore the initiative"}{" "}
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .spotlight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── status sections ─────────────────────────────────────────────────────── */

function InProgressSection({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const active = data.byStatus.in_progress;
  const planned = data.byStatus.planned;
  if (active.length === 0 && planned.length === 0) return null;

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <SectionHeader
          label={bg ? "Сега" : "Now"}
          title={bg ? "Инициативи в развитие" : "Initiatives in motion"}
          intro={
            bg
              ? "Проекти, по които работим в момента — плюс такива, които тепърва започваме."
              : "Projects we're working on right now — plus ones we're about to begin."
          }
        />
        <CardGrid>
          {active.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
          {planned.map((i) => (
            <InitiativeCard
              key={i.id}
              initiative={i}
              lang={lang}
              showPlannedBadge
            />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

function FinishedSection({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const done = data.byStatus.done;
  if (done.length === 0) return null;

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <SectionHeader
          label={bg ? "Постигнато" : "Achieved"}
          title={bg ? "Завършени инициативи" : "Completed initiatives"}
        />
        <CardGrid>
          {done.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

function FrozenSection({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const frozen = data.byStatus.frozen;
  if (frozen.length === 0) return null;

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <SectionHeader
          label={bg ? "На пауза" : "On hold"}
          title={bg ? "Замразени инициативи" : "Frozen initiatives"}
          intro={
            bg
              ? "Проекти, които са на пауза към момента — оставаме честни за причините."
              : "Projects currently on hold — we stay honest about the reasons."
          }
        />
        <CardGrid>
          {frozen.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

/* ─── developing / empty states ───────────────────────────────────────────── */

function DevelopingNote({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div
          style={{
            background:
              "linear-gradient(145deg, var(--sky-lt) 0%, var(--caramel-lt) 100%)",
            border: "1px dashed oklch(80% 0.07 230)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(32px, 5vw, 52px)",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--plum)",
              marginBottom: 12,
            }}
          >
            {bg
              ? "Разказът за нашето въздействие тепърва се пише"
              : "The story of our impact is only beginning"}
          </h3>
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "var(--text-mid)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {bg
              ? "Съвсем скоро тук ще виждате повече завършени проекти, партньори и вложени средства — стъпка по стъпка, открито и проследимо. Благодарим, че сте с нас от самото начало."
              : "Very soon you'll see more completed projects, partners and invested funds here — step by step, openly and traceably. Thank you for being with us from the very start."}
          </p>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div
        className="section-inner"
        style={{ maxWidth: 720, textAlign: "center", margin: "0 auto" }}
      >
        <div
          style={{
            background:
              "linear-gradient(145deg, var(--plum-lt) 0%, var(--caramel-lt) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(40px, 6vw, 72px) clamp(24px, 5vw, 48px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <span style={{ color: "var(--caramel)", transform: "scale(2.2)" }}>
              <IconStar />
            </span>
          </div>
          <h2 className="heading-md" style={{ marginBottom: 14 }}>
            {bg
              ? "Нашето въздействие тепърва започва"
              : "Our impact story is just beginning"}
          </h2>
          <p
            style={{
              fontSize: "1.02rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              maxWidth: 520,
              margin: "0 auto 28px",
            }}
          >
            {bg
              ? "Все още подготвяме първите си инициативи. Съвсем скоро тук ще споделяме конкретни проекти за Пловдив, партньорите зад тях и всяко вложено евро — открито и проследимо."
              : "We're still preparing our first initiatives. Very soon we'll share concrete projects for Plovdiv, the partners behind them, and every euro invested — openly and traceably."}
          </p>
          <Link href="/initiatives" className="btn btn-primary">
            {bg ? "Как работят инициативите ни" : "How our initiatives work"}{" "}
            <IconArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── page ────────────────────────────────────────────────────────────────── */

export default function InitiativesOverview({ data }: { data: OverviewData }) {
  const lang = useAtomValue(langAtom);
  const { byStatus, stats, hasAnyPartner } = data;

  const sparse =
    byStatus.done.length === 0 ||
    !hasAnyPartner ||
    (byStatus.in_progress.length === 0 && byStatus.planned.length === 0) ||
    stats.investedTotalCents === 0;

  return (
    <main>
      <TopBand data={data} lang={lang} />
      {data.hasAnyInitiative ? (
        <>
          <Spotlight data={data} lang={lang} />
          <PartnersCarousel items={data.partners} lang={lang} />
          <InProgressSection data={data} lang={lang} />
          <FinishedSection data={data} lang={lang} />
          <FrozenSection data={data} lang={lang} />
          {sparse && <DevelopingNote lang={lang} />}
        </>
      ) : (
        <EmptyState lang={lang} />
      )}
    </main>
  );
}
