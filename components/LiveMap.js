"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const FALLBACK_POSITION = [40.7128, -74.006];

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const LiveMap = ({ lat, lon, cityName = "Location" }) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const position = useMemo(() => {
    if (isFiniteNumber(lat) && isFiniteNumber(lon)) return [lat, lon];
    return FALLBACK_POSITION;
  }, [lat, lon]);

  const markerIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");

    return new L.DivIcon({
      html: `
        <div style="position:relative">
          <span style="position:absolute;inset:-14px;border-radius:9999px;background:rgba(14,165,233,.22);animation:mapPulse 2.6s ease-out infinite;"></span>
          <svg width="30" height="43" viewBox="0 0 30 43" style="position:relative;filter:drop-shadow(0 6px 6px rgba(0,0,0,0.25));">
            <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 28 15 28s15-17.5 15-28c0-8.284-6.716-15-15-15z" fill="#0284c7" stroke="#FFFFFF" stroke-width="1.5" />
            <circle cx="15" cy="12" r="5" fill="#FFFFFF" />
          </svg>
        </div>
      `,
      className: "",
      iconSize: [30, 43],
      iconAnchor: [15, 43],
      popupAnchor: [0, -34],
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    mapRef.current.setView(position, 10, { animate: true, duration: 1.4 });
    if (markerRef.current) markerRef.current.openPopup();
  }, [mounted, position]);

  if (!mounted) {
    return (
      <div className="map-skeleton">
        <div className="map-skeleton-dot" />
        <p className="map-skeleton-text">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="map-frame">
      <MapContainer
        center={position}
        zoom={10}
        className="h-full w-full"
        zoomControl
        scrollWheelZoom
        whenReady={(event) => {
          mapRef.current = event.target;
          setTimeout(() => event.target.invalidateSize(), 60);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} ref={markerRef} icon={markerIcon}>
          <Popup className="map-popup">
            <div className="map-popup-content">
              <p className="map-popup-title">{cityName}</p>
              <p>Lat: {position[0].toFixed(4)}</p>
              <p>Lon: {position[1].toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;
