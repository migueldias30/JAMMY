"use client";

import { useEffect, useRef, useState } from "react";
import L, { type LeafletMouseEvent, type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";
import { Jam } from "@/lib/types";
import styles from "./map-view.module.css";

// Custom marker icon
const createJamIcon = (icon: string | null) => {
  return L.divIcon({
    className: styles.marker,
    html: `<div class="${styles.markerInner}">${icon || ""}</div>`,
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
        <div class="${styles.popup}">
          <h3 class="${styles.popupTitle}">${jam.title}</h3>
          <div class="${styles.popupMeta}">
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
      <div className={styles.loadingState}>
        <div className={styles.loadingText}>Loading map...</div>
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

  return <div ref={mapElementRef} className={styles.map} />;
}
