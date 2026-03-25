"use client";

import { useEffect, useRef, useState } from "react";
import { NotificationItem, User } from "@/lib/types";
import { Plus, Bell, MapPinned, CalendarClock, UserPlus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./header.module.css";

interface HeaderProps {
  user: User;
  onCreateJam: () => void;
  hasNotifications?: boolean;
  notifications: NotificationItem[];
}

const statusColors = {
  available: "bg-accent",
  busy: "bg-destructive",
  away: "bg-yellow-500",
  offline: "bg-muted-foreground/30",
};

const notificationIcons = {
  request: UserPlus,
  jam: CalendarClock,
  message: MessageCircle,
};

export default function Header({ user, onCreateJam, hasNotifications, notifications }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <MapPinned size={18} />
          </div>
          <div>
            <h1 className={styles.title}>Jammy</h1>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onCreateJam}
            className={styles.cta}
          >
            <Plus size={20} />
            <span className={styles.ctaLabel}>Nova Jam</span>
          </button>
          <div className={styles.notificationsWrap} ref={notificationsRef}>
            <button
              className={styles.iconButton}
              aria-label="Notificações"
              onClick={() => setIsNotificationsOpen((value) => !value)}
            >
              <Bell size={20} />
              {hasNotifications && (
                <span className={styles.notificationDot} />
              )}
            </button>

            {isNotificationsOpen && (
              <div className={styles.notificationsPanel}>
                <div className={styles.notificationsHeader}>
                  <h2 className={styles.notificationsTitle}>Notificações</h2>
                  <span className={styles.notificationsCount}>{notifications.length}</span>
                </div>

                <div className={styles.notificationsList}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = notificationIcons[notification.kind];

                      return (
                        <div key={notification.id} className={styles.notificationItem}>
                          <div className={styles.notificationIconWrap}>
                            <Icon size={16} />
                          </div>
                          <div className={styles.notificationBody}>
                            <p className={styles.notificationItemTitle}>{notification.title}</p>
                            <p className={styles.notificationItemText}>{notification.description}</p>
                          </div>
                          <span className={styles.notificationTime}>{notification.timeLabel}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.notificationsEmpty}>
                      <Bell size={18} />
                      <p>Sem novidades por agora.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
        </div>
      </div>
    </header>
  );
}
