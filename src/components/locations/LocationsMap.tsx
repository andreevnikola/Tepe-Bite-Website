"use client";
import { langAtom } from "@/store/lang";
import type { Location } from "@/sanity/types";
import { useAtomValue } from "jotai";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const PLOVDIV: [number, number] = [42.1485, 24.7508];

const pinIcon = L.divIcon({
  html: `
    <div style="position:relative;width:30px;height:40px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25))">
      <div style="
        position:absolute;
        width:30px;height:30px;
        background:var(--plum,#3d1a4a);
        border:2.5px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        top:0;left:0;
      "></div>
      <div style="
        position:absolute;
        width:10px;height:10px;
        background:var(--caramel,#c47830);
        border-radius:50%;
        top:10px;left:10px;
        z-index:1;
      "></div>
    </div>
  `,
  className: "",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -42],
});

function FindMeControl({ lang }: { lang: "bg" | "en" }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleFind = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15, {
          animate: true,
        });
        L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
          radius: 9,
          fillColor: "var(--caramel,#c47830)",
          color: "white",
          weight: 2.5,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup(lang === "bg" ? "Вие сте тук" : "You are here")
          .openPopup();
        setLoading(false);
      },
      () => setLoading(false),
      { timeout: 6000 }
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 48,
        zIndex: 499,
      }}
    >
      <button
        onClick={handleFind}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "white",
          border: "none",
          borderRadius: "var(--r-sm,12px)",
          padding: "8px 14px",
          fontSize: "0.8rem",
          fontWeight: 600,
          fontFamily: "var(--font-body)",
          color: "var(--plum)",
          cursor: loading ? "default" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {loading
          ? lang === "bg"
            ? "Търси..."
            : "Finding..."
          : lang === "bg"
            ? "Намери ме"
            : "Find me"}
      </button>
    </div>
  );
}

export default function LocationsMap({
  locations,
}: {
  locations: Location[];
}) {
  const lang = useAtomValue(langAtom);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--r-lg,32px)",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        height: "clamp(320px, 45vw, 520px)",
      }}
    >
      <MapContainer
        center={PLOVDIV}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <FindMeControl lang={lang} />
        {locations.map((loc) => {
          if (!loc.coordinates?.lat || !loc.coordinates?.lng) return null;
          const name =
            lang === "en" && loc.nameEn ? loc.nameEn : loc.nameBg;
          return (
            <Marker
              key={loc._id}
              position={[loc.coordinates.lat, loc.coordinates.lng]}
              icon={pinIcon}
            >
              <Popup>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    minWidth: 160,
                    padding: "2px 0",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "var(--plum)",
                      marginBottom: 2,
                    }}
                  >
                    {name}
                  </div>
                  {loc.neighborhood && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-soft)",
                        marginBottom: 6,
                      }}
                    >
                      {loc.neighborhood}
                    </div>
                  )}
                  <Link
                    href={`/partnering-locations/${loc.slug.current}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--caramel)",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      textDecoration: "none",
                    }}
                  >
                    {lang === "bg" ? "Виж детайли" : "View details"} →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
