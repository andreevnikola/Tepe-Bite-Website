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
            {bg ? "Екипът" : "The team"}
          </div>
          <h2 className="heading-lg" style={{ color: "white", maxWidth: 720, margin: 0 }}>
            {bg ? "Млад екип от Пловдив, който строи истинска компания" : "A young Plovdiv team building a real company"}
          </h2>
          <p style={{ color: "oklch(92% 0.02 300)", fontSize: "clamp(1.02rem, 1.7vw, 1.2rem)", maxWidth: 600, lineHeight: 1.6, margin: "18px 0 0" }}>
            {bg
              ? "Ученици, които решиха да не чакат разрешение да започнат нещо свое. Зад всяко барче стоят реални хора, реални отговорности и една обща кауза за Пловдив. Когато подкрепяш ТЕПЕ bite, подкрепяш нас."
              : "Students who decided not to wait for permission to start something of their own. Behind every bar are real people, real responsibilities and one shared cause for Plovdiv. When you support ТЕПЕ bite, you support us."}
          </p>
          <div style={{ marginTop: 28 }}>
            <Link href="/about" className="btn btn-caramel">
              {bg ? "Запознай се с екипа" : "Meet the team"}
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
