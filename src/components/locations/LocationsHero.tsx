"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function LocationsHero() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      style={{
        paddingTop: 140,
        paddingBottom: 64,
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        background: `
          radial-gradient(ellipse 60% 55% at 80% 50%, oklch(88% 0.05 315 / 0.18), transparent),
          radial-gradient(ellipse 40% 40% at 10% 80%, oklch(88% 0.08 55 / 0.14), transparent),
          var(--bg)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -40,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "oklch(88% 0.05 315 / 0.12)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div className="section-inner" style={{ position: "relative" }}>
        <div
          className="label-tag"
          style={{ color: "var(--caramel)", marginBottom: 16 }}
        >
          {lang === "bg" ? "Партньорски локации" : "Partner Locations"}
        </div>

        <h1 className="heading-xl" style={{ maxWidth: 640, marginBottom: 20 }}>
          {lang === "bg" ? (
            <>
              Намери ни{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                близо до теб
              </span>
            </>
          ) : (
            <>
              Find us{" "}
              <span style={{ color: "var(--caramel)", fontStyle: "italic" }}>
                near you
              </span>
            </>
          )}
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            maxWidth: 520,
            color: "var(--text-mid)",
            lineHeight: 1.72,
            marginBottom: 0,
          }}
        >
          {lang === "bg"
            ? "ТЕПЕ bite се предлага в избрани магазини из Пловдив. Разгледай партньорите ни на картата или в списъка по-долу."
            : "ТЕПЕ bite is available at selected stores across Plovdiv. Browse our partners on the map or in the list below."}
        </p>
      </div>
    </section>
  );
}
