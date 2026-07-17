"use client";

import { IconArrow } from "@/components/icons";
import { PledgeHeart } from "@/components/ImpactPledge";
import type { Lang } from "@/store/lang";
import Link from "next/link";

/**
 * ImpactPolicyBand — a compact dark-plum pointer band.
 *
 * A shorter echo of the /impact "instrument" section (see
 * ImpactPageContent.tsx → HowImpactWorksSection). It reuses the same dark-plum
 * canvas, sky-tinted accents, masked ТЕПЕ bite Impact logo and blurred sky
 * glow, but drops the 4-step grid — it reads as a pointer to the full story,
 * not a repeat of it. Fixed `var(--plum)` background: it lives OUTSIDE the
 * surface↔bg alternation of InitiativesOverview.
 */
export default function ImpactPolicyBand({ lang }: { lang: Lang }) {
  const bg = lang === "bg";

  return (
    <section
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 6vw, 72px) clamp(20px, 5vw, 80px)",
      }}
    >
      {/* Masked ТЕПЕ bite Impact logo, bottom-left, tinted into the plum */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -20,
          bottom: -14,
          width: "min(38vw, 260px)",
          aspectRatio: "2.1 / 1",
          backgroundColor: "rgb(82, 51, 95)",
          maskImage: "url(/brand/TEPEbiteImpact-crop.png)",
          maskSize: "contain",
          maskPosition: "left bottom",
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(/brand/TEPEbiteImpact-crop.png)",
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "left bottom",
          WebkitMaskRepeat: "no-repeat",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Sky glow blob — transparency / Impact accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -70,
          right: "16%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "oklch(74% 0.1 230 / 0.16)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="policy-band-inner section-inner"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(24px, 4vw, 56px)",
        }}
      >
        {/* Left — the pointer copy */}
        <div className="policy-band-copy" style={{ maxWidth: 620 }}>
          <div
            className="label-tag"
            style={{ color: "oklch(82% 0.09 230)", marginBottom: 16 }}
          >
            {bg ? "Как работим" : "How we work"}
          </div>

          <div
            className="policy-band-lockup"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <PledgeHeart size={60} fill="var(--caramel)" textColor="white" />
            <h2
              className="heading-lg"
              style={{
                color: "white",
                textAlign: "left",
                margin: 0,
                fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
                lineHeight: 1.15,
              }}
            >
              {bg ? "Политиката зад нашия" : "The policy behind our"}{" "}
              <span
                style={{
                  fontFamily: "var(--font-brush)",
                  fontWeight: 1000,
                  color: "var(--caramel)",
                  lineHeight: 1,
                }}
              >
                Impact
              </span>
            </h2>
          </div>

          <p
            style={{
              color: "oklch(90% 0.03 310)",
              fontSize: "1.04rem",
              margin: 0,
              maxWidth: 560,
            }}
          >
            {bg
              ? "Искаш да разбереш повече за политиката, по която организираме инициативите си и как работи ТЕПЕ bite Impact?"
              : "Want to understand the policy under which we organise our initiatives and how ТЕПЕ bite Impact works?"}
          </p>
        </div>

        {/* Right — single pointer link */}
        <div className="policy-band-cta" style={{ flexShrink: 0 }}>
          <Link href="/impact" className="btn btn-sky justify-center">
            {bg ? "Разбери повече" : "Learn more"}
            <IconArrow />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .policy-band-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .policy-band-cta {
            width: 100%;
          }
        }
        @media (max-width: 520px) {
          .policy-band-lockup {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .policy-band-cta .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
