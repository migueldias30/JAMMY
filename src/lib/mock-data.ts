import { User, Friend, Group, Jam, Message, FriendRequest } from "./types";

export const mockUser: User = {
  uid: "user-1",
  name: "Miguel Dias",
  email: "miguel@jammy.app",
  status: "available",
  statusMessage: "Apetece-me um café",
};

export const mockFriends: Friend[] = [
  { uid: "friend-1", name: "Ana Silva", status: "available", statusMessage: "Livre o dia todo!" },
  { uid: "friend-2", name: "Pedro Costa", status: "busy", statusMessage: "A trabalhar até às 18h" },
  { uid: "friend-3", name: "Sofia Martins", status: "away", statusMessage: "De férias" },
  { uid: "friend-4", name: "Tiago Ferreira", status: "available", statusMessage: "Bora beber uma cerveja" },
  { uid: "friend-5", name: "Maria Santos", status: "offline" },
];

export const mockGroups: Group[] = [
  { id: "group-1", name: "Pessoal da Faculdade", members: ["friend-1", "friend-2", "friend-4"], creatorId: "user-1" },
  { id: "group-2", name: "Amigos do Trabalho", members: ["friend-2", "friend-3"], creatorId: "user-1" },
  { id: "group-3", name: "Equipa de Futebol", members: ["friend-1", "friend-4", "friend-5"], creatorId: "friend-1" },
];

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

export const mockJams: Jam[] = [
  {
    id: "jam-1",
    title: "Café na Fábrica",
    location: "Fábrica Coffee Roasters, Lisboa",
    pos: [38.7169, -9.1399],
    dateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    duration: "1h",
    icon: null,
    privacy: "all-friends",
    targetGroups: [],
    attendees: ["Miguel Dias", "Ana Silva"],
    creatorId: "user-1",
    creatorName: "Miguel Dias",
  },
  {
    id: "jam-2",
    title: "Cervejas no Pensão Amor",
    location: "Pensão Amor, Cais do Sodré",
    pos: [38.7072, -9.1456],
    dateTime: tomorrow.toISOString(),
    duration: "3h",
    icon: null,
    privacy: "all-friends",
    targetGroups: [],
    attendees: ["Tiago Ferreira", "Pedro Costa"],
    creatorId: "friend-4",
    creatorName: "Tiago Ferreira",
  },
  {
    id: "jam-3",
    title: "Jogo de Futebol",
    location: "Campo de Jogos, Benfica",
    pos: [38.7523, -9.1849],
    dateTime: nextWeek.toISOString(),
    duration: "2h",
    icon: null,
    privacy: "groups",
    targetGroups: ["group-3"],
    attendees: ["Ana Silva", "Tiago Ferreira", "Maria Santos"],
    creatorId: "friend-1",
    creatorName: "Ana Silva",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    jamId: "jam-1",
    userId: "user-1",
    userName: "Miguel Dias",
    content: "Olá! Quem vem?",
    timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    jamId: "jam-1",
    userId: "friend-1",
    userName: "Ana Silva",
    content: "Eu vou! Mas devo chegar um bocadinho atrasada.",
    timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-3",
    jamId: "jam-1",
    userId: "user-1",
    userName: "Miguel Dias",
    content: "Sem stress, até já!",
    timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
  },
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: "req-1",
    fromUserId: "stranger-1",
    fromUserName: "Joao Pereira",
    toUserId: "user-1",
    status: "pending",
  },
];
