"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

const steps = {
  bg: [
    {
      num: "01",
      title: "Поръчваш барче",
      copy: "Избираш ТЕПЕ bite като вкусна и по-балансирана междинна закуска.",
    },
    {
      num: "02",
      title: "Подкрепяш инициатива",
      copy: "Част от стойността на всяка покупка се насочва към социална кауза.",
    },
    {
      num: "03",
      title: "Виждаш резултата",
      copy: "Показваме напредъка, предстоящите стъпки и резултатите от реализираните от нас инициативи.",
    },
  ],
  en: [
    {
      num: "01",
      title: "You order a bar",
      copy: "You choose ТЕПЕ bite as a tasty and more balanced snack.",
    },
    {
      num: "02",
      title: "You support a cause",
      copy: "Part of the value from every purchase goes towards a social initiative.",
    },
    {
      num: "03",
      title: "You see the result",
      copy: "We show progress, upcoming steps and results from initiatives we have implemented.",
    },
  ],
};

export default function HowItHelps() {
  const lang = useAtomValue(langAtom);
  const items = steps[lang];

  return (
    <section className="section-spacing">
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Как работи" : "How it works"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Как всяка покупка помага"
              : "How Every Purchase Helps"}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {items.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  flex: "0 1 280px",
                  textAlign: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: i === 1 ? "var(--plum)" : "var(--surface)",
                    border: i === 1 ? "none" : "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    boxShadow:
                      i === 1
                        ? "0 8px 24px oklch(32% 0.09 315 / 0.28)"
                        : "var(--shadow)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: i === 1 ? "white" : "var(--plum)",
                    }}
                  >
                    {s.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "var(--plum)",
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.93rem",
                    maxWidth: 240,
                    margin: "0 auto",
                  }}
                >
                  {s.copy}
                </p>
              </div>
              {i < items.length - 1 && (
                <div className="step-connector" style={{ marginTop: 36 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
