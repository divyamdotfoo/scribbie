import { generateRandomLorem, getRandomColor } from "@/lib";
import { nanoid } from "nanoid";
import { Channel } from "pusher-js";
import { create } from "zustand";
import { wordArray } from "./words";
export interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  score: number;
  host: boolean;
  color: string;
}

export interface Message extends PlayerInfo {
  message: string;
  time: number;
  messageId: string;
}

export interface UserState {
  allPlayers: PlayerInfo[] | [];
  currentWord: string | null;
  activePlayer: PlayerInfo | null;
  allMessages: Message[] | [];
  user: PlayerInfo | null;
  setActivePlayer: (player: PlayerInfo) => void;
  setMessages: (messages: Message[] | Message) => void;
  setPlayers: (players: PlayerInfo[] | PlayerInfo) => void;
  setCurrentWord: (word: string) => void;
  setUser: (user: PlayerInfo) => void;
  updatePlayerScore: (userId: string) => void;
}

export const useUser = create<UserState>((set) => ({
  activePlayer: null,
  setActivePlayer: (player: PlayerInfo) =>
    set((state) => ({ activePlayer: player })),
  allMessages: [],
  setMessages: (messages: Message[] | Message) => {
    if (Array.isArray(messages)) {
      set((state) => ({ allMessages: messages }));
    } else {
      set((state) => ({ allMessages: [...state.allMessages, messages] }));
    }
  },
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
  updatePlayerScore: (userId: string) =>
    set((s) => {
      const i = s.allPlayers.findIndex((z) => z.id === userId);
      const p = s.allPlayers[i];
      p.score += 50 + 5 * Math.floor(Math.random() * 10);
      return {
        allPlayers: [
          ...s.allPlayers.slice(0, i),
          p,
          ...s.allPlayers.slice(i + 1),
        ],
      };
    }),
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

export interface Game {
  playedPlayers: PlayerInfo[] | [];
  allWords: string[];
  setPlayedPlayers: (player: PlayerInfo) => void;
  started: boolean;
  setGame: () => void;
  countdown: boolean;
  setCountdown: (v: boolean) => void;
  emptyPlayed: () => void;
  status: string;
  setStatus: (s: string) => void;
}
export const useGame = create<Game>((set) => ({
  playedPlayers: [],
  allWords: wordArray,
  setPlayedPlayers: (player: PlayerInfo) =>
    set((s) => ({ playedPlayers: [...s.playedPlayers, player] })),
  started: false,
  setGame: () => set((s) => ({ started: true })),
  countdown: false,
  setCountdown: (v: boolean) => set((s) => ({ countdown: v })),
  emptyPlayed: () => set((s) => ({ playedPlayers: [] })),
  status: "",
  setStatus: (status: string) => set((s) => ({ status: status })),
}));

export interface CanvasStore {
  lx: number;
  ly: number;
  setLx: (n: number) => void;
  setLy: (n: number) => void;
  color: string;
  setColor: (color: string) => void;
  ctx: CanvasRenderingContext2D | null | undefined;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  canDraw: boolean;
  setDraw: (foo: boolean) => void;
}
export const useCanvas = create<CanvasStore>((set) => ({
  canDraw: false,
  color: "purple",
  ctx: null,
  lx: 0,
  ly: 0,
  setColor: (color: string) => set((s) => ({ color: color })),
  setCtx: (ctx: CanvasRenderingContext2D | null) => set((s) => ({ ctx: ctx })),
  setDraw: (foo: boolean) => set((s) => ({ canDraw: foo })),
  setLx: (n: number) => set((s) => ({ lx: n })),
  setLy: (n: number) => set((s) => ({ ly: n })),
}));
