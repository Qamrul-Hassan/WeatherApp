"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

const LiveMap = ({ lat = 23.8103, lon = 90.4125 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents hydration errors

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
