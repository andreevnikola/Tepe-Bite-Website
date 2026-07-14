"use client";
import { IconArrow } from "@/components/icons";
import { PledgeHeart } from "@/components/ImpactPledge";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

/* ── Small engine-step icons (stroke, sky-tinted) ── */
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

export default function InitiativesPromo() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const engine = bg
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

  const stats = bg
    ? [
        { num: "0.15 €", label: "фиксирано на барче" },
        { num: "100%", label: "прозрачност" },
        { num: "Пловдив", label: "в центъра" },
      ]
    : [
        { num: "0.15 €", label: "fixed per bar" },
        { num: "100%", label: "transparency" },
        { num: "Plovdiv", label: "at the center" },
      ];

  return (
    <section
      id="impact"
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Solid silhouette logo behind wave */}
      <div
        style={{
          position: "absolute",
          right: -60,
          bottom: -10,
          width: "50vw",
          maxWidth: 350,
          minWidth: 250,
          height: "auto",
          aspectRatio: "1 / 1",
          backgroundColor: "rgb(82, 51, 95)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          maskImage: "url(/logo-nav.png)",
          maskSize: "contain",
          maskPosition: "center",
          maskRepeat: "no-repeat",
        }}
      />

      {/* Hills motif */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z"
          fill="rgb(82, 51, 95)"
        />
      </svg>

      {/* Sky glow blob — transparency accent */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: "20%",
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
        {/* Header — the promise */}
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <div
            className="label-tag"
            style={{ color: "oklch(82% 0.09 230)", marginBottom: 20 }}
          >
            {bg ? "Нашето обещание" : "Our Pledge"}
          </div>

          {/* Big pledge lockup */}
          <div
            className="pledge-lockup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 22,
            }}
          >
            <PledgeHeart size={72} fill="var(--caramel)" textColor="white" />
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
              fontSize: "1.08rem",
              margin: "0 auto 8px",
              maxWidth: 680,
            }}
          >
            {bg
              ? "Но ние не спираме до дарение. Обединяваме средствата във фонд ТЕПЕ bite Impact, избираме каузата, намираме партньори и съфинансиране и реализираме — за да извлечем максимума от всеки лев."
              : "But we don't stop at a donation. We pool the money into the ТЕПЕ bite Impact fund, choose the cause, find partners and co-funding, and get it built — to get the most out of every lev."}
          </p>
        </div>

        {/* The engine — 4 steps */}
        <div
          className="impact-engine"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            margin: "44px auto 40px",
            maxWidth: 960,
          }}
        >
          {engine.map((s, i) => (
            <div
              key={i}
              style={{
                background: "oklch(38% 0.07 315 / 0.5)",
                border: "1px solid oklch(74% 0.1 230 / 0.25)",
                borderRadius: "var(--r-md)",
                padding: "22px 20px",
                textAlign: "left",
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

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 44,
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  color: "var(--caramel)",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  color: "oklch(78% 0.04 310)",
                  fontSize: "0.85rem",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/impact" className="btn btn-sky justify-center">
            {bg
              ? "Разбери повече за ТЕПЕ bite Impact"
              : "Explore ТЕПЕ bite Impact"}
            <IconArrow />
          </Link>
          <Link
            href="/initiatives"
            className="btn justify-center"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid oklch(100% 0 0 / 0.3)",
            }}
          >
            {bg ? "Виж инициативите" : "See the initiatives"}
          </Link>
          {/* NOTE: kept on /initiatives (registry) — copy = browse; the sky
              button above already links to the /impact story. */}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .impact-engine {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .pledge-lockup {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .pledge-lockup h2 {
            text-align: center !important;
          }
        }
        @media (max-width: 480px) {
          .impact-engine {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
