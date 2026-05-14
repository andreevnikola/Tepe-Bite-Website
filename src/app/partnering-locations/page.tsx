import Footer from "@/components/Footer";
import LocationCard from "@/components/locations/LocationCard";
import LocationsGridHeader from "@/components/locations/LocationsGridHeader";
import LocationsHero from "@/components/locations/LocationsHero";
import LocationsMapSection from "@/components/locations/LocationsMapSection";
import LocationOrderBridge from "@/components/locations/LocationOrderBridge";
import PartnerCTA from "@/components/locations/PartnerCTA";
import { getAllLocations } from "@/sanity/queries";
import type { Location } from "@/sanity/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Партньорски локации — ТЕПЕ bite",
  description:
    "Намери ТЕПЕ bite в магазини из Пловдив. Разгледай нашите партньори на интерактивна карта.",
};

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        color: "var(--text-soft)",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: "0 auto 16px", display: "block", opacity: 0.4 }}
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <p style={{ margin: 0 }}>Очаквайте скоро нашите партньори</p>
    </div>
  );
}

export default async function PartneringLocationsPage() {
  let locations: Location[] = [];
  try {
    locations = await getAllLocations();
  } catch {
    // Sanity not configured or no data — show empty state
  }

  return (
    <main>
      <LocationsHero />

      {/* Map section */}
      <section
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingBottom: 64,
          background: "var(--bg)",
        }}
      >
        <div className="section-inner">
          <LocationsMapSection locations={locations} />
        </div>
      </section>

      {/* Grid section */}
      <section
        className="section-spacing"
        style={{ background: "var(--surface2)" }}
      >
        <div className="section-inner">
          <LocationsGridHeader />

          {locations.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(clamp(260px, 28vw, 340px), 1fr))",
                gap: 28,
              }}
            >
              {locations.map((loc) => (
                <LocationCard key={loc._id} loc={loc} />
              ))}
            </div>
          )}
        </div>
      </section>

      <LocationOrderBridge />
      <PartnerCTA />
      <Footer />
    </main>
  );
}
