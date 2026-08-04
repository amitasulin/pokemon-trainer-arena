import type { Pokemon } from '../types/pokemon';
import { getDefaultMoves } from './battle';

interface EvolutionForm {
  id: number;
  name: string;
  types: string[];
  level: number;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  spAttack: number;
  spDefense: number;
}

type EvolutionMap = Record<string, Array<EvolutionForm>>;

const BASE_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const img = (id: number) => `${BASE_IMAGE}/${id}.png`;

export const EVOLUTIONS: EvolutionMap = {
  Bulbasaur: [
    { id: 2, name: 'Ivysaur', types: ['grass', 'poison'], level: 16, image: img(2), hp: 60, attack: 62, defense: 63, speed: 60, spAttack: 80, spDefense: 80 },
    { id: 3, name: 'Venusaur', types: ['grass', 'poison'], level: 32, image: img(3), hp: 80, attack: 82, defense: 83, speed: 80, spAttack: 100, spDefense: 100 },
  ],
  Ivysaur: [
    { id: 3, name: 'Venusaur', types: ['grass', 'poison'], level: 32, image: img(3), hp: 80, attack: 82, defense: 83, speed: 80, spAttack: 100, spDefense: 100 },
  ],
  Charmander: [
    { id: 5, name: 'Charmeleon', types: ['fire'], level: 16, image: img(5), hp: 39, attack: 64, defense: 58, speed: 80, spAttack: 80, spDefense: 65 },
    { id: 6, name: 'Charizard', types: ['fire', 'flying'], level: 36, image: img(6), hp: 78, attack: 84, defense: 78, speed: 100, spAttack: 109, spDefense: 85 },
  ],
  Charmeleon: [
    { id: 6, name: 'Charizard', types: ['fire', 'flying'], level: 36, image: img(6), hp: 78, attack: 84, defense: 78, speed: 100, spAttack: 109, spDefense: 85 },
  ],
  Squirtle: [
    { id: 8, name: 'Wartortle', types: ['water'], level: 16, image: img(8), hp: 59, attack: 63, defense: 80, speed: 55, spAttack: 65, spDefense: 80 },
    { id: 9, name: 'Blastoise', types: ['water'], level: 36, image: img(9), hp: 79, attack: 83, defense: 100, speed: 78, spAttack: 85, spDefense: 105 },
  ],
  Wartortle: [
    { id: 9, name: 'Blastoise', types: ['water'], level: 36, image: img(9), hp: 79, attack: 83, defense: 100, speed: 78, spAttack: 85, spDefense: 105 },
  ],
  Pidgey: [
    { id: 17, name: 'Pidgeotto', types: ['normal', 'flying'], level: 17, image: img(17), hp: 63, attack: 60, defense: 55, speed: 92, spAttack: 50, spDefense: 50 },
    { id: 18, name: 'Pidgeot', types: ['normal', 'flying'], level: 36, image: img(18), hp: 83, attack: 78, defense: 75, speed: 101, spAttack: 70, spDefense: 70 },
  ],
  Pidgeotto: [
    { id: 18, name: 'Pidgeot', types: ['normal', 'flying'], level: 36, image: img(18), hp: 83, attack: 78, defense: 75, speed: 101, spAttack: 70, spDefense: 70 },
  ],
  Rattata: [
    { id: 20, name: 'Raticate', types: ['normal'], level: 20, image: img(20), hp: 55, attack: 40, defense: 60, speed: 62, spAttack: 50, spDefense: 70 },
  ],
  Caterpie: [
    { id: 11, name: 'Metapod', types: ['bug'], level: 7, image: img(11), hp: 50, attack: 20, defense: 55, speed: 30, spAttack: 25, spDefense: 25 },
    { id: 12, name: 'Butterfree', types: ['bug', 'flying'], level: 10, image: img(12), hp: 60, attack: 45, defense: 50, speed: 70, spAttack: 80, spDefense: 80 },
  ],
  Metapod: [
    { id: 12, name: 'Butterfree', types: ['bug', 'flying'], level: 10, image: img(12), hp: 60, attack: 45, defense: 50, speed: 70, spAttack: 80, spDefense: 80 },
  ],
  Weedle: [
    { id: 13, name: 'Kakuna', types: ['bug', 'poison'], level: 7, image: img(13), hp: 45, attack: 25, defense: 50, speed: 35, spAttack: 25, spDefense: 25 },
    { id: 15, name: 'Beedrill', types: ['bug', 'poison'], level: 10, image: img(15), hp: 65, attack: 80, defense: 40, speed: 70, spAttack: 45, spDefense: 80 },
  ],
  Kakuna: [
    { id: 15, name: 'Beedrill', types: ['bug', 'poison'], level: 10, image: img(15), hp: 65, attack: 80, defense: 40, speed: 70, spAttack: 45, spDefense: 80 },
  ],
  Pichu: [
    { id: 25, name: 'Pikachu', types: ['electric'], level: 18, image: img(25), hp: 35, attack: 55, defense: 40, speed: 75, spAttack: 50, spDefense: 50 },
  ],
  Pikachu: [
    { id: 26, name: 'Raichu', types: ['electric'], level: 30, image: img(26), hp: 75, attack: 90, defense: 55, speed: 110, spAttack: 90, spDefense: 80 },
  ],
  Geodude: [
    { id: 75, name: 'Graveler', types: ['rock', 'ground'], level: 22, image: img(75), hp: 55, attack: 95, defense: 115, speed: 35, spAttack: 45, spDefense: 45 },
    { id: 76, name: 'Golem', types: ['rock', 'ground'], level: 36, image: img(76), hp: 80, attack: 110, defense: 130, speed: 45, spAttack: 55, spDefense: 65 },
  ],
  Graveler: [
    { id: 76, name: 'Golem', types: ['rock', 'ground'], level: 36, image: img(76), hp: 80, attack: 110, defense: 130, speed: 45, spAttack: 55, spDefense: 65 },
  ],
  Oddish: [
    { id: 44, name: 'Gloom', types: ['grass', 'poison'], level: 21, image: img(44), hp: 60, attack: 65, defense: 70, speed: 40, spAttack: 85, spDefense: 75 },
    { id: 45, name: 'Vileplume', types: ['grass', 'poison'], level: 36, image: img(45), hp: 75, attack: 80, defense: 85, speed: 50, spAttack: 100, spDefense: 90 },
  ],
  Gloom: [
    { id: 45, name: 'Vileplume', types: ['grass', 'poison'], level: 36, image: img(45), hp: 75, attack: 80, defense: 85, speed: 50, spAttack: 100, spDefense: 90 },
  ],
  Zubat: [
    { id: 42, name: 'Golbat', types: ['poison', 'flying'], level: 22, image: img(42), hp: 75, attack: 80, defense: 70, speed: 90, spAttack: 65, spDefense: 75 },
    { id: 169, name: 'Crobat', types: ['poison', 'flying'], level: 38, image: img(169), hp: 85, attack: 90, defense: 80, speed: 130, spAttack: 70, spDefense: 80 },
  ],
  Golbat: [
    { id: 169, name: 'Crobat', types: ['poison', 'flying'], level: 38, image: img(169), hp: 85, attack: 90, defense: 80, speed: 130, spAttack: 70, spDefense: 80 },
  ],
  Machop: [
    { id: 67, name: 'Machoke', types: ['fighting'], level: 22, image: img(67), hp: 80, attack: 130, defense: 70, speed: 45, spAttack: 50, spDefense: 60 },
    { id: 68, name: 'Machamp', types: ['fighting'], level: 36, image: img(68), hp: 100, attack: 130, defense: 80, speed: 55, spAttack: 65, spDefense: 85 },
  ],
  Machoke: [
    { id: 68, name: 'Machamp', types: ['fighting'], level: 36, image: img(68), hp: 100, attack: 130, defense: 80, speed: 55, spAttack: 65, spDefense: 85 },
  ],
  Mankey: [
    { id: 57, name: 'Primeape', types: ['fighting'], level: 22, image: img(57), hp: 65, attack: 105, defense: 60, speed: 95, spAttack: 60, spDefense: 70 },
    { id: 979, name: 'Annihilape', types: ['fighting', 'ghost'], level: 38, image: img(979), hp: 110, attack: 115, defense: 80, speed: 90, spAttack: 50, spDefense: 80 },
  ],
  Rhyhorn: [
    { id: 112, name: 'Rhydon', types: ['ground', 'rock'], level: 22, image: img(112), hp: 85, attack: 130, defense: 85, speed: 40, spAttack: 55, spDefense: 55 },
  ],
  Aron: [
    { id: 305, name: 'Lairon', types: ['steel', 'rock'], level: 18, image: img(305), hp: 60, attack: 90, defense: 90, speed: 40, spAttack: 50, spDefense: 50 },
    { id: 306, name: 'Aggron', types: ['steel', 'rock'], level: 32, image: img(306), hp: 90, attack: 110, defense: 110, speed: 50, spAttack: 60, spDefense: 60 },
  ],
  Lairon: [
    { id: 306, name: 'Aggron', types: ['steel', 'rock'], level: 32, image: img(306), hp: 90, attack: 110, defense: 110, speed: 50, spAttack: 60, spDefense: 60 },
  ],
  'Nidoran♂': [
    { id: 33, name: 'Nidorino', types: ['poison'], level: 16, image: img(33), hp: 61, attack: 72, defense: 57, speed: 65, spAttack: 55, spDefense: 55 },
    { id: 34, name: 'Nidoking', types: ['poison', 'ground'], level: 36, image: img(34), hp: 81, attack: 102, defense: 77, speed: 85, spAttack: 85, spDefense: 75 },
  ],
  'Nidoran♀': [
    { id: 30, name: 'Nidorina', types: ['poison'], level: 16, image: img(30), hp: 70, attack: 62, defense: 67, speed: 56, spAttack: 55, spDefense: 50 },
    { id: 31, name: 'Nidoqueen', types: ['poison', 'ground'], level: 36, image: img(31), hp: 90, attack: 92, defense: 87, speed: 76, spAttack: 75, spDefense: 85 },
  ],
  Bellsprout: [
    { id: 70, name: 'Weepinbell', types: ['grass', 'poison'], level: 21, image: img(70), hp: 65, attack: 90, defense: 50, speed: 55, spAttack: 85, spDefense: 45 },
    { id: 71, name: 'Victreebel', types: ['grass', 'poison'], level: 36, image: img(71), hp: 80, attack: 115, defense: 70, speed: 70, spAttack: 100, spDefense: 70 },
  ],
  Ponyta: [
    { id: 78, name: 'Rapidash', types: ['fire'], level: 30, image: img(78), hp: 65, attack: 100, defense: 70, speed: 105, spAttack: 80, spDefense: 80 },
  ],
};

