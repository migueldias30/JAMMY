"use client";

import { Jam } from "@/lib/types";
import JamCard from "./jam-card";
import { Calendar, Clock } from "lucide-react";
import styles from "./jams-list.module.css";

interface JamsListProps {
  jams: Jam[];
  currentUserId: string;
  onSelectJam: (jam: Jam) => void;
  onOpenChat: (jam: Jam) => void;
}

export default function JamsList({ jams, currentUserId, onSelectJam, onOpenChat }: JamsListProps) {
  const now = new Date();
  
  const upcomingJams = jams
    .filter((jam) => new Date(jam.dateTime) > now)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const pastJams = jams
    .filter((jam) => new Date(jam.dateTime) <= now)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  if (jams.length === 0) {
    return (
      <div className={styles.empty}>
        <Calendar size={48} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>Ainda não há jams</p>
        <p className={styles.emptyText}>
          Cria a tua primeira jam ou espera por um convite dos teus amigos.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {upcomingJams.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>
            <Clock size={16} />
            Próximas
          </h2>
          <div className={styles.cards}>
            {upcomingJams.map((jam) => (
              <JamCard
                key={jam.id}
                jam={jam}
                onSelect={onSelectJam}
                onOpenChat={onOpenChat}
                isAttending={jam.attendees.some(
                  (a) => a === currentUserId || jam.creatorId === currentUserId
                )}
              />
            ))}
          </div>
        </section>
      )}

      {pastJams.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>
            <Calendar size={16} />
            Jams anteriores
          </h2>
          <div className={styles.pastCards}>
            {pastJams.map((jam) => (
              <JamCard
                key={jam.id}
                jam={jam}
                onSelect={onSelectJam}
                onOpenChat={onOpenChat}
                compact
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
