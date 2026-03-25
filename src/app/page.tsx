"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { TabType, Jam, Message, User } from "@/lib/types";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import JamsList from "@/components/jams-list";
import SocialTab from "@/components/social-tab";
import MoodTab from "@/components/mood-tab";
import ChatPanel from "@/components/chat-panel";
import CreateJamModal from "@/components/create-jam-modal";
import AuthScreen from "@/components/auth-screen";
import { useAppDatabase } from "@/hooks/use-app-database";
import { hashPassword, parseJwtPayload } from "@/lib/auth";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";
import { AuthUser } from "@/lib/types";

// Dynamic import for map to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className={styles.loadingState}>
      <div className={styles.loadingText}>A carregar mapa...</div>
    </div>
  ),
});

export default function Home() {
  const { database, setDatabase } = useAppDatabase();

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("map");
  const [showCreateJam, setShowCreateJam] = useState(false);
  const [selectedJam, setSelectedJam] = useState<Jam | null>(null);
  const [chatJam, setChatJam] = useState<Jam | null>(null);
  const [mapClickPos, setMapClickPos] = useState<[number, number] | null>(null);
  const [mapView, setMapView] = useState<"map" | "list">("map");

  const { user, friends, groups, jams, messages, friendRequests } = database;

  const syncSessionUser = (users: AuthUser[], currentUserId: string | null) => {
    if (!currentUserId) {
      return null;
    }

    const currentUser = users.find((candidate) => candidate.uid === currentUserId);
    if (!currentUser) {
      return null;
    }

    const { passwordHash: _passwordHash, googleSub: _googleSub, provider: _provider, createdAt: _createdAt, ...safeUser } =
      currentUser;
    return safeUser;
  };

  // Handlers
  const handleCreateJam = useCallback((jamData: Omit<Jam, "id">) => {
    if (!user) {
      return;
    }

    const newJam: Jam = {
      ...jamData,
      id: `jam-${Date.now()}`,
    };
    setDatabase((prev) => {
      return {
        ...prev,
        jams: [...prev.jams, newJam],
      };
    });
    setMapClickPos(null);
    setShowCreateJam(false);
  }, [setDatabase, user]);

  const handleJoinJam = useCallback((jamId: string) => {
    setDatabase((prev) => {
      if (!prev.user) {
        return prev;
      }

      const currentUser = prev.user;

      return {
        ...prev,
        jams: prev.jams.map((jam) =>
          jam.id === jamId && !jam.attendees.includes(currentUser.name)
            ? { ...jam, attendees: [...jam.attendees, currentUser.name] }
            : jam
        ),
      };
    });
  }, [setDatabase]);

  const handleLeaveJam = useCallback((jamId: string) => {
    setDatabase((prev) => {
      if (!prev.user) {
        return prev;
      }

      const currentUser = prev.user;

      return {
        ...prev,
        jams: prev.jams.map((jam) =>
          jam.id === jamId
            ? { ...jam, attendees: jam.attendees.filter((a) => a !== currentUser.name) }
            : jam
        ),
      };
    });
  }, [setDatabase]);

  const handleSendMessage = useCallback((content: string) => {
    if (!chatJam || !user) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      jamId: chatJam.id,
      userId: user.uid,
      userName: user.name,
      content,
      timestamp: new Date().toISOString(),
    };
    setDatabase((prev) => {
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });
  }, [chatJam, setDatabase, user]);

  const handleStatusChange = useCallback((status: User["status"], message?: string) => {
    if (!database.user) {
      return;
    }

    setDatabase((prev) => {
      return {
        ...prev,
        user: prev.user ? { ...prev.user, status, statusMessage: message } : prev.user,
        users: prev.users.map((candidate) =>
          candidate.uid === prev.currentUserId ? { ...candidate, status, statusMessage: message } : candidate
        ),
      };
    });
  }, [database.user, setDatabase]);

  const handleAcceptRequest = useCallback((requestId: string) => {
    setDatabase((prev) => {
      const request = prev.friendRequests.find((item) => item.id === requestId);
      if (!request) {
        return prev;
      }

      const alreadyFriend = prev.friends.some((friend) => friend.uid === request.fromUserId);

      return {
        ...prev,
        friends: alreadyFriend
          ? prev.friends
          : [
              ...prev.friends,
              {
                uid: request.fromUserId,
                name: request.fromUserName,
                status: "offline",
              },
            ],
        friendRequests: prev.friendRequests.map((r) =>
          r.id === requestId ? { ...r, status: "accepted" as const } : r
        ),
      };
    });
  }, [setDatabase]);

  const handleRejectRequest = useCallback((requestId: string) => {
    setDatabase((prev) => {
      return {
        ...prev,
        friendRequests: prev.friendRequests.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" as const } : r
        ),
      };
    });
  }, [setDatabase]);

  const handleMapClick = useCallback((pos: [number, number]) => {
    setMapClickPos(pos);
    setShowCreateJam(true);
  }, []);

  const handleLogout = useCallback(() => {
    setDatabase((prev) => ({
      ...prev,
      user: null,
      currentUserId: null,
    }));
    setShowCreateJam(false);
    setChatJam(null);
    setSelectedJam(null);
    setMapClickPos(null);
  }, [setDatabase]);

  const handleEmailLogin = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = email.toLowerCase();
      const passwordHash = await hashPassword(password);
      const account = database.users.find(
        (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.passwordHash === passwordHash
      );

      if (!account) {
        return "Email ou password inválidos.";
      }

      setDatabase((prev) => ({
        ...prev,
        currentUserId: account.uid,
        user: syncSessionUser(prev.users, account.uid),
      }));

      return null;
    },
    [database.users, setDatabase]
  );

  const handleEmailRegister = useCallback(
    async (name: string, email: string, password: string) => {
      const normalizedEmail = email.toLowerCase();
      if (name.length < 2) {
        return "Indica um nome válido.";
      }

      if (database.users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
        return "Esse email já está registado.";
      }

      const newUserId = `user-${Date.now()}`;
      const passwordHash = await hashPassword(password);
      const createdAt = new Date().toISOString();
      const newAccount: AuthUser = {
        uid: newUserId,
        name,
        email: normalizedEmail,
        status: "available",
        statusMessage: "Pronto para combinar uma jam",
        provider: "email",
        passwordHash,
        createdAt,
      };

      setDatabase((prev) => ({
        ...prev,
        users: [...prev.users, newAccount],
        currentUserId: newAccount.uid,
        user: syncSessionUser([...prev.users, newAccount], newAccount.uid),
      }));

      return null;
    },
    [database.users, setDatabase]
  );

  const handleGoogleLogin = useCallback(
    async (credential: string) => {
      const payload = parseJwtPayload<{ sub?: string; email?: string; name?: string; picture?: string }>(credential);
      if (!payload?.email || !payload?.sub) {
        return "Não foi possível validar a resposta do Google.";
      }

      const normalizedEmail = payload.email.toLowerCase();
      const existingAccount =
        database.users.find((candidate) => candidate.googleSub === payload.sub) ??
        database.users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

      if (existingAccount) {
        const updatedAccount: AuthUser = {
          ...existingAccount,
          name: payload.name || existingAccount.name,
          email: normalizedEmail,
          avatar: payload.picture || existingAccount.avatar,
          provider: "google",
          googleSub: payload.sub,
        };

        setDatabase((prev) => {
          const users = prev.users.map((candidate) => (candidate.uid === existingAccount.uid ? updatedAccount : candidate));
          return {
            ...prev,
            users,
            currentUserId: updatedAccount.uid,
            user: syncSessionUser(users, updatedAccount.uid),
          };
        });

        return null;
      }

      const newAccount: AuthUser = {
        uid: `user-${Date.now()}`,
        name: payload.name || "Utilizador Google",
        email: normalizedEmail,
        avatar: payload.picture,
        status: "available",
        statusMessage: "Pronto para combinar uma jam",
        provider: "google",
        googleSub: payload.sub,
        createdAt: new Date().toISOString(),
      };

      setDatabase((prev) => {
        const users = [...prev.users, newAccount];
        return {
          ...prev,
          users,
          currentUserId: newAccount.uid,
          user: syncSessionUser(users, newAccount.uid),
        };
      });

      return null;
    },
    [database.users, setDatabase]
  );

  const jamMessages = chatJam ? messages.filter((m) => m.jamId === chatJam.id) : [];
  const isAttendingChat = chatJam && user ? chatJam.attendees.includes(user.name) || chatJam.creatorId === user.uid : false;
  const pendingRequests = friendRequests.filter((r) => r.status === "pending");

  if (!user) {
    return (
      <AuthScreen
        jamsCount={jams.length}
        friendsCount={friends.length}
        groupsCount={groups.length}
        onLogin={handleEmailLogin}
        onRegister={handleEmailRegister}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <div className={styles.page}>
      <Header
        user={user}
        onCreateJam={() => setShowCreateJam(true)}
        onLogout={handleLogout}
        hasNotifications={pendingRequests.length > 0}
      />

      <main className={styles.main}>
        {activeTab === "map" && (
          <div className={styles.panel}>
            <div className={styles.toolbar}>
              <h2 className={styles.toolbarTitle}>
                {jams.length} jams por perto
              </h2>
              <div className={styles.toggle}>
                <button
                  onClick={() => setMapView("map")}
                  className={cn(
                    styles.toggleButton,
                    mapView === "map" ? styles.toggleButtonActive : styles.toggleButtonIdle
                  )}
                  aria-label="Vista de mapa"
                >
                  <MapIcon
                    size={18}
                    className={mapView === "map" ? styles.toggleIconActive : styles.toggleIconIdle}
                  />
                </button>
                <button
                  onClick={() => setMapView("list")}
                  className={cn(
                    styles.toggleButton,
                    mapView === "list" ? styles.toggleButtonActive : styles.toggleButtonIdle
                  )}
                  aria-label="Vista de lista"
                >
                  <List
                    size={18}
                    className={mapView === "list" ? styles.toggleIconActive : styles.toggleIconIdle}
                  />
                </button>
              </div>
            </div>
            
            <div className={styles.content}>
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
                <div className={styles.scrollArea}>
                  <JamsList
                    jams={jams}
                    currentUserId={user.uid}
                    currentUserName={user.name}
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
          <div className={styles.panel}>
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
          <div className={styles.panel}>
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
