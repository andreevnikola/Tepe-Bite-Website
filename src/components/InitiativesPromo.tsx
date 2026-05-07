"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function InitiativesPromo() {
  const lang = useAtomValue(langAtom);

  const stats = [
    {
      num: "1+",
      bg: "активна инициатива",
      en: "active initiative",
    },
    {
      num: "100%",
      bg: "прозрачност",
      en: "transparency",
    },
    {
      num: "Пловдив",
      bg: "вдъхновение",
      en: "inspiration",
    },
  ];

  return (
    <section
      id="initsiatiви"
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Solid silhouette logo sticking out behind wave */}
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
          opacity: 1,
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

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "oklch(88% 0.06 315 / 0.12)",
          filter: "blur(60px)",
        }}
      />

      <div
        className="section-inner"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <div
          className="label-tag"
          style={{ color: "oklch(85% 0.08 315)", marginBottom: 20 }}
        >
          {lang === "bg" ? "Нашите инициативи" : "Our Initiatives"}
        </div>

        <h2
          className="heading-lg"
          style={{ color: "white", maxWidth: 880, margin: "0 auto 20px" }}
        >
          {lang === "bg" ? (
            <>
              Виж как{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                ТЕПЕ bite
              </span>{" "}
              подпомага Пловдив
            </>
          ) : (
            <>
              See how{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                ТЕПЕ bite
              </span>{" "}
              supports Plovdiv
            </>
          )}
        </h2>

        <span
          style={{
            color: "oklch(88% 0.03 310)",
            maxWidth: 750,
            margin: "0 auto 40px",
            fontSize: "1.05rem",
          }}
        >
          {lang === "bg" ? (
            <>
              <p style={{ color: "oklch(88% 0.03 310)" }}>
                Прозрачни сме за резултатите ни.
              </p>
              <a
                href="/initiatives"
                style={{
                  color: "var(--caramel)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Разгледай нашите социални проекти
              </a>
              .
            </>
          ) : (
            <>
              We are transparent about our results.{" "}
              <a
                href="/initiatives"
                style={{
                  color: "var(--caramel)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                See our initiatives
              </a>
              .
            </>
          )}
        </span>

        <div
          className="mt-16 md:mt-8"
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "2.5rem",
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
                {lang === "bg" ? s.bg : s.en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
