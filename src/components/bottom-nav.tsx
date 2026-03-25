"use client";

import { TabType } from "@/lib/types";
import { Map, Users, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./bottom-nav.module.css";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "map" as TabType, label: "Mapa", icon: Map },
  { id: "social" as TabType, label: "Social", icon: Users },
  { id: "mood" as TabType, label: "Estado", icon: Smile },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                styles.tab,
                isActive ? styles.tabActive : styles.tabIdle
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(styles.label, isActive && styles.labelActive)}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