export function getNextEvolution(pokemon: Pick<Pokemon, 'name' | 'level'>): EvolutionForm | null {
  const line = EVOLUTIONS[pokemon.name];
  if (!line) return null;
  return line.find(evo => pokemon.level >= evo.level) || null;
}

export function evolvePokemon(pokemon: Pokemon): Pokemon {
  const target = getNextEvolution(pokemon);
  if (!target) return pokemon;

  const statScale = 1 + (pokemon.level - 1) * 0.08;
  // Keep HP ratio across evolution so the gauge stays fair
  const hpRatio = pokemon.maxHp > 0 ? pokemon.hp / pokemon.maxHp : 1;

  const evolved: Pokemon = {
    ...pokemon,
    id: target.id,
    name: target.name,
    types: target.types,
    image: target.image,
    hp: Math.floor(target.hp * statScale),
    maxHp: Math.floor(target.hp * statScale),
    attack: Math.floor(target.attack * statScale),
    defense: Math.floor(target.defense * statScale),
    speed: Math.floor(target.speed * statScale),
    spAttack: Math.floor(target.spAttack * statScale),
    spDefense: Math.floor(target.spDefense * statScale),
  };

  evolved.hp = Math.max(1, Math.floor(evolved.hp * hpRatio));

  // Give the evolved form a fresh, type-appropriate moveset (keep PP from prior league)
  const freshMoves = getDefaultMoves(evolved);
  evolved.moves = freshMoves.map((m, i) => {
    const old = pokemon.moves[i];
    return old ? { ...m, pp: old.pp, maxPp: old.maxPp } : m;
  });

  return evolved;
}