import { create } from 'zustand';
import type { Trainer, PokedexEntry, Achievement } from '../types/trainer';
import type { Pokemon } from '../types/pokemon';
import { createPokemon } from '../utils/xp';
import { saveGame, loadGame, deleteSave as deleteSaveData } from '../services/saveService';
import { STARTER_POKEMON } from '../types/pokemon';
import { getDefaultMoves } from '../utils/battle';

interface GameState {
  trainer: Trainer | null;
  pokedex: Record<number, PokedexEntry>;
  achievements: Achievement[];
  gameStarted: boolean;
  showBattle: boolean;

  newGame: (name: string, avatar: string, starterId: number) => void;
  continueGame: () => boolean;
  saveCurrentGame: () => void;
  deleteSave: () => void;
  addPokemonToTeam: (pokemon: Pokemon) => void;
  addPokemonToBox: (pokemon: Pokemon) => void;
  updatePokemonInTeam: (index: number, pokemon: Pokemon) => void;
  removePokemonFromTeam: (index: number) => void;
  swapPokemon: (fromIndex: number, toIndex: number) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  addBadge: (badge: string) => void;
  addWin: () => void;
  addLoss: () => void;
  updatePosition: (x: number, y: number) => void;
  setCurrentArea: (area: string) => void;
  unlockArea: (area: string) => void;
  setActivePokemon: (index: number) => void;
  setShowBattle: (show: boolean) => void;
  updatePlayTime: () => void;
  setPokedexEntry: (id: number, name: string, seen: boolean, caught: boolean) => void;
  unlockAchievement: (id: string) => void;
  getStarterPokemon: (id: number) => Pokemon;
}

