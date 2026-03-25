"use client";

import { useState } from "react";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Circle, Coffee, Briefcase, Plane, Moon, Edit3 } from "lucide-react";

interface MoodTabProps {
  user: User;
  onStatusChange: (status: User["status"], message?: string) => void;
}

const statusOptions = [
  {
    status: "available" as const,
    label: "Available",
    description: "Ready to jam anytime",
    icon: Circle,
    color: "text-accent bg-accent/10 border-accent/30",
    dotColor: "bg-accent",
  },
  {
    status: "busy" as const,
    label: "Busy",
    description: "Working on something",
    icon: Briefcase,
    color: "text-destructive bg-destructive/10 border-destructive/30",
    dotColor: "bg-destructive",
  },
  {
    status: "away" as const,
    label: "Away",
    description: "Taking a break",
    icon: Plane,
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/30",
    dotColor: "bg-yellow-500",
  },
  {
    status: "offline" as const,
    label: "Invisible",
    description: "Appear offline",
    icon: Moon,
    color: "text-muted-foreground bg-muted border-border",
    dotColor: "bg-muted-foreground/50",
  },
];

const quickMessages = [
  "Down for coffee",
  "Let's grab beers",
  "Free all day!",
  "Working until 6",
  "On vacation",
  "Do not disturb",
];

export default function MoodTab({ user, onStatusChange }: MoodTabProps) {
  const [customMessage, setCustomMessage] = useState(user.statusMessage || "");
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  const handleStatusSelect = (status: User["status"]) => {
    onStatusChange(status, customMessage);
  };

  const handleMessageSubmit = () => {
    onStatusChange(user.status, customMessage);
    setIsEditingMessage(false);
  };

  const handleQuickMessage = (message: string) => {
    setCustomMessage(message);
    onStatusChange(user.status, message);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Current Status Display */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-semibold text-secondary-foreground">
              {user.name.charAt(0)}
            </div>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card",
                statusOptions.find((s) => s.status === user.status)?.dotColor
              )}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">
              {statusOptions.find((s) => s.status === user.status)?.label}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status Message</label>
          {isEditingMessage ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleMessageSubmit()}
              />
              <button
                onClick={handleMessageSubmit}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingMessage(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary border border-border text-left hover:bg-secondary/80 transition-colors"
            >
              <span className={customMessage ? "text-foreground" : "text-muted-foreground"}>
                {customMessage || "Add a status message..."}
              </span>
              <Edit3 size={16} className="ml-auto text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Quick Messages */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickMessages.map((message) => (
            <button
              key={message}
              onClick={() => handleQuickMessage(message)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                customMessage === message
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
              )}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      {/* Status Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground px-1">Your Availability</h3>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = user.status === option.status;

            return (
              <button
                key={option.status}
                onClick={() => handleStatusSelect(option.status)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left",
                  isActive
                    ? option.color
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <Icon
                  size={24}
                  className={cn(
                    "mb-2",
                    isActive ? "" : "text-muted-foreground"
                  )}
                />
                <span className={cn("font-medium", isActive ? "" : "text-foreground")}>
                  {option.label}
                </span>
                <span className={cn("text-xs mt-0.5", isActive ? "opacity-80" : "text-muted-foreground")}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
        <p>
          Your status helps friends know when you're free to jam. They can see your availability
          and status message when planning hangouts.
        </p>
      </div>
    </div>
  );
}
