import type { Trainer } from '../types/trainer';

const SAVE_KEY = 'pokemon_trainer_arena_save';

export function saveGame(trainer: Trainer): void {
  try {
    const data = JSON.stringify({ ...trainer, lastSave: new Date().toISOString() });
    localStorage.setItem(SAVE_KEY, data);
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): Trainer | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data) as Trainer;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
