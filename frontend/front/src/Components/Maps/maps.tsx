"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  details?: string;
}

interface Props {
  open: boolean;
}

const MapWithMarkers = ({ open }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/locations`)
      .then(res => res.json())
      .then(data => {
        setLocations(data.locations);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener locaciones:", err);
        setLoading(false);
      });
  }, [open]);

  useEffect(() => {
    if (!open || !mapContainerRef.current || !apiKey || locations.length === 0)
      return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [locations[0].longitude, locations[0].latitude],
      zoom: 12,
    });

    locations.forEach(loc => {
      new maplibregl.Marker({ color: "#dc2626" })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div class="text-sm font-semibold text-gray-800">${
              loc.name
            }</div><div class="text-xs text-gray-500">${
              loc.address
            }</div><div class="text-xs text-gray-400">${
              loc.details || ""
            }</div>`
          )
        )
        .addTo(map);
    });

    setTimeout(() => map.resize(), 300);

    return () => map.remove();
  }, [open, apiKey, locations]);

  return (
    <div className="h-full w-full rounded-lg relative">
      {loading && (
        <div className="absolute inset-0 z-10 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default MapWithMarkers;
