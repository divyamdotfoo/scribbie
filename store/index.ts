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
  time: Date;
}
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
