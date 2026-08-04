import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { useGameStore } from '../stores/gameStore'
import { hasSave } from '../services/saveService'

const POKEMON_BG = [
  { id: 6, name: 'Charizard', types: ['fire', 'flying'] },
  { id: 9, name: 'Blastoise', types: ['water'] },
  { id: 3, name: 'Venusaur', types: ['grass', 'poison'] },
  { id: 25, name: 'Pikachu', types: ['electric'] },
  { id: 149, name: 'Dragonite', types: ['dragon', 'flying'] },
  { id: 150, name: 'Mewtwo', types: ['psychic'] },
  { id: 248, name: 'Tyranitar', types: ['rock', 'dark'] },
  { id: 373, name: 'Salamence', types: ['dragon', 'flying'] },
]

const COLORS = {
  fire: '#ef4444', water: '#3b82f6', grass: '#22c55e', electric: '#eab308',
  psychic: '#ec4899', dragon: '#7c3aed', rock: '#92400e', normal: '#a8a878',
}

function Sparkle({ delay }: { delay: number }) {
  const style = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1.5 + Math.random() * 3,
    duration: 2 + Math.random() * 4,
  }), [])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: style.left, top: style.top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], y: [-10, -30 - Math.random() * 20] }}
      transition={{ duration: style.duration, delay, repeat: Infinity, ease: 'easeOut' }}
    >
      <svg width={style.size * 5} height={style.size * 5} viewBox="0 0 12 12">
        <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#ffd93d" />
      </svg>
    </motion.div>
  )
}

function FloatingEmber({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left, bottom: 0, backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444, 0 0 12px #ef444440' }}
      animate={{
        y: [0, -200 - Math.random() * 200],
        x: [0, (Math.random() - 0.5) * 60],
        opacity: [0, 0.6, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{ duration: 4 + Math.random() * 4, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { continueGame } = useGameStore()
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [currentBg, setCurrentBg] = useState(0)

  useEffect(() => { setHasSavedGame(hasSave()) }, [])
  useEffect(() => {
    const interval = setInterval(() => setCurrentBg(prev => (prev + 1) % POKEMON_BG.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const current = POKEMON_BG[currentBg]
  const bgColor = COLORS[current.types[0] as keyof typeof COLORS] || '#6366f1'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-950">
      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 50%, ${bgColor}25 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #6366f115 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #111827 100%)`,
            `radial-gradient(ellipse at 80% 50%, ${bgColor}25 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #6366f115 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #111827 100%)`,
            `radial-gradient(ellipse at 20% 50%, ${bgColor}25 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #6366f115 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #111827 100%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating embers */}
      {[...Array(10)].map((_, i) => (
        <FloatingEmber key={i} delay={Math.random() * 4} left={`${5 + Math.random() * 90}%`} />
      ))}

      {/* Sparkles */}
      {[...Array(20)].map((_, i) => <Sparkle key={i} delay={Math.random() * 5} />)}

      {/* Floating Pokémon - main */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.5, rotate: -15, y: 40 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 15, y: -40 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute"
          style={{ top: '8%', right: '5%' }}
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${current.id}.png`}
            alt=""
            className="w-64 h-64 object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Pokémon - secondary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={POKEMON_BG[(currentBg + 4) % POKEMON_BG.length].id}
          initial={{ opacity: 0, scale: 0.4, x: 40 }}
          animate={{ opacity: 0.08, scale: 0.7, x: 0 }}
          exit={{ opacity: 0, scale: 0.4, x: -40 }}
          transition={{ duration: 2 }}
          className="absolute"
          style={{ bottom: '10%', left: '3%' }}
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${POKEMON_BG[(currentBg + 4) % POKEMON_BG.length].id}.png`}
            alt=""
            className="w-36 h-36 object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center mb-10 relative z-10"
      >
        {/* Animated 3D Pokéball */}
        <motion.div
          className="text-7xl mb-6 inline-block relative"
          animate={{ rotate: [0, 10, -10, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="relative"
            animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="relative z-10 drop-shadow-2xl">🔴</span>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1)',
                  '0 0 50px rgba(239,68,68,0.5), 0 0 100px rgba(239,68,68,0.2)',
                  '0 0 30px rgba(239,68,68,0.3), 0 0 60px rgba(239,68,68,0.1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-7xl font-black mb-4 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #facc15 30%, #3b82f6 60%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.2))',
          }}
        >
          Pokémon Trainer Arena
        </motion.h1>

        <motion.p
          className="text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          ✦ A new adventure awaits ✦
        </motion.p>

        <motion.div
          className="mt-5 inline-block px-4 py-1.5 bg-gray-800/30 border border-gray-700/30 rounded-full text-sm text-gray-500 backdrop-blur"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          Powered by PokéAPI
        </motion.div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 w-full max-w-xs relative z-10"
      >
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
          <Button onClick={() => navigate('/create-trainer')} variant="primary" size="lg" className="w-full shadow-2xl shadow-red-500/30">
            ✨ New Game
          </Button>
        </motion.div>
        {hasSavedGame && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Button onClick={() => { continueGame(); navigate('/world') }} variant="secondary" size="lg" className="w-full shadow-2xl shadow-blue-500/30">
              ▶️ Continue
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
          <Button onClick={() => navigate('/settings')} variant="ghost" size="lg" className="w-full">
            ⚙️ Settings
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-4 text-center text-gray-700 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Pokémon Trainer Arena · Fan-made
      </motion.div>
    </div>
  )
}