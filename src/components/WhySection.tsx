"use client";
import { IconArrow } from "@/components/icons";
import { PledgeHeart } from "@/components/ImpactPledge";
import InitiativeCard from "@/components/public/InitiativeCard";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

/* ── Engine-step icons (stroke, sky-tinted) — absorbed from the retired
   InitiativesPromo so the transparency pledge content is preserved. ── */
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);
const IconPartners = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCoins = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88l.7.71-2.82 2.82" />
  </svg>
);
const IconReport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export default function MissionSection({ cards }: { cards: InitiativeDTO[] }) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const engine = bg
    ? [
        { icon: <IconTarget />, title: "Избираме каузата", copy: "Свързана с Пловдив, тепетата и младите хора." },
        { icon: <IconPartners />, title: "Намираме партньори", copy: "Организации, които реализират на терен." },
        { icon: <IconCoins />, title: "Осигуряваме съфинансиране", copy: "Спонсори и партньори, за да умножим всеки лев." },
        { icon: <IconReport />, title: "Отчитаме прозрачно", copy: "Какво обещахме, какво направихме, какво вложихме." },
      ]
    : [
        { icon: <IconTarget />, title: "We choose the cause", copy: "Tied to Plovdiv, its hills and young people." },
        { icon: <IconPartners />, title: "We find partners", copy: "Organisations that get it built on the ground." },
        { icon: <IconCoins />, title: "We secure co-funding", copy: "Sponsors and partners to multiply every lev." },
        { icon: <IconReport />, title: "We report openly", copy: "What we promised, did, and put in." },
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
      {/* Solid silhouette logo watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -60,
          bottom: -10,
          width: "50vw",
          maxWidth: 350,
          minWidth: 250,
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
        aria-hidden="true"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 0 }}
      >
        <path d="M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z" fill="rgb(82, 51, 95)" />
      </svg>

      {/* Sky glow blob — transparency accent */}
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
          zIndex: 0,
        }}
      />

      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header — introduce ТЕПЕ bite Impact ── */}
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
          <div className="section-divider" style={{ background: "var(--caramel)" }} />
          <div className="label-tag" style={{ color: "oklch(82% 0.09 230)", marginBottom: 20 }}>
            {bg ? "Нашата мисия" : "Our Mission"}
          </div>

          {/* Impact logo lockup on a light plate so it reads on plum */}
          <div
            style={{
              display: "inline-flex",
              background: "white",
              borderRadius: "var(--r-md)",
              padding: "16px 26px",
              marginBottom: 24,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Image
              src="/brand/TEPEbiteImpact-crop.png"
              alt="ТЕПЕ bite Impact"
              width={400}
              height={160}
              style={{ height: "clamp(46px, 8vw, 64px)", width: "auto", display: "block" }}
            />
          </div>

          <h2 className="heading-lg" style={{ color: "white", margin: "0 auto 18px", maxWidth: 720 }}>
            {bg ? (
              <>
                Всяко барче захранва{" "}
                <span style={{ color: "var(--caramel)" }}>ТЕПЕ bite Impact</span>
              </>
            ) : (
              <>
                Every bar powers{" "}
                <span style={{ color: "var(--caramel)" }}>ТЕПЕ bite Impact</span>
              </>
            )}
          </h2>

          <p style={{ color: "oklch(90% 0.03 310)", fontSize: "1.08rem", margin: "0 auto", maxWidth: 700 }}>
            {bg
              ? "ТЕПЕ bite Impact е фондът, през който организираме всяка инициатива за Пловдив — за градските пространства и тепетата, за общността и за младите хора. Но ние не спираме до дарение: избираме каузата, намираме партньори и съфинансиране и реализираме — за да извлечем максимума от всеки лев."
              : "ТЕПЕ bite Impact is the fund through which we organise every initiative for Plovdiv — for the city's public spaces and hills, for the community and for young people. But we don't stop at a donation: we choose the cause, find partners and co-funding, and get it built — to get the most out of every lev."}
          </p>
        </div>

        {/* ── Pledge lockup ── */}
        <div className="mission-pledge">
          <PledgeHeart size={72} fill="var(--caramel)" textColor="white" />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "white",
                lineHeight: 1.1,
              }}
            >
              {bg ? "0.15 € от всяко барче." : "0.15 € from every bar."}{" "}
              <span style={{ color: "var(--caramel)" }}>
                {bg ? "Фиксирано обещание." : "A fixed promise."}
              </span>
            </div>
            <p style={{ color: "oklch(82% 0.03 310)", fontSize: "0.92rem", margin: "8px 0 0", maxWidth: 460 }}>
              {bg
                ? "Обединяваме средствата от всички продажби във фонда — открито и отчетено."
                : "We pool the money from every sale into the fund — openly and accountably."}
            </p>
          </div>
        </div>

        {/* ── The engine — 4 steps ── */}
        <div className="mission-engine">
          {engine.map((s, i) => (
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
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "1rem", color: "white", marginBottom: 6 }}>
                {s.title}
              </div>
              <p style={{ color: "oklch(82% 0.03 310)", fontSize: "0.85rem", margin: 0, lineHeight: 1.55 }}>{s.copy}</p>
            </div>
          ))}
        </div>

        {/* ── Learn about the policy ── */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(28px, 4vw, 40px)" }}>
          <Link href="/impact" className="btn btn-sky justify-center">
            {bg ? "Разбери повече за политиката ни" : "Learn more about our policy"}
            <IconArrow />
          </Link>
        </div>

        {/* ── Initiative cards ── */}
        {cards.length > 0 && (
          <div style={{ marginTop: "clamp(48px, 7vw, 80px)" }}>
            <div
              className="label-tag"
              style={{ color: "oklch(82% 0.09 230)", textAlign: "center", marginBottom: 24 }}
            >
              {bg ? "Инициативи през фонда" : "Initiatives through the fund"}
            </div>
            <div className="mission-cards">
              {cards.map((i) => (
                <InitiativeCard key={i.id} initiative={i} lang={lang} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <Link
                href="/initiatives"
                className="btn justify-center"
                style={{ background: "transparent", color: "white", border: "2px solid oklch(100% 0 0 / 0.3)" }}
              >
                {bg ? "Виж всички инициативи" : "See all initiatives"}
                <IconArrow />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mission-pledge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: clamp(40px, 6vw, 60px) auto 0;
          max-width: 720px;
        }
        .mission-engine {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: clamp(36px, 5vw, 48px) auto 0;
          max-width: 980px;
        }
        .mission-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 1080px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .mission-engine { grid-template-columns: repeat(2, 1fr) !important; }
          .mission-cards { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; max-width: 720px; }
        }
        @media (max-width: 560px) {
          .mission-pledge { flex-direction: column; text-align: center; gap: 14px; }
          .mission-pledge > div { text-align: center !important; }
          .mission-engine { grid-template-columns: 1fr !important; }
          .mission-cards { grid-template-columns: 1fr !important; max-width: 360px; }
        }
      `}</style>
    </section>
  );
}
