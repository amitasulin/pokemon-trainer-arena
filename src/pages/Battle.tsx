import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BattleHUD from '../components/battle/BattleHUD'
import BattleActions from '../components/battle/BattleActions'
import CaptureAnimation from '../components/battle/CaptureAnimation'
import AttackEffect from '../components/battle/AttackEffect'
import { useBattleStore } from '../stores/battleStore'
import { useGameStore } from '../stores/gameStore'
import { ITEMS } from '../types/items'

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#ef4444', water: '#3b82f6', electric: '#eab308',
  grass: '#22c55e', ice: '#67e8f9', fighting: '#dc2626', poison: '#a855f7',
  ground: '#d97706', flying: '#93c5fd', psychic: '#ec4899', bug: '#84cc16',
  rock: '#92400e', ghost: '#7c3aed', dragon: '#7c3aed', dark: '#475569',
  steel: '#94a3b8', fairy: '#f9a8d4',
}

const ARENA_BG = [
  { name: 'Sunset Plains', gradient: 'from-orange-900 via-rose-800 to-violet-900', ground: 'from-amber-900 via-amber-800 to-amber-950', color: '#f97316' },
  { name: 'Misty Valley', gradient: 'from-sky-900 via-indigo-800 to-slate-900', ground: 'from-emerald-800 via-teal-800 to-slate-900', color: '#6366f1' },
  { name: 'Lava Fields', gradient: 'from-red-950 via-orange-900 to-yellow-900', ground: 'from-stone-900 via-amber-900 to-yellow-950', color: '#ef4444' },
  { name: 'Crystal Cave', gradient: 'from-cyan-950 via-blue-900 to-indigo-950', ground: 'from-slate-800 via-blue-900 to-indigo-950', color: '#06b6d4' },
]

