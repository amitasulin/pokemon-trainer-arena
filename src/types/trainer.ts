import type { Pokemon } from './pokemon';

export interface Trainer {
  name: string;
  avatar: string;
  money: number;
  badges: string[];
  pokemonTeam: Pokemon[];
  pokemonBox: Pokemon[];
  wins: number;
  losses: number;
  playTime: number;
  lastSave: string | null;
  currentArea: string;
  position: { x: number; y: number };
  unlockedAreas: string[];
  activePokemonIndex: number;
}

export interface PokedexEntry {
  id: number;
  name: string;
  seen: boolean;
  caught: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export const AVATARS = ['trainer1', 'trainer2', 'trainer3', 'trainer4', 'trainer5', 'trainer6'];
