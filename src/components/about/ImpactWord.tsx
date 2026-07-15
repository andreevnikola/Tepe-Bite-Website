import type { CSSProperties, ReactNode } from "react";

const FUND = "ТЕПЕ bite Impact";

/**
 * Render a plain string, replacing every mention of the fund
 * ("ТЕПЕ bite Impact") with <ImpactWord/> so the brush "Impact" styling stays
 * consistent everywhere the fund is named — including copy stored as strings.
 */
export function renderWithFund(text: string, tone?: "caramel" | "cream"): ReactNode {
  if (!text.includes(FUND)) return text;
  const parts = text.split(FUND);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <ImpactWord tone={tone} size="1.05em" />}
    </span>
  ));
}

/**
 * The fund wordmark "ТЕПЕ bite Impact", with the word "Impact" set in the
 * navbar brush font (Caveat, `--font-brush`) exactly as the nav renders it.
 * Use this for every on-page mention of the fund so the styling stays in one
 * place. `tone` recolours the brush word for dark panels.
 */
export default function ImpactWord({
  tone = "caramel",
  size = "1.15em",
  style,
}: {
  tone?: "caramel" | "cream";
  /** Font size of the brush "Impact" relative to surrounding text. */
  size?: string;
  style?: CSSProperties;
}) {
  return (
    <span style={{ whiteSpace: "nowrap", ...style }}>
      ТЕПЕ bite{" "}
      <span
        style={{
          fontFamily: "var(--font-brush)",
          fontWeight: 700,
          fontSize: size,
          color: tone === "cream" ? "oklch(93% 0.06 70)" : "var(--caramel)",
          lineHeight: 1,
        }}
      >
        Impact
      </span>
    </span>
  );
}
