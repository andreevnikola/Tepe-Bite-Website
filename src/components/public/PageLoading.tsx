import type { CSSProperties } from "react";

/**
 * Route skeleton for the public pages.
 *
 * Rendered by each public `loading.tsx` while the route's server components
 * stream in — roughly 200–900 ms — so it stays deliberately quiet. The caramel
 * section divider and the Plovdiv hill silhouette are the only brand cues;
 * everything else is a warm neutral block with a slow sheen (disabled under
 * `prefers-reduced-motion` via `.skeleton-block` in `globals.css`).
 *
 * No copy, so nothing here needs a BG/EN pair.
 */

type Variant = "page" | "detail" | "form";

/** Shared Plovdiv-hills path (see STYLE_GUIDE "Signature motifs"). */
const HILL_PATH =
  "M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z";

function Block({
  w = "100%",
  h = 14,
  r = 10,
  style,
}: {
  w?: number | string;
  h?: number | string;
  r?: number | string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="skeleton-block"
      aria-hidden="true"
      style={{
        width: w,
        height: h,
        maxWidth: "100%",
        borderRadius: r,
        ...style,
      }}
    />
  );
}

function Header({ centred }: { centred: boolean }) {
  const headingHeight = "clamp(28px, 4.2vw, 42px)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: centred ? "center" : "flex-start",
        marginBottom: "clamp(40px, 6vw, 64px)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 56,
          height: 3,
          borderRadius: 10,
          background: "var(--caramel)",
          opacity: 0.55,
          marginBottom: 10,
        }}
      />
      <Block w={116} h={10} r={100} style={{ opacity: 0.75 }} />
      {/* `min()` keeps the two title bars visibly different lengths at every
          width — a hard px width would clamp both to the container on mobile. */}
      <Block
        w={centred ? "min(440px, 92%)" : "min(520px, 88%)"}
        h={headingHeight}
        r={14}
      />
      <Block
        w={centred ? "min(280px, 66%)" : "min(340px, 60%)"}
        h={headingHeight}
        r={14}
        style={{ opacity: 0.7 }}
      />
      <Block
        w="min(540px, 100%)"
        h={12}
        style={{ marginTop: 10, opacity: 0.55 }}
      />
    </div>
  );
}

export default function PageLoading({
  variant = "page",
}: {
  variant?: Variant;
}) {
  return (
    <div
      aria-busy="true"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <section
        className="section-spacing"
        style={{
          paddingTop: "clamp(112px, 13vw, 148px)",
          position: "relative",
        }}
      >
        <div className="section-inner">
          <Header centred={variant === "page"} />

          {variant === "page" && (
            <div
              className="page-loading-cards"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {[0, 1, 2].map((i) => (
                <Block
                  key={i}
                  h="clamp(180px, 24vw, 240px)"
                  r="var(--r-lg)"
                  style={{ opacity: 1 - i * 0.18 }}
                />
              ))}
            </div>
          )}

          {variant === "detail" && (
            <>
              <Block
                h="clamp(190px, 32vw, 360px)"
                r="var(--r-lg)"
                style={{ marginBottom: "clamp(32px, 4vw, 48px)" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  maxWidth: 760,
                }}
              >
                {["100%", "94%", "97%", "86%", "58%"].map((w, i) => (
                  <Block
                    key={w}
                    w={w}
                    h={12}
                    style={{ opacity: 0.7 - i * 0.1 }}
                  />
                ))}
              </div>
            </>
          )}

          {variant === "form" && (
            <div
              className="page-loading-form"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
                gap: 32,
                alignItems: "start",
              }}
            >
              <Block h="clamp(280px, 40vw, 420px)" r="var(--r-lg)" />
              <Block
                h="clamp(180px, 28vw, 300px)"
                r="var(--r-lg)"
                style={{ opacity: 0.72 }}
              />
            </div>
          )}
        </div>
      </section>

      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "clamp(110px, 16vw, 190px)",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      >
        <path d={HILL_PATH} fill="var(--plum)" />
      </svg>

      <style>{`
        /* Below ~990px the card grid drops to two columns, which would leave
           the third tile orphaned on a half-empty row — hide it instead. */
        @media (max-width: 990px) {
          .page-loading-cards > :nth-child(3) { display: none; }
        }
        @media (max-width: 900px) {
          .page-loading-form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
