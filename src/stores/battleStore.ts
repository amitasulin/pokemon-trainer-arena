import { create } from 'zustand';
import type { Battle, ActivePokemon } from '../types/battle';
import type { Pokemon } from '../types/pokemon';
import { calculateDamage } from '../utils/battle';
import { attemptCapture } from '../utils/capture';
import { getBaseXpYield, addXp } from '../utils/xp';
import { getNextEvolution, evolvePokemon } from '../utils/evolution';
import { useGameStore } from './gameStore';

function applyStatus(active: ActivePokemon, effect: string, chance: number): ActivePokemon {
  if (active.statusEffects.includes(effect)) return active;
  if (Math.random() > chance) return active;
  const timers = { ...(active.statusTimers || {}) };
  if (effect === 'sleep') timers.sleep = 2;
  return {
    ...active,
    statusEffects: [...active.statusEffects, effect],
    statusTimers: timers,
  };
}

function statusLabel(effect: string): string {
  const map: Record<string, string> = { burn: 'burned', poison: 'poisoned', sleep: 'drowsy', paralysis: 'paralyzed' };
  return map[effect] || effect;
}

interface BattleStore {
  battle: Battle;
  startWildEncounter: (pokemon: Pokemon) => void;
  startTrainerBattle: (pokemonList: Pokemon[], name: string) => void;
  playerAttack: (moveIndex: number) => void;
  playerDefend: () => void;
  enemyAttack: () => void;
  useItem: (itemId: string) => void;
  attemptRun: () => boolean;
  attemptCapture: (ballType?: string) => boolean;
  switchPokemon: (index: number) => void;
  applyStatusTick: (side: 'player' | 'enemy') => boolean;
  endBattle: (won: boolean) => void;
  setMessage: (msg: string) => void;
  clearMessage: () => void;
  resetBattle: () => void;
}

const initialBattle: Battle = {
  state: 'idle',
  playerPokemon: null as unknown as ActivePokemon,
  enemyPokemon: null as unknown as ActivePokemon,
  turn: 'player',
  message: '',
  showMessage: false,
  log: [],
  canCapture: false,
  isCapturing: false,
  captureAnimation: 'idle',
  opponentName: 'Wild Pokémon',
};

