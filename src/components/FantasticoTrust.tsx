"use client";
import { IconArrow } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function FantasticoTrust() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const support = bg
    ? ["Дарение 4000 €", "Маркетинг", "Дизайнерски материали", "Продажби в Пловдив"]
    : ["€4,000 donation", "Marketing", "Design materials", "Retail in Plovdiv"];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)", position: "relative", overflow: "hidden" }}
    >
      {/* on-brand background depth: soft blobs + Plovdiv hill silhouette */}
      <div aria-hidden="true" className="ft-decor" style={{ zIndex: 0 }}>
        <span className="hero-blob ft-blob ft-blob-a" />
        <span className="hero-blob ft-blob ft-blob-b" />
        <svg
          className="ft-hills"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z"
            fill="var(--plum)"
          />
        </svg>
      </div>

      <div className="ft-note" style={{ zIndex: 1 }}>
        {/* Fantastico logo plate, standing on its own */}
        <div className="ft-logo-plate">
          <Image
            src="/partners/FantasticoGroupLongLogo.png"
            alt="Fantastico Group"
            width={261}
            height={121}
            className="ft-logo-img"
            style={{ width: "auto", display: "block" }}
          />
        </div>

        <h2 className="heading-md ft-heading">
          {bg ? (
            <>
              Гордо казваме: благодарим, <span className="ft-fanta">Fantastico</span>
            </>
          ) : (
            <>
              We proudly say: thank you, <span className="ft-fanta">Fantastico</span>
            </>
          )}
        </h2>

        <p className="ft-lead">
          {bg
            ? "Една от най-големите търговски вериги в България се довери на ученически екип от Пловдив и застана зад нас."
            : "One of Bulgaria's largest retail chains trusted a student team from Plovdiv and chose to stand behind us."}
        </p>

        <div className="ft-chips">
          {support.map((s, i) => (
            <span
              key={s}
              className="ft-chip"
              style={{
                background: i === 0 ? "var(--caramel)" : "var(--plum-lt)",
                color: i === 0 ? "white" : "var(--plum)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <Link href="/about" className="ft-link">
          {bg ? "Разбери повече за нашата история" : "Learn more about our story"}
          <IconArrow />
        </Link>
      </div>

      <style>{`
        .ft-decor {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .ft-blob {
          opacity: 0.18;
          filter: blur(74px);
        }
        .ft-blob-a {
          width: clamp(260px, 34vw, 460px);
          height: clamp(260px, 34vw, 460px);
          background: var(--plum);
          top: -14%;
          left: -8%;
        }
        .ft-blob-b {
          width: clamp(240px, 30vw, 420px);
          height: clamp(240px, 30vw, 420px);
          background: var(--caramel);
          bottom: -18%;
          right: -6%;
          opacity: 0.14;
        }
        .ft-hills {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: clamp(80px, 12vw, 150px);
          opacity: 0.06;
          display: block;
        }
        .ft-note {
          position: relative;
          max-width: 640px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 40px);
          text-align: center;
        }
        .ft-logo-plate {
          display: inline-flex;
          background: white;
          border-radius: var(--r-md);
          padding: clamp(14px, 2.4vw, 22px) clamp(22px, 3.6vw, 34px);
          box-shadow: var(--shadow-lg);
          margin-bottom: 22px;
        }
        .ft-logo-img {
          height: clamp(64px, 8vw, 84px);
        }
        .ft-heading {
          margin: 0;
          font-size: clamp(1.3rem, 2.4vw, 1.7rem);
        }
        .ft-fanta { border-bottom: 3px solid #E2001A; padding-bottom: 1px; white-space: nowrap; }
        .ft-lead {
          margin: 14px auto 0;
          max-width: 480px;
        }
        .ft-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-top: 22px;
        }
        .ft-chip {
          display: inline-flex;
          align-items: center;
          border-radius: 100px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 22px;
          color: var(--caramel);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
        }
      `}</style>
    </section>
  );
}
