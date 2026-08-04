import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { useGameStore } from '../stores/gameStore'
import { deleteSave } from '../services/saveService'

export default function Settings() {
  const navigate = useNavigate()
  const { trainer, saveCurrentGame } = useGameStore()

  const handleDeleteSave = () => {
    if (confirm('⚠️ Are you sure you want to delete your save? This cannot be undone!')) {
      deleteSave()
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[120px]"
          animate={{ backgroundColor: ['rgba(239,68,68,0.08)', 'rgba(59,130,246,0.08)', 'rgba(239,68,68,0.08)'] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-[120px]"
          animate={{ backgroundColor: ['rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)', 'rgba(59,130,246,0.08)'] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            ⚙️ Settings
          </motion.h1>
          <Button onClick={() => navigate(trainer ? '/world' : '/')} variant="ghost">
            ← Back
          </Button>
        </div>

        <div className="space-y-4">
          {trainer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-gray-900/70 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💾</span>
                <h2 className="text-white font-bold text-lg">Save Data</h2>
              </div>
              <div className="space-y-3">
                <Button onClick={saveCurrentGame} variant="primary" size="lg" className="w-full shadow-lg shadow-blue-500/20">
                  💾 Save Game
                </Button>
                {trainer.lastSave && (
                  <motion.p
                    className="text-sm text-gray-500 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Last saved: {new Date(trainer.lastSave).toLocaleString()}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-gray-900/70 backdrop-blur rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">ℹ️</span>
              <h2 className="text-white font-bold text-lg">About</h2>
            </div>
            <div className="text-base text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-gray-300 font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="text-gray-300 font-medium">React 19 + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span>Bundler</span>
                <span className="text-gray-300 font-medium">Vite 8</span>
              </div>
              <div className="flex justify-between">
                <span>Data</span>
                <span className="text-gray-300 font-medium">PokéAPI</span>
              </div>
              <hr className="border-gray-800 my-2" />
              <p className="text-center text-gray-600 text-sm">
                Pokémon Trainer Arena is a fan-made browser game.
                Pokémon is owned by Nintendo, Game Freak, and The Pokémon Company.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur rounded-2xl p-6 border border-red-900/40 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-red-400 font-bold text-lg">Danger Zone</h2>
            </div>
            <p className="text-red-300/60 text-base mb-4">
              This action will permanently delete all your saved data.
            </p>
            <Button onClick={handleDeleteSave} variant="danger" size="lg" className="w-full shadow-lg shadow-red-500/20">
              🗑️ Delete All Save Data
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
