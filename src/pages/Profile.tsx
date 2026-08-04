import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import PokemonCard from '../components/pokemon/PokemonCard'
import { useGameStore } from '../stores/gameStore'

export default function Profile() {
  const navigate = useNavigate()
  const { trainer, achievements } = useGameStore()

  if (!trainer) {
    navigate('/')
    return null
  }

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-[120px]"
          animate={{ backgroundColor: ['rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)', 'rgba(59,130,246,0.08)'] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-[120px]"
          animate={{ backgroundColor: ['rgba(236,72,153,0.08)', 'rgba(59,130,246,0.08)', 'rgba(236,72,153,0.08)'] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Trainer Profile
          </motion.h1>
          <Button onClick={() => navigate('/world')} variant="ghost">← Back</Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Trainer Card */}
          <motion.div
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-5">
              <motion.span
                className="text-5xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {trainer.avatar}
              </motion.span>
              <div>
                <h2 className="text-2xl font-black text-white">{trainer.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-base">
                  <span className="flex items-center gap-1.5 text-yellow-400"><span>💰</span> ${trainer.money}</span>
                  <span className="flex items-center gap-1.5 text-yellow-500"><span>🏅</span> {trainer.badges.length} Badges</span>
                  <span className="flex items-center gap-1.5 text-gray-400"><span>⏱️</span> {formatTime(trainer.playTime)}</span>
                </div>
                <div className="flex gap-4 mt-1 text-base">
                  <span className="flex items-center gap-1.5 text-blue-400"><span>🏆</span> Wins: {trainer.wins}</span>
                  <span className="flex items-center gap-1.5 text-red-400"><span>💔</span> Losses: {trainer.losses}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          {trainer.badges.length > 0 && (
            <motion.div
              className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full inline-block" />
                Badges
              </h3>
              <div className="flex gap-3 flex-wrap">
                {trainer.badges.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/40 rounded-xl px-4 py-2 shadow-lg shadow-yellow-500/10"
                  >
                    <span className="text-yellow-400 font-black text-base">{badge}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team */}
          <motion.div
            className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full inline-block" />
              Team
            </h3>
            <div className="space-y-2">
              {trainer.pokemonTeam.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PokemonCard pokemon={p} showStats />
                </motion.div>
              ))}
            </div>
            {trainer.pokemonBox.length > 0 && (
              <>
                <h3 className="text-white font-bold mt-5 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full inline-block" />
                  Box ({trainer.pokemonBox.length})
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {trainer.pokemonBox.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <PokemonCard pokemon={p} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-gray-900/60 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full inline-block" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map(a => (
                <motion.div
                  key={a.id}
                  whileHover={a.unlocked ? { scale: 1.02, y: -2 } : {}}
                  className={`p-3 rounded-xl border transition-all ${
                    a.unlocked
                      ? 'border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 shadow-lg shadow-yellow-500/10'
                      : 'border-gray-800 bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <motion.span
                      animate={a.unlocked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {a.unlocked ? '⭐' : '🔒'}
                    </motion.span>
                    <div>
                      <div className={`text-base font-bold ${a.unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>{a.name}</div>
                      <div className="text-sm text-gray-500">{a.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