function WeatherParticles({ type }: { type: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {type === 'fire' && [...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: '#ef4444',
            boxShadow: '0 0 6px #ef4444, 0 0 12px #ef444440',
          }}
          animate={{ y: [0, 400], opacity: [0, 0.5, 0], x: [0, (Math.random() - 0.5) * 60] }}
          transition={{ duration: 5 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {(type === 'water' || type === 'ice') && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-1 bg-white/30 rounded-full"
          style={{ left: `${Math.random() * 100}%` }}
          animate={{ y: [0, 400], opacity: [0, 0.4, 0] }}
          transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 3, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {type === 'psychic' && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
            backgroundColor: '#ec4899', filter: 'blur(2px)',
          }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, delay: Math.random() * 3, repeat: Infinity }}
        />
      ))}
      {type === 'dragon' && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 40}%`,
            backgroundColor: '#7c3aed', filter: 'blur(3px)',
          }}
          animate={{ x: [0, 200], y: [0, -100], opacity: [0, 0.3, 0] }}
          transition={{ duration: 6, delay: Math.random() * 6, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

export default function Battle() {
  const navigate = useNavigate()
  const { battle, playerAttack, playerDefend, enemyAttack, useItem, attemptRun, switchPokemon, applyStatusTick, resetBattle } = useBattleStore()
  const { trainer } = useGameStore()
  const prevHp = useRef(battle.playerPokemon?.currentHp ?? 0)
  const prevEnemyHp = useRef(battle.enemyPokemon?.currentHp ?? 0)

  const [enemyShake, setEnemyShake] = useState(false)
  const [playerShake, setPlayerShake] = useState(false)
  const [enemyFaint, setEnemyFaint] = useState(false)
  const [playerFaint, setPlayerFaint] = useState(false)
  const [attackEffect, setAttackEffect] = useState<{ type: string; pos: 'player' | 'enemy' } | null>(null)
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 })
  const [typeFlash, setTypeFlash] = useState<string | null>(null)
  const [damagePopup, setDamagePopup] = useState<{ amount: number; id: number; x: number; y: number } | null>(null)
  const [arena, setArena] = useState(0)
  const popupId = useRef(0)

  useEffect(() => {
    if (battle.state === 'idle') navigate('/world')
  }, [battle.state])

  // Esc key to always flee the battle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        resetBattle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetBattle])

  useEffect(() => {
    const interval = setInterval(() => setArena(a => (a + 1) % ARENA_BG.length), 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (battle.turn === 'enemy' && battle.enemyPokemon && battle.playerPokemon?.currentHp > 0) {
      const timer = setTimeout(() => {
        applyStatusTick('player')
        const move = battle.enemyPokemon.pokemon.moves.find(m => m.pp > 0) || battle.enemyPokemon.pokemon.moves[0]
        const type = move?.type || 'normal'
        setAttackEffect({ type, pos: 'enemy' })
        setTypeFlash(type)
        setTimeout(() => { setAttackEffect(null); setTypeFlash(null) }, 1000)
        enemyAttack()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [battle.turn])

  // Enemy statuses tick at the start of the player's turn
  useEffect(() => {
    if (battle.turn === 'player' && battle.enemyPokemon && battle.playerPokemon?.currentHp > 0) {
      applyStatusTick('enemy')
    }
  }, [battle.turn])

  useEffect(() => {
    if (!battle.enemyPokemon) return
    const diff = battle.enemyPokemon.currentHp - prevEnemyHp.current
    if (diff < 0) {
      const id = popupId.current++
      setDamagePopup({ amount: -diff, id, x: 55, y: 12 })
      setTimeout(() => setDamagePopup(p => p?.id === id ? null : p), 1400)
      setScreenShake({ x: -8, y: 3 })
      setTimeout(() => setScreenShake({ x: 6, y: -2 }), 50)
      setTimeout(() => setScreenShake({ x: -4, y: 1 }), 100)
      setTimeout(() => setScreenShake({ x: 0, y: 0 }), 200)
      if (battle.enemyPokemon.currentHp === 0) { setEnemyFaint(true); setTimeout(() => setEnemyFaint(false), 1200) }
      else { setEnemyShake(true); setTimeout(() => setEnemyShake(false), 600) }
    }
    prevEnemyHp.current = battle.enemyPokemon.currentHp
  }, [battle.enemyPokemon?.currentHp])

  useEffect(() => {
    if (!battle.playerPokemon) return
    const diff = battle.playerPokemon.currentHp - prevHp.current
    if (diff < 0) {
      const id = popupId.current++
      setDamagePopup({ amount: -diff, id, x: 25, y: 65 })
      setTimeout(() => setDamagePopup(p => p?.id === id ? null : p), 1400)
      setScreenShake({ x: 8, y: -3 })
      setTimeout(() => setScreenShake({ x: -6, y: 2 }), 50)
      setTimeout(() => setScreenShake({ x: 4, y: -1 }), 100)
      setTimeout(() => setScreenShake({ x: 0, y: 0 }), 200)
      if (battle.playerPokemon.currentHp === 0) { setPlayerFaint(true); setTimeout(() => setPlayerFaint(false), 1200) }
      else { setPlayerShake(true); setTimeout(() => setPlayerShake(false), 600) }
    }
    prevHp.current = battle.playerPokemon.currentHp
  }, [battle.playerPokemon?.currentHp])

  const handleFight = (moveIndex: number) => {
    if (battle.turn !== 'player') return
    const move = battle.playerPokemon.pokemon.moves[moveIndex]
    if (!move) return
    setAttackEffect({ type: move.type, pos: 'player' })
    setTypeFlash(move.type)
    setTimeout(() => { setAttackEffect(null); setTypeFlash(null) }, 1000)
    playerAttack(moveIndex)
  }

  const handleItem = (itemId: string) => useItem(itemId)
  const handlePokemon = (index: number) => switchPokemon(index)
  const handleRun = () => attemptRun()
  const handleCapture = () => useItem('pokeball')

  if (battle.state === 'idle' || !battle.playerPokemon || !battle.enemyPokemon) return null

  const currentArena = ARENA_BG[arena]
  const lastMoveType = attackEffect?.type || battle.enemyPokemon.pokemon.types[0] || 'normal'
  const weatherType = lastMoveType

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      animate={{ x: screenShake.x, y: screenShake.y }}
      transition={{ duration: 0.08, ease: 'easeOut' }}
    >
      {/* Battle Arena */}
      <div className="flex-1 relative">
        {/* Dynamic sky gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{ background: `linear-gradient(180deg, ${currentArena.gradient.replace('from-', '').split(' ')[0].replace('via-', '').split(',')[0]}, ${currentArena.ground.split(' ')[0].replace('from-', '')})` }}
          transition={{ duration: 3 }}
        />

        {/* Weather particles */}
        <WeatherParticles type={weatherType} />

        {/* Cloud layer */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden opacity-[0.08]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{ width: 60 + Math.random() * 80, height: 20 + Math.random() * 20, top: `${5 + i * 12}%` }}
              animate={{ x: ['-120%', '250%'] }}
              transition={{ duration: 20 + i * 6, repeat: Infinity, ease: 'linear', delay: i * 3 }}
            />
          ))}
        </div>

        {/* Ground */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[35%]"
          animate={{ background: `linear-gradient(180deg, ${currentArena.ground} 0%, #000 100%)` }}
          transition={{ duration: 3 }}
        >
          {/* Ground grid */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
            {[...Array(12)].map((_, i) => (
              <div key={`h${i}`} className="w-full h-px bg-white" style={{ marginTop: `${i * 8}%` }} />
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={`v${i}`} className="h-full w-px bg-white absolute" style={{ left: `${i * 14}%` }} />
            ))}
          </div>
        </motion.div>

        {/* Type flash */}
        <AnimatePresence>
          {typeFlash && (
            <motion.div
              key={typeFlash}
              className="absolute inset-0 z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: typeFlash === 'dark' || typeFlash === 'ghost' ? 0.45 : 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ backgroundColor: TYPE_COLORS[typeFlash] || '#fff' }}
            />
          )}
        </AnimatePresence>

        {/* Battle message */}
        <AnimatePresence>
          {battle.showMessage && (
            <motion.div
              key={battle.message}
              initial={{ opacity: 0, y: -50, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-gray-900/90 text-white px-7 py-3 rounded-2xl border-2 border-yellow-400/50 text-center text-base max-w-sm shadow-2xl shadow-yellow-500/15 backdrop-blur-xl"
            >
              <span className="font-semibold">{battle.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Damage popup */}
        <AnimatePresence>
          {damagePopup && (
            <motion.div
              key={damagePopup.id}
              className="absolute z-25 font-black text-5xl pointer-events-none"
              style={{ left: `${damagePopup.x}%`, top: `${damagePopup.y}%` }}
              initial={{ opacity: 0, scale: 0.2, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 2, 1.2, 0.8], y: [0, -50, -100] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              <span className="text-red-400" style={{ textShadow: '0 2px 20px rgba(239,68,68,0.6), 0 0 60px rgba(239,68,68,0.3)' }}>
                -{damagePopup.amount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AttackEffect moveType={attackEffect?.type || ''} isAttacking={attackEffect !== null} position={attackEffect?.pos || 'player'} />
        <CaptureAnimation isCapturing={battle.isCapturing} animation={battle.captureAnimation} />

        {/* VS Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 8 }}
            className="bg-gradient-to-br from-red-600 via-red-500 to-red-800 text-white font-black text-4xl px-7 py-4 rounded-2xl border-2 border-yellow-400 shadow-2xl shadow-red-500/40"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
          >
            <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              VS
            </motion.span>
          </motion.div>
        </div>

        {/* Flee / Exit button - always available */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetBattle}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur border border-white/15 text-white font-bold text-sm hover:bg-red-900/70 hover:border-red-500/50 transition-all shadow-lg"
        >
          <span>🏃</span> Exit · <kbd className="px-1.5 rounded bg-white/20 text-xs">Esc</kbd>
        </motion.button>

        {/* Pokémon positions */}
        <div className="relative h-full">
          <div className="absolute top-[5%] right-[5%]">
            <BattleHUD active={battle.enemyPokemon} position="enemy" isShaking={enemyShake} isFainting={enemyFaint} />
          </div>
          <div className="absolute bottom-[5%] left-[5%]">
            <BattleHUD active={battle.playerPokemon} position="player" isShaking={playerShake} isFainting={playerFaint} />
          </div>
        </div>

        {/* Arena name */}
        <motion.div
          className="absolute bottom-[36%] left-1/2 -translate-x-1/2 text-xs text-white/20 font-medium tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          {currentArena.name}
        </motion.div>
      </div>

      {/* Actions */}
      <div className="bg-gray-950 border-t-2 border-gray-800 relative">
        <BattleActions
          playerPokemon={battle.playerPokemon}
          enemyPokemon={battle.enemyPokemon}
          inventory={createInventoryMap()}
          team={trainer?.pokemonTeam || []}
          onFight={handleFight}
          onItem={handleItem}
          onPokemon={handlePokemon}
          onRun={handleRun}
          onDefend={playerDefend}
          onCapture={handleCapture}
          disabled={battle.turn !== 'player'}
        />
      </div>
    </motion.div>
  )
}

function createInventoryMap() {
  const inv: Record<string, any> = {}
  for (const [id, item] of Object.entries(ITEMS)) {
    inv[id] = { ...item, count: id === 'pokeball' ? 5 : id === 'potion' ? 3 : 0 }
  }
  return inv
}