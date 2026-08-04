export interface PokemonType {
  name: string;
  color: string;
  icon: string;
}

export const POKEMON_TYPES: Record<string, PokemonType> = {
  normal: { name: 'Normal', color: '#A8A878', icon: '⬜' },
  fire: { name: 'Fire', color: '#F08030', icon: '🔥' },
  water: { name: 'Water', color: '#6890F0', icon: '💧' },
  electric: { name: 'Electric', color: '#F8D030', icon: '⚡' },
  grass: { name: 'Grass', color: '#78C850', icon: '🌿' },
  ice: { name: 'Ice', color: '#98D8D8', icon: '❄️' },
  fighting: { name: 'Fighting', color: '#C03028', icon: '👊' },
  poison: { name: 'Poison', color: '#A040A0', icon: '☠️' },
  ground: { name: 'Ground', color: '#E0C068', icon: '🏜️' },
  flying: { name: 'Flying', color: '#A890F0', icon: '🦅' },
  psychic: { name: 'Psychic', color: '#F85888', icon: '🔮' },
  bug: { name: 'Bug', color: '#A8B820', icon: '🐛' },
  rock: { name: 'Rock', color: '#B8A038', icon: '🪨' },
  ghost: { name: 'Ghost', color: '#705898', icon: '👻' },
  dragon: { name: 'Dragon', color: '#7038F8', icon: '🐉' },
  dark: { name: 'Dark', color: '#705848', icon: '🌙' },
  steel: { name: 'Steel', color: '#B8B8D0', icon: '⚙️' },
  fairy: { name: 'Fairy', color: '#EE99AC', icon: '🧚' },
};

export interface Move {
  name: string;
  type: string;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  category: 'physical' | 'special' | 'status';
  statusEffect?: string;
  statusChance?: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  spAttack: number;
  spDefense: number;
  moves: Move[];
  image: string;
  caught: boolean;
}

export const STARTER_POKEMON = [
  {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    hp: 45,
    attack: 49,
    defense: 49,
    speed: 45,
    spAttack: 65,
    spDefense: 65,
  },
  {
    id: 4,
    name: 'Charmander',
    types: ['fire'],
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    hp: 39,
    attack: 52,
    defense: 43,
    speed: 65,
    spAttack: 60,
    spDefense: 50,
  },
  {
    id: 7,
    name: 'Squirtle',
    types: ['water'],
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    hp: 44,
    attack: 48,
    defense: 65,
    speed: 43,
    spAttack: 50,
    spDefense: 64,
  },
];

