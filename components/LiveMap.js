"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo } from "react";

const LiveMap = ({ lat, lon, cityName = "Location" }) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef();
  const markerRef = useRef();

  const position = useMemo(() => {
    return lat && lon ? [lat, lon] : [23.8103, 90.4125];
  }, [lat, lon]);

  const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
  );
  const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
  );
  const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
  );
  const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
  );

  const createMarkerIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");

    return new L.DivIcon({
      html: `
        <div style="position:relative">
          <svg width="30" height="43" viewBox="0 0 30 43" style="filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3));">
            <path 
              d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 28 15 28s15-17.5 15-28c0-8.284-6.716-15-15-15z" 
              fill="#EA4335" 
              stroke="#FFF" 
              stroke-width="1.5"
            />
            <circle cx="15" cy="12" r="5" fill="#FFF" />
          </svg>
        </div>
      `,
      className: '',
      iconSize: [30, 43],
      iconAnchor: [15, 43],
      popupAnchor: [0, -40]
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

    const timer = setTimeout(() => {
      mapRef.current.invalidateSize();
      mapRef.current.setView(position, 13);
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [mounted, position]);

  if (!mounted) {
    return (
      <div className="h-[250px] sm:h-[400px] lg:h-screen w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-300 rounded-full mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[250px] sm:h-[400px] lg:h-screen w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
        whenCreated={(map) => {
          mapRef.current = map;
          setTimeout(() => map.invalidateSize(), 50);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={position} 
          ref={markerRef}
          icon={createMarkerIcon}
          eventHandlers={{
            add: () => {
              if (mapRef.current) {
                mapRef.current.setView(position);
              }
            }
          }}
        >
          <Popup className="!rounded-lg !border !border-gray-200 !shadow-lg">
            <div className="text-sm space-y-1">
              <p className="font-bold text-red-600">{cityName}</p>
              <p className="text-gray-700">Latitude: {position[0]?.toFixed(4)}</p>
              <p className="text-gray-700">Longitude: {position[1]?.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;
