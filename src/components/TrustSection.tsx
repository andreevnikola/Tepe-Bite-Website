"use client";
import { IconLeaf, IconMap, IconStar } from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

const cards = {
  bg: [
    {
      icon: <IconMap />,
      title: "Създадено в Пловдив",
      copy: "Идеята и реализацията е от група пловдивски младежи по случей Teenovator 2026. Продуктът е произведен в Пловдивска област, а с част от реализираната печалба се усъществяват проекти в обществена полза за града.",
    },
    {
      icon: <IconLeaf />,
      title: "Ясен и прозрачен състав",
      copy: "Ядки, семена, фибри, растителен протеин, лукума, еритритол и морска сол — без излишна сложност. Произведено от сертифициран производител (BioStyle LTD), който вярва във важността на устойчивите практитки в бичнеса.",
    },
    {
      icon: <IconStar />,
      title: "Балансиран избор",
      copy: "С ниско съдържание на нетни въглехидрати, богато на фибри и растителен протеин, нашето барче е обмислен избор за вашето здраве. А чрез инициативите на ТЕПЕ bite той е правилен и от социална гледна точка.",
    },
  ],
  en: [
    {
      icon: <IconMap />,
      title: "Made in Plovdiv",
      copy: "The idea and implementation is from a group of young people from Plovdiv as part of the Teenovator 2026 program. The product is produced in the Plovdiv region, and part of the profits are used to support community projects in the city.",
    },
    {
      icon: <IconLeaf />,
      title: "Clear and transparent ingredients",
      copy: "Nuts, seeds, fibre, plant protein, lucuma, erythritol and sea salt — without unnecessary complexity. Made by a certified manufacturer (BioStyle LTD) that believes in the importance of sustainable practices in business.",
    },
    {
      icon: <IconStar />,
      title: "Balanced choice",
      copy: "With low net carbs, rich in fibre and plant protein, our bar is a thoughtful choice for your health. And through the initiatives of TEPE bite, it's also a socially responsible one.",
    },
  ],
};

export default function TrustSection() {
  const lang = useAtomValue(langAtom);
  const items = cards[lang];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Качество и доверие" : "Quality & Trust"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Качество, в което вярваме"
              : "Quality We Believe In"}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {items.map((c, i) => (
            <div
              key={i}
              className={`card trust-card ${i === items.length - 1 ? "trust-last" : ""}`}
              style={{ padding: "32px 28px" }}
            >
              <div
                style={{
                  fontSize: "1.4rem",
                  marginBottom: 16,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--caramel-lt)",
                  borderRadius: 12,
                  color: "var(--caramel)",
                }}
              >
                {c.icon}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "var(--plum)",
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h4>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>{c.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-card {
          flex: 1 1 calc((100% - 48px) / 3);
        }

        @media (max-width: 1000px) {
          .trust-card {
            flex: 1 1 calc((100% - 24px) / 2);
          }

          .trust-card.trust-last {
            flex-basis: 100%;
          }
        }

        @media (max-width: 650px) {
          .trust-card {
            flex-basis: 100%;
          }
        }
      `}</style>
    </section>
  );
}
