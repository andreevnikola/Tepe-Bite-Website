"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function PartnerCTA() {
  const lang = useAtomValue(langAtom);

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
          pointerEvents: "none",
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

      <div className="section-inner" style={{ position: "relative", zIndex: 2 }}>
        <div
          className="label-tag"
          style={{ color: "oklch(85% 0.08 315)", marginBottom: 20 }}
        >
          {lang === "bg" ? "Партньорство" : "Partnership"}
        </div>

        <h2
          className="heading-lg"
          style={{ color: "white", maxWidth: 700, margin: "0 auto 16px" }}
        >
          {lang === "bg" ? (
            <>
              Искаш{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                ТЕПЕ bite
              </span>{" "}
              в твоя магазин?
            </>
          ) : (
            <>
              Want{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                ТЕПЕ bite
              </span>{" "}
              in your store?
            </>
          )}
        </h2>

        <p
          style={{
            color: "oklch(82% 0.04 310)",
            maxWidth: 520,
            margin: "0 auto 36px",
            fontSize: "1.02rem",
            lineHeight: 1.72,
          }}
        >
          {lang === "bg"
            ? "Ако управляваш магазин в Пловдив и искаш да предлагаш ТЕПЕ bite, свържи се с нас. Работим с партньори, споделящи нашите ценности."
            : "If you run a store in Plovdiv and want to carry ТЕПЕ bite, get in touch. We partner with stores that share our values."}
        </p>

        <a
          href="mailto:tepe@mail.bg"
          className="btn"
          style={{
            background: "var(--caramel)",
            color: "white",
            fontSize: "1rem",
            padding: "14px 32px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            borderRadius: "var(--r-md)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {lang === "bg" ? "Свържи се с нас" : "Get in touch"}
        </a>
      </div>
    </section>
  );
}
