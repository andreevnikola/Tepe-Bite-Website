"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** Shared Plovdiv-hills path (see STYLE_GUIDE "Imagery" / PageLoading). */
const HILL_PATH =
  "M0 200 L0 120 Q150 50 300 90 Q450 130 600 70 L600 200 Z";

/**
 * Large-photo placeholder: the same plum→caramel gradient + hill silhouette
 * STYLE_GUIDE already uses for "no cover" states (see InitiativeCard's
 * CoverPlaceholder). Reused here so a loading photo and a missing photo read
 * as the same brand moment instead of two different fallback languages.
 */
function CoverPlaceholder() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(145deg, var(--plum-lt) 0%, oklch(94% 0.05 52) 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, width: "100%", opacity: 0.22 }}
      >
        <path d={HILL_PATH} fill="var(--plum)" />
      </svg>
    </div>
  );
}

/** Small-asset placeholder (logos, thumbnails, icons): a quiet sheen, no motif — the hill silhouette doesn't read at that scale. */
function FlatPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="skeleton-block"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

type PlaceholderMode = "cover" | "flat";

export type SmartImageProps = ImageProps & {
  /** Force the placeholder style. Defaults to "cover" for `fill` images or
   * either dimension ≥ 120px, "flat" otherwise (logos, badges, thumbnails). */
  placeholderMode?: PlaceholderMode;
};

/**
 * Drop-in `next/image` replacement: shows a brand placeholder in the image's
 * own box until it decodes, then crossfades in. On error the placeholder is
 * left showing instead of the browser's broken-image icon.
 */
export default function SmartImage({
  placeholderMode,
  style,
  onLoad,
  onError,
  ...props
}: SmartImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  const numericW = typeof props.width === "number" ? props.width : 0;
  const numericH = typeof props.height === "number" ? props.height : 0;
  const mode: PlaceholderMode =
    placeholderMode ?? (props.fill || numericW >= 120 || numericH >= 120 ? "cover" : "flat");

  const showPlaceholder = status !== "loaded";
  const Placeholder = mode === "cover" ? CoverPlaceholder : FlatPlaceholder;

  const image = (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is required on ImageProps and always present via the spread; eslint can't see through it
    <Image
      {...props}
      onLoad={(e) => {
        setStatus("loaded");
        onLoad?.(e);
      }}
      onError={(e) => {
        setStatus("error");
        onError?.(e);
      }}
      style={{
        ...style,
        opacity: status === "loaded" ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    />
  );

  // `fill` images require a positioned ancestor sized by the caller already —
  // the placeholder can sit as an absolutely-positioned sibling in that same
  // box, no extra wrapper needed.
  if (props.fill) {
    return (
      <>
        {showPlaceholder && <Placeholder />}
        {image}
      </>
    );
  }

  // Non-fill images size the box themselves (intrinsic width/height); wrap in
  // an inline-block that auto-fits the rendered image so the placeholder
  // overlays exactly the same box, including when `style` overrides width/height.
  return (
    <span style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
      {showPlaceholder && <Placeholder />}
      {image}
    </span>
  );
}
