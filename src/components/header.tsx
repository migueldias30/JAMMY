"use client";

import { User } from "@/lib/types";
import { Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./header.module.css";

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
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {user.name.charAt(0)}
            </div>
            <div
              className={cn(
                styles.statusDot,
                statusColors[user.status]
              )}
            />
          </div>
          <div>
            <h1 className={styles.title}>Jammy</h1>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {hasNotifications && (
              <span className={styles.notificationDot} />
            )}
          </button>
          <button
            onClick={onCreateJam}
            className={styles.cta}
          >
            <Plus size={20} />
            <span className={styles.ctaLabel}>New Jam</span>
          </button>
        </div>
      </div>
    </header>
  );
}
