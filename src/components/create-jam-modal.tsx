"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Group, User, Jam } from "@/lib/types";
import { X, MapPin, Clock, Search, Loader, Globe, UserCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateJamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (jam: Omit<Jam, "id">) => void;
  groups: Group[];
  currentUser: User;
  initialPos?: [number, number] | null;
}

const ICONS = [null, "coffee", "beer", "ball", "laptop", "music", "burger", "art", "movie", "gym", "dance"];
const ICON_DISPLAY: Record<string, string> = {
  coffee: "C",
  beer: "B",
  ball: "S",
  laptop: "W",
  music: "M",
  burger: "F",
  art: "A",
  movie: "V",
  gym: "G",
  dance: "D",
};

const DURATIONS = ["30m", "1h", "2h", "3h", "4h", "Late"];

export default function CreateJamModal({
  isOpen,
  onClose,
  onCreate,
  groups,
  currentUser,
  initialPos,
}: CreateJamModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    duration: "2h",
    icon: null as string | null,
    privacy: "all-friends" as "public" | "all-friends" | "groups",
    targetGroups: [] as string[],
    pos: initialPos || null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialPos) {
      setFormData((prev) => ({ ...prev, pos: initialPos }));
    }
  }, [initialPos]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (result: { display_name: string; lat: string; lon: string }) => {
    setFormData((prev) => ({
      ...prev,
      location: result.display_name,
      pos: [parseFloat(result.lat), parseFloat(result.lon)],
    }));
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pos) {
      alert("Please select a location on the map or search for an address.");
      return;
    }

    const fullDateTime = new Date(`${formData.date}T${formData.time}`);

    onCreate({
      title: formData.title,
      location: formData.location,
      pos: formData.pos as [number, number],
      dateTime: fullDateTime.toISOString(),
      duration: formData.duration === "Late" ? "Late" : formData.duration,
      icon: formData.icon,
      privacy: formData.privacy,
      targetGroups: formData.targetGroups,
      attendees: [currentUser.name],
      creatorId: currentUser.uid,
      creatorName: currentUser.name,
    });

    // Reset
    setFormData({
      title: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      duration: "2h",
      icon: null,
      privacy: "all-friends",
      targetGroups: [],
      pos: null,
    });
    setSearchQuery("");
    onClose();
  };

  const toggleGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetGroups: prev.targetGroups.includes(groupId)
        ? prev.targetGroups.filter((id) => id !== groupId)
        : [...prev.targetGroups, groupId],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Host a Jam</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X size={20} className="text-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">JAM TITLE</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What's happening?"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">LOCATION</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                      placeholder="Search for a place..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    {isSearching ? <Loader size={20} className="animate-spin" /> : "Find"}
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden mt-2">
                    {searchResults.map((result, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectLocation(result)}
                        className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-secondary transition-colors border-b border-border last:border-0"
                      >
                        {result.display_name}
                      </button>
                    ))}
                  </div>
                )}
                {formData.pos && (
                  <p className="flex items-center gap-1.5 text-sm text-accent">
                    <MapPin size={14} />
                    Location set: {formData.pos[0].toFixed(4)}, {formData.pos[1].toFixed(4)}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">WHEN</label>
                <div className="flex gap-3">
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">DURATION</label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration: d })}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        formData.duration === d
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">ICON</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon || "none"}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
                        formData.icon === icon
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {icon === null ? (
                        <X size={16} />
                      ) : (
                        <span className="text-xs">{ICON_DISPLAY[icon]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">WHO CAN SEE</label>
                <div className="flex gap-2">
                  {[
                    { id: "public" as const, label: "Public", icon: Globe },
                    { id: "all-friends" as const, label: "Friends", icon: UserCheck },
                    { id: "groups" as const, label: "Groups", icon: Shield },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, privacy: p.id })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        formData.privacy === p.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      <p.icon size={18} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Groups Selection */}
              {formData.privacy === "groups" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">SELECT GROUPS</label>
                  <div className="flex flex-wrap gap-2">
                    {groups.length > 0 ? (
                      groups.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            formData.targetGroups.includes(group.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {group.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No groups found. Create one first!</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Post Jam
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
