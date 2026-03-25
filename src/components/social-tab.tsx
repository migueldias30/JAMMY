"use client";

import { useState } from "react";
import { Friend, Group, FriendRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserPlus, Users, Bell, Check, X, ChevronRight, Plus } from "lucide-react";
import styles from "./social-tab.module.css";

interface SocialTabProps {
  friends: Friend[];
  groups: Group[];
  friendRequests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onCreateGroup: () => void;
}

type SubTab = "friends" | "groups" | "requests";

const statusColors = {
  available: "bg-accent",
  busy: "bg-destructive",
  away: "bg-yellow-500",
  offline: "bg-muted-foreground/30",
};

export default function SocialTab({
  friends,
  groups,
  friendRequests,
  onAcceptRequest,
  onRejectRequest,
  onCreateGroup,
}: SocialTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("friends");

  const pendingRequests = friendRequests.filter((r) => r.status === "pending");

  return (
    <div className={styles.root}>
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveSubTab("friends")}
          className={cn(
            styles.tab,
            activeSubTab === "friends" ? styles.tabActive : styles.tabIdle
          )}
        >
          <UserPlus size={18} />
          Friends
          <span className={styles.count}>
            {friends.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("groups")}
          className={cn(
            styles.tab,
            activeSubTab === "groups" ? styles.tabActive : styles.tabIdle
          )}
        >
          <Users size={18} />
          Groups
        </button>
        <button
          onClick={() => setActiveSubTab("requests")}
          className={cn(
            styles.tab,
            activeSubTab === "requests" ? styles.tabActive : styles.tabIdle
          )}
        >
          <Bell size={18} />
          Requests
          {pendingRequests.length > 0 && (
            <span className={styles.badge}>
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {activeSubTab === "friends" && (
          <div className={styles.stack}>
            {friends.length === 0 ? (
              <div className={styles.empty}>
                <UserPlus size={48} className={styles.emptyIcon} />
                <p>No friends yet</p>
                <p className={styles.subtitle}>Add friends to start jamming together!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.uid}
                  className={styles.card}
                >
                  <div className={styles.avatarWrap}>
                    <div className={styles.avatar}>
                      {friend.name.charAt(0)}
                    </div>
                    <div
                      className={cn(
                        styles.statusDot,
                        statusColors[friend.status]
                      )}
                    />
                  </div>
                  <div className={styles.body}>
                    <p className={styles.title}>{friend.name}</p>
                    {friend.statusMessage && (
                      <p className={cn(styles.subtitle, styles.truncate)}>{friend.statusMessage}</p>
                    )}
                  </div>
                  <ChevronRight size={18} className={styles.chevron} />
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === "groups" && (
          <div className={styles.stack}>
            <button
              onClick={onCreateGroup}
              className={styles.createGroup}
            >
              <div className={styles.createIconWrap}>
                <Plus size={24} className="text-primary" />
              </div>
              <span className={styles.createLabel}>Create New Group</span>
            </button>
            {groups.map((group) => (
              <div
                key={group.id}
                className={styles.card}
              >
                <div className={styles.groupIconWrap}>
                  <Users size={20} className="text-secondary-foreground" />
                </div>
                <div className={styles.body}>
                  <p className={styles.title}>{group.name}</p>
                  <p className={styles.subtitle}>
                    {group.members.length} members
                  </p>
                </div>
                <ChevronRight size={18} className={styles.chevron} />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === "requests" && (
          <div className={styles.stack}>
            {pendingRequests.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={48} className={styles.emptyIcon} />
                <p>No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className={styles.requestCard}
                >
                  <div className={styles.avatar}>
                    {request.fromUserName.charAt(0)}
                  </div>
                  <div className={styles.body}>
                    <p className={styles.title}>{request.fromUserName}</p>
                    <p className={styles.subtitle}>Wants to be your friend</p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onAcceptRequest(request.id)}
                      className={styles.accept}
                      aria-label="Accept"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => onRejectRequest(request.id)}
                      className={styles.reject}
                      aria-label="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
