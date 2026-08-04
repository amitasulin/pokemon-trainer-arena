const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(idOrName: string | number) {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error('Failed to fetch Pokemon');
  return res.json();
}

export async function fetchPokemonSpecies(id: number) {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

export async function fetchEvolutionChain(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch evolution chain');
  return res.json();
}