export const WILD_POKEMON_AREAS: Record<string, { id: number; name: string; types: string[]; levelRange: [number, number] }[]> = {
  route1: [
    { id: 16, name: 'Pidgey', types: ['normal', 'flying'], levelRange: [2, 5] },
    { id: 19, name: 'Rattata', types: ['normal'], levelRange: [2, 4] },
    { id: 10, name: 'Caterpie', types: ['bug'], levelRange: [2, 3] },
    { id: 13, name: 'Weedle', types: ['bug', 'poison'], levelRange: [2, 3] },
    { id: 161, name: 'Sentret', types: ['normal'], levelRange: [2, 4] },
    { id: 165, name: 'Ledyba', types: ['bug', 'flying'], levelRange: [2, 4] },
    { id: 172, name: 'Pichu', types: ['electric'], levelRange: [2, 3] },
    { id: 39, name: 'Jigglypuff', types: ['normal', 'fairy'], levelRange: [3, 5] },
    { id: 52, name: 'Meowth', types: ['normal'], levelRange: [3, 5] },
    { id: 179, name: 'Mareep', types: ['electric'], levelRange: [2, 4] },
    { id: 187, name: 'Hoppip', types: ['grass', 'flying'], levelRange: [2, 4] },
    { id: 298, name: 'Azurill', types: ['normal', 'fairy'], levelRange: [2, 3] },
    { id: 399, name: 'Bidoof', types: ['normal'], levelRange: [2, 4] },
  ],
  route2: [
    { id: 25, name: 'Pikachu', types: ['electric'], levelRange: [3, 6] },
    { id: 23, name: 'Ekans', types: ['poison'], levelRange: [3, 5] },
    { id: 32, name: 'Nidoran♂', types: ['poison'], levelRange: [3, 5] },
    { id: 29, name: 'Nidoran♀', types: ['poison'], levelRange: [3, 5] },
    { id: 66, name: 'Machop', types: ['fighting'], levelRange: [4, 6] },
    { id: 77, name: 'Ponyta', types: ['fire'], levelRange: [4, 7] },
    { id: 84, name: 'Doduo', types: ['normal', 'flying'], levelRange: [4, 7] },
    { id: 108, name: 'Lickitung', types: ['normal'], levelRange: [5, 7] },
    { id: 115, name: 'Kangaskhan', types: ['normal'], levelRange: [5, 8] },
    { id: 128, name: 'Tauros', types: ['normal'], levelRange: [5, 8] },
    { id: 190, name: 'Aipom', types: ['normal'], levelRange: [4, 6] },
    { id: 209, name: 'Snubbull', types: ['fairy'], levelRange: [4, 6] },
  ],
  forest: [
    { id: 48, name: 'Venonat', types: ['bug', 'poison'], levelRange: [4, 7] },
    { id: 46, name: 'Paras', types: ['bug', 'grass'], levelRange: [4, 6] },
    { id: 43, name: 'Oddish', types: ['grass', 'poison'], levelRange: [4, 6] },
    { id: 69, name: 'Bellsprout', types: ['grass', 'poison'], levelRange: [4, 7] },
    { id: 102, name: 'Exeggcute', types: ['grass', 'psychic'], levelRange: [5, 7] },
    { id: 114, name: 'Tangela', types: ['grass'], levelRange: [5, 8] },
    { id: 123, name: 'Scyther', types: ['bug', 'flying'], levelRange: [6, 9] },
    { id: 127, name: 'Pinsir', types: ['bug'], levelRange: [6, 9] },
    { id: 204, name: 'Pineco', types: ['bug'], levelRange: [4, 7] },
    { id: 265, name: 'Wurmple', types: ['bug'], levelRange: [3, 5] },
    { id: 285, name: 'Shroomish', types: ['grass'], levelRange: [4, 7] },
    { id: 287, name: 'Slakoth', types: ['normal'], levelRange: [4, 6] },
  ],
  cave: [
    { id: 74, name: 'Geodude', types: ['rock', 'ground'], levelRange: [5, 8] },
    { id: 41, name: 'Zubat', types: ['poison', 'flying'], levelRange: [5, 7] },
    { id: 95, name: 'Onix', types: ['rock', 'ground'], levelRange: [6, 9] },
    { id: 50, name: 'Diglett', types: ['ground'], levelRange: [5, 8] },
    { id: 56, name: 'Mankey', types: ['fighting'], levelRange: [5, 8] },
    { id: 35, name: 'Clefairy', types: ['fairy'], levelRange: [5, 8] },
    { id: 88, name: 'Grimer', types: ['poison'], levelRange: [5, 7] },
    { id: 108, name: 'Lickitung', types: ['normal'], levelRange: [6, 9] },
    { id: 304, name: 'Aron', types: ['steel', 'rock'], levelRange: [6, 9] },
  ],
  water: [
    { id: 129, name: 'Magikarp', types: ['water'], levelRange: [3, 7] },
    { id: 54, name: 'Psyduck', types: ['water'], levelRange: [5, 8] },
    { id: 60, name: 'Poliwag', types: ['water'], levelRange: [4, 7] },
    { id: 118, name: 'Goldeen', types: ['water'], levelRange: [5, 8] },
    { id: 98, name: 'Krabby', types: ['water'], levelRange: [5, 8] },
    { id: 120, name: 'Staryu', types: ['water'], levelRange: [6, 9] },
    { id: 79, name: 'Slowpoke', types: ['water', 'psychic'], levelRange: [5, 8] },
    { id: 90, name: 'Shellder', types: ['water'], levelRange: [5, 8] },
    { id: 116, name: 'Horsea', types: ['water'], levelRange: [5, 7] },
    { id: 130, name: 'Gyarados', types: ['water', 'flying'], levelRange: [8, 12] },
    { id: 211, name: 'Qwilfish', types: ['water', 'poison'], levelRange: [6, 9] },
    { id: 223, name: 'Remoraid', types: ['water'], levelRange: [4, 7] },
  ],
  mountain: [
    { id: 111, name: 'Rhyhorn', types: ['ground', 'rock'], levelRange: [7, 10] },
    { id: 142, name: 'Aerodactyl', types: ['rock', 'flying'], levelRange: [8, 12] },
    { id: 246, name: 'Larvitar', types: ['rock', 'ground'], levelRange: [6, 9] },
    { id: 104, name: 'Cubone', types: ['ground'], levelRange: [6, 9] },
    { id: 74, name: 'Geodude', types: ['rock', 'ground'], levelRange: [6, 9] },
    { id: 56, name: 'Mankey', types: ['fighting'], levelRange: [6, 9] },
    { id: 95, name: 'Onix', types: ['rock', 'ground'], levelRange: [7, 10] },
    { id: 299, name: 'Nosepass', types: ['rock'], levelRange: [7, 10] },
    { id: 337, name: 'Lunatone', types: ['rock', 'psychic'], levelRange: [8, 11] },
    { id: 338, name: 'Solrock', types: ['rock', 'psychic'], levelRange: [8, 11] },
    { id: 371, name: 'Bagon', types: ['dragon'], levelRange: [7, 10] },
  ],
  beach: [
    { id: 79, name: 'Slowpoke', types: ['water', 'psychic'], levelRange: [5, 8] },
    { id: 90, name: 'Shellder', types: ['water'], levelRange: [5, 8] },
    { id: 116, name: 'Horsea', types: ['water'], levelRange: [5, 7] },
    { id: 98, name: 'Krabby', types: ['water'], levelRange: [4, 7] },
    { id: 19, name: 'Rattata', types: ['normal'], levelRange: [3, 6] },
    { id: 54, name: 'Psyduck', types: ['water'], levelRange: [4, 7] },
    { id: 60, name: 'Poliwag', types: ['water'], levelRange: [4, 7] },
    { id: 120, name: 'Staryu', types: ['water'], levelRange: [5, 8] },
    { id: 131, name: 'Lapras', types: ['water', 'ice'], levelRange: [7, 10] },
    { id: 278, name: 'Wingull', types: ['water', 'flying'], levelRange: [3, 6] },
    { id: 283, name: 'Surskit', types: ['bug', 'water'], levelRange: [3, 5] },
  ],
};
