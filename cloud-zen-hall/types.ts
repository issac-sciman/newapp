export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  CHAT = 'CHAT',
  ZEN_ROOM = 'ZEN_ROOM',
  WOODEN_FISH = 'WOODEN_FISH',
  SUTRA_LIBRARY = 'SUTRA_LIBRARY'
}

export interface MeritState {
  count: number;
  lastMeritTime: number;
}

export interface Sutra {
  id: string;
  title: string;
  intro: string;
  content: string;
}

export interface MeditationTrack {
  id: string;
  title: string;
  duration: string; // e.g. "5 min"
  steps: string[]; // The guided script
}