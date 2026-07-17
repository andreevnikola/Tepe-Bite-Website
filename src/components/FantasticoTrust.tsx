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
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div className="ft-band">
          {/* Left: logo + gratitude */}
          <div className="ft-left">
            <div className="ft-logo-plate">
              <Image
                src="/partners/FantasticoGroupLongLogo.png"
                alt="Fantastico Group"
                width={261}
                height={121}
                style={{ height: 46, width: "auto", display: "block" }}
              />
            </div>
            <div className="label-tag" style={{ marginTop: 20, marginBottom: 12 }}>
              {bg ? "Заедно с Fantastico" : "Together with Fantastico"}
            </div>
            <h2 className="heading-md" style={{ margin: 0, fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)" }}>
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
            <p style={{ margin: "14px 0 0", maxWidth: 440 }}>
              {bg
                ? "Една от най-големите търговски вериги в България се довери на ученически екип от Пловдив и застана зад нас."
                : "One of Bulgaria's largest retail chains trusted a student team from Plovdiv and chose to stand behind us."}
            </p>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 18,
                color: "var(--caramel)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              {bg ? "Разбери повече за нашата история" : "Learn more about our story"}
              <IconArrow />
            </Link>
          </div>

          {/* Right: what they entrusted us with */}
          <div className="ft-right">
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
              {bg ? "Как ни подкрепят" : "How they back us"}
            </div>
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
          </div>
        </div>
      </div>

      <style>{`
        .ft-band {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: clamp(28px, 5vw, 64px);
          align-items: center;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: clamp(28px, 4vw, 48px);
        }
        .ft-logo-plate {
          display: inline-flex;
          background: white;
          border-radius: var(--r-sm);
          padding: 12px 20px;
          box-shadow: var(--shadow);
        }
        .ft-fanta { border-bottom: 3px solid #E2001A; padding-bottom: 1px; white-space: nowrap; }
        .ft-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .ft-chip {
          display: inline-flex;
          align-items: center;
          border-radius: 100px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        @media (max-width: 820px) {
          .ft-band { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
