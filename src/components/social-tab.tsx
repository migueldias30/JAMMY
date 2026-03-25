"use client";

import { useState } from "react";
import { Friend, Group, FriendRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserPlus, Users, Bell, Check, X, ChevronRight, Plus } from "lucide-react";

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
    <div className="flex flex-col h-full">
      {/* Sub-tabs */}
      <div className="flex border-b border-border px-4">
        <button
          onClick={() => setActiveSubTab("friends")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeSubTab === "friends"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <UserPlus size={18} />
          Friends
          <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
            {friends.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("groups")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeSubTab === "groups"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users size={18} />
          Groups
        </button>
        <button
          onClick={() => setActiveSubTab("requests")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors relative",
            activeSubTab === "requests"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell size={18} />
          Requests
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSubTab === "friends" && (
          <div className="space-y-2">
            {friends.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p>No friends yet</p>
                <p className="text-sm">Add friends to start jamming together!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.uid}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-medium text-secondary-foreground">
                      {friend.name.charAt(0)}
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card",
                        statusColors[friend.status]
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{friend.name}</p>
                    {friend.statusMessage && (
                      <p className="text-sm text-muted-foreground truncate">{friend.statusMessage}</p>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === "groups" && (
          <div className="space-y-2">
            <button
              onClick={onCreateGroup}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus size={24} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">Create New Group</span>
            </button>
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Users size={20} className="text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{group.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {group.members.length} members
                  </p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === "requests" && (
          <div className="space-y-2">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-medium text-secondary-foreground">
                    {request.fromUserName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{request.fromUserName}</p>
                    <p className="text-sm text-muted-foreground">Wants to be your friend</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptRequest(request.id)}
                      className="p-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                      aria-label="Accept"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => onRejectRequest(request.id)}
                      className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
