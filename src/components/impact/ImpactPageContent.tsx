"use client";

import { IconArrow, IconHeart, IconInsta, IconShop } from "@/components/icons";
import ImpactPledge, { PledgeHeart } from "@/components/ImpactPledge";
import { IMPACT } from "@/lib/config/impact";
import { formatDualMoney } from "@/lib/money";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

/* ── Engine-step icons (mirrors InitiativesPromo for consistency) ── */
const IconTarget = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);
const IconPartners = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCoins = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88l.7.71-2.82 2.82" />
  </svg>
);
const IconReport = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

/* ── Trust / "how the fund works" icons ── */
const IconVault = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10.5" width="16" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    <path d="M12 14.5v2.5" />
  </svg>
);
const IconGift = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
    <path d="M2 7h20v5H2z" />
    <path d="M12 22V7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);
const IconEye = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconHandshake = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);

/* ── Shared hills motif ── */
function Hills({
  fill = "var(--plum)",
  opacity = 0.06,
}: {
  fill?: string;
  opacity?: number;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z"
        fill={fill}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   Propose-a-campaign target: Google Form if set, else socials
   ═══════════════════════════════════════════════════════════ */
const INSTAGRAM_URL = "https://www.instagram.com/tepe.bite/";
const proposeHref =
  IMPACT.formUrl || `mailto:impact@${process.env.NEXT_PUBLIC_APP_BASE_DOMAIN}`;

/* ═══════════════════════════════════════════════════════════
   SECTION 1 · HERO
   ═══════════════════════════════════════════════════════════ */
function HeroSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      style={{
        minHeight: "72vh",
        background:
          "radial-gradient(ellipse 65% 55% at 30% 25%, oklch(90% 0.05 230 / 0.4), transparent), radial-gradient(ellipse 50% 40% at 90% 80%, oklch(92% 0.06 52 / 0.35), transparent), var(--bg)",
        display: "flex",
        alignItems: "center",
        paddingTop: 118,
        paddingBottom: 72,
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-blob"
        style={{
          width: 360,
          height: 360,
          background: "oklch(84% 0.09 230)",
          top: -70,
          right: "8%",
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 260,
          height: 260,
          background: "oklch(89% 0.09 52)",
          bottom: -50,
          left: "4%",
        }}
      />
      <Hills fill="var(--sky-dk)" opacity={0.07} />

      <div
        className="section-inner"
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <div
          className="impact-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Copy */}
          <div className="max-w-[600px] justify-self-center">
            <div
              className="label-tag"
              style={{ color: "var(--sky-dk)", marginBottom: 16 }}
            >
              {bg
                ? "Фондът зад инициативите"
                : "The fund behind the initiatives"}
            </div>
            <h1
              className="heading-xl"
              style={{ maxWidth: 620, marginBottom: 20 }}
            >
              {bg
                ? "Не просто дарение, a двигател за Пловдив."
                : "Not just a donation — an engine for Plovdiv."}
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.12rem)",
                maxWidth: 560,
                lineHeight: 1.75,
                marginBottom: 30,
              }}
            >
              {bg
                ? "ТЕПЕ bite Impact е фондът, в който влизат фиксираните 0.15 € от всяко продадено барче. Обединяваме средствата, избираме каузата, намираме партньори и съфинансиране, реализираме и отчитаме прозрачно."
                : "ТЕПЕ bite Impact is the fund that collects the fixed 0.15 € from every bar sold. We pool the money, choose the cause, find partners and co-funding, execute, and report openly."}
            </p>

            <ImpactPledge variant="chip" className="max-[900px]:w-full!" />

            <div
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              className="mt-7"
            >
              <Link
                href="/order"
                className="btn btn-primary max-[900px]:w-full! justify-center"
              >
                {bg ? "Поръчай" : "Order"} <IconShop />
              </Link>
              <a
                href={proposeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sky max-[900px]:w-full! justify-center"
              >
                {bg ? "Предложи кауза" : "Propose a cause"} <IconArrow />
              </a>
            </div>
          </div>

          {/* Fund wordmark lockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                padding: "10px",
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(90% 0.05 230 / 0.5), transparent)",
                  pointerEvents: "none",
                }}
              />
              <Image
                src="/TEPEbiteImpact.png"
                alt={
                  bg
                    ? "ТЕПЕ bite Impact — фондът"
                    : "ТЕПЕ bite Impact — the fund"
                }
                width={800}
                height={500}
                priority
                style={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "2 / 1",
                  objectFit: "cover",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .impact-hero-grid { grid-template-columns: 1fr !important; }
          .impact-hero-grid > div:last-child { order: -1; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 · THE ENGINE (dark plum, mirrors InitiativesPromo)
   ═══════════════════════════════════════════════════════════ */
function EngineSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const steps = bg
    ? [
        {
          icon: <IconTarget />,
          title: "Избираме каузата",
          copy: "Свързана с Пловдив, тепетата и младите хора.",
        },
        {
          icon: <IconPartners />,
          title: "Намираме партньори",
          copy: "Организации, които реализират на терен.",
        },
        {
          icon: <IconCoins />,
          title: "Осигуряваме съфинансиране",
          copy: "Спонсори и партньори, за да умножим всеки лев.",
        },
        {
          icon: <IconReport />,
          title: "Отчитаме прозрачно",
          copy: "Какво обещахме, какво направихме, какво вложихме.",
        },
      ]
    : [
        {
          icon: <IconTarget />,
          title: "We choose the cause",
          copy: "Tied to Plovdiv, its hills and young people.",
        },
        {
          icon: <IconPartners />,
          title: "We find partners",
          copy: "Organisations that get it built on the ground.",
        },
        {
          icon: <IconCoins />,
          title: "We secure co-funding",
          copy: "Sponsors and partners to multiply every lev.",
        },
        {
          icon: <IconReport />,
          title: "We report openly",
          copy: "What we promised, did, and put in.",
        },
      ];

  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: "18%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "oklch(74% 0.1 230 / 0.18)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <div
            className="label-tag"
            style={{ color: "oklch(82% 0.09 230)", marginBottom: 18 }}
          >
            {bg ? "Как работи фондът" : "How the fund works"}
          </div>
          <div
            className="engine-lockup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <PledgeHeart size={68} fill="var(--caramel)" textColor="white" />
            <h2
              className="heading-lg"
              style={{ color: "white", textAlign: "left", margin: 0 }}
            >
              {bg ? (
                <>
                  0.15 € от всяко барче.
                  <br />
                  <span style={{ color: "var(--caramel)" }}>
                    Фиксирано обещание.
                  </span>
                </>
              ) : (
                <>
                  0.15 € from every bar.
                  <br />
                  <span style={{ color: "var(--caramel)" }}>
                    A fixed promise.
                  </span>
                </>
              )}
            </h2>
          </div>
          <p
            style={{
              color: "oklch(90% 0.03 310)",
              fontSize: "1.06rem",
              margin: "0 auto",
              maxWidth: 660,
            }}
          >
            {bg
              ? "Но ние не спираме до дарение. Обединяваме средствата, за да извлечем максимума от всеки лев — през четири стъпки."
              : "But we don't stop at a donation. We pool the money to get the most out of every lev — in four steps."}
          </p>
        </div>

        <div
          className="engine-steps"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            margin: "44px auto 0",
            maxWidth: 980,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                background: "oklch(38% 0.07 315 / 0.5)",
                border: "1px solid oklch(74% 0.1 230 / 0.25)",
                borderRadius: "var(--r-md)",
                padding: "22px 20px",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "oklch(74% 0.1 230 / 0.15)",
                  color: "oklch(85% 0.09 230)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "white",
                  marginBottom: 6,
                }}
              >
                {s.title}
              </div>
              <p
                style={{
                  color: "oklch(82% 0.03 310)",
                  fontSize: "0.85rem",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .engine-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) {
          .engine-lockup { flex-direction: column !important; gap: 12px !important; }
          .engine-lockup h2 { text-align: center !important; }
        }
        @media (max-width: 480px) { .engine-steps { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 · TRANSPARENCY DASHBOARD
   ═══════════════════════════════════════════════════════════ */
function DashboardSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const live = IMPACT.isLive;
  const money = (cents: number) => (live ? formatDualMoney(cents) : "—");

  const lastUpdated =
    live && IMPACT.lastUpdatedISO
      ? new Date(IMPACT.lastUpdatedISO).toLocaleDateString(
          bg ? "bg-BG" : "en-GB",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )
      : bg
        ? "Стартира скоро"
        : "Launching soon";

  const cards = [
    {
      label: bg ? "Събрани до момента" : "Collected to date",
      value: money(IMPACT.collectedCents),
      hint: bg
        ? "от фиксираните 0.15 € на барче"
        : "from the fixed 0.15 € per bar",
      accent: "var(--sky-dk)",
    },
    {
      label: bg ? "Външни дарения" : "External donations",
      value: money(IMPACT.externalDonationsCents),
      hint: bg ? "всички обявени публично" : "all announced publicly",
      accent: "var(--caramel)",
    },
    {
      label: bg ? "Очаквани от наличности" : "Expected from stock",
      value: money(IMPACT.expectedIncomingCents),
      hint: bg
        ? "от оставащите за продажба барчета"
        : "from bars still to be sold",
      accent: "var(--plum-mid)",
    },
  ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            maxWidth: 640,
            marginInline: "auto",
          }}
        >
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Прозрачност" : "Transparency"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 14 }}>
            {bg ? "Балансът на фонда" : "The fund balance"}
          </h2>
          <p style={{ fontSize: "1rem" }}>
            {bg
              ? "Обявяваме публично събраните средства и очакваното от оставащите наличности. Фондът стартира скоро — тук ще виждате реалните числа."
              : "We publicly announce the funds collected and what's expected from remaining stock. The fund is launching soon — real figures will appear here."}
          </p>
        </div>

        {!live && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              margin: "0 auto 28px",
              maxWidth: 520,
              background: "var(--sky-lt)",
              border: "1px solid oklch(85% 0.06 230)",
              borderRadius: 100,
              padding: "10px 18px",
              color: "var(--sky-dk)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--caramel)",
                flexShrink: 0,
                animation: "pulse-dot 2s infinite",
              }}
            />
            {bg
              ? "Фондът стартира скоро — числата се подготвят."
              : "The fund is launching soon — figures are being prepared."}
          </div>
        )}

        <div
          className="dash-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "28px 26px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 4,
                  background: c.accent,
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-soft)",
                  marginBottom: 12,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  lineHeight: 1.1,
                  marginBottom: 8,
                }}
              >
                {c.value}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-mid)" }}>
                {c.hint}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: "0.85rem",
            color: "var(--text-soft)",
          }}
        >
          {bg ? "Последна актуализация: " : "Last updated: "}
          <span style={{ fontWeight: 600, color: "var(--plum)" }}>
            {lastUpdated}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4 · HOW THE FUND WORKS (trust cards)
   ═══════════════════════════════════════════════════════════ */
function HowItWorksSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const cards = bg
    ? [
        {
          icon: <IconVault />,
          title: "Обособени средства",
          copy: "Като малка фирма засега водим сумата като ясно обособено и внимателно проследявано перо. С разрастването ни планираме напълно отделна сметка.",
        },
        {
          icon: <IconGift />,
          title: "Приема дарения",
          copy: "Освен 0.15 € на барче, фондът приема и външни дарения. Всички се обявяват публично.",
        },
        {
          icon: <IconEye />,
          title: "Публична отчетност",
          copy: "Обявяваме събраните средства, избраните каузи и напредъка по всяка стъпка.",
        },
        {
          icon: <IconHandshake />,
          title: "Координираме и съфинансираме",
          copy: "Не просто даряваме — избираме кауза, търсим партньори и умножаваме всеки лев.",
        },
      ]
    : [
        {
          icon: <IconVault />,
          title: "Ring-fenced funds",
          copy: "As a small company, for now we track the amount as a clearly ring-fenced, carefully monitored line. As we grow, we plan a fully separate account.",
        },
        {
          icon: <IconGift />,
          title: "Accepts donations",
          copy: "Beyond the 0.15 € per bar, the fund accepts external donations. All are announced publicly.",
        },
        {
          icon: <IconEye />,
          title: "Public reporting",
          copy: "We announce the funds collected, the causes chosen, and progress at every step.",
        },
        {
          icon: <IconHandshake />,
          title: "We coordinate & co-fund",
          copy: "We don't just donate — we choose a cause, find partners, and multiply every lev.",
        },
      ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Политика на фонда" : "Fund policy"}
          </div>
          <h2 className="heading-lg">
            {bg ? "Как работи фондът" : "How the fund operates"}
          </h2>
        </div>

        <div
          className="howfund-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              className="card card-hover"
              style={{ padding: "30px 26px" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--sky-lt)",
                  color: "var(--sky-dk)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                {c.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1.08rem",
                  color: "var(--plum)",
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h3>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                {c.copy}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <a
            href="/legal/initiative-transparency"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--plum)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            🤝{" "}
            {bg
              ? "Пълната ни политика за прозрачност →"
              : "Read our full transparency policy →"}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .howfund-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .howfund-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5 · EXTERNAL DONATIONS (#donate)
   ═══════════════════════════════════════════════════════════ */
function DonateSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const hasDonors = IMPACT.donors.length > 0;

  return (
    <section
      id="donate"
      className="section-spacing"
      style={{
        background: "var(--bg)",
        scrollMarginTop: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Hills fill="var(--caramel)" opacity={0.05} />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="donate-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "start",
          }}
        >
          {/* Left: statement + contact */}
          <div>
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {bg ? "Подкрепи фонда" : "Support the fund"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 18 }}>
              {bg
                ? "Фондът приема и външни дарения"
                : "The fund accepts external donations"}
            </h2>
            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              {bg
                ? "Всеки лев в ТЕПЕ bite Impact отива към конкретни каузи за Пловдив. Дарения се приемат и се водят като обособено перо, а всяко постъпление се обявява публично. За да дарите, свържете се с нас."
                : "Every lev in ТЕПЕ bite Impact goes toward concrete causes for Plovdiv. Donations are accepted and ring-fenced as a tracked amount, and every contribution is announced publicly. To donate, get in touch."}
            </p>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "24px 26px",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-soft)",
                  marginBottom: 14,
                }}
              >
                {bg ? "Контакт за дарения" : "Donation contact"}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}
                  >
                    {bg ? "Имейл" : "Email"}
                  </span>
                  <a
                    href={`mailto:${IMPACT.contactEmail}`}
                    style={{
                      fontWeight: 600,
                      color: "var(--plum)",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    {IMPACT.contactEmail}
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 12,
                  }}
                >
                  <span
                    style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}
                  >
                    IBAN
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: IMPACT.iban ? "var(--plum)" : "var(--text-soft)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {IMPACT.iban ?? (bg ? "Предстои" : "Coming soon")}
                  </span>
                </div>
              </div>
              <a
                href={`mailto:${IMPACT.contactEmail}`}
                className="btn btn-caramel"
                style={{
                  marginTop: 20,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {bg ? "Свържи се, за да дариш" : "Contact us to donate"}{" "}
                <IconHeart />
              </a>
            </div>
          </div>

          {/* Right: donor list / empty state */}
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-soft)",
                marginBottom: 16,
              }}
            >
              {bg ? "Нашите дарители" : "Our supporters"}
            </div>

            {hasDonors ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {IMPACT.donors.map((d, i) => (
                  <div
                    key={i}
                    className="card"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--plum)",
                          fontSize: "0.95rem",
                        }}
                      >
                        {d.name}
                      </div>
                      {d.note && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-soft)",
                          }}
                        >
                          {d.note}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        color: "var(--caramel)",
                        fontSize: "1.05rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDualMoney(d.amountCents)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background:
                    "linear-gradient(145deg, var(--sky-lt) 0%, var(--caramel-lt) 100%)",
                  border: "1px dashed oklch(80% 0.07 230)",
                  borderRadius: "var(--r-lg)",
                  padding: "clamp(36px, 5vw, 52px) 32px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PledgeHeart
                    size={64}
                    fill="var(--caramel)"
                    textColor="white"
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "var(--plum)",
                    marginBottom: 8,
                  }}
                >
                  {bg ? "Стани първият ни дарител" : "Be our first supporter"}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    maxWidth: 300,
                    margin: "0 auto",
                    color: "var(--text-mid)",
                  }}
                >
                  {bg
                    ? "Списъкът е още празен. Твоето дарение ще бъде първото — и обявено тук с благодарност."
                    : "The list is still empty. Your donation would be the first — and announced here with gratitude."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .donate-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6 · PROPOSE A CAMPAIGN
   ═══════════════════════════════════════════════════════════ */
function ProposeSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const criteria = bg
    ? [
        "Свързана с Пловдив, тепетата или младите хора",
        "Видим, снимаем резултат на терен",
        "Има отчет: обещано, направено, вложени ресурси",
        "Реализуема чрез партньорски организации",
        "Екипът координира и прави финалния избор",
      ]
    : [
        "Tied to Plovdiv, its hills, or young people",
        "A visible, photographable result on the ground",
        "Has a report: promised, done, resources put in",
        "Deliverable through partner organisations",
        "The team coordinates and makes the final choice",
      ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div
          className="propose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {bg ? "Твоята идея" : "Your idea"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 18 }}>
              {bg ? "Предложи кауза за фонда" : "Propose a cause for the fund"}
            </h2>
            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              {bg
                ? "Знаеш ли място на тепетата или в Пловдив, което заслужава грижа? Клиентите могат да предлагат кампании. Разгледай критериите и ни пиши."
                : "Know a spot on the hills or in Plovdiv that deserves care? Customers can propose campaigns. Check the criteria and reach out."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={proposeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {IMPACT.formUrl
                  ? bg
                    ? "Попълни формата"
                    : "Fill in the form"
                  : bg
                    ? "Предложи по имейл"
                    : "Propose by email"}
                <IconArrow />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {bg ? "Instagram" : "Instagram"} <IconInsta />
              </a>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(28px, 4vw, 40px)",
            }}
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
              {bg ? "Как избираме" : "How we choose"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {criteria.map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--sky-lt)",
                      color: "var(--sky-dk)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "0.92rem",
                      color: "var(--text-mid)",
                      lineHeight: 1.5,
                      paddingTop: 2,
                    }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .propose-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 7 · WHERE THE MONEY GOES (band → /initiatives)
   ═══════════════════════════════════════════════════════════ */
function WhereItGoesSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div
          className="wheregoes"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--r-lg)",
            background:
              "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 60%, oklch(52% 0.13 40) 100%)",
            color: "white",
            padding: "clamp(32px, 5vw, 56px)",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -80,
              left: -40,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "oklch(66% 0.16 52 / 0.25)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="label-tag"
              style={{ color: "oklch(88% 0.08 52)", marginBottom: 14 }}
            >
              {bg ? "Накъде отиват парите" : "Where the money goes"}
            </div>
            <h2
              className="heading-lg"
              style={{ color: "white", marginBottom: 16, maxWidth: 520 }}
            >
              {bg
                ? "От фонда към реални проекти"
                : "From the fund to real projects"}
            </h2>
            <p
              style={{
                color: "oklch(92% 0.03 310)",
                fontSize: "1.02rem",
                maxWidth: 560,
                marginBottom: 30,
              }}
            >
              {bg
                ? "Средствата от ТЕПЕ bite Impact захранват видимите инициативи в Пловдив — започвайки с RE-CONNECT БУНАРДЖИКА. Виж докъде сме стигнали."
                : "Funds from ТЕПЕ bite Impact power the visible initiatives in Plovdiv — starting with RE-CONNECT BUNARDZHIKA. See how far we've come."}
            </p>
            <Link href="/initiatives" className="btn btn-caramel">
              {bg ? "Виж инициативите" : "See the initiatives"} <IconArrow />
            </Link>
          </div>

          <div
            className="wheregoes-visual"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "oklch(100% 0 0 / 0.1)",
                border: "1px solid oklch(100% 0 0 / 0.22)",
                borderRadius: "var(--r-lg)",
                padding: "32px 28px",
                textAlign: "center",
                width: "100%",
                maxWidth: 280,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <PledgeHeart
                  size={92}
                  fill="var(--caramel)"
                  textColor="white"
                />
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: 4,
                }}
              >
                {bg ? "Всеки лев работи" : "Every lev works"}
              </div>
              <div
                style={{ fontSize: "0.82rem", color: "oklch(92% 0.03 310)" }}
              >
                {bg
                  ? "избрано, съфинансирано, отчетено"
                  : "chosen, co-funded, reported"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .wheregoes { grid-template-columns: 1fr !important; }
          .wheregoes-visual { order: -1; max-width: 280px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 8 · FAQ
   ═══════════════════════════════════════════════════════════ */
function FAQSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const items = bg
    ? [
        {
          q: "Защо точно 0.15 €?",
          a: "Това е фиксирана сума от всяко продадено барче — ясна, проследима и еднаква за всеки. Предпочитаме твърдо обещание пред неясен процент.",
        },
        {
          q: "Регистрирана благотворителна организация ли е фондът?",
          a: "Не в класическия смисъл. ТЕПЕ bite Impact е обособен фонд с публична отчетност, но не е самостоятелно юридическо лице. Като малка фирма засега водим средствата като ясно обособено и внимателно проследявано перо в сметката на фирмата и ги използваме точно както е обявено. С разрастването ни планираме напълно отделна сметка.",
        },
        {
          q: "Как се харчат парите?",
          a: "Обединяваме средствата, избираме конкретна кауза за Пловдив, намираме партньори и съфинансиране, реализираме и отчитаме какво сме вложили.",
        },
        {
          q: "Мога ли да дарявам допълнително?",
          a: "Да. Освен 0.15 € на барче, фондът приема външни дарения по отделната сметка. Свържи се с нас в секция „Подкрепи фонда“.",
        },
        {
          q: "Ще има ли отчети и разписки?",
          a: "Да. Обявяваме публично събраните средства, избраните каузи и напредъка по всяка стъпка — какво обещахме, какво направихме и какво вложихме.",
        },
      ]
    : [
        {
          q: "Why exactly 0.15 €?",
          a: "It's a fixed amount from every bar sold — clear, traceable, and the same for everyone. We prefer a firm promise over a vague percentage.",
        },
        {
          q: "Is the fund a registered charity?",
          a: "Not in the classic sense. ТЕПЕ bite Impact is a distinct fund with public reporting, but not a standalone legal entity. As a small company, we currently track the money as a clearly ring-fenced, carefully monitored line within the company account and use it exactly as stated. As we grow, we plan a fully separate account.",
        },
        {
          q: "How is the money spent?",
          a: "We pool the funds, choose a concrete cause for Plovdiv, find partners and co-funding, execute, and report what we put in.",
        },
        {
          q: "Can I donate on top?",
          a: "Yes. Beyond the 0.15 € per bar, the fund accepts external donations via its separate account. Reach out in the 'Support the fund' section.",
        },
        {
          q: "Will there be receipts and reports?",
          a: "Yes. We publicly announce the funds collected, the causes chosen, and progress at every step — what we promised, did, and put in.",
        },
      ];

  return (
    <section
      style={{
        background: "var(--surface)",
        paddingTop: "clamp(52px, 6vw, 80px)",
        paddingBottom: "clamp(52px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              FAQ
            </div>
            <h2 className="heading-lg">
              {bg ? "Въпроси за фонда" : "Questions about the fund"}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(({ q, a }, i) => (
              <details key={i} className="faq-item faq-light">
                <summary className="faq-summary faq-summary-light">
                  <span>{q}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-body faq-body-light">
                  <p style={{ margin: 0, fontSize: "0.93rem" }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-light .faq-summary-light {
          padding: 15px 20px; cursor: pointer; font-weight: 600; font-size: 0.93rem;
          color: var(--plum); background: var(--bg); border-radius: var(--r-sm);
          border: 1px solid var(--border); list-style: none; display: flex;
          justify-content: space-between; align-items: center; gap: 12px;
          user-select: none; transition: background 0.18s;
        }
        .faq-light .faq-summary-light::-webkit-details-marker { display: none; }
        .faq-light .faq-summary-light:hover { background: var(--plum-lt); }
        .faq-light.faq-item { border-radius: var(--r-sm); }
        .faq-light details[open] .faq-summary-light,
        .faq-light[open] .faq-summary-light {
          border-radius: var(--r-sm) var(--r-sm) 0 0; background: var(--plum-lt);
        }
        .faq-body-light {
          padding: 15px 20px 18px; background: var(--plum-lt);
          border: 1px solid var(--border); border-top: none;
          border-radius: 0 0 var(--r-sm) var(--r-sm);
        }
        .faq-plus { font-size: 1.25rem; color: var(--caramel); flex-shrink: 0; font-weight: 300; transition: transform 0.2s; }
        details[open] .faq-plus { transform: rotate(45deg); }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 9 · CLOSING CTA
   ═══════════════════════════════════════════════════════════ */
function ClosingCTASection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Hills fill="rgb(82, 51, 95)" opacity={1} />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1, maxWidth: 680 }}
      >
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PledgeHeart size={72} fill="var(--caramel)" textColor="white" />
        </div>
        <h2 className="heading-lg" style={{ color: "white", marginBottom: 16 }}>
          {bg ? "Едно барче. Едно обещание." : "One bar. One promise."}
        </h2>
        <p
          style={{
            color: "oklch(90% 0.03 310)",
            fontSize: "1.06rem",
            marginBottom: 32,
            maxWidth: 560,
            marginInline: "auto",
          }}
        >
          {bg
            ? "Всяка покупка добавя фиксираните 0.15 € към фонда. Поръчай, следи ни и виж как расте въздействието за Пловдив."
            : "Every purchase adds the fixed 0.15 € to the fund. Order, follow along, and watch the impact for Plovdiv grow."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/order" className="btn btn-caramel">
            {bg ? "Поръчай сега" : "Order now"} <IconShop />
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid oklch(100% 0 0 / 0.3)",
            }}
          >
            {bg ? "Последвай ни" : "Follow us"} <IconInsta />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ImpactPageContent() {
  const lang = useAtomValue(langAtom);
  return (
    <>
      <HeroSection lang={lang} />
      <EngineSection lang={lang} />
      <DashboardSection lang={lang} />
      <HowItWorksSection lang={lang} />
      <DonateSection lang={lang} />
      <ProposeSection lang={lang} />
      <WhereItGoesSection lang={lang} />
      <FAQSection lang={lang} />
      <ClosingCTASection lang={lang} />
    </>
  );
}
