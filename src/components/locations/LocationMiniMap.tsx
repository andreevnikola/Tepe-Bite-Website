"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

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
});

export default function LocationMiniMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md,20px)",
        overflow: "hidden",
        height: 260,
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border)",
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}
