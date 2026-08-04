import type { Pokemon } from './pokemon';

export type BattleState = 'idle' | 'wild_encounter' | 'trainer_battle' | 'gym_battle';
export type BattleTurn = 'player' | 'enemy';
export type BattleAction = 'fight' | 'bag' | 'pokemon' | 'run' | 'capture';

export interface ActivePokemon {
  pokemon: Pokemon;
  currentHp: number;
  statusEffects: string[];
  statStages: Record<string, number>;
  defending?: boolean;
  statusTimers?: Record<string, number>;
}

export type StatusEffect = 'burn' | 'poison' | 'sleep' | 'paralysis';

export const STATUS_META: Record<StatusEffect, { label: string; color: string; emoji: string }> = {
  burn: { label: 'Burn', color: '#ea580c', emoji: '🔥' },
  poison: { label: 'Poison', color: '#a855f7', emoji: '☠️' },
  sleep: { label: 'Sleep', color: '#7c9bbf', emoji: '😴' },
  paralysis: { label: 'Paralysis', color: '#facc15', emoji: '⚡' },
};

export interface Battle {
  state: BattleState;
  playerPokemon: ActivePokemon;
  enemyPokemon: ActivePokemon;
  turn: BattleTurn;
  message: string;
  showMessage: boolean;
  log: string[];
  canCapture: boolean;
  isCapturing: boolean;
  captureAnimation: 'idle' | 'shaking' | 'success' | 'fail';
  opponentName: string;
}

export interface GymLeader {
  name: string;
  title: string;
  type: string;
  badge: string;
  pokemon: Omit<Pokemon, 'xp' | 'xpToNext' | 'caught'>[];
}

export const GYM_LEADERS: GymLeader[] = [
  {
    name: 'Brock',
    title: 'Rock Solid',
    type: 'rock',
    badge: 'Boulder Badge',
    pokemon: [
      { id: 74, name: 'Geodude', types: ['rock', 'ground'], level: 12, hp: 40, maxHp: 40, attack: 50, defense: 60, speed: 20, spAttack: 30, spDefense: 30, moves: [
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
        { name: 'Defense Curl', type: 'normal', power: 0, accuracy: 100, pp: 40, maxPp: 40, category: 'status' },
      ], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
      { id: 95, name: 'Onix', types: ['rock', 'ground'], level: 14, hp: 45, maxHp: 45, attack: 45, defense: 80, speed: 30, spAttack: 30, spDefense: 30, moves: [
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
        { name: 'Screech', type: 'normal', power: 0, accuracy: 85, pp: 40, maxPp: 40, category: 'status' },
      ], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png' },
    ],
  },
  {
    name: 'Misty',
    title: 'Tomboyish Mermaid',
    type: 'water',
    badge: 'Cascade Badge',
    pokemon: [
      { id: 54, name: 'Psyduck', types: ['water'], level: 18, hp: 50, maxHp: 50, attack: 45, defense: 40, speed: 50, spAttack: 50, spDefense: 40, moves: [
        { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
        { name: 'Scratch', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
      ], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
      { id: 120, name: 'Staryu', types: ['water'], level: 20, hp: 55, maxHp: 55, attack: 45, defense: 50, speed: 60, spAttack: 55, spDefense: 50, moves: [
        { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
      ], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png' },
    ],
  },
];
