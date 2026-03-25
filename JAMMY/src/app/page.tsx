"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { TabType, Jam, Message, User } from "@/lib/types";
import { mockUser, mockFriends, mockGroups, mockJams, mockMessages, mockFriendRequests } from "@/lib/mock-data";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import JamsList from "@/components/jams-list";
import SocialTab from "@/components/social-tab";
import MoodTab from "@/components/mood-tab";
import ChatPanel from "@/components/chat-panel";
import CreateJamModal from "@/components/create-jam-modal";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for map to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted">
      <div className="animate-pulse text-muted-foreground">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  // User state
  const [user, setUser] = useState<User>(mockUser);
  
  // Data state
  const [friends] = useState(mockFriends);
  const [groups] = useState(mockGroups);
  const [jams, setJams] = useState(mockJams);
  const [messages, setMessages] = useState(mockMessages);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  
  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("map");
  const [showCreateJam, setShowCreateJam] = useState(false);
  const [selectedJam, setSelectedJam] = useState<Jam | null>(null);
  const [chatJam, setChatJam] = useState<Jam | null>(null);
  const [mapClickPos, setMapClickPos] = useState<[number, number] | null>(null);
  const [mapView, setMapView] = useState<"map" | "list">("map");

  // Handlers
  const handleCreateJam = useCallback((jamData: Omit<Jam, "id">) => {
    const newJam: Jam = {
      ...jamData,
      id: `jam-${Date.now()}`,
    };
    setJams((prev) => [...prev, newJam]);
    setMapClickPos(null);
  }, []);

  const handleJoinJam = useCallback((jamId: string) => {
    setJams((prev) =>
      prev.map((jam) =>
        jam.id === jamId && !jam.attendees.includes(user.name)
          ? { ...jam, attendees: [...jam.attendees, user.name] }
          : jam
      )
    );
  }, [user.name]);

  const handleLeaveJam = useCallback((jamId: string) => {
    setJams((prev) =>
      prev.map((jam) =>
        jam.id === jamId
          ? { ...jam, attendees: jam.attendees.filter((a) => a !== user.name) }
          : jam
      )
    );
  }, [user.name]);

  const handleSendMessage = useCallback((content: string) => {
    if (!chatJam) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      jamId: chatJam.id,
      userId: user.uid,
      userName: user.name,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [chatJam, user]);

  const handleStatusChange = useCallback((status: User["status"], message?: string) => {
    setUser((prev) => ({ ...prev, status, statusMessage: message }));
  }, []);

  const handleAcceptRequest = useCallback((requestId: string) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" as const } : r))
    );
  }, []);

  const handleRejectRequest = useCallback((requestId: string) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" as const } : r))
    );
  }, []);

  const handleMapClick = useCallback((pos: [number, number]) => {
    setMapClickPos(pos);
    setShowCreateJam(true);
  }, []);

  const jamMessages = chatJam ? messages.filter((m) => m.jamId === chatJam.id) : [];
  const isAttendingChat = chatJam ? chatJam.attendees.includes(user.name) || chatJam.creatorId === user.uid : false;
  const pendingRequests = friendRequests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onCreateJam={() => setShowCreateJam(true)}
        hasNotifications={pendingRequests.length > 0}
      />

      <main className="pt-16 pb-20 h-screen">
        {activeTab === "map" && (
          <div className="h-full flex flex-col">
            {/* Toggle between map and list */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
              <h2 className="text-sm font-medium text-muted-foreground">
                {jams.length} jams nearby
              </h2>
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setMapView("map")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    mapView === "map" ? "bg-card shadow-sm" : "hover:bg-card/50"
                  )}
                  aria-label="Map view"
                >
                  <MapIcon size={18} className={mapView === "map" ? "text-primary" : "text-muted-foreground"} />
                </button>
                <button
                  onClick={() => setMapView("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    mapView === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
                  )}
                  aria-label="List view"
                >
                  <List size={18} className={mapView === "list" ? "text-primary" : "text-muted-foreground"} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {mapView === "map" ? (
                <MapView
                  jams={jams}
                  onJamSelect={(jam) => {
                    setSelectedJam(jam);
                    setChatJam(jam);
                  }}
                  onMapClick={handleMapClick}
                  selectedJam={selectedJam}
                />
              ) : (
                <div className="h-full overflow-y-auto">
                  <JamsList
                    jams={jams}
                    currentUserId={user.uid}
                    onSelectJam={(jam) => {
                      setSelectedJam(jam);
                      setChatJam(jam);
                    }}
                    onOpenChat={(jam) => setChatJam(jam)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="h-full overflow-hidden">
            <SocialTab
              friends={friends}
              groups={groups}
              friendRequests={friendRequests}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onCreateGroup={() => {}}
            />
          </div>
        )}

        {activeTab === "mood" && (
          <div className="h-full overflow-y-auto">
            <MoodTab user={user} onStatusChange={handleStatusChange} />
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <CreateJamModal
        isOpen={showCreateJam}
        onClose={() => {
          setShowCreateJam(false);
          setMapClickPos(null);
        }}
        onCreate={handleCreateJam}
        groups={groups}
        currentUser={user}
        initialPos={mapClickPos}
      />

      {chatJam && (
        <ChatPanel
          jam={chatJam}
          messages={jamMessages}
          currentUser={user}
          isOpen={!!chatJam}
          onClose={() => {
            setChatJam(null);
            setSelectedJam(null);
          }}
          onSendMessage={handleSendMessage}
          onJoinJam={() => handleJoinJam(chatJam.id)}
          onLeaveJam={() => handleLeaveJam(chatJam.id)}
          isAttending={isAttendingChat}
        />
      )}
    </div>
  );
}
