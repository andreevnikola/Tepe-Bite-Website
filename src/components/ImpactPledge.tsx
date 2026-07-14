"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Fixed pledge amount, in euros, per bar sold. Single source of truth. */
export const PLEDGE_EUR = 0.15;

const IconArrowSm = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/**
 * The heart lockup from the wrap — a symmetric heart with the amount inside.
 * Reused across the site (hero chip, big lockups) so it stays perfectly
 * consistent and never skews.
 */
export function PledgeHeart({
  size = 52,
  label = ".15€",
  fill = "var(--plum)",
  textColor = "var(--surface)",
}: {
  size?: number;
  label?: string;
  fill?: string;
  textColor?: string;
}) {
  return (
    <span
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        display: "inline-block",
        lineHeight: 0,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{
          display: "block",
          filter: "drop-shadow(0 3px 6px oklch(32% 0.09 315 / 0.28))",
        }}
      >
        <path
          fill={fill}
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${-size * 0.06}px)`,
          color: textColor,
          fontFamily: "var(--font-body)",
          fontWeight: 800,
          fontSize: size * 0.24,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </span>
  );
}

type Variant = "chip" | "tag" | "total";

const fmt = (n: number) =>
  n.toLocaleString("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * The fixed-0.15-€ pledge motif, reused across the site.
 * - `chip`  — heart + one-line promise, links to /impact (hero, sections, footer)
 * - `tag`   — compact inline tag for use near a price
 * - `total` — cart/checkout: multiplies the pledge by `count`
 */
export default function ImpactPledge({
  variant = "chip",
  count,
  href = "/impact",
  className,
  style,
}: {
  variant?: Variant;
  count?: number;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const pathname = usePathname();

  if (variant === "tag") {
    return (
      <Link
        href={href}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--sky-lt)",
          border: "1px solid oklch(85% 0.06 230)",
          borderRadius: 100,
          padding: "5px 12px 5px 6px",
          textDecoration: "none",
          ...style,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--sky-mid)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.68rem",
            flexShrink: 0,
          }}
        >
          15¢
        </span>
        <p
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--sky-dk)",
            lineHeight: 1.25,
          }}
        >
          {bg
            ? "0.15 € от това барче → ТЕПЕ bite Impact"
            : "0.15 € from this bar → ТЕПЕ bite Impact"}
        </p>
      </Link>
    );
  }

  if (variant === "total") {
    const n = Math.max(count ?? 0, 0);
    const total = n * PLEDGE_EUR;
    return (
      <Link
        href={href}
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "var(--sky-lt)",
          border: "1px solid oklch(85% 0.06 230)",
          borderRadius: "var(--r-sm)",
          padding: "14px 16px",
          textDecoration: "none",
          ...style,
        }}
      >
        <PledgeHeart size={44} />
        <span style={{ lineHeight: 1.4 }}>
          <span
            style={{
              display: "block",
              fontWeight: 800,
              color: "var(--plum)",
              fontSize: "0.95rem",
            }}
          >
            {bg
              ? `Твоята поръчка дарява ${fmt(total)} € във фонда`
              : `Your order gives ${fmt(total)} € to the fund`}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--sky-dk)",
            }}
          >
            {bg
              ? `${n} × 0.15 € · ТЕПЕ bite Impact`
              : `${n} × 0.15 € · ТЕПЕ bite Impact`}
            <IconArrowSm />
          </span>
        </span>
      </Link>
    );
  }

  // chip
  return (
    <Link
      href={href}
      className={`impact-chip ${className ?? ""}`}
      style={style}
    >
      <PledgeHeart size={52} />
      <div
        style={{ lineHeight: 1.35 }}
        className={
          pathname === "/impact"
            ? "w-full max-[1200px]:items-center max-[1200px]:justify-center flex flex-col"
            : ""
        }
      >
        <span
          style={{
            display: "block",
            fontWeight: 800,
            color: "var(--plum)",
            fontSize: "0.98rem",
          }}
        >
          {bg ? "0.15 € от всяко барче" : "0.15 € from every bar"}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--sky-dk)",
          }}
        >
          {bg
            ? "влиза във фонд ТЕПЕ bite Impact"
            : "goes to the ТЕПЕ bite Impact fund"}
          <IconArrowSm />
        </span>
      </div>
    </Link>
  );
}
