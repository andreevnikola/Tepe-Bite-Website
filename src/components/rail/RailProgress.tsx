"use client";

/**
 * Thin, subtle scroll-progress indicator for a rail carousel — deliberately
 * distinct from globals.css's .progress-track/.progress-fill, which carry a
 * "funding progress" semantic per STYLE_GUIDE.md. Short (not full-width),
 * centred under the rail, only rendered when the rail actually overflows.
 */
export default function RailProgress({
  progress,
  overflows,
}: {
  progress: number;
  overflows: boolean;
}) {
  if (!overflows) return null;
  return (
    <div
      style={{
        width: 72,
        height: 3,
        margin: "18px auto 0",
        borderRadius: 10,
        background: "var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 10,
          background: "var(--caramel)",
          width: `${Math.round(progress * 100)}%`,
          transition: "width 0.15s linear",
        }}
      />
    </div>
  );
}
