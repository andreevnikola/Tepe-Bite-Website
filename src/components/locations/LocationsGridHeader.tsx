"use client";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";

export default function LocationsGridHeader() {
  const lang = useAtomValue(langAtom);
  return (
    <div style={{ marginBottom: 48 }}>
      <div className="label-tag" style={{ color: "var(--caramel)", marginBottom: 12 }}>
        {lang === "bg" ? "Нашите партньори" : "Our partners"}
      </div>
      <h2 className="heading-lg">
        {lang === "bg" ? "Всички локации" : "All locations"}
      </h2>
    </div>
  );
}