export const useGameStore = create<GameState>((set, get) => ({
  trainer: null,
  pokedex: {},
  achievements: [
    { id: 'first_catch', name: 'First Catch', description: 'Catch your first Pokémon', unlocked: false },
    { id: 'win_10', name: 'Win 10 Battles', description: 'Win 10 battles', unlocked: false },
    { id: 'catch_50', name: 'Catch 50 Pokémon', description: 'Catch 50 Pokémon', unlocked: false },
    { id: 'complete_pokedex', name: 'Complete Pokédex', description: 'See all Pokémon', unlocked: false },
    { id: 'defeat_champion', name: 'Defeat Champion', description: 'Become the Champion', unlocked: false },
  ],
  gameStarted: false,
  showBattle: false,

  newGame: (name, avatar, starterId) => {
    const starter = STARTER_POKEMON.find(s => s.id === starterId)!;
    const pokemon = createPokemon(starter, 5);
    pokemon.moves = getDefaultMoves(pokemon);

    const trainer: Trainer = {
      name,
      avatar,
      money: 500,
      badges: [],
      pokemonTeam: [pokemon],
      pokemonBox: [],
      wins: 0,
      losses: 0,
      playTime: 0,
      lastSave: null,
      currentArea: 'route1',
      position: { x: 5, y: 5 },
      unlockedAreas: ['route1', 'route2', 'city'],
      activePokemonIndex: 0,
    };

    const pokedex: Record<number, PokedexEntry> = {};
    pokedex[starter.id] = { id: starter.id, name: starter.name, seen: true, caught: true };
    pokedex[25] = { id: 25, name: 'Pikachu', seen: false, caught: false };

    set({ trainer, pokedex, gameStarted: true, showBattle: false });
    saveGame(trainer);
  },

  continueGame: () => {
    const saved = loadGame();
    if (saved) {
      const fixed = {
        ...saved,
        activePokemonIndex: saved.activePokemonIndex ?? 0,
        pokemonTeam: saved.pokemonTeam.map(p => ({
          ...p,
          moves: p.moves.length > 0 ? p.moves : getDefaultMoves(p),
        })),
        pokemonBox: saved.pokemonBox.map(p => ({
          ...p,
          moves: p.moves.length > 0 ? p.moves : getDefaultMoves(p),
        })),
      };
      set({ trainer: fixed, gameStarted: true });
      return true;
    }
    return false;
  },

  saveCurrentGame: () => {
    const { trainer } = get();
    if (trainer) saveGame(trainer);
  },

  deleteSave: () => {
    deleteSaveData();
    set({ trainer: null, gameStarted: false });
  },

  addPokemonToTeam: (pokemon) => {
    const { trainer } = get();
    if (!trainer) return;
    if (trainer.pokemonTeam.length < 6) {
      const updated = { ...trainer, pokemonTeam: [...trainer.pokemonTeam, pokemon] };
      set({ trainer: updated });
      saveGame(updated);
    } else {
      get().addPokemonToBox(pokemon);
    }
  },

  addPokemonToBox: (pokemon) => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, pokemonBox: [...trainer.pokemonBox, pokemon] };
    set({ trainer: updated });
    saveGame(updated);
  },

  updatePokemonInTeam: (index, pokemon) => {
    const { trainer } = get();
    if (!trainer) return;
    const team = [...trainer.pokemonTeam];
    team[index] = pokemon;
    const updated = { ...trainer, pokemonTeam: team };
    set({ trainer: updated });
    saveGame(updated);
  },

  removePokemonFromTeam: (index) => {
    const { trainer } = get();
    if (!trainer) return;
    const team = trainer.pokemonTeam.filter((_, i) => i !== index);
    const updated = { ...trainer, pokemonTeam: team };
    set({ trainer: updated });
    saveGame(updated);
  },

  swapPokemon: (fromIndex, toIndex) => {
    const { trainer } = get();
    if (!trainer) return;
    const team = [...trainer.pokemonTeam];
    [team[fromIndex], team[toIndex]] = [team[toIndex], team[fromIndex]];
    const updated = { ...trainer, pokemonTeam: team };
    set({ trainer: updated });
    saveGame(updated);
  },

  addMoney: (amount) => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, money: trainer.money + amount };
    set({ trainer: updated });
    saveGame(updated);
  },

  spendMoney: (amount) => {
    const { trainer } = get();
    if (!trainer || trainer.money < amount) return false;
    const updated = { ...trainer, money: trainer.money - amount };
    set({ trainer: updated });
    saveGame(updated);
    return true;
  },

  addBadge: (badge) => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, badges: [...trainer.badges, badge] };
    set({ trainer: updated });
    saveGame(updated);
  },

  addWin: () => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, wins: trainer.wins + 1, money: trainer.money + 100 };
    set({ trainer: updated });
    saveGame(updated);
  },

  addLoss: () => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, losses: trainer.losses + 1 };
    set({ trainer: updated });
    saveGame(updated);
  },

  updatePosition: (x, y) => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, position: { x, y } };
    set({ trainer: updated });
  },

  setCurrentArea: (area) => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, currentArea: area };
    set({ trainer: updated });
  },

  unlockArea: (area) => {
    const { trainer } = get();
    if (!trainer || trainer.unlockedAreas.includes(area)) return;
    const updated = { ...trainer, unlockedAreas: [...trainer.unlockedAreas, area] };
    set({ trainer: updated });
    saveGame(updated);
  },

  setActivePokemon: (index) => {
    const { trainer } = get();
    if (!trainer || trainer.pokemonTeam.length === 0) return;
    const updated = { ...trainer, activePokemonIndex: Math.min(index, trainer.pokemonTeam.length - 1) };
    set({ trainer: updated });
    saveGame(updated);
  },

  setShowBattle: (show) => set({ showBattle: show }),

  updatePlayTime: () => {
    const { trainer } = get();
    if (!trainer) return;
    const updated = { ...trainer, playTime: trainer.playTime + 1 };
    set({ trainer: updated });
  },

  setPokedexEntry: (id, name, seen, caught) => {
    const { pokedex } = get();
    const entry = pokedex[id] || { id, name, seen: false, caught: false };
    pokedex[id] = { ...entry, id, name, seen: entry.seen || seen, caught: entry.caught || caught };
    set({ pokedex: { ...pokedex } });
  },

  unlockAchievement: (id) => {
    const { achievements } = get();
    const updated = achievements.map(a => a.id === id ? { ...a, unlocked: true } : a);
    set({ achievements: updated });
  },

  getStarterPokemon: (id) => {
    const base = STARTER_POKEMON.find(s => s.id === id)!;
    return createPokemon(base, 5);
  },
}));
