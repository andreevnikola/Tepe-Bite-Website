"use client";
import { IconArrow } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function AboutTeaser() {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div className="at-inner">
        <Image
          src="/photos/team.jpg"
          alt={bg ? "Екипът на ТЕПЕ bite" : "The ТЕПЕ bite team"}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 28%" }}
        />
        {/* plum scrim for legibility */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, oklch(20% 0.06 315 / 0.55) 0%, oklch(22% 0.06 315 / 0.35) 40%, oklch(18% 0.06 315 / 0.82) 100%)",
          }}
        />

        <div className="section-inner at-content">
          <div className="label-tag" style={{ color: "oklch(93% 0.06 70)", marginBottom: 16 }}>
            {bg ? "За нас" : "About us"}
          </div>
          <h2 className="heading-lg" style={{ color: "white", maxWidth: 720, margin: 0 }}>
            {bg ? "Марка, създадена от ученици — за ученици като тях" : "A brand built by high-schoolers — for young people like them"}
          </h2>
          <p style={{ color: "oklch(92% 0.02 300)", fontSize: "clamp(1.02rem, 1.7vw, 1.2rem)", maxWidth: 560, lineHeight: 1.6, margin: "16px 0 0" }}>
            {bg
              ? "Основателите ни са гимназисти — точно младите, на които ТЕПЕ bite иска да даде сцена."
              : "Our founders are still in high school — the very youth ТЕПЕ bite sets out to give a stage."}
          </p>
          <div style={{ marginTop: 28 }}>
            <Link href="/about" className="btn btn-caramel">
              {bg ? "Разбери повече за марката" : "Learn more about the brand"}
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .at-inner {
          position: relative;
          min-height: clamp(420px, 60vh, 580px);
          display: flex;
          align-items: flex-end;
        }
        .at-content {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 clamp(20px, 5vw, 80px) clamp(48px, 7vw, 88px);
        }
      `}</style>
    </section>
  );
}
