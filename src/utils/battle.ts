import type { Pokemon, Move } from '../types/pokemon';
import type { ActivePokemon } from '../types/battle';

const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fighting: 2, poison: 0.5, steel: 0.5, dark: 2, dragon: 2 },
};

export function getEffectiveness(moveType: string, defenderTypes: string[]): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    const chart = TYPE_CHART[moveType.toLowerCase()];
    if (chart && chart[defType.toLowerCase()] !== undefined) {
      multiplier *= chart[defType.toLowerCase()];
    }
  }
  return multiplier;
}

export function calculateDamage(
  attacker: ActivePokemon,
  defender: ActivePokemon,
  move: Move,
): { damage: number; effectiveness: number; critical: boolean } {
  const level = attacker.pokemon.level;
  const attackStat = move.category === 'special' ? attacker.pokemon.spAttack : attacker.pokemon.attack;
  const defenseStat = move.category === 'special' ? defender.pokemon.spDefense : defender.pokemon.defense;

  const effectiveness = getEffectiveness(move.type, defender.pokemon.types);
  const critical = Math.random() < 0.0625;
  const critMultiplier = critical ? 1.5 : 1;

  if (move.power === 0) return { damage: 0, effectiveness, critical };

  const base = ((2 * level) / 5 + 2) * move.power * (attackStat / defenseStat);
  const damage = Math.max(1, Math.floor((base / 50 + 2) * effectiveness * critMultiplier * (0.85 + Math.random() * 0.15)));

  return { damage, effectiveness, critical };
}

export function calculateSpeed(first: ActivePokemon, second: ActivePokemon): BattleTurn {
  return first.pokemon.speed >= second.pokemon.speed ? 'player' : 'enemy';
}

