"use client";
import type { Location } from "@/sanity/types";
import dynamic from "next/dynamic";

const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "clamp(320px, 45vw, 520px)",
        borderRadius: "var(--r-lg)",
        background: "var(--surface2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-soft)",
        fontSize: "0.9rem",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      Зарежда карта…
    </div>
  ),
});

export default function LocationsMapSection({
  locations,
}: {
  locations: Location[];
}) {
  return <LocationsMap locations={locations} />;
}
