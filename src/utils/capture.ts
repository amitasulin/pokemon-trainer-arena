import type { ActivePokemon } from '../types/battle';

export function calculateCaptureRate(active: ActivePokemon, ballMultiplier: number = 1): number {
  const { pokemon, currentHp } = active;
  const hpRatio = (3 * pokemon.maxHp - 2 * currentHp) / (3 * pokemon.maxHp);
  const catchRate = getCatchRate(pokemon.name);
  const statusBonus = active.statusEffects.length > 0 ? 1.5 : 1;

  const rate = (hpRatio * catchRate * ballMultiplier * statusBonus) / 255;
  return Math.min(rate, 1);
}

function getCatchRate(name: string): number {
  const rates: Record<string, number> = {
    Pidgey: 255, Rattata: 255, Caterpie: 255, Weedle: 255,
    Bulbasaur: 45, Charmander: 45, Squirtle: 45,
    Pikachu: 190, Ekans: 255, Nidoran: 235, Venonat: 190,
    Paras: 190, Oddish: 255, Geodude: 255, Zubat: 255,
    Onix: 45, Magikarp: 255, Psyduck: 190, Poliwag: 255,
    Staryu: 225,
  };
  return rates[name] || 150;
}

export function attemptCapture(active: ActivePokemon, ballType: string = 'pokeball'): boolean {
  const ballMultipliers: Record<string, number> = {
    pokeball: 1, greatball: 1.5, ultraball: 2,
  };
  const rate = calculateCaptureRate(active, ballMultipliers[ballType] || 1);
  return Math.random() < rate;
}
