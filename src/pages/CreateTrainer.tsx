import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import PokemonSprite from '../components/pokemon/PokemonSprite'
import { useGameStore } from '../stores/gameStore'
import { STARTER_POKEMON, POKEMON_TYPES } from '../types/pokemon'

const AVATARS = ['🧑', '👨', '👩', '🧔', '👱', '🧑‍🦰']

export default function CreateTrainer() {
  const navigate = useNavigate()
  const { newGame } = useGameStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(0)
  const [starter, setStarter] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!name.trim()) { setError('Please enter a name'); return }
    if (!starter) { setError('Please choose a starter Pokémon'); return }
    newGame(name.trim(), AVATARS[avatar], starter)
    navigate('/world')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 flex flex-col items-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px]" animate={{ backgroundColor: ['rgba(59,130,246,0.1)', 'rgba(139,92,246,0.1)', 'rgba(59,130,246,0.1)'] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px]" animate={{ backgroundColor: ['rgba(236,72,153,0.1)', 'rgba(139,92,246,0.1)', 'rgba(236,72,153,0.1)'] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full relative z-10">
        <motion.h1
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center mb-8"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
          Create Trainer
        </motion.h1>

        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-0.5 mx-auto mb-6"
          animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center text-4xl">{AVATARS[avatar]}</div>
        </motion.div>

        <motion.div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 space-y-5 shadow-2xl shadow-black/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div>
            <label className="text-gray-400 text-sm mb-2 block font-medium">Trainer Name</label>
            <input type="text" value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Enter your name..." maxLength={15}
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-base"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-3 block font-medium">Choose Avatar</label>
            <div className="flex gap-3 justify-center">
              {AVATARS.map((a, i) => (
                <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(i)}
                  className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${avatar === i ? 'bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-blue-400/50 scale-110 shadow-lg' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
                >{a}</motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-3 block font-medium">Choose Starter Pokémon</label>
            <div className="grid grid-cols-3 gap-3">
              {STARTER_POKEMON.map((p, idx) => (
                <motion.button key={p.id} whileHover={{ scale: 1.06, y: -4 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setStarter(p.id); setError('') }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                  className={`p-4 rounded-2xl border-2 transition-all ${starter === p.id ? 'border-yellow-400 bg-gradient-to-b from-yellow-400/15 to-yellow-500/5 shadow-xl shadow-yellow-400/20' : 'border-gray-800 bg-gray-800/50 hover:border-gray-600'}`}
                >
                  <motion.div animate={starter === p.id ? { y: [0, -5, 0], scale: [1, 1.08, 1] } : {}} transition={starter === p.id ? { duration: 2, repeat: Infinity } : {}}>
                    <PokemonSprite image={p.image} name={p.name} size="lg" />
                  </motion.div>
                  <p className="text-white font-bold text-base mt-2">{p.name}</p>
                  <div className="flex gap-1 mt-1 justify-center">
                    {p.types.map(t => (
                      <span key={t} className="text-[11px] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: POKEMON_TYPES[t]?.color || '#888' }}>{POKEMON_TYPES[t]?.name || t}</span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center mt-4">{error}</motion.p>}

        <div className="flex gap-4 mt-6 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button onClick={() => navigate('/')} variant="ghost">← Back</Button></motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button onClick={handleStart} variant="primary" size="lg">⚡ Start Adventure!</Button></motion.div>
        </div>
      </motion.div>
    </div>
  )
}