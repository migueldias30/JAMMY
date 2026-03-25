"use client";

import { Jam } from "@/lib/types";
import JamCard from "./jam-card";
import { Calendar, Clock } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <Calendar size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">No jams yet</p>
        <p className="text-sm text-center mt-1">
          Create your first jam or wait for friends to invite you!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {upcomingJams.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3 px-1">
            <Clock size={16} />
            Upcoming
          </h2>
          <div className="space-y-3">
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
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3 px-1">
            <Calendar size={16} />
            Past Jams
          </h2>
          <div className="space-y-3 opacity-70">
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
