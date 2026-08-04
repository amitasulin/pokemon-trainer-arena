export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  category: 'pokeball' | 'potion' | 'revive' | 'berry' | 'key';
  value: number;
}

export const ITEMS: Record<string, Omit<Item, 'count'>> = {
  pokeball: { id: 'pokeball', name: 'Poké Ball', description: 'A device for catching wild Pokémon', icon: '🔴', category: 'pokeball', value: 200 },
  greatball: { id: 'greatball', name: 'Great Ball', description: 'A better Ball with a higher catch rate', icon: '🔵', category: 'pokeball', value: 600 },
  ultraball: { id: 'ultraball', name: 'Ultra Ball', description: 'The best Ball with a high catch rate', icon: '🖤', category: 'pokeball', value: 1200 },
  potion: { id: 'potion', name: 'Potion', description: 'Restores 20 HP', icon: '🧪', category: 'potion', value: 300 },
  superpotion: { id: 'superpotion', name: 'Super Potion', description: 'Restores 50 HP', icon: '🧪', category: 'potion', value: 700 },
  hyperpotion: { id: 'hyperpotion', name: 'Hyper Potion', description: 'Restores 200 HP', icon: '🧪', category: 'potion', value: 1500 },
  revive: { id: 'revive', name: 'Revive', description: 'Revives a fainted Pokémon', icon: '💊', category: 'revive', value: 2000 },
  berry: { id: 'berry', name: 'Berry', description: 'Restores 10 HP during battle', icon: '🫐', category: 'berry', value: 100 },
};

export function createInventory(): Record<string, Item> {
  const items: Record<string, Item> = {};
  for (const [id, item] of Object.entries(ITEMS)) {
    items[id] = { ...item, count: id === 'pokeball' ? 5 : id === 'potion' ? 3 : id === 'berry' ? 5 : 0 };
  }
  return items;
}