const TYPE_MOVES: Record<string, Move[]> = {
  normal: [
    { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
    { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
    { name: 'Body Slam', type: 'normal', power: 85, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Hyper Fang', type: 'normal', power: 80, accuracy: 90, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Growl', type: 'normal', power: 0, accuracy: 100, pp: 40, maxPp: 40, category: 'status' },
    { name: 'Tail Whip', type: 'normal', power: 0, accuracy: 100, pp: 30, maxPp: 30, category: 'status' },
    { name: 'Headbutt', type: 'normal', power: 70, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Take Down', type: 'normal', power: 90, accuracy: 85, pp: 20, maxPp: 20, category: 'physical' },
  ],
  fire: [
    { name: 'Ember', type: 'fire', power: 40, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
    { name: 'Fire Spin', type: 'fire', power: 35, accuracy: 85, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, pp: 5, maxPp: 5, category: 'special' },
    { name: 'Flame Wheel', type: 'fire', power: 60, accuracy: 100, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Will-O-Wisp', type: 'fire', power: 0, accuracy: 85, pp: 15, maxPp: 15, category: 'status' },
    { name: 'Heat Wave', type: 'fire', power: 95, accuracy: 90, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Fire Fang', type: 'fire', power: 65, accuracy: 95, pp: 15, maxPp: 15, category: 'physical' },
  ],
  water: [
    { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
    { name: 'Bubble', type: 'water', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'special' },
    { name: 'Water Pulse', type: 'water', power: 60, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Surf', type: 'water', power: 90, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, pp: 5, maxPp: 5, category: 'special' },
    { name: 'Aqua Jet', type: 'water', power: 40, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Bubble Beam', type: 'water', power: 65, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Rain Dance', type: 'water', power: 0, accuracy: 100, pp: 5, maxPp: 5, category: 'status' },
  ],
  electric: [
    { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'special' },
    { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
    { name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Thunder', type: 'electric', power: 110, accuracy: 70, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Spark', type: 'electric', power: 65, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Thunder Wave', type: 'electric', power: 0, accuracy: 90, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Discharge', type: 'electric', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Wild Charge', type: 'electric', power: 90, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
  ],
  grass: [
    { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 95, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Seed Bomb', type: 'grass', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Energy Ball', type: 'grass', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Giga Drain', type: 'grass', power: 75, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Sleep Powder', type: 'grass', power: 0, accuracy: 75, pp: 15, maxPp: 15, category: 'status' },
    { name: 'Leech Seed', type: 'grass', power: 0, accuracy: 90, pp: 10, maxPp: 10, category: 'status' },
    { name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
  ],
  ice: [
    { name: 'Ice Beam', type: 'ice', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Powder Snow', type: 'ice', power: 40, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
    { name: 'Blizzard', type: 'ice', power: 110, accuracy: 70, pp: 5, maxPp: 5, category: 'special' },
    { name: 'Ice Punch', type: 'ice', power: 75, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Aurora Beam', type: 'ice', power: 65, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Haze', type: 'ice', power: 0, accuracy: 100, pp: 30, maxPp: 30, category: 'status' },
    { name: 'Ice Shard', type: 'ice', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
    { name: 'Freeze-Dry', type: 'ice', power: 70, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
  ],
  fighting: [
    { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 100, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Low Kick', type: 'fighting', power: 40, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Brick Break', type: 'fighting', power: 75, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Close Combat', type: 'fighting', power: 120, accuracy: 100, pp: 5, maxPp: 5, category: 'physical' },
    { name: 'Force Palm', type: 'fighting', power: 60, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Bulk Up', type: 'fighting', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Drain Punch', type: 'fighting', power: 75, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Cross Chop', type: 'fighting', power: 100, accuracy: 80, pp: 5, maxPp: 5, category: 'physical' },
  ],
  poison: [
    { name: 'Poison Sting', type: 'poison', power: 15, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
    { name: 'Acid', type: 'poison', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'special' },
    { name: 'Poison Jab', type: 'poison', power: 80, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Sludge Bomb', type: 'poison', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Toxic', type: 'poison', power: 0, accuracy: 90, pp: 10, maxPp: 10, category: 'status' },
    { name: 'Venoshock', type: 'poison', power: 65, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Smog', type: 'poison', power: 30, accuracy: 70, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Acid Armor', type: 'poison', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
  ],
  ground: [
    { name: 'Mud Shot', type: 'ground', power: 55, accuracy: 95, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Bone Club', type: 'ground', power: 65, accuracy: 85, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Earthquake', type: 'ground', power: 100, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Earth Power', type: 'ground', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Dig', type: 'ground', power: 80, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Sand Attack', type: 'ground', power: 0, accuracy: 100, pp: 15, maxPp: 15, category: 'status' },
    { name: 'Bulldoze', type: 'ground', power: 60, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Magnitude', type: 'ground', power: 50, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
  ],
  flying: [
    { name: 'Gust', type: 'flying', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'special' },
    { name: 'Wing Attack', type: 'flying', power: 60, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
    { name: 'Air Slash', type: 'flying', power: 75, accuracy: 95, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Brave Bird', type: 'flying', power: 120, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Aerial Ace', type: 'flying', power: 60, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Roost', type: 'flying', power: 0, accuracy: 100, pp: 10, maxPp: 10, category: 'status' },
    { name: 'Drill Peck', type: 'flying', power: 80, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Hurricane', type: 'flying', power: 110, accuracy: 70, pp: 10, maxPp: 10, category: 'special' },
  ],
  psychic: [
    { name: 'Confusion', type: 'psychic', power: 50, accuracy: 100, pp: 25, maxPp: 25, category: 'special' },
    { name: 'Psybeam', type: 'psychic', power: 65, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Psychic', type: 'psychic', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Psyshock', type: 'psychic', power: 80, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Zen Headbutt', type: 'psychic', power: 80, accuracy: 90, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Calm Mind', type: 'psychic', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Future Sight', type: 'psychic', power: 120, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Hypnosis', type: 'psychic', power: 0, accuracy: 60, pp: 20, maxPp: 20, category: 'status' },
  ],
  bug: [
    { name: 'Bug Bite', type: 'bug', power: 60, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Fury Cutter', type: 'bug', power: 40, accuracy: 95, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'X-Scissor', type: 'bug', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Bug Buzz', type: 'bug', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'U-turn', type: 'bug', power: 70, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Quiver Dance', type: 'bug', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Signal Beam', type: 'bug', power: 75, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Struggle Bug', type: 'bug', power: 50, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
  ],
  rock: [
    { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Rollout', type: 'rock', power: 30, accuracy: 90, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Rock Slide', type: 'rock', power: 75, accuracy: 90, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Stone Edge', type: 'rock', power: 100, accuracy: 80, pp: 5, maxPp: 5, category: 'physical' },
    { name: 'Power Gem', type: 'rock', power: 80, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Rock Polish', type: 'rock', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Smack Down', type: 'rock', power: 50, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Ancient Power', type: 'rock', power: 60, accuracy: 100, pp: 5, maxPp: 5, category: 'special' },
  ],
  ghost: [
    { name: 'Lick', type: 'ghost', power: 30, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
    { name: 'Shadow Ball', type: 'ghost', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Shadow Claw', type: 'ghost', power: 70, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Hex', type: 'ghost', power: 65, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Will-O-Wisp', type: 'ghost', power: 0, accuracy: 85, pp: 15, maxPp: 15, category: 'status' },
    { name: 'Destiny Bond', type: 'ghost', power: 0, accuracy: 100, pp: 5, maxPp: 5, category: 'status' },
    { name: 'Phantom Force', type: 'ghost', power: 90, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Ominous Wind', type: 'ghost', power: 60, accuracy: 100, pp: 5, maxPp: 5, category: 'special' },
  ],
  dragon: [
    { name: 'Dragon Rage', type: 'dragon', power: 40, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Twister', type: 'dragon', power: 40, accuracy: 100, pp: 20, maxPp: 20, category: 'special' },
    { name: 'Dragon Claw', type: 'dragon', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Draco Meteor', type: 'dragon', power: 130, accuracy: 90, pp: 5, maxPp: 5, category: 'special' },
    { name: 'Outrage', type: 'dragon', power: 120, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Dragon Dance', type: 'dragon', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Dragon Pulse', type: 'dragon', power: 85, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Dual Chop', type: 'dragon', power: 40, accuracy: 90, pp: 15, maxPp: 15, category: 'physical' },
  ],
  dark: [
    { name: 'Bite', type: 'dark', power: 60, accuracy: 100, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Pursuit', type: 'dark', power: 40, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Crunch', type: 'dark', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Dark Pulse', type: 'dark', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Foul Play', type: 'dark', power: 95, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Nasty Plot', type: 'dark', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Knock Off', type: 'dark', power: 65, accuracy: 100, pp: 20, maxPp: 20, category: 'physical' },
    { name: 'Sucker Punch', type: 'dark', power: 70, accuracy: 100, pp: 5, maxPp: 5, category: 'physical' },
  ],
  steel: [
    { name: 'Metal Claw', type: 'steel', power: 50, accuracy: 95, pp: 35, maxPp: 35, category: 'physical' },
    { name: 'Steel Wing', type: 'steel', power: 70, accuracy: 90, pp: 25, maxPp: 25, category: 'physical' },
    { name: 'Iron Head', type: 'steel', power: 80, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
    { name: 'Flash Cannon', type: 'steel', power: 80, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Bullet Punch', type: 'steel', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'physical' },
    { name: 'Iron Defense', type: 'steel', power: 0, accuracy: 100, pp: 15, maxPp: 15, category: 'status' },
    { name: 'Metal Burst', type: 'steel', power: 1, accuracy: 100, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Magnet Rise', type: 'steel', power: 0, accuracy: 100, pp: 10, maxPp: 10, category: 'status' },
  ],
  fairy: [
    { name: 'Fairy Wind', type: 'fairy', power: 40, accuracy: 100, pp: 30, maxPp: 30, category: 'special' },
    { name: 'Draining Kiss', type: 'fairy', power: 50, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Moonblast', type: 'fairy', power: 95, accuracy: 100, pp: 15, maxPp: 15, category: 'special' },
    { name: 'Play Rough', type: 'fairy', power: 90, accuracy: 90, pp: 10, maxPp: 10, category: 'physical' },
    { name: 'Dazzling Gleam', type: 'fairy', power: 80, accuracy: 100, pp: 10, maxPp: 10, category: 'special' },
    { name: 'Charm', type: 'fairy', power: 0, accuracy: 100, pp: 20, maxPp: 20, category: 'status' },
    { name: 'Sweet Kiss', type: 'fairy', power: 0, accuracy: 75, pp: 10, maxPp: 10, category: 'status' },
    { name: 'Spirit Break', type: 'fairy', power: 75, accuracy: 100, pp: 15, maxPp: 15, category: 'physical' },
  ],
};

export function getDefaultMoves(pokemon: Pokemon): Move[] {
  const moves: Move[] = [];
  const primaryType = pokemon.types[0]?.toLowerCase() || 'normal';

  if (TYPE_MOVES[primaryType]) {
    moves.push(...TYPE_MOVES[primaryType]);
  }
  if (pokemon.types.length > 1) {
    const secondaryType = pokemon.types[1]?.toLowerCase();
    if (secondaryType && TYPE_MOVES[secondaryType]) {
      TYPE_MOVES[secondaryType].forEach(m => {
        if (!moves.some(existing => existing.name === m.name)) {
          moves.push(m);
        }
      });
    }
  }
  if (moves.length === 0) {
    moves.push({ name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' });
  }

  const physical = moves.filter(m => m.category === 'physical');
  const special = moves.filter(m => m.category === 'special');
  const status = moves.filter(m => m.category === 'status');

  const selected: Move[] = [];
  if (physical.length > 0) selected.push(physical[0]);
  if (special.length > 0) selected.push(special[0]);
  if (physical.length > 1) selected.push(physical[1]);
  if (special.length > 1) selected.push(special[1]);
  if (status.length > 0) selected.push(status[0]);

  return selected.slice(0, 4).map(m => {
    const sfx = STATUS_AILMENTS[m.name];
    return sfx ? { ...m, statusEffect: sfx.effect, statusChance: sfx.chance } : m;
  });
}

export const STATUS_AILMENTS: Record<string, { effect: string; chance: number }> = {
  // Burn
  'Will-O-Wisp': { effect: 'burn', chance: 0.95 },
  Ember: { effect: 'burn', chance: 0.1 },
  Flamethrower: { effect: 'burn', chance: 0.1 },
  'Fire Fang': { effect: 'burn', chance: 0.1 },
  // Paralysis
  'Thunder Wave': { effect: 'paralysis', chance: 0.95 },
  'Thunder Shock': { effect: 'paralysis', chance: 0.1 },
  Thunderbolt: { effect: 'paralysis', chance: 0.1 },
  Spark: { effect: 'paralysis', chance: 0.1 },
  Thunder: { effect: 'paralysis', chance: 0.3 },
  Discharge: { effect: 'paralysis', chance: 0.3 },
  Lick: { effect: 'paralysis', chance: 0.3 },
  'Sweet Kiss': { effect: 'paralysis', chance: 0.25 },
  // Sleep
  'Sleep Powder': { effect: 'sleep', chance: 0.75 },
  Hypnosis: { effect: 'sleep', chance: 0.6 },
  // Poison
  Toxic: { effect: 'poison', chance: 0.9 },
  'Poison Sting': { effect: 'poison', chance: 0.3 },
  'Poison Jab': { effect: 'poison', chance: 0.3 },
  'Sludge Bomb': { effect: 'poison', chance: 0.3 },
  Acid: { effect: 'poison', chance: 0.1 },
  Smog: { effect: 'poison', chance: 0.3 },
  Venoshock: { effect: 'poison', chance: 0.1 },
};

import type { BattleTurn } from '../types/battle';