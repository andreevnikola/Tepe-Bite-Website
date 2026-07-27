"use client";

/**
 * Shared 44x44 circular prev/next control for header-row rail controls
 * (MoreInitiativesSection, PartnersCarousel, WhySection's PortfolioRail,
 * YouthPartnerCarousel). NewsStrip uses its own smaller overlay blob instead
 * since it has no header-controls row.
 */
export default function RailArrow({
  dir,
  disabled,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: disabled ? "var(--text-soft)" : "var(--plum)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontSize: "1.3rem",
        boxShadow: "var(--shadow)",
        transition: "opacity 0.2s, transform 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
