import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ActivePokemon } from '../../types/battle'
import { POKEMON_TYPES } from '../../types/pokemon'
import type { Item } from '../../types/items'
import type { Pokemon } from '../../types/pokemon'

interface Props {
  playerPokemon: ActivePokemon; enemyPokemon: ActivePokemon; inventory: Record<string, Item>
  team: Pokemon[]; onFight: (i: number) => void; onItem: (id: string) => void; onPokemon: (i: number) => void
  onDefend: () => void; onRun: () => void; onCapture: () => void; disabled: boolean
}

type Menu = 'main' | 'fight' | 'bag' | 'pokemon'
const TYPE_ICONS: Record<string, string> = {
  normal: '⬜', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
  fighting: '👊', poison: '☠️', ground: '🏜️', flying: '🦅', psychic: '🔮',
  bug: '🐛', rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '✨',
}

export default function BattleActions(p: Props) {
  const [menu, setMenu] = useState<Menu>('main')
  const getHpColor = (c: number, m: number) => (c / m) > 0.5 ? '#22c55e' : (c / m) > 0.25 ? '#eab308' : '#ef4444'
  const canCapture = p.enemyPokemon.currentHp < p.enemyPokemon.pokemon.maxHp * 0.5
  const isDefending = p.playerPokemon.defending || false

  return (
    <div className="bg-gray-950/95 border-t-2 border-gray-800 p-3 relative">
      <AnimatePresence>
        {isDefending && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-t-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            🛡️ DEFENDING
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {menu === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-2 max-w-lg mx-auto">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'FIGHT', icon: '⚔️', grad: 'from-red-600 to-red-500', onClick: () => setMenu('fight') },
                { label: 'BAG', icon: '🎒', grad: 'from-blue-600 to-blue-500', onClick: () => setMenu('bag') },
                { label: 'SWITCH', icon: '🔄', grad: 'from-gray-600 to-gray-500', onClick: () => setMenu('pokemon') },
              ].map(btn => (
                <motion.button key={btn.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={btn.onClick} disabled={p.disabled}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-white font-bold text-base disabled:opacity-40 bg-gradient-to-br ${btn.grad} shadow-lg`}
                >
                  <span className="text-xl">{btn.icon}</span><span>{btn.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {canCapture && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={p.onCapture} disabled={p.disabled}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-white font-bold text-base disabled:opacity-40 bg-gradient-to-br from-yellow-600 to-yellow-500 shadow-lg">
                  <span className="text-lg">🔴</span><span>CAPTURE</span>
                </motion.button>
              )}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={p.onDefend} disabled={p.disabled}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-white font-bold text-base disabled:opacity-40 bg-gradient-to-br from-green-700 to-green-600 shadow-lg">
                <span className="text-lg">🛡️</span><span>DEFEND</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={p.onRun} disabled={p.disabled}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-white font-bold text-base disabled:opacity-40 bg-gradient-to-br from-gray-700 to-gray-600 shadow-lg">
                <span className="text-lg">🏃</span><span>RUN</span>
              </motion.button>
              {!canCapture && <div />}
            </div>
          </motion.div>
        )}
        {menu === 'fight' && (
          <motion.div key="fight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold text-base uppercase tracking-wider">Choose a move</h3>
              <button onClick={() => setMenu('main')} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700">← Back</button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-w-lg mx-auto">
              {p.playerPokemon.pokemon.moves.map((move, i) => {
                const ti = POKEMON_TYPES[move.type]
                return (
                  <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { p.onFight(i); setMenu('main') }} disabled={p.disabled || move.pp <= 0}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${move.pp <= 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                    style={{ borderColor: ti?.color || '#888', background: `linear-gradient(135deg, ${ti?.color}25, ${ti?.color}10)` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{TYPE_ICONS[move.type] || '⬜'}</span>
                      <span className="text-white font-bold text-base">{move.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="type-badge" style={{ backgroundColor: ti?.color || '#888' }}>{ti?.name || move.type}</span>
                      <span className="text-gray-400">PP {move.pp}/{move.maxPp}</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">{move.category.toUpperCase()} · POW {move.power} · ACC {move.accuracy}</div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
        {menu === 'bag' && (
          <motion.div key="bag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold text-base uppercase tracking-wider">Items</h3>
              <button onClick={() => setMenu('main')} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700">← Back</button>
            </div>
            <div className="grid grid-cols-4 gap-1.5 max-w-lg mx-auto">
              {Object.values(p.inventory).filter(i => i.count > 0).map(item => (
                <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { p.onItem(item.id); setMenu('main') }} disabled={p.disabled}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-gray-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-bold text-white text-center">{item.name}</span>
                  <span className="text-xs text-gray-400">×{item.count}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {menu === 'pokemon' && (
          <motion.div key="pokemon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold text-base uppercase tracking-wider">Switch Pokémon</h3>
              <button onClick={() => setMenu('main')} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700">← Back</button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-w-lg mx-auto max-h-40 overflow-y-auto">
              {p.team.map((mon, i) => {
                const fainted = mon.hp <= 0
                return (
                  <motion.button key={i} whileHover={fainted ? {} : { scale: 1.02 }} whileTap={fainted ? {} : { scale: 0.98 }}
                    onClick={() => { p.onPokemon(i); setMenu('main') }} disabled={p.disabled || fainted}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${fainted ? 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed' : 'border-gray-700 bg-gray-800/80 hover:bg-gray-700 cursor-pointer'}`}
                  >
                    <img src={mon.image} alt={mon.name} className="w-10 h-10 object-contain" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-base font-bold truncate">{mon.name}</span>
                        <span className="text-gray-400 text-xs">Lv.{mon.level}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(mon.hp / mon.maxHp) * 100}%`, backgroundColor: getHpColor(mon.hp, mon.maxHp) }} />
                        </div>
                        <span style={{ color: getHpColor(mon.hp, mon.maxHp) }} className="font-bold">{mon.hp}/{mon.maxHp}</span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}