"use client";

import config from "@/sanity/config";
import dynamic from "next/dynamic";

const NextStudio = dynamic(
  () => import("next-sanity/studio/client-component").then((m) => m.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