export const useBattleStore = create<BattleStore>((set, get) => ({
  battle: { ...initialBattle },

  startWildEncounter: (pokemon) => {
    const trainer = useGameStore.getState().trainer;
    if (!trainer || trainer.pokemonTeam.length === 0) return;

    const leadIndex = Math.min(trainer.activePokemonIndex ?? 0, trainer.pokemonTeam.length - 1);
    const playerMon = trainer.pokemonTeam[leadIndex];
    const playerActive: ActivePokemon = {
      pokemon: playerMon,
      currentHp: playerMon.maxHp,
      statusEffects: [],
      statStages: { attack: 0, defense: 0, speed: 0, spAttack: 0, spDefense: 0 },
    };
    const enemyActive: ActivePokemon = {
      pokemon,
      currentHp: pokemon.maxHp,
      statusEffects: [],
      statStages: { attack: 0, defense: 0, speed: 0, spAttack: 0, spDefense: 0 },
    };

    set({
      battle: {
        ...initialBattle,
        state: 'wild_encounter',
        playerPokemon: playerActive,
        enemyPokemon: enemyActive,
        canCapture: true,
        message: `Wild ${pokemon.name} appeared!`,
        showMessage: true,
        opponentName: `Wild ${pokemon.name}`,
      },
    });
  },

  startTrainerBattle: (pokemonList, name) => {
    const trainer = useGameStore.getState().trainer;
    if (!trainer || trainer.pokemonTeam.length === 0) return;

    const leadIndex = Math.min(trainer.activePokemonIndex ?? 0, trainer.pokemonTeam.length - 1);
    const playerMon = trainer.pokemonTeam[leadIndex];
    const enemyMon = pokemonList[0];
    const playerActive: ActivePokemon = {
      pokemon: playerMon,
      currentHp: playerMon.maxHp,
      statusEffects: [],
      statStages: { attack: 0, defense: 0, speed: 0, spAttack: 0, spDefense: 0 },
    };
    const enemyActive: ActivePokemon = {
      pokemon: enemyMon,
      currentHp: enemyMon.maxHp,
      statusEffects: [],
      statStages: { attack: 0, defense: 0, speed: 0, spAttack: 0, spDefense: 0 },
    };

    set({
      battle: {
        ...initialBattle,
        state: 'trainer_battle',
        playerPokemon: playerActive,
        enemyPokemon: enemyActive,
        canCapture: false,
        message: `Trainer ${name} challenges you!`,
        showMessage: true,
        opponentName: name,
      },
    });
  },

  playerAttack: (moveIndex) => {
    const { battle } = get();
    if (!battle.playerPokemon || !battle.enemyPokemon || battle.turn !== 'player') return;

    const move = battle.playerPokemon.pokemon.moves[moveIndex];
    if (!move || move.pp <= 0) {
      set({ battle: { ...battle, message: 'No PP left!', showMessage: true } });
      return;
    }

    if (Math.random() * 100 > move.accuracy) {
      set({
        battle: {
          ...battle,
          message: `${battle.playerPokemon.pokemon.name}'s ${move.name} missed!`,
          showMessage: true,
          turn: 'enemy',
        },
      });
      return;
    }

    const result = calculateDamage(battle.playerPokemon, battle.enemyPokemon, move);
    const newHp = Math.max(0, battle.enemyPokemon.currentHp - result.damage);
    const updatedMoves = battle.playerPokemon.pokemon.moves.map((m, i) =>
      i === moveIndex ? { ...m, pp: m.pp - 1 } : m
    );

    let msg = `${battle.playerPokemon.pokemon.name} used ${move.name}!`;
    if (result.effectiveness > 1) msg += ' It\'s super effective!';
    else if (result.effectiveness < 1 && result.effectiveness > 0) msg += ' It\'s not very effective...';
    else if (result.effectiveness === 0) msg += ' It has no effect...';
    if (result.critical) msg += ' Critical hit!';
    if (result.damage > 0) msg += ` (-${result.damage} HP)`;

    // Status-category moves apply a condition on the target
    let updatedEnemy: ActivePokemon = {
      ...battle.enemyPokemon,
      currentHp: newHp,
    };
    if (move.statusEffect) {
      const applied = applyStatus(updatedEnemy, move.statusEffect, move.statusChance ?? 0.1);
      if (applied.statusEffects.length > updatedEnemy.statusEffects.length) {
        msg += ` ${applied.pokemon.name} was ${statusLabel(move.statusEffect)}!`;
      }
      updatedEnemy = applied;
    }

    const newTurn: Battle['turn'] = newHp === 0 ? 'player' : 'enemy';
    const newLog = [...battle.log, msg];

    set({
      battle: {
        ...battle,
        playerPokemon: {
          ...battle.playerPokemon,
          pokemon: { ...battle.playerPokemon.pokemon, moves: updatedMoves },
        },
        enemyPokemon: updatedEnemy,
        message: msg,
        showMessage: true,
        turn: newTurn,
        log: newLog,
      },
    });

    if (newHp === 0) {
      setTimeout(() => get().endBattle(true), 1000);
    }
  },

  playerDefend: () => {
    const { battle } = get();
    if (!battle.playerPokemon || battle.turn !== 'player') return;

    set({
      battle: {
        ...battle,
        playerPokemon: { ...battle.playerPokemon, defending: true },
        message: `${battle.playerPokemon.pokemon.name} braced itself!`,
        showMessage: true,
        turn: 'enemy',
        log: [...battle.log, `${battle.playerPokemon.pokemon.name} used Defend!`],
      },
    });
  },

  enemyAttack: () => {
    const { battle } = get();
    if (!battle.enemyPokemon || !battle.playerPokemon || battle.turn !== 'enemy') return;

    const moves = battle.enemyPokemon.pokemon.moves;
    if (moves.length === 0) {
      set({ battle: { ...battle, turn: 'player' } });
      return;
    }

    const availableMoves = moves.filter(m => m.pp > 0);
    if (availableMoves.length === 0) {
      set({ battle: { ...battle, message: 'Enemy has no moves left!', showMessage: true, turn: 'player' } });
      return;
    }

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    if (Math.random() * 100 > move.accuracy) {
      set({
        battle: {
          ...battle,
          message: `Wild ${battle.enemyPokemon.pokemon.name}'s ${move.name} missed!`,
          showMessage: true,
          turn: 'player',
        },
      });
      return;
    }

    const isDefending = battle.playerPokemon.defending;
    const result = calculateDamage(battle.enemyPokemon, battle.playerPokemon, move);
    const actualDamage = isDefending ? Math.floor(result.damage * 0.5) : result.damage;
    const newHp = Math.max(0, battle.playerPokemon.currentHp - actualDamage);

    let msg = `${battle.enemyPokemon.pokemon.name} used ${move.name}!`;
    if (isDefending) msg += ' Your Pokémon braced for the hit!';
    if (result.effectiveness > 1) msg += ' It\'s super effective!';
    else if (result.effectiveness < 1 && result.effectiveness > 0) msg += ' It\'s not very effective...';
    if (result.critical) msg += ' Critical hit!';
    if (actualDamage > 0) msg += ` (-${actualDamage} HP)`;

    let updatedPlayer: ActivePokemon = {
      ...battle.playerPokemon,
      currentHp: newHp,
      defending: false,
    };
    if (move.statusEffect && move.statusEffect !== 'paralysis') {
      const applied = applyStatus(updatedPlayer, move.statusEffect, move.statusChance ?? 0.1);
      if (applied.statusEffects.length > updatedPlayer.statusEffects.length) {
        msg += ` ${applied.pokemon.name} was ${statusLabel(move.statusEffect)}!`;
      }
      updatedPlayer = applied;
    }

    const newLog = [...battle.log, msg];
    const newTurn: Battle['turn'] = newHp === 0 ? 'enemy' : 'player';

    set({
      battle: {
        ...battle,
        playerPokemon: updatedPlayer,
        message: msg,
        showMessage: true,
        turn: newTurn,
        log: newLog,
      },
    });

    if (newHp === 0) {
      setTimeout(() => get().endBattle(false), 1000);
    }
  },

  useItem: (itemId) => {
    const { battle } = get();
    const gameStore = useGameStore.getState();

    if (itemId === 'potion' || itemId === 'superpotion' || itemId === 'hyperpotion') {
      const healAmounts: Record<string, number> = { potion: 20, superpotion: 50, hyperpotion: 200 };
      const heal = healAmounts[itemId] || 20;
      const player = battle.playerPokemon;
      const newHp = Math.min(player.pokemon.maxHp, player.currentHp + heal);
      set({
        battle: {
          ...battle,
          playerPokemon: { ...player, currentHp: newHp },
          message: `Used ${itemId}! Restored ${newHp - player.currentHp} HP.`,
          showMessage: true,
          turn: 'enemy' as const,
        },
      });
    } else if (itemId === 'pokeball' || itemId === 'greatball' || itemId === 'ultraball') {
      if (battle.state === 'wild_encounter') {
        const success = attemptCapture(battle.enemyPokemon, itemId);
        if (success) {
          set({
            battle: {
              ...battle,
              isCapturing: true,
              captureAnimation: 'shaking',
              message: 'Gotcha! Pokémon was caught!',
              showMessage: true,
            },
          });
          setTimeout(() => {
            set({ battle: { ...get().battle, captureAnimation: 'success' } });
          }, 1800);
          setTimeout(() => {
            const caughtMon = get().battle.enemyPokemon.pokemon;
            gameStore.addPokemonToBox(caughtMon);
            gameStore.setPokedexEntry(caughtMon.id, caughtMon.name, true, true);
            gameStore.addMoney(50);
            get().resetBattle();
          }, 2500);
        } else {
          set({
            battle: {
              ...battle,
              captureAnimation: 'fail',
              message: 'Oh no! The Pokémon broke free!',
              showMessage: true,
              turn: 'enemy' as const,
            },
          });
        }
      }
    } else if (itemId === 'revive') {
      const player = battle.playerPokemon;
      if (player.currentHp === 0) {
        set({
          battle: {
            ...battle,
            playerPokemon: { ...player, currentHp: Math.floor(player.pokemon.maxHp / 2) },
            message: 'Revived!',
            showMessage: true,
            turn: 'enemy' as const,
          },
        });
      }
    } else if (itemId === 'berry') {
      const player = battle.playerPokemon;
      const newHp = Math.min(player.pokemon.maxHp, player.currentHp + 10);
      set({
        battle: {
          ...battle,
          playerPokemon: { ...player, currentHp: newHp },
          message: 'Ate a Berry! Restored 10 HP.',
          showMessage: true,
          turn: 'enemy' as const,
        },
      });
    }
  },

  attemptRun: () => {
    const { battle } = get();
    // Always allow escaping wild encounters; trainer battles cannot be fled.
    if (battle.state !== 'wild_encounter') {
      set({
        battle: {
          ...battle,
          message: 'You can\'t escape a Trainer battle!',
          showMessage: true,
        },
      });
      return false;
    }
    set({
      battle: { ...battle, message: 'Got away safely!', showMessage: true },
    });
    setTimeout(() => get().resetBattle(), 900);
    return true;
  },

  attemptCapture: (ballType = 'pokeball') => {
    return attemptCapture(get().battle.enemyPokemon, ballType);
  },

  switchPokemon: (index) => {
    const { battle } = get();
    const trainer = useGameStore.getState().trainer;
    if (!trainer || index >= trainer.pokemonTeam.length) return;

    const newMon = trainer.pokemonTeam[index];
    const playerActive: ActivePokemon = {
      pokemon: newMon,
      currentHp: newMon.maxHp,
      statusEffects: [],
      statStages: { attack: 0, defense: 0, speed: 0, spAttack: 0, spDefense: 0 },
    };

    set({
      battle: {
        ...battle,
        playerPokemon: playerActive,
        message: `Go, ${newMon.name}!`,
        showMessage: true,
      },
    });
  },

  endBattle: (won) => {
    const { battle } = get();
    const gameStore = useGameStore.getState();

    if (won) {
      gameStore.addWin();
      const xpGained = getBaseXpYield(battle.enemyPokemon.pokemon.level);
      const updatedPokemon = addXp(battle.playerPokemon.pokemon, xpGained);
      gameStore.updatePokemonInTeam(0, updatedPokemon);
      gameStore.setPokedexEntry(battle.enemyPokemon.pokemon.id, battle.enemyPokemon.pokemon.name, true, false);

      // Trigger evolution if the Pokémon has reached an evolution level
      let effectMessage = `${battle.enemyPokemon.pokemon.name} fainted! +${xpGained} XP`;
      const nextEvo = getNextEvolution(updatedPokemon);
      if (nextEvo) {
        const evolved = evolvePokemon(updatedPokemon);
        gameStore.updatePokemonInTeam(0, evolved);
        gameStore.setPokedexEntry(evolved.id, evolved.name, true, true);
        effectMessage = `${updatedPokemon.name} is evolving into ${evolved.name}!`;
      }

      set({
        battle: {
          ...battle,
          message: effectMessage,
          showMessage: true,
        },
      });
    } else {
      gameStore.addLoss();
      set({
        battle: {
          ...battle,
          message: `${battle.playerPokemon.pokemon.name} fainted!`,
          showMessage: true,
        },
      });
    }

    setTimeout(() => get().resetBattle(), 2000);
  },

  setMessage: (msg) => {
    set({ battle: { ...get().battle, message: msg, showMessage: true } });
  },

  clearMessage: () => {
    set({ battle: { ...get().battle, showMessage: false } });
  },

  applyStatusTick: (side) => {
    const { battle } = get();
    const active = side === 'player' ? battle.playerPokemon : battle.enemyPokemon;
    if (!active) return false;

    let newHp = active.currentHp;
    let statusEffects = [...active.statusEffects];
    const timers = { ...(active.statusTimers || {}) };
    let skipped = false;
    const msgs: string[] = [];
    const name = active.pokemon.name;

    if (statusEffects.includes('sleep')) {
      const remaining = (timers.sleep ?? 1) - 1;
      if (remaining > 0) {
        timers.sleep = remaining;
        skipped = true;
        msgs.push(`${name} is fast asleep.`);
      } else {
        statusEffects = statusEffects.filter(s => s !== 'sleep');
        delete timers.sleep;
        msgs.push(`${name} woke up!`);
      }
    }

    if (!skipped && statusEffects.includes('paralysis') && Math.random() < 0.25) {
      skipped = true;
      msgs.push(`${name} is paralyzed! It can't move!`);
    }

    if (!skipped) {
      const tickDamage: Record<string, number> = { burn: 1 / 16, poison: 1 / 16 };
      for (const eff of statusEffects) {
        if (tickDamage[eff]) {
          const dmg = Math.max(1, Math.floor(active.pokemon.maxHp * tickDamage[eff]));
          newHp = Math.max(0, newHp - dmg);
          msgs.push(`${name} is hurt by its ${eff}! (-${dmg} HP)`);
          if (newHp === 0) {
            msgs.push(`${name} fainted!`);
            break;
          }
        }
      }
    }

    const updated: ActivePokemon = {
      ...active,
      currentHp: newHp,
      statusEffects,
      statusTimers: timers,
    };

    const battleUpdate = side === 'player'
      ? { playerPokemon: updated }
      : { enemyPokemon: updated };

    set({ battle: { ...get().battle, ...battleUpdate, message: msgs.join(' '), showMessage: msgs.length > 0 } });

    if (newHp === 0) {
      setTimeout(() => get().endBattle(side === 'player' ? false : true), 1000);
    }

    return skipped;
  },

  resetBattle: () => {
    set({ battle: { ...initialBattle, state: 'idle' } });
    useGameStore.getState().setShowBattle(false);
  },
}));
