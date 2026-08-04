import type { Pokemon } from '../types/pokemon';
import { getDefaultMoves } from './battle';

export function getXpToNextLevel(level: number): number {
  return Math.floor(Math.pow(level, 2) * 10);
}

export function getBaseXpYield(level: number): number {
  return Math.floor((level * 20) + 10);
}

const LEVEL_UP_MOVES: Record<number, Move[]> = {
  5: [{ name: 'Tail Whip', type: 'normal', power: 0, accuracy: 100, pp: 30, maxPp: 30, category: 'status' }],
  8: [{ name: 'Growl', type: 'normal', power: 0, accuracy: 100, pp: 40, maxPp: 40, category: 'status' }],
  10: [{ name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' }],
  12: [{ name: 'Sand Attack', type: 'ground', power: 0, accuracy: 100, pp: 15, maxPp: 15, category: 'status' }],
  15: [{ name: 'Bite', type: 'dark', power: 60, accuracy: 100, pp: 25, maxPp: 25, category: 'physical' }],
  18: [{ name: 'Scary Face', type: 'normal', power: 0, accuracy: 100, pp: 10, maxPp: 10, category: 'status' }],
  20: [{ name: 'Take Down', type: 'normal', power: 90, accuracy: 85, pp: 20, maxPp: 20, category: 'physical' }],
  25: [{ name: 'Slam', type: 'normal', power: 80, accuracy: 75, pp: 20, maxPp: 20, category: 'physical' }],
  30: [{ name: 'Double-Edge', type: 'normal', power: 120, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' }],
  35: [{ name: 'Hyper Beam', type: 'normal', power: 150, accuracy: 90, pp: 5, maxPp: 5, category: 'special' }],
  40: [{ name: 'Hyper Fang', type: 'normal', power: 80, accuracy: 90, pp: 15, maxPp: 15, category: 'physical' }],
  45: [{ name: 'Flail', type: 'normal', power: 1, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' }],
};

function getMovesForLevel(level: number): Move[] {
  const moves: Move[] = [];
  for (const [lvl, mvs] of Object.entries(LEVEL_UP_MOVES)) {
    if (parseInt(lvl) <= level) {
      mvs.forEach(m => {
        if (!moves.some(existing => existing.name === m.name)) {
          moves.push(m);
        }
      });
    }
  }
  return moves;
}

export function addXp(pokemon: Pokemon, xpGained: number): Pokemon {
  let updated = { ...pokemon, xp: pokemon.xp + xpGained };
  while (updated.xp >= updated.xpToNext) {
    updated = levelUp(updated);
  }
  return updated;
}

function levelUp(pokemon: Pokemon): Pokemon {
  const newLevel = pokemon.level + 1;
  const newHp = pokemon.maxHp + Math.floor(Math.random() * 3) + 2;
  const newAttack = pokemon.attack + Math.floor(Math.random() * 2) + 1;
  const newDefense = pokemon.defense + Math.floor(Math.random() * 2) + 1;
  const newSpeed = pokemon.speed + Math.floor(Math.random() * 2) + 1;
  const newSpAttack = pokemon.spAttack + Math.floor(Math.random() * 2) + 1;
  const newSpDefense = pokemon.spDefense + Math.floor(Math.random() * 2) + 1;

  const defaultMoves = getDefaultMoves({ ...pokemon, level: newLevel });
  const levelMoves = getMovesForLevel(newLevel);
  const allMoves = [...defaultMoves, ...levelMoves];

  const uniqueMoves: Move[] = [];
  for (const m of allMoves) {
    if (!uniqueMoves.some(existing => existing.name === m.name)) {
      uniqueMoves.push(m);
    }
  }

  return {
    ...pokemon,
    level: newLevel,
    maxHp: newHp,
    hp: newHp,
    attack: newAttack,
    defense: newDefense,
    speed: newSpeed,
    spAttack: newSpAttack,
    spDefense: newSpDefense,
    xp: 0,
    xpToNext: getXpToNextLevel(newLevel),
    moves: uniqueMoves.slice(0, 4),
  };
}

export function createPokemon(
  base: { id: number; name: string; types: string[]; hp: number; attack: number; defense: number; speed: number; spAttack: number; spDefense: number; image: string },
  level: number,
): Pokemon {
  const statScale = 1 + (level - 1) * 0.08;
  return {
    ...base,
    level,
    xp: 0,
    xpToNext: getXpToNextLevel(level),
    hp: Math.floor(base.hp * statScale),
    maxHp: Math.floor(base.hp * statScale),
    attack: Math.floor(base.attack * statScale),
    defense: Math.floor(base.defense * statScale),
    speed: Math.floor(base.speed * statScale),
    spAttack: Math.floor(base.spAttack * statScale),
    spDefense: Math.floor(base.spDefense * statScale),
    moves: getDefaultMoves({
      ...base,
      level,
      hp: Math.floor(base.hp * statScale),
      maxHp: Math.floor(base.hp * statScale),
      attack: Math.floor(base.attack * statScale),
      defense: Math.floor(base.defense * statScale),
      speed: Math.floor(base.speed * statScale),
      spAttack: Math.floor(base.spAttack * statScale),
      spDefense: Math.floor(base.spDefense * statScale),
    } as Pokemon),
    caught: false,
  };
}

import type { Move } from '../types/pokemon';