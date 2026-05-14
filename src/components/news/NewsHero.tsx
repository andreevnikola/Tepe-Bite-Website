"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function NewsHero() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      className="section-spacing pt-36!"
      style={{ position: "relative", overflow: "hidden", textAlign: "center" }}
    >
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-120px",
          width: "480px",
          height: "480px",
          background: "var(--plum)",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-80px",
          width: "320px",
          height: "320px",
          background: "var(--caramel)",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.07,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <span className="label-tag">{lang === "bg" ? "НОВИНИ" : "NEWS"}</span>

        <div
          style={{
            width: "48px",
            height: "3px",
            background: "var(--caramel)",
            margin: "16px auto",
            borderRadius: "2px",
          }}
        />

        <h1 className="heading-xl" style={{ marginBottom: "20px" }}>
          {lang === "bg"
            ? "Прозрачност преди всичко"
            : "Transparency, Above All"}
        </h1>

        <p
          style={{
            color: "var(--text-mid)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.75,
            fontSize: "1.05rem",
          }}
        >
          {lang === "bg"
            ? "Вярваме, че честността изгражда доверие. Затова споделяме всяка стъпка от пътя ни — от напредъка на кампанията до участията ни на събития и срещи с общността."
            : "We believe honesty builds trust. That's why we share every step of our journey — from campaign milestones to our appearances at events and community gatherings."}
        </p>
      </div>
    </section>
  );
}
