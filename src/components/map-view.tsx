"use client";

import { useEffect, useRef, useState } from "react";
import L, { type LeafletMouseEvent, type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";
import { Jam } from "@/lib/types";

// Custom marker icon
const createJamIcon = (icon: string | null) => {
  return L.divIcon({
    className: "jam-marker",
    html: `<div class="jam-marker-inner">${icon || ""}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface MapClickHandlerProps {
  onMapClick: (pos: [number, number]) => void;
}

interface MapViewProps {
  jams: Jam[];
  onJamSelect: (jam: Jam) => void;
  onMapClick?: (pos: [number, number]) => void;
  selectedJam?: Jam | null;
}

export default function MapView({ jams, onJamSelect, onMapClick, selectedJam }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || mapRef.current || !mapElementRef.current) {
      return;
    }

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
    }).setView([38.7223, -9.1393], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (onMapClick) {
      map.on("click", (event: LeafletMouseEvent) => {
        onMapClick([event.latlng.lat, event.latlng.lng]);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [isMounted, onMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    jams.forEach((jam) => {
      const marker = L.marker(jam.pos, {
        icon: createJamIcon(jam.icon),
      }).addTo(map);

      marker.bindPopup(`
        <div class="min-width-[200px] p-1">
          <h3 style="font-weight:600;margin-bottom:8px;">${jam.title}</h3>
          <div style="display:grid;gap:6px;font-size:14px;color:#6b7280;">
            <div>${jam.location}</div>
            <div>${formatDate(jam.dateTime)}</div>
            <div>${jam.duration}</div>
            <div>${jam.attendees.length} attending</div>
          </div>
        </div>
      `);

      marker.on("click", () => {
        onJamSelect(jam);
      });

      markersRef.current[jam.id] = marker;
    });
  }, [jams, onJamSelect]);

  useEffect(() => {
    if (!selectedJam) {
      return;
    }

    const marker = markersRef.current[selectedJam.id];
    const map = mapRef.current;
    if (!marker || !map) {
      return;
    }

    map.flyTo(selectedJam.pos, map.getZoom(), {
      duration: 0.4,
    });
    marker.openPopup();
  }, [selectedJam]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <style jsx global>{`
        .jam-marker {
          background: transparent;
          border: none;
        }
        .jam-marker-inner {
          width: 40px;
          height: 40px;
          background: hsl(24 95% 53%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          font-size: 18px;
          border: 3px solid white;
        }
        .jam-marker-inner > * {
          transform: rotate(45deg);
        }
      `}</style>
      <div ref={mapElementRef} className="h-full w-full z-0" />
    </>
  );
}
