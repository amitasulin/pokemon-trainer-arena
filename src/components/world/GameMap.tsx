import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Trainer } from '../../types/trainer'
import PlayerSprite from './PlayerSprite'
import { scaleGrid, MAP_SCALE } from './areasData'

interface Props {
  trainer: Trainer
  onMove: (x: number, y: number) => void
  onEncounter: () => void
}

interface AreaData {
  id: string; name: string; grid: string[][]; encounters: boolean; gym?: string; color: string; desc: string
  weather?: 'none' | 'rain' | 'snow' | 'sandstorm' | 'mist' | 'sun'
  decor?: string
}

const TILE_STYLES: Record<string, { bg: string; emoji: string }> = {
  G: { bg: 'bg-emerald-900', emoji: '🌳' },
  D: { bg: 'bg-emerald-600', emoji: '🌿' },
  P: { bg: 'bg-stone-500', emoji: '⬜' },
  H: { bg: 'bg-amber-800', emoji: '🏠' },
  T: { bg: 'bg-emerald-950', emoji: '🌲' },
  B: { bg: 'bg-stone-700', emoji: '🧱' },
  Y: { bg: 'bg-amber-50', emoji: '✨' },
  R: { bg: 'bg-red-600', emoji: '⚔️' },
  F: { bg: 'bg-emerald-700', emoji: '🌺' },
  W: { bg: 'bg-blue-600', emoji: '🌊' },
  S: { bg: 'bg-stone-400', emoji: '🏖️' },
  M: { bg: 'bg-stone-600', emoji: '⛰️' },
}

