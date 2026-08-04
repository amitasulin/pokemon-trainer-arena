import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GameMap3D from '../components/world/GameMap3D'
import { useGameStore } from '../stores/gameStore'
import { useBattleStore } from '../stores/battleStore'
import { WILD_POKEMON_AREAS } from '../types/pokemon'
import { GYM_LEADERS } from '../types/battle'
import { createPokemon } from '../utils/xp'
import { getDefaultMoves } from '../utils/battle'

type ToolKey = 'team' | 'pokedex' | 'profile' | 'settings' | 'gym'

export default function World() {
  const navigate = useNavigate()
  const { trainer, updatePosition, setCurrentArea, updatePlayTime, setShowBattle, unlockArea, setActivePokemon } = useGameStore()
  const { startWildEncounter, startTrainerBattle } = useBattleStore()
  const { battle } = useBattleStore()
  const [openPanel, setOpenPanel] = useState<ToolKey | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { if (!trainer) navigate('/') }, [trainer])
  useEffect(() => {
    const interval = setInterval(updatePlayTime, 60000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (battle.state !== 'idle') { setShowBattle(true); navigate('/battle') }
  }, [battle.state])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  if (!trainer) return null

  const handleMove = (x: number, y: number) => updatePosition(x, y)

  const handleEncounter = () => {
    if (battle.state !== 'idle') return
    const areaPokemon = WILD_POKEMON_AREAS[trainer.currentArea]
    if (!areaPokemon || areaPokemon.length === 0) return
    const species = areaPokemon[Math.floor(Math.random() * areaPokemon.length)]
    const level = species.levelRange[0] + Math.floor(Math.random() * (species.levelRange[1] - species.levelRange[0] + 1))
    const baseStats = getBaseStats(species.id, species.name, species.types)
    const pokemon = createPokemon({ ...baseStats, image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species.id}.png` }, level)
    pokemon.moves = getDefaultMoves(pokemon)
    startWildEncounter(pokemon)
  }

  const areas = [
    { id: 'route1', name: 'Route 1', icon: '🌿', unlocked: true, desc: 'Tall grass and wild Pokémon' },
    { id: 'route2', name: 'Route 2', icon: '🌾', unlocked: trainer.currentArea === 'route2' || trainer.unlockedAreas.includes('route2'), desc: 'Hills and hidden paths' },
    { id: 'forest', name: 'Forest', icon: '🌲', unlocked: trainer.unlockedAreas.includes('forest'), desc: 'Dark and mysterious' },
    { id: 'cave', name: 'Cave', icon: '🕳️', unlocked: trainer.unlockedAreas.includes('cave'), desc: 'Dark underground tunnels' },
    { id: 'water', name: 'Bay', icon: '🌊', unlocked: trainer.unlockedAreas.includes('water'), desc: 'Sparkling waters' },
    { id: 'mountain', name: 'Mt. Silver', icon: '⛰️', unlocked: trainer.unlockedAreas.includes('mountain'), desc: 'Towering peak' },
    { id: 'income', name: 'Beach', icon: '🏖️', unlocked: trainer.unlockedAreas.includes('income'), desc: 'Sandy shores' },
    { id: 'city', name: 'Town', icon: '🏘️', unlocked: true, desc: 'A quiet place to rest' },
    { id: 'gym', name: 'Indigo League', icon: '🏟️', unlocked: true, desc: 'Battle Gym Leaders!' },
  ]

  const handleAreaChange = (areaId: string) => { setCurrentArea(areaId); unlockArea(areaId); setOpenPanel(null) }

  const handleGymBattle = () => {
    if (trainer.currentArea === 'gym' && GYM_LEADERS.length > 0) {
      const leader = GYM_LEADERS[0]
      const pokemonList = leader.pokemon.map(p => {
        const mon = createPokemon(p, p.level)
        mon.moves = getDefaultMoves(mon)
        mon.image = p.image
        return mon
      })
      startTrainerBattle(pokemonList, leader.name)
    }
  }

  const tools: { key: ToolKey; icon: string; label: string; action: () => void }[] = [
    { key: 'team', icon: '⚽', label: 'Team', action: () => setOpenPanel(openPanel === 'team' ? null : 'team') },
    { key: 'pokedex', icon: '📖', label: 'Pokédex', action: () => navigate('/pokedex') },
    { key: 'profile', icon: '👤', label: 'Profile', action: () => navigate('/profile') },
    { key: 'gym', icon: '🏟️', label: 'Gym', action: () => handleAreaChange('gym') },
    { key: 'settings', icon: '⚙️', label: 'Settings', action: () => navigate('/settings') },
  ]

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen animated background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 animate-world-drift" />
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.35) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, rgba(16,185,129,0.25) 0%, transparent 50%)' }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      {/* Full-screen map */}
      <div className="absolute inset-0 z-10">
        <div className="relative w-full h-full overflow-hidden animate-map-frame">
          <GameMap3D trainer={trainer} onMove={handleMove} onEncounter={handleEncounter} />

          {/* Top HUD - centered */}
          <div className="fixed top-0 inset-x-0 z-40 flex justify-center pt-3 px-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
            <div className="flex items-center gap-3 bg-gray-950/70 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 shadow-2xl shadow-black/40">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg border-2 border-white/20 shadow-lg">
                {trainer.avatar}
              </motion.div>
              <div>
                <h1 className="text-white font-black text-base leading-tight tracking-wide">{trainer.name}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
                  <span className="flex items-center gap-1"><span className="text-yellow-400">💰</span>{trainer.money}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1"><span className="text-yellow-500">🏅</span>{trainer.badges.length}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1"><span className="text-blue-400">🏆</span>{trainer.wins}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gym banner */}
          {trainer.currentArea === 'gym' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
              <div className="px-6 py-3 bg-gray-950/70 backdrop-blur-xl rounded-2xl border border-yellow-400/40 shadow-2xl shadow-black/50 flex flex-col items-center gap-3">
                <p className="text-yellow-300 font-black text-2xl drop-shadow">⚔️ Gym Leader Awaits!</p>
                <button onClick={handleGymBattle} className="px-8 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black font-black text-lg rounded-2xl shadow-2xl shadow-orange-500/40 hover:scale-105 transition-transform">
                  ⚔️ BATTLE GYM LEADER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom toolbar - overlay */}
      <div className="fixed bottom-0 inset-x-0 z-40 px-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {/* Expanded team / area panel */}
        {openPanel === 'team' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 p-3 bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <p className="text-white font-bold text-sm mb-2 text-center">Your Team — tap to set battle lead</p>
            <div className="flex items-center justify-center gap-2">
              {trainer.pokemonTeam.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePokemon(i)}
                  className={`relative w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                    trainer.activePokemonIndex === i
                      ? 'border-yellow-400 bg-gray-800 shadow-lg shadow-yellow-400/20 scale-105'
                      : 'border-white/15 bg-gray-900 hover:border-white/40 hover:scale-110'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-11 h-11 object-contain" />
                  {trainer.activePokemonIndex === i && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">LEAD</span>
                  )}
                  <span className="text-[9px] text-gray-300 font-semibold mt-0.5 truncate max-w-full px-1">{p.name}</span>
                </button>
              ))}
              {Array.from({ length: Math.max(0, 6 - trainer.pokemonTeam.length) }).map((_, i) => (
                <div key={`e${i}`} className="w-14 h-14 rounded-xl border border-dashed border-white/15 bg-gray-900/40 flex items-center justify-center text-gray-600 text-lg">+</div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Area selector chips */}
        <motion.div layout className="mb-2 flex flex-wrap justify-center gap-1.5 md:gap-2">
          {areas.filter(a => a.unlocked).map(a => (
            <button
              key={a.id}
              onClick={() => handleAreaChange(a.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-xl border transition-all shadow-lg md:px-4 ${
                trainer.currentArea === a.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-white/30 scale-105'
                  : 'bg-gray-950/70 text-gray-100 border-white/15 hover:bg-gray-800/70'
              }`}
              style={{ boxShadow: trainer.currentArea === a.id ? '0 0 20px rgba(99,102,241,0.4)' : undefined }}
            >
              <span>{a.icon}</span> {a.name}
            </button>
          ))}
        </motion.div>

        {/* Feature buttons */}
        <div className="bg-gray-950/70 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-2xl shadow-black/60">
          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            {tools.map(t => (
              <button
                key={t.key}
                onClick={t.action}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all md:px-5 ${
                  openPanel === t.key
                    ? 'bg-white/15 text-white scale-105 shadow-inner'
                    : 'text-gray-100 hover:bg-white/10 hover:text-white active:scale-95'
                }`}
              >
                <span className="text-2xl leading-none drop-shadow">{t.icon}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-gray-900/90 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl text-white text-sm font-semibold"
        >
          {toast}
        </motion.div>
      )}
    </div>
  )
}

function getBaseStats(id: number, name: string, types: string[]) {
  return { id, name, types, hp: 40, attack: 40, defense: 40, speed: 40, spAttack: 40, spDefense: 40 }
}