"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Jam } from "@/lib/types";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

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

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface MapViewProps {
  jams: Jam[];
  onJamSelect: (jam: Jam) => void;
  onMapClick?: (pos: [number, number]) => void;
  selectedJam?: Jam | null;
}

export default function MapView({ jams, onJamSelect, onMapClick, selectedJam }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    } else if (date.toDateString() === tomorrow.toDateString()) {
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
      <MapContainer
        center={[38.7223, -9.1393]}
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {jams.map((jam) => (
          <Marker
            key={jam.id}
            position={jam.pos}
            icon={createJamIcon(jam.icon)}
            eventHandlers={{
              click: () => onJamSelect(jam),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <h3 className="font-semibold text-foreground text-base mb-2">{jam.title}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate">{jam.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(jam.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{jam.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{jam.attendees.length} attending</span>
                  </div>
                </div>
                <button
                  onClick={() => onJamSelect(jam)}
                  className="mt-3 w-full bg-primary text-primary-foreground py-2 px-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
