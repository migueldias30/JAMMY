"use client";

import { Jam } from "@/lib/types";
import { Calendar, Clock, Users, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JamCardProps {
  jam: Jam;
  onSelect: (jam: Jam) => void;
  onOpenChat: (jam: Jam) => void;
  isAttending?: boolean;
  compact?: boolean;
}

export default function JamCard({ jam, onSelect, onOpenChat, isAttending, compact }: JamCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  const isUpcoming = new Date(jam.dateTime) > new Date();

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-4 transition-all hover:shadow-md cursor-pointer",
        isAttending && "border-primary/30 bg-primary/5"
      )}
      onClick={() => onSelect(jam)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {jam.icon && <span className="text-xl">{jam.icon}</span>}
            <h3 className="font-semibold text-foreground truncate">{jam.title}</h3>
          </div>
          
          {!compact && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <MapPin size={14} />
              <span className="truncate">{jam.location}</span>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className={isUpcoming ? "text-primary" : ""} />
              <span className={isUpcoming ? "text-foreground font-medium" : ""}>{formatDate(jam.dateTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{jam.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{jam.attendees.length}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenChat(jam);
          }}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Open chat"
        >
          <MessageCircle size={18} className="text-secondary-foreground" />
        </button>
      </div>
      
      {isAttending && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs font-medium text-primary">You're attending</span>
        </div>
      )}
    </div>
  );
}
