"use client";

import { User } from "@/lib/types";
import { Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: User;
  onCreateJam: () => void;
  hasNotifications?: boolean;
}

const statusColors = {
  available: "bg-accent",
  busy: "bg-destructive",
  away: "bg-yellow-500",
  offline: "bg-muted-foreground/30",
};

export default function Header({ user, onCreateJam, hasNotifications }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        {/* Logo & User */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold text-secondary-foreground">
              {user.name.charAt(0)}
            </div>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
                statusColors[user.status]
              )}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Jammy</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-foreground" />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            )}
          </button>
          <button
            onClick={onCreateJam}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Jam</span>
          </button>
        </div>
      </div>
    </header>
  );
}
