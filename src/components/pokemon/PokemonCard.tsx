import { motion } from 'framer-motion'
import type { Pokemon } from '../../types/pokemon'
import { POKEMON_TYPES } from '../../types/pokemon'
import ProgressBar from '../ui/ProgressBar'
import PokemonSprite from './PokemonSprite'

interface Props { pokemon: Pokemon; currentHp?: number; onClick?: () => void; selected?: boolean; showStats?: boolean; className?: string }

export default function PokemonCard({ pokemon, currentHp, onClick, selected, showStats, className = '' }: Props) {
  const hp = currentHp ?? pokemon.hp
  const hpColor = (hp / pokemon.maxHp) > 0.5 ? '#4ade80' : (hp / pokemon.maxHp) > 0.25 ? '#facc15' : '#ef4444'
  const primaryType = pokemon.types[0]
  const typeColor = POKEMON_TYPES[primaryType]?.color || '#374151'

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.03, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      className={`rounded-xl p-3 border-2 transition-all ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-800/50'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}08, rgb(31,41,55))` }}
    >
      <div className="flex items-center gap-3">
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <PokemonSprite image={pokemon.image} name={pokemon.name} size={showStats ? 'lg' : 'md'} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Lv.{pokemon.level}</span>
            <h3 className="text-white font-bold truncate text-base">{pokemon.name}</h3>
          </div>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full text-white font-bold tracking-wide"
                style={{ backgroundColor: POKEMON_TYPES[t]?.color || '#888', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {POKEMON_TYPES[t]?.name || t}
              </span>
            ))}
          </div>
          <div className="mt-2"><ProgressBar value={hp} max={pokemon.maxHp} label="HP" color={hpColor} /></div>
        </div>
        {showStats && (
          <div className="text-xs text-gray-400 space-y-0.5 font-medium">
            <div className="flex items-center gap-1"><span className="text-red-400">⚔️</span>{pokemon.attack}</div>
            <div className="flex items-center gap-1"><span className="text-blue-400">🛡️</span>{pokemon.defense}</div>
            <div className="flex items-center gap-1"><span className="text-yellow-400">💨</span>{pokemon.speed}</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}