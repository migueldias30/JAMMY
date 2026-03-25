import {
  mockFriendRequests,
  mockFriends,
  mockGroups,
  mockJams,
  mockMessages,
  mockUser,
} from "./mock-data";
import { AppDatabase, User } from "./types";

const STORAGE_KEY = "jammy-db-v1";

export function createSeedDatabase(): AppDatabase {
  return {
    user: null,
    users: [],
    currentUserId: null,
    friends: mockFriends.map((friend) => ({ ...friend })),
    groups: mockGroups.map((group) => ({ ...group, members: [...group.members] })),
    jams: mockJams.map((jam) => ({
      ...jam,
      pos: [...jam.pos] as [number, number],
      targetGroups: [...jam.targetGroups],
      attendees: [...jam.attendees],
    })),
    messages: mockMessages.map((message) => ({ ...message })),
    friendRequests: mockFriendRequests.map((request) => ({ ...request })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDatabase(value: unknown): AppDatabase {
  const seed = createSeedDatabase();

  if (!isRecord(value)) {
    return seed;
  }

  return {
    user: isRecord(value.user) ? ({ ...mockUser, ...value.user } as User) : seed.user,
    users: Array.isArray(value.users) ? value.users : seed.users,
    currentUserId: typeof value.currentUserId === "string" ? value.currentUserId : seed.currentUserId,
    friends: Array.isArray(value.friends) ? value.friends : seed.friends,
    groups: Array.isArray(value.groups) ? value.groups : seed.groups,
    jams: Array.isArray(value.jams) ? value.jams : seed.jams,
    messages: Array.isArray(value.messages) ? value.messages : seed.messages,
    friendRequests: Array.isArray(value.friendRequests) ? value.friendRequests : seed.friendRequests,
  };
}

export function loadDatabase(): AppDatabase {
  if (typeof window === "undefined") {
    return createSeedDatabase();
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return createSeedDatabase();
  }

  try {
    return normalizeDatabase(JSON.parse(storedValue));
  } catch {
    return createSeedDatabase();
  }
}

export function saveDatabase(database: AppDatabase) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
}
