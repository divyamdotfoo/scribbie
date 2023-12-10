import { generateRandomLorem } from "@/lib";
import { nanoid } from "nanoid";
import { Channel } from "pusher-js";
import { create } from "zustand";
export interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  score: number;
  host: boolean;
}

export interface Message extends PlayerInfo {
  message: string;
  time: number;
  messageId: string;
}
const intialUsers: PlayerInfo[] = [
  {
    id: nanoid(10),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
    name: "John Doe",
    host: false,
    score: 100,
  },
  {
    id: nanoid(10),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
    name: "John Doe",
    host: false,
    score: 280,
  },
  {
    id: nanoid(10),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
    name: "John Doe",
    host: true,
    score: 210,
  },
  {
    id: nanoid(10),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
    name: "John Doe",
    host: false,
    score: 340,
  },
  {
    id: nanoid(10),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
    name: "John Doe",
    host: false,
    score: 80,
  },
];
const initialMessages: Message[] = intialUsers.map((z) => ({
  message: generateRandomLorem(),
  time: Date.now(),
  messageId: nanoid(),
  ...z,
}));
export interface UserState {
  allPlayers: PlayerInfo[] | [];
  currentWord: string | null;
  activePlayer: PlayerInfo | null;
  allMessages: Message[] | [];
  user: PlayerInfo | null;
  setActivePlayer: (player: PlayerInfo) => void;
  setMessages: (messages: Message[]) => void;
  setPlayers: (players: PlayerInfo[] | PlayerInfo) => void;
  setCurrentWord: (word: string) => void;
  setUser: (user: PlayerInfo) => void;
}

export const useUser = create<UserState>((set) => ({
  activePlayer: null,
  setActivePlayer: (player: PlayerInfo) =>
    set((state) => ({ activePlayer: player })),
  allMessages: [],
  setMessages: (messages: Message[]) =>
    set((state) => ({ allMessages: messages })),
  allPlayers: [],
  setPlayers: (players: PlayerInfo[] | PlayerInfo) => {
    if (Array.isArray(players)) {
      set((state) => ({ allPlayers: players }));
    } else {
      set((state) => ({ allPlayers: [...state.allPlayers, players] }));
    }
  },
  currentWord: null,
  setCurrentWord: (word: string) => set((state) => ({ currentWord: word })),
  user: null,
  setUser: (user: PlayerInfo) => set((state) => ({ user: user })),
}));

export interface ChannelState {
  channel: Channel | null;
  setChannel: (channel: Channel) => void;
  canTrigger: boolean;
  setTrigger: (z: boolean) => void;
}
export const useChannel = create<ChannelState>((set) => ({
  channel: null,
  setChannel: (channel: Channel) => set((state) => ({ channel: channel })),
  canTrigger: false,
  setTrigger: (z) => set((state) => ({ canTrigger: z })),
}));
