import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import PokemonSprite from '../components/pokemon/PokemonSprite'
import { useGameStore } from '../stores/gameStore'
import { POKEMON_TYPES } from '../types/pokemon'

const ALL_POKEMON = [
  { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'] },
  { id: 2, name: 'Ivysaur', types: ['grass', 'poison'] },
  { id: 3, name: 'Venusaur', types: ['grass', 'poison'] },
  { id: 4, name: 'Charmander', types: ['fire'] },
  { id: 5, name: 'Charmeleon', types: ['fire'] },
  { id: 6, name: 'Charizard', types: ['fire', 'flying'] },
  { id: 7, name: 'Squirtle', types: ['water'] },
  { id: 8, name: 'Wartortle', types: ['water'] },
  { id: 9, name: 'Blastoise', types: ['water'] },
  { id: 10, name: 'Caterpie', types: ['bug'] },
  { id: 11, name: 'Metapod', types: ['bug'] },
  { id: 12, name: 'Butterfree', types: ['bug', 'flying'] },
  { id: 13, name: 'Weedle', types: ['bug', 'poison'] },
  { id: 14, name: 'Kakuna', types: ['bug', 'poison'] },
  { id: 15, name: 'Beedrill', types: ['bug', 'poison'] },
  { id: 16, name: 'Pidgey', types: ['normal', 'flying'] },
  { id: 17, name: 'Pidgeotto', types: ['normal', 'flying'] },
  { id: 18, name: 'Pidgeot', types: ['normal', 'flying'] },
  { id: 19, name: 'Rattata', types: ['normal'] },
  { id: 20, name: 'Raticate', types: ['normal'] },
  { id: 23, name: 'Ekans', types: ['poison'] },
  { id: 24, name: 'Arbok', types: ['poison'] },
  { id: 25, name: 'Pikachu', types: ['electric'] },
  { id: 26, name: 'Raichu', types: ['electric'] },
  { id: 29, name: 'Nidoran♀', types: ['poison'] },
  { id: 30, name: 'Nidorina', types: ['poison'] },
  { id: 31, name: 'Nidoqueen', types: ['poison', 'ground'] },
  { id: 32, name: 'Nidoran♂', types: ['poison'] },
  { id: 33, name: 'Nidorino', types: ['poison'] },
  { id: 34, name: 'Nidoking', types: ['poison', 'ground'] },
  { id: 35, name: 'Clefairy', types: ['fairy'] },
  { id: 36, name: 'Clefable', types: ['fairy'] },
  { id: 39, name: 'Jigglypuff', types: ['normal', 'fairy'] },
  { id: 40, name: 'Wigglytuff', types: ['normal', 'fairy'] },
  { id: 41, name: 'Zubat', types: ['poison', 'flying'] },
  { id: 42, name: 'Golbat', types: ['poison', 'flying'] },
  { id: 43, name: 'Oddish', types: ['grass', 'poison'] },
  { id: 44, name: 'Gloom', types: ['grass', 'poison'] },
  { id: 45, name: 'Vileplume', types: ['grass', 'poison'] },
  { id: 46, name: 'Paras', types: ['bug', 'grass'] },
  { id: 47, name: 'Parasect', types: ['bug', 'grass'] },
  { id: 48, name: 'Venonat', types: ['bug', 'poison'] },
  { id: 49, name: 'Venomoth', types: ['bug', 'poison'] },
  { id: 50, name: 'Diglett', types: ['ground'] },
  { id: 51, name: 'Dugtrio', types: ['ground'] },
  { id: 52, name: 'Meowth', types: ['normal'] },
  { id: 53, name: 'Persian', types: ['normal'] },
  { id: 54, name: 'Psyduck', types: ['water'] },
  { id: 55, name: 'Golduck', types: ['water'] },
  { id: 56, name: 'Mankey', types: ['fighting'] },
  { id: 57, name: 'Primeape', types: ['fighting'] },
  { id: 60, name: 'Poliwag', types: ['water'] },
  { id: 61, name: 'Poliwhirl', types: ['water'] },
  { id: 62, name: 'Poliwrath', types: ['water', 'fighting'] },
  { id: 66, name: 'Machop', types: ['fighting'] },
  { id: 67, name: 'Machoke', types: ['fighting'] },
  { id: 68, name: 'Machamp', types: ['fighting'] },
  { id: 69, name: 'Bellsprout', types: ['grass', 'poison'] },
  { id: 70, name: 'Weepinbell', types: ['grass', 'poison'] },
  { id: 71, name: 'Victreebel', types: ['grass', 'poison'] },
  { id: 74, name: 'Geodude', types: ['rock', 'ground'] },
  { id: 75, name: 'Graveler', types: ['rock', 'ground'] },
  { id: 76, name: 'Golem', types: ['rock', 'ground'] },
  { id: 77, name: 'Ponyta', types: ['fire'] },
  { id: 78, name: 'Rapidash', types: ['fire'] },
  { id: 79, name: 'Slowpoke', types: ['water', 'psychic'] },
  { id: 80, name: 'Slowbro', types: ['water', 'psychic'] },
  { id: 84, name: 'Doduo', types: ['normal', 'flying'] },
  { id: 85, name: 'Dodrio', types: ['normal', 'flying'] },
  { id: 88, name: 'Grimer', types: ['poison'] },
  { id: 89, name: 'Muk', types: ['poison'] },
  { id: 90, name: 'Shellder', types: ['water'] },
  { id: 91, name: 'Cloyster', types: ['water', 'ice'] },
  { id: 92, name: 'Gastly', types: ['ghost', 'poison'] },
  { id: 93, name: 'Haunter', types: ['ghost', 'poison'] },
  { id: 94, name: 'Gengar', types: ['ghost', 'poison'] },
  { id: 95, name: 'Onix', types: ['rock', 'ground'] },
  { id: 96, name: 'Drowzee', types: ['psychic'] },
  { id: 97, name: 'Hypno', types: ['psychic'] },
  { id: 98, name: 'Krabby', types: ['water'] },
  { id: 99, name: 'Kingler', types: ['water'] },
  { id: 102, name: 'Exeggcute', types: ['grass', 'psychic'] },
  { id: 103, name: 'Exeggutor', types: ['grass', 'psychic'] },
  { id: 104, name: 'Cubone', types: ['ground'] },
  { id: 105, name: 'Marowak', types: ['ground'] },
  { id: 108, name: 'Lickitung', types: ['normal'] },
  { id: 111, name: 'Rhyhorn', types: ['ground', 'rock'] },
  { id: 112, name: 'Rhydon', types: ['ground', 'rock'] },
  { id: 113, name: 'Chansey', types: ['normal'] },
  { id: 114, name: 'Tangela', types: ['grass'] },
  { id: 115, name: 'Kangaskhan', types: ['normal'] },
  { id: 116, name: 'Horsea', types: ['water'] },
  { id: 117, name: 'Seadra', types: ['water'] },
  { id: 118, name: 'Goldeen', types: ['water'] },
  { id: 119, name: 'Seaking', types: ['water'] },
  { id: 120, name: 'Staryu', types: ['water'] },
  { id: 121, name: 'Starmie', types: ['water', 'psychic'] },
  { id: 123, name: 'Scyther', types: ['bug', 'flying'] },
  { id: 124, name: 'Jynx', types: ['ice', 'psychic'] },
  { id: 125, name: 'Electabuzz', types: ['electric'] },
  { id: 126, name: 'Magmar', types: ['fire'] },
  { id: 127, name: 'Pinsir', types: ['bug'] },
  { id: 128, name: 'Tauros', types: ['normal'] },
  { id: 129, name: 'Magikarp', types: ['water'] },
  { id: 130, name: 'Gyarados', types: ['water', 'flying'] },
  { id: 131, name: 'Lapras', types: ['water', 'ice'] },
  { id: 142, name: 'Aerodactyl', types: ['rock', 'flying'] },
  { id: 143, name: 'Snorlax', types: ['normal'] },
  { id: 147, name: 'Dratini', types: ['dragon'] },
  { id: 148, name: 'Dragonair', types: ['dragon'] },
  { id: 149, name: 'Dragonite', types: ['dragon', 'flying'] },
  { id: 161, name: 'Sentret', types: ['normal'] },
  { id: 162, name: 'Furret', types: ['normal'] },
  { id: 165, name: 'Ledyba', types: ['bug', 'flying'] },
  { id: 166, name: 'Ledian', types: ['bug', 'flying'] },
  { id: 172, name: 'Pichu', types: ['electric'] },
  { id: 179, name: 'Mareep', types: ['electric'] },
  { id: 180, name: 'Flaaffy', types: ['electric'] },
  { id: 181, name: 'Ampharos', types: ['electric'] },
  { id: 187, name: 'Hoppip', types: ['grass', 'flying'] },
  { id: 188, name: 'Skiploom', types: ['grass', 'flying'] },
  { id: 189, name: 'Jumpluff', types: ['grass', 'flying'] },
  { id: 190, name: 'Aipom', types: ['normal'] },
  { id: 204, name: 'Pineco', types: ['bug'] },
  { id: 205, name: 'Forretress', types: ['bug', 'steel'] },
  { id: 209, name: 'Snubbull', types: ['fairy'] },
  { id: 210, name: 'Granbull', types: ['fairy'] },
  { id: 211, name: 'Qwilfish', types: ['water', 'poison'] },
  { id: 223, name: 'Remoraid', types: ['water'] },
  { id: 224, name: 'Octillery', types: ['water'] },
  { id: 246, name: 'Larvitar', types: ['rock', 'ground'] },
  { id: 247, name: 'Pupitar', types: ['rock', 'ground'] },
  { id: 248, name: 'Tyranitar', types: ['rock', 'dark'] },
  { id: 265, name: 'Wurmple', types: ['bug'] },
  { id: 266, name: 'Silcoon', types: ['bug'] },
  { id: 267, name: 'Beautifly', types: ['bug', 'flying'] },
  { id: 268, name: 'Cascoon', types: ['bug'] },
  { id: 269, name: 'Dustox', types: ['bug', 'poison'] },
  { id: 278, name: 'Wingull', types: ['water', 'flying'] },
  { id: 279, name: 'Pelipper', types: ['water', 'flying'] },
  { id: 283, name: 'Surskit', types: ['bug', 'water'] },
  { id: 284, name: 'Masquerain', types: ['bug', 'flying'] },
  { id: 285, name: 'Shroomish', types: ['grass'] },
  { id: 286, name: 'Breloom', types: ['grass', 'fighting'] },
  { id: 287, name: 'Slakoth', types: ['normal'] },
  { id: 288, name: 'Vigoroth', types: ['normal'] },
  { id: 289, name: 'Slaking', types: ['normal'] },
  { id: 298, name: 'Azurill', types: ['normal', 'fairy'] },
  { id: 299, name: 'Nosepass', types: ['rock'] },
  { id: 304, name: 'Aron', types: ['steel', 'rock'] },
  { id: 305, name: 'Lairon', types: ['steel', 'rock'] },
  { id: 306, name: 'Aggron', types: ['steel', 'rock'] },
  { id: 337, name: 'Lunatone', types: ['rock', 'psychic'] },
  { id: 338, name: 'Solrock', types: ['rock', 'psychic'] },
  { id: 371, name: 'Bagon', types: ['dragon'] },
  { id: 372, name: 'Shelgon', types: ['dragon'] },
  { id: 373, name: 'Salamence', types: ['dragon', 'flying'] },
  { id: 399, name: 'Bidoof', types: ['normal'] },
  { id: 400, name: 'Bibarel', types: ['normal', 'water'] },
]

export default function Pokedex() {
  const navigate = useNavigate()
  const { pokedex } = useGameStore()

  const seenCount = Object.values(pokedex).filter(e => e.seen).length
  const caughtCount = Object.values(pokedex).filter(e => e.caught).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px]"
          animate={{ backgroundColor: ['rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)', 'rgba(59,130,246,0.08)'] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">Pokédex</h1>
            <p className="text-base text-gray-400 mt-1">
              <span className="text-blue-400">{seenCount}</span> Seen · <span className="text-yellow-400">{caughtCount}</span> Caught
            </p>
          </div>
          <Button onClick={() => navigate('/world')} variant="ghost">← Back</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
        >
          {ALL_POKEMON.map((p, idx) => {
            const entry = pokedex[p.id]
            const seen = entry?.seen || false
            const caught = entry?.caught || false

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.015 }}
                whileHover={caught ? { scale: 1.04, y: -4 } : {}}
                className={`p-3 rounded-2xl border-2 transition-all ${
                  caught
                    ? 'border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-yellow-500/5 shadow-lg shadow-yellow-500/10'
                    : seen
                      ? 'border-gray-700 bg-gray-800/60'
                      : 'border-gray-800 bg-gray-900/60'
                }`}
              >
                <div className="flex flex-col items-center">
                  {seen ? (
                    <motion.div
                      animate={caught ? { y: [0, -4, 0], scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 3, delay: idx * 0.1, repeat: Infinity }}
                    >
                      <PokemonSprite
                        image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        name={p.name}
                        size="sm"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="w-12 h-12 flex items-center justify-center"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-3xl text-gray-700">?</span>
                    </motion.div>
                  )}
                  <div className="text-center mt-1">
                    <div className="text-xs text-gray-500">#{String(p.id).padStart(3, '0')}</div>
                    <div className={`text-sm font-bold ${caught ? 'text-yellow-300' : seen ? 'text-gray-300' : 'text-gray-700'}`}>
                      {seen ? p.name : '?????'}
                    </div>
                    {seen && (
                      <div className="flex gap-1 mt-1 justify-center flex-wrap">
                        {p.types.map(t => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-bold tracking-wide"
                            style={{ backgroundColor: POKEMON_TYPES[t]?.color || '#888', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                          >
                            {POKEMON_TYPES[t]?.name || t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {caught && (
                  <motion.div
                    className="mt-1 text-center text-[10px] text-yellow-500/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ★ Caught
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
