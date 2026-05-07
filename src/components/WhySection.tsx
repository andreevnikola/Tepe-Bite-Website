"use client";
import { IconHeart, IconLeaf, IconMap } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";

const pillars = {
  bg: [
    {
      icon: <IconLeaf />,
      title: "Качествен продукт",
      copy: "Солен карамел, ядки, семена, фибри и растителен протеин — в барче, създадено за балансиран избор през деня.",
    },
    {
      icon: <IconMap />,
      title: "Пловдивска идея",
      copy: "ТЕПЕ bite е вдъхновено от Пловдив — град с характер, общност и енергия за промяна.",
    },
    {
      icon: <IconHeart />,
      title: "Реално въздействие",
      copy: "Част от стойността на всяка покупка подкрепя социални инициативи, които развиваме и показваме прозрачно.",
    },
  ],
  en: [
    {
      icon: <IconLeaf />,
      title: "Quality Product",
      copy: "Salted caramel, nuts, seeds, fibre and plant protein — a bar made for a balanced choice during the day.",
    },
    {
      icon: <IconMap />,
      title: "A Plovdiv Idea",
      copy: "ТЕПЕ bite is inspired by Plovdiv — a city with character, community and energy for change.",
    },
    {
      icon: <IconHeart />,
      title: "Real Impact",
      copy: "Part of the value from every purchase supports social initiatives that we develop and share openly.",
    },
  ],
};

export default function WhySection() {
  const lang = useAtomValue(langAtom);
  const items = pillars[lang];

  return (
    <section
      id="za-nas"
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner" style={{ textAlign: "center" }}>
        <div className="section-divider" />
        <div className="label-tag" style={{ marginBottom: 16 }}>
          {lang === "bg" ? "Нашата мисия" : "Our Mission"}
        </div>
        <h2
          className="heading-lg"
          style={{ maxWidth: 640, margin: "0 auto 20px" }}
        >
          {lang === "bg"
            ? "Не просто барче. Малък начин да подкрепиш нещо по-голямо."
            : "Not just a bar. A small way to support something bigger."}
        </h2>
        <p
          style={{ maxWidth: 580, margin: "0 auto 48px", fontSize: "1.05rem" }}
        >
          {lang === "bg" ? (
            <>
              <strong>
                Създадохме ТЕПЕ bite като продукт, който съчетава вкус, качество
                и кауза.
              </strong>{" "}
              Идеята е проста: когато избираш по-добра междинна закуска, можеш
              едновременно да подкрепиш реални социални инициативи.
            </>
          ) : (
            <>
              <strong>
                We created ТЕПЕ bite as a product that combines taste, quality
                and purpose.
              </strong>{" "}
              The idea is simple: when you choose a better snack, you can
              simultaneously support real social initiatives.
            </>
          )}
        </p>

        {/* Manufacturing photo strip */}
        <div
          className="mfg-photo-wrap"
          style={{
            width: "100%",
            height: "clamp(200px, 28vw, 380px)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            marginBottom: 56,
            position: "relative",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <Image
            src="/manufacturing.jpg"
            alt={
              lang === "bg"
                ? "Производство на ТЕПЕ bite в Пловдив"
                : "ТЕПЕ bite production in Plovdiv"
            }
            fill
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, oklch(32% 0.09 315 / 0.8) 10%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              paddingLeft: "clamp(24px, 4vw, 56px)",
            }}
          >
            <div className="z-10">
              <div
                className="label-tag"
                style={{ color: "oklch(85% 0.08 55)", marginBottom: 10 }}
              >
                {lang === "bg" ? "Местно производство" : "Locally produced"}
              </div>
              <p
                style={{
                  color: "white",
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                  fontWeight: 600,
                  maxWidth: 350,
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {lang === "bg"
                  ? "Всяко барче е направено с грижа в с. Брестовица, област Пловдив"
                  : "Every bar is made with care in Brestovitsa, Plovdiv Region"}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {items.map((p, i) => (
            <div
              key={i}
              className={`card w-full ${i === items.length - 1 ? "pillar-last" : ""}`}
              style={{
                padding: "40px 32px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "var(--plum-lt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--plum)",
                  marginBottom: 22,
                }}
              >
                {p.icon}
              </div>
              <h3
                className="heading-md"
                style={{ marginBottom: 12, fontSize: "1.2rem" }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>{p.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 926px) {
          .pillar-last {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .mfg-photo-wrap {
            border-radius: 0 !important;
            margin-left: -20px !important;
            margin-right: -20px !important;
            width: calc(100% + 40px) !important;
            height: clamp(220px, 55vw, 320px) !important;
          }
        }
      `}</style>
    </section>
  );
}
