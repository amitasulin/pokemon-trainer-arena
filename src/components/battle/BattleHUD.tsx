import { motion, AnimatePresence } from 'framer-motion'
import type { ActivePokemon } from '../../types/battle'
import { STATUS_META } from '../../types/battle'
import { POKEMON_TYPES } from '../../types/pokemon'
import PokemonSprite from '../pokemon/PokemonSprite'

interface Props { active: ActivePokemon; position: 'player' | 'enemy'; isShaking?: boolean; isFainting?: boolean }

export default function BattleHUD({ active, position, isShaking, isFainting }: Props) {
  const { pokemon, currentHp, defending } = active
  const hpPct = currentHp / pokemon.maxHp
  const hpColor = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#eab308' : '#ef4444'
  const primaryType = pokemon.types[0]
  const typeColor = POKEMON_TYPES[primaryType]?.color || '#6366f1'

  return (
    <div className={`flex ${position === 'enemy' ? 'flex-row' : 'flex-row-reverse'} items-end gap-3 ${position === 'enemy' ? 'justify-start' : 'justify-end'}`}>
      {/* Pokémon Sprite */}
      <motion.div
        className={position === 'enemy' ? 'order-2' : 'order-1'}
        animate={
          isFainting
            ? { opacity: 0, scale: 0, rotate: position === 'enemy' ? 180 : -180, y: 50 }
            : isShaking
              ? { x: [0, -12, 12, -10, 10, -6, 6, 0], y: [0, 3, -3, 2, -2, 0] }
              : { y: [0, -4, 0] }
        }
        transition={isFainting ? { duration: 0.8 } : isShaking ? { duration: 0.35 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          {/* Shadow platform under the sprite for visibility */}
          <div
            className="absolute -inset-6 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)' }}
          />
          <motion.div
            animate={defending ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <PokemonSprite image={pokemon.image} name={pokemon.name} size={position === 'enemy' ? 'xl' : 'lg'} />
          </motion.div>
          {defending && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.span className="text-4xl" animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🛡️</motion.span>
            </motion.div>
          )}
          {/* HP bar above sprite when low */}
          <AnimatePresence>
            {hpPct < 0.25 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500/20 px-2 py-0.5 rounded-full text-[10px] text-red-400 font-bold whitespace-nowrap"
              >
                ⚠️ LOW HP
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* HUD Panel */}
      <motion.div
        className={`${position === 'enemy' ? 'order-1' : 'order-2'} rounded-2xl p-2.5 sm:p-3 border-2 min-w-[120px] sm:min-w-[190px] shadow-xl backdrop-blur`}
        style={{ background: `linear-gradient(135deg, ${typeColor}15 0%, rgb(17,24,39) 100%)` }}
        animate={
          isShaking
            ? { borderColor: ['#ef4444', '#facc15', '#ef4444', '#4b5563'], boxShadow: ['0 0 20px rgba(239,68,68,0.3)', '0 0 30px rgba(239,68,68,0.5)', '0 0 20px rgba(239,68,68,0.3)'] }
            : defending
              ? { borderColor: ['#16a34a', '#15803d', '#16a34a'], boxShadow: ['0 0 15px rgba(22,163,74,0.3)', '0 0 25px rgba(22,163,74,0.5)', '0 0 15px rgba(22,163,74,0.3)'] }
              : { borderColor: '#374151', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }
        }
        transition={isShaking || defending ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            {defending && <motion.span className="text-sm" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>🛡️</motion.span>}
            <h3 className="text-white font-bold text-base tracking-wide">{pokemon.name}</h3>
          </div>
          <span className="text-gray-400 text-sm font-medium ml-auto">Lv.{pokemon.level}</span>
        </div>

        <div className="rounded-lg p-2" style={{ backgroundColor: `${typeColor}15` }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">HP</span>
            <span className="text-xs font-bold" style={{ color: hpColor }}>{currentHp}/{pokemon.maxHp}</span>
          </div>
          <div className="h-3 bg-gray-950 rounded-full overflow-hidden border" style={{ borderColor: `${typeColor}30` }}>
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${Math.max(0, hpPct * 100)}%`, backgroundColor: hpColor, boxShadow: `0 0 10px ${hpColor}70, 0 0 25px ${hpColor}30` }}
              layout
            />
          </div>
        </div>

        <div className="flex gap-1 mt-1.5">
          {pokemon.types.map(t => (
            <span key={t} className="type-badge text-xs" style={{ backgroundColor: POKEMON_TYPES[t]?.color || '#888' }}>
              {POKEMON_TYPES[t]?.name || t}
            </span>
          ))}
        </div>

        {active.statusEffects.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {active.statusEffects.map(eff => (
              <motion.span
                key={eff}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white border"
                style={{ backgroundColor: STATUS_META[eff as keyof typeof STATUS_META]?.color || '#555', borderColor: STATUS_META[eff as keyof typeof STATUS_META]?.color || '#555' }}
              >
                {STATUS_META[eff as keyof typeof STATUS_META]?.emoji} {STATUS_META[eff as keyof typeof STATUS_META]?.label || eff}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}