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
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<"BA" | "BOG">("BA");

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/locations`, { signal })
      .then(res => res.json())
      .then(data => {
        setLocations(data.locations);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("Error al obtener locaciones:", err);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [open]);

  const filteredLocations = locations.filter(loc => {
    const lat = parseFloat(loc.latitude.toString());
    return selectedCity === "BA" ? lat < 0 : lat > 0;
  });

  useEffect(() => {
    if (
      !open ||
      loading ||
      !mapContainerRef.current ||
      !apiKey ||
      filteredLocations.length === 0
    )
      return;

    if (mapRef.current && typeof mapRef.current.remove === "function") {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [filteredLocations[0].longitude, filteredLocations[0].latitude],
      zoom: 12,
    });

    mapRef.current = map;

    filteredLocations.forEach(loc => {
      new maplibregl.Marker({ color: "#dc2626" })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div class="text-sm font-semibold text-gray-800">${loc.name}</div>
             <div class="text-xs text-gray-500">${loc.address}</div>
             <div class="text-xs text-gray-400">${loc.details || ""}</div>`
          )
        )
        .addTo(map);
    });

    setTimeout(() => map.resize(), 300);

    return () => {
      if (mapRef.current && typeof mapRef.current.remove === "function") {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [open, loading, apiKey, filteredLocations]);

  return (
    <div className="h-full w-full rounded-lg relative">
      {loading && (
        <div className="absolute inset-0 z-10 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="absolute z-20 top-4 right-4">
          <button
            onClick={() =>
              setSelectedCity(selectedCity === "BA" ? "BOG" : "BA")
            }
            className="bg-white text-sm shadow-md border px-4 py-1 rounded-full hover:bg-gray-100 transition">
            Ver sedes en {selectedCity === "BA" ? "Bogotá" : "Buenos Aires"}
          </button>
        </div>
      )}

      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default MapWithMarkers;
