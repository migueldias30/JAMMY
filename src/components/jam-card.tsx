"use client";

import { Jam } from "@/lib/types";
import { Calendar, Clock, Users, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./jam-card.module.css";

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
      return `Hoje às ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("pt-PT", { weekday: "short", month: "short", day: "numeric" });
  };

  const isUpcoming = new Date(jam.dateTime) > new Date();

  return (
    <div
      className={cn(
        styles.card,
        isAttending && styles.cardAttending
      )}
      onClick={() => onSelect(jam)}
    >
      <div className={styles.row}>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            {jam.icon && <span className={styles.emoji}>{jam.icon}</span>}
            <h3 className={styles.title}>{jam.title}</h3>
          </div>
          
          {!compact && (
            <div className={styles.location}>
              <MapPin size={14} />
              <span className={styles.truncate}>{jam.location}</span>
            </div>
          )}
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={14} className={isUpcoming ? styles.metaHighlightIcon : undefined} />
              <span className={isUpcoming ? styles.metaHighlightText : undefined}>{formatDate(jam.dateTime)}</span>
            </div>
            <div className={styles.metaItem}>
              <Clock size={14} />
              <span>{jam.duration}</span>
            </div>
            <div className={styles.metaItem}>
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
          className={styles.chatButton}
          aria-label="Abrir chat"
        >
          <MessageCircle size={18} className={styles.chatIcon} />
        </button>
      </div>
      
      {isAttending && (
        <div className={styles.attending}>
          <span className={styles.attendingLabel}>Vais participar</span>
        </div>
      )}
    </div>
  );
}