const AREAS: Record<string, AreaData> = {
  route1: {
    id: 'route1', name: 'Route 1', desc: 'A peaceful route with tall grass swaying in the breeze',
    grid: [
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','D','D','D','D','F','F','G','G','G'],
      ['G','G','F','F','D','D','D','D','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','P','P','P','P','P','P','P','P','G','G','G'],
      ['G','G','P','P','P','P','P','P','P','P','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ],
    encounters: true, color: '#4ade80', weather: 'none', decor: 'grass',
  },
  route2: {
    id: 'route2', name: 'Route 2', desc: 'A winding path through rolling hills',
    grid: [
      ['G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','D','D','F','F','F','F','G','G'],
      ['G','G','G','D','D','D','D','G','G','G','G','G'],
      ['G','G','G','D','D','D','D','G','G','G','G','G'],
      ['G','F','F','F','D','D','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','G','G','G','B','B','G','G','G','G','G','G'],
      ['G','G','G','G','B','B','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G'],
    ],
    encounters: true, color: '#22c55e', weather: 'none', decor: 'grass',
  },
  forest: {
    id: 'forest', name: 'Viridian Forest', desc: 'A dark, dense forest where bugs roam freely',
    grid: [
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','F','F','D','D','D','D','F','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','F','D','D','D','D','F','F','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
    ],
    encounters: true, color: '#16a34a', weather: 'mist', decor: 'forest',
  },
  cave: {
    id: 'cave', name: 'Diglett Cave', desc: 'Dark tunnels underground with rocky terrain',
    grid: [
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','S','S','D','D','D','D','S','S','R'],
      ['R','S','D','D','D','D','D','D','S','R'],
      ['R','S','D','R','D','D','R','D','S','R'],
      ['R','S','D','R','D','D','R','D','S','R'],
      ['R','S','S','D','D','D','D','S','S','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
    ],
    encounters: true, color: '#a8734a', weather: 'sandstorm', decor: 'cave',
  },
  water: {
    id: 'water', name: 'Cerulean Bay', desc: 'Sparkling waters with gentle waves',
    grid: [
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','W','W','W','W','W','W','W','W','S'],
      ['S','W','D','D','D','D','D','D','W','S'],
      ['S','W','D','D','D','D','D','D','W','S'],
      ['S','W','W','W','D','D','W','W','W','S'],
      ['S','W','W','W','D','D','W','W','W','S'],
      ['S','W','W','W','W','W','W','W','W','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
    ],
    encounters: true, color: '#3b82f6', weather: 'rain', decor: 'water',
  },
  mountain: {
    id: 'mountain', name: 'Mt. Silver', desc: 'A towering rocky peak reaching the clouds',
    grid: [
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','M','M','R','R','R','R','M','M','R','R','R'],
      ['R','M','D','D','R','R','D','D','M','R','R','R'],
      ['R','R','D','D','D','D','D','D','R','R','R','R'],
      ['R','R','D','D','D','D','D','D','R','R','R','R'],
      ['R','M','D','D','R','R','D','D','M','R','R','R'],
      ['R','M','M','R','R','R','R','M','M','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
    ],
    encounters: true, color: '#92400e', weather: 'snow', decor: 'mountain',
  },
  beach: {
    id: 'beach', name: 'Cyan Beach', desc: 'Sandy shores with gentle rolling waves',
    grid: [
      ['S','S','S','S','S','S','S','S','S','S','S'],
      ['S','B','B','B','W','W','B','B','B','S','S'],
      ['S','B','B','B','W','W','B','B','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','B','B','B','B','B','B','B','S','S'],
      ['S','S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S','S'],
    ],
    encounters: true, color: '#eab308', weather: 'sun', decor: 'beach',
  },
  city: {
    id: 'city', name: 'Pallet Town', desc: 'A quiet town by the sea where journeys begin',
    grid: [
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','H','H','P','H','H','P','P','P','P'],
      ['P','P','H','H','P','H','H','P','P','P','P'],
      ['P','P','P','P','G','P','P','P','P','P','P'],
      ['P','P','P','P','G','P','P','P','P','P','P'],
      ['P','P','G','G','P','G','G','P','P','P','P'],
      ['P','P','G','G','P','G','G','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
    ],
    encounters: false, color: '#94a3b8', weather: 'none', decor: 'town',
  },
  gym: {
    id: 'gym', name: 'Indigo League', desc: 'Home of the Gym Leader - prove your strength!',
    grid: [
      ['B','B','B','B','B','B','B','B','B'],
      ['B','B','B','B','B','B','B','B','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','R','R','R','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','B','B','B','B','B','B','B','B'],
      ['B','B','B','B','B','B','B','B','B'],
    ],
    encounters: false, gym: 'Brock', color: '#f59e0b', weather: 'none', decor: 'gym',
  },
}

const decorClasses: Record<string, string> = {
  grass: 'bg-gradient-to-t from-emerald-500/30 via-emerald-400/20 to-transparent',
  forest: 'bg-gradient-to-t from-green-600/30 via-emerald-500/20 to-transparent',
  cave: 'bg-gradient-to-t from-amber-600/20 via-stone-500/15 to-transparent',
  water: 'bg-gradient-to-t from-blue-500/30 via-cyan-400/20 to-transparent',
  mountain: 'bg-gradient-to-t from-stone-500/20 via-gray-500/15 to-transparent',
  beach: 'bg-gradient-to-t from-amber-300/30 via-yellow-200/20 to-transparent',
  town: 'bg-gradient-to-t from-emerald-500/20 via-green-400/15 to-transparent',
  gym: 'bg-gradient-to-t from-yellow-400/30 via-orange-500/20 to-transparent',
}

function getDecorClass(decor: string): string {
  return decorClasses[decor] || 'bg-transparent'
}

interface TileProps {
  tile: string
  style: { bg: string; emoji: string }
  isPlayer: boolean
  isEncounterTile: boolean
  dist: number
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
  avatar: string
  decorClass: string
  size: number
  ry: number
  rx: number
}

const Tile = memo(function Tile({
  style, isPlayer, isEncounterTile, dist, direction, isMoving, avatar, decorClass, size
}: TileProps) {
  const opacity = isPlayer ? 1 : dist > 5 ? 0.15 : dist > 3 ? 0.35 : dist > 1 ? 0.6 : 0.9

  if (isPlayer) {
    return (
      <div className={`flex items-center justify-center rounded-md relative ${style.bg}`} style={{ width: size, height: size, fontSize: size * 0.7, opacity: 1, filter: 'brightness(1.25) drop-shadow(0 0 8px currentColor)' }}>
        <div className="absolute inset-0" style={{ background: decorClass }} />
        <PlayerSprite direction={direction} isMoving={isMoving} avatar={avatar} />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-md relative overflow-hidden transition-all duration-100 ${style.bg} cursor-pointer`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.7,
        opacity,
        filter: dist > 4 ? 'grayscale(0.6) brightness(0.7)' : 'none',
      }}
      onMouseEnter={() => {}}
    >
      <div className="absolute inset-0" style={{ background: decorClass }} />
      {isEncounterTile && (
        <div className="absolute inset-0 rounded-md pointer-events-none animate-pulse" style={{ boxShadow: 'inset 0 0 8px #fde04780, 0 0 12px #fde04740' }} />
      )}
      <span className="relative drop-shadow-sm">{style.emoji}</span>
    </div>
  )
})

export default function GameMap({ trainer, onMove, onEncounter }: Props) {
  const area = useMemo(() => AREAS[trainer.currentArea], [trainer.currentArea])
  if (!area) return null
  const grid = useMemo(() => scaleGrid(area.grid, MAP_SCALE), [area.grid])

  const { x, y } = trainer.position
  const containerRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [isMoving, setIsMoving] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const keysPressed = useRef<Set<string>>(new Set())
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    containerRef.current?.focus()
    const t = setTimeout(() => setShowTip(false), 5000)
    return () => clearTimeout(t)
  }, [trainer.currentArea])

  const handleMove = useCallback((dx: number, dy: number) => {
    const nx = x + dx
    const ny = y + dy
    if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) return

    const newDir = dy === -1 ? 'up' : dy === 1 ? 'down' : dx === -1 ? 'left' : 'right'
    setDirection(newDir)
    setIsMoving(true)
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    moveTimeoutRef.current = window.setTimeout(() => setIsMoving(false), 150)

    onMove(nx, ny)
    const destTile = grid[ny][nx]
    const isEncounterTile = destTile === 'D' || destTile === 'W' || destTile === 'F'
    if (area.encounters && isEncounterTile && Math.random() < 0.28) {
      setTimeout(onEncounter, 500)
    }
  }, [x, y, area, grid, onMove, onEncounter])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return
      if (keysPressed.current.has(key)) return
      keysPressed.current.add(key)
      e.preventDefault()

      switch (key) {
        case 'ArrowUp': handleMove(0, -1); break
        case 'ArrowDown': handleMove(0, 1); break
        case 'ArrowLeft': handleMove(-1, 0); break
        case 'ArrowRight': handleMove(1, 0); break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    }
  }, [handleMove])

  const decorClass = getDecorClass(area.decor || 'grass')
  const tileSize = Math.max(14, Math.min(92, 900 / Math.max(grid[0].length, 1)))

  const tiles = useMemo(() => {
    const result: Array<{ ry: number; rx: number; tile: string; isPlayer: boolean; dist: number; isEncounterTile: boolean }> = []
    grid.forEach((row, ry) => {
      row.forEach((tile, rx) => {
        const isPlayer = rx === x && ry === y
        const dist = Math.abs(rx - x) + Math.abs(ry - y)
        const isEncounterTile = (tile === 'D' || tile === 'W' || tile === 'F') && area.encounters
        result.push({ ry, rx, tile, isPlayer, dist, isEncounterTile })
      })
    })
    return result
  }, [grid, x, y, area.encounters])

  return (
    <div ref={containerRef} tabIndex={0} className="flex flex-col items-center gap-3 outline-none w-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={area.id}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-4xl"
        >
          {area.weather && area.weather !== 'none' && (
            <WeatherOverlay weather={area.weather} />
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.span
                className="text-3xl filter drop-shadow-lg"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {area.encounters ? '🌿' : area.gym ? '🏟️' : '🏘️'}
              </motion.span>
              <h2 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                {area.name}
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md mx-auto">{area.desc}</p>
            {area.gym && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block mt-2 text-xs bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-4 py-1.5 rounded-full font-black shadow-xl shadow-yellow-500/30 border border-yellow-300/50"
              >
                ⚔️ GYM LEADER: {area.gym}
              </motion.span>
            )}
          </motion.div>

          <div className="relative flex justify-center w-full">
            <div
              className="bg-gradient-to-br from-gray-950/90 to-gray-900/95 backdrop-blur-xl rounded-3xl p-4 border border-gray-800/50 shadow-[0_0_60px_rgba(0,0,0,0.6)] inset-shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] inline-block"
            >
              <div
                className="grid gap-0.5 relative"
                style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
              >
                {tiles.map(({ ry, rx, tile, isPlayer, dist, isEncounterTile }) => {
                  const style = TILE_STYLES[tile] || { bg: 'bg-gray-950', emoji: '' }
                  return (
                    <Tile
                      key={`${ry}-${rx}`}
                      tile={tile}
                      style={style}
                      isPlayer={isPlayer}
                      isEncounterTile={isEncounterTile}
                      dist={dist}
                      direction={direction}
                      isMoving={isMoving}
                      avatar={trainer.avatar}
                      decorClass={decorClass}
                      size={tileSize}
                      ry={ry}
                      rx={rx}
                    />
                  )
                })}
              </div>
            </div>

            <motion.div
              className="absolute -top-8 right-0 w-12 h-12 flex items-center justify-center"
              animate={{ rotate: direction === 'up' ? 0 : direction === 'right' ? 90 : direction === 'down' ? 180 : 270 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl" />
                <svg className="w-10 h-10 text-yellow-400/80 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12" strokeLinecap="round" />
                  <polygon points="12,2 10,8 14,8" fill="currentColor" />
                </svg>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap bg-gray-950/95 px-4 py-2 rounded-full border border-gray-800 backdrop-blur shadow-lg"
              >
                ⌨️ Arrow keys to move &nbsp;|&nbsp; 🌿 Tall grass = encounters
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
        {Object.values(AREAS).map((a) => (
          <button
            key={a.id}
            onClick={() => {}}
            disabled={a.id === area.id}
            className={`w-3 h-3 rounded-full transition-all ${
              a.id === area.id
                ? 'ring-2 ring-white scale-125 shadow-lg'
                : trainer.unlockedAreas.includes(a.id)
                ? `hover:ring-2 hover:ring-[${a.color}]/50 cursor-pointer`
                : 'bg-gray-700/50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: a.id === area.id ? 'white' : trainer.unlockedAreas.includes(a.id) ? a.color : undefined }}
            title={a.name}
          />
        ))}
      </div>
    </div>
  )
}

function WeatherOverlay({ weather }: { weather: string }) {
  const particles = useMemo(() => {
    const count = weather === 'rain' ? 25 : weather === 'snow' ? 15 : weather === 'sandstorm' ? 12 : weather === 'mist' ? 8 : 6
    return [...Array(count)].map((_, i) => {
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const delay = Math.random() * 3
      const dur = 1.5 + Math.random() * 2

      switch (weather) {
        case 'rain':
          return (
            <motion.div
              key={i}
              className="absolute w-0.5 h-5 bg-blue-300/50"
              style={{ left, top, transform: 'rotate(15deg)' }}
              animate={{ y: [0, 150], opacity: [0.5, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
            />
          )
        case 'snow':
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/70 rounded-full"
              style={{ left, top }}
              animate={{ y: [0, 180], x: [0, (Math.random() - 0.5) * 50], opacity: [0.7, 0], rotate: [0, 360] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay }}
            />
          )
        case 'sandstorm':
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-600/30 rounded"
              style={{ left, top }}
              animate={{ x: [0, (Math.random() - 0.5) * 60], y: [0, (Math.random() - 0.5) * 60], opacity: [0.3, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay }}
            />
          )
        case 'mist':
          return (
            <motion.div
              key={i}
              className="absolute h-24 bg-white/8 rounded-full blur-xl"
              style={{ width: `${60 + Math.random() * 100}px`, left, top }}
              animate={{ x: [(Math.random() - 0.5) * 30, -(Math.random() - 0.5) * 30], opacity: [0.1, 0.03, 0.1] }}
              transition={{ duration: 7 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          )
        case 'sun':
        default:
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200/50 rounded-full"
              style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 40}%` }}
              animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.7, 0.2], rotate: [0, 180] }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay }}
            />
          )
      }
    })
  }, [weather])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}
    >
      {particles}
    </motion.div>
  )
}