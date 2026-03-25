export interface User {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  status: "available" | "busy" | "away" | "offline";
  statusMessage?: string;
}

export interface AuthUser extends User {
  provider: "email" | "google";
  passwordHash?: string;
  googleSub?: string;
  createdAt: string;
}

export interface Friend {
  uid: string;
  name: string;
  avatar?: string;
  status: "available" | "busy" | "away" | "offline";
  statusMessage?: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  creatorId: string;
}

export interface Jam {
  id: string;
  title: string;
  location: string;
  pos: [number, number];
  dateTime: string;
  duration: string;
  icon: string | null;
  privacy: "public" | "all-friends" | "groups";
  targetGroups: string[];
  attendees: string[];
  creatorId: string;
  creatorName: string;
}

export interface Message {
  id: string;
  jamId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
}

export interface AppDatabase {
  user: User | null;
  users: AuthUser[];
  currentUserId: string | null;
  friends: Friend[];
  groups: Group[];
  jams: Jam[];
  messages: Message[];
  friendRequests: FriendRequest[];
}

export type TabType = "map" | "social" | "mood";
