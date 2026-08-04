import { useRef, useMemo, useState, useEffect, useCallback, Suspense, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { AREAS_DATA, scaleGrid, MAP_SCALE } from './areasData'
import { WILD_POKEMON_AREAS } from '../../types/pokemon'

type TileKind =
  | 'grass' | 'tallgrass' | 'flower' | 'path' | 'tree' | 'house'
  | 'rock' | 'water' | 'sand' | 'building' | 'mountain'

interface Tile { kind: TileKind; solid: boolean; encounter: boolean }

function to3D(ch: string): Tile {
  switch (ch) {
    case 'G': return { kind: 'grass', solid: false, encounter: false }
    case 'D': return { kind: 'tallgrass', solid: false, encounter: true }
    case 'F': return { kind: 'flower', solid: false, encounter: true }
    case 'R': return { kind: 'rock', solid: true, encounter: false }
    case 'W': return { kind: 'water', solid: true, encounter: true }
    case 'S': return { kind: 'sand', solid: false, encounter: false }
    case 'M': return { kind: 'mountain', solid: true, encounter: false }
    case 'T': return { kind: 'tree', solid: false, encounter: false }
    case 'H': return { kind: 'house', solid: true, encounter: false }
    case 'B': return { kind: 'building', solid: true, encounter: false }
    case 'P': case 'Y': return { kind: 'path', solid: false, encounter: false }
    default: return { kind: 'grass', solid: true, encounter: false }
  }
}

// ---------- Procedural textures (cached) ----------
const textureCache: Record<string, THREE.CanvasTexture> = {}
function makeNoiseTexture(base: string, speckle: string, spots = 70): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = base
  g.fillRect(0, 0, 128, 128)
  for (let i = 0; i < spots; i++) {
    g.fillStyle = speckle
    g.globalAlpha = 0.08 + Math.random() * 0.18
    g.beginPath()
    g.arc(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 3, 0, Math.PI * 2)
    g.fill()
  }
  g.globalAlpha = 1
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}
function grassTexture() { return textureCache.grass || (textureCache.grass = makeNoiseTexture('#3f9e4a', '#2f7f3a')) }
function sandTexture() { return textureCache.sand || (textureCache.sand = makeNoiseTexture('#e7cd72', '#c9af55')) }

// ---------- Reusable nature props ----------
function GrassTuft({ x, z, h = 1 }: { x: number; z: number; h?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.children.forEach((c, i) => { c.position.y = Math.sin(clock.elapsedTime * 4 + x + i) * 0.05 })
  })
  return (
    <group ref={ref} position={[x, 0.24, z]}>
      {[-0.12, 0, 0.12].map((px, i) => (
        <mesh key={i} position={[px, 0.28, 0]}>
          <coneGeometry args={[0.09, 0.45 * h, 3]} />
          <meshStandardMaterial color={i % 2 ? '#3f9e4a' : '#54b457'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Flower({ x, z, color = '#e91e63' }: { x: number; z: number; color?: string }) {  return (
    <group position={[x, 0.26, z]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.02, 0.035, 0.3, 6]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.1, 7, 7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

// ---------- Touch D-pad: removed in favor of tap-to-move ----------

function Boulder({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <mesh position={[x, 0.32 * s, z]} scale={s} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color="#9a938c" roughness={1} flatShading />
    </mesh>
  )
}

function BirchTree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  const branch = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (branch.current) branch.current.rotation.z = Math.sin(clock.elapsedTime * 1.4 + x * 2) * 0.06
  })
  return (
    <group position={[x, 0, z]} scale={s} castShadow>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 1.9, 8]} />
        <meshStandardMaterial color="#6d4c2f" roughness={1} />
      </mesh>
      <group position={[0, 2.2, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow><sphereGeometry args={[0.6, 12, 12]} /><meshStandardMaterial color="#3f9e3f" roughness={0.9} /></mesh>
        <mesh position={[-0.28, 0.02, 0.05]} castShadow><sphereGeometry args={[0.4, 10, 10]} /><meshStandardMaterial color="#2e8b2f" roughness={0.9} /></mesh>
        <mesh position={[0.3, 0.04, -0.1]} castShadow><sphereGeometry args={[0.38, 10, 10]} /><meshStandardMaterial color="#45b04a" roughness={0.9} /></mesh>
      </group>
    </group>
  )
}

function House({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]} castShadow>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.55, 0.24, 1.55]} />
        <meshStandardMaterial color="#9aa0a6" roughness={1} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#ecdfc2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.68, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.15, 0.9, 4]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.45, 0.71]}>
        <boxGeometry args={[0.46, 0.62, 0.05]} />
        <meshStandardMaterial color="#7b4b2a" />
      </mesh>
      <mesh position={[-0.42, 0.85, 0.71]}>
        <boxGeometry args={[0.26, 0.26, 0.05]} />
        <meshStandardMaterial color="#bfe0ff" emissive="#8cc8ff" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.42, 0.85, 0.71]}>
        <boxGeometry args={[0.26, 0.26, 0.05]} />
        <meshStandardMaterial color="#bfe0ff" emissive="#8cc8ff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Building({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]} castShadow>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.6, 1.5]} />
        <meshStandardMaterial color="#b0b6be" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.66, 0]}>
        <boxGeometry args={[1.56, 0.14, 1.56]} />
        <meshStandardMaterial color="#8a909a" roughness={0.8} />
      </mesh>
      {[-0.42, 0, 0.42].map((px, i) => (
        <mesh key={i} position={[px, 0.85, 0.76]}>
          <boxGeometry args={[0.26, 0.32, 0.05]} />
          <meshStandardMaterial color="#9fd8ff" emissive="#6fbfff" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0.76]}>
        <boxGeometry args={[0.4, 0.54, 0.05]} />
        <meshStandardMaterial color="#565c66" />
      </mesh>
    </group>
  )
}

function Mountain({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.75, z]} castShadow receiveShadow>
      <coneGeometry args={[1.05, 1.9, 6]} />
      <meshStandardMaterial color="#a39d93" roughness={1} flatShading />
      <mesh position={[0, 0.3, 0.2]}>
        <coneGeometry args={[0.5, 0.9, 4]} />
        <meshStandardMaterial color="#e8e4dd" roughness={1} flatShading />
      </mesh>
    </mesh>
  )
}

function Water({ x, z }: { x: number; z: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const m = ref.current?.material as THREE.MeshStandardMaterial
    if (m) m.opacity = 0.72 + Math.sin(clock.elapsedTime * 2) * 0.05
  })
  return (
    <mesh ref={ref} position={[x, 0.12, z]}>
      <boxGeometry args={[1, 0.22, 1]} />
      <meshStandardMaterial color="#2f7fd6" transparent opacity={0.75} roughness={0.15} metalness={0.2} />
    </mesh>
  )
}

function Floor({ kind }: { kind: TileKind }) {
  const grass = kind === 'grass' || kind === 'tallgrass' || kind === 'flower' || kind === 'tree'
  const sand = kind === 'sand'

  const map = useMemo(() => (
    grass ? grassTexture() : sand ? sandTexture() : grassTexture()
  ), [kind])

  const color = useMemo(() => kind === 'flower' ? '#45a849' : kind === 'tallgrass' ? '#3a9441' : '#60a84f', [kind])

  return (
    <mesh position={[0, 0.08, 0]} receiveShadow>
      <boxGeometry args={[1, 0.16, 1]} />
      <meshStandardMaterial map={map} color={color} roughness={1} />
    </mesh>
  )
}

const FLOWER_COLORS = ['#e91e63', '#f1c40f', '#8e44ad', '#f39c12', '#e84118']

function Tile({ t, x, z }: { t: Tile; x: number; z: number }) {
  const hasTuft = useMemo(() => t.kind === 'grass' && Math.random() < 0.15, [])
  const hasRock = useMemo(() => t.kind === 'grass' && Math.random() < 0.04, [])
  const hasGrassBlade = useMemo(() => t.kind === 'grass' && Math.random() < 0.1, [])
  const flowerColor = useMemo(() => FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)], [])
  const edgeDecor = useMemo(() =>
    (t.kind === 'path' || t.kind === 'rock' || t.kind === 'mountain' || t.kind === 'house' || t.kind === 'building' || (t.kind === 'grass' && t.solid))
      ? Math.random() < 0.7
      : false
  , [t])
  const edgeFlower = useMemo(() => FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)], [])

  return (
    <group position={[x, 0, z]} castShadow receiveShadow>
      {t.kind !== 'water' && <Floor kind={t.kind} />}
      {t.kind === 'water' && <Water x={0} z={0} />}

      {hasTuft && <GrassTuft x={-0.18} z={0.12} h={0.8} />}
      {hasTuft && <GrassTuft x={0.2} z={-0.15} h={0.7} />}
      {hasRock && <Boulder x={0.12} z={-0.12} s={0.45} />}
      {hasGrassBlade && <GrassTuft x={0} z={0} h={0.6} />}

      {(t.kind === 'tallgrass') && (
        <>
          <GrassTuft x={0} z={0} h={1.4} />
          <GrassTuft x={0.2} z={0.12} h={1} />
          <GrassTuft x={-0.18} z={-0.1} h={1.1} />
        </>
      )}

      {t.kind === 'flower' && <Flower x={0} z={0} color={flowerColor} />}
      {t.kind === 'flower' && <Flower x={0.22} z={0.16} color={flowerColor} />}

      {t.kind === 'tree' && <BirchTree x={0} z={0} />}
      {t.kind === 'house' && <House x={0} z={0} />}
      {t.kind === 'building' && <Building x={0} z={0} />}
      {t.kind === 'rock' && <Boulder x={0} z={0} s={1.1} />}
      {t.kind === 'mountain' && <Mountain x={0} z={0} />}

      {edgeDecor && <GrassTuft x={0.3} z={0.3} h={1} />}
      {edgeDecor && <GrassTuft x={-0.3} z={-0.28} h={0.85} />}
      {edgeDecor && <GrassTuft x={0.22} z={-0.2} h={0.7} />}
      {edgeDecor && <Flower x={-0.26} z={0.28} color={edgeFlower} />}
      {(t.kind === 'path' || t.kind === 'house' || t.kind === 'building') && <GrassTuft x={-0.32} z={-0.2} h={0.8} />}

      {t.encounter && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.38, 6]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// ---------- Player ----------
function Player3D({ x, z, direction, moving }: { x: number; z: number; direction: 'up'|'down'|'left'|'right'; moving: boolean }) {
  const group = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)

  const rot = useMemo(() => {
    switch (direction) {
      case 'up': return Math.PI
      case 'right': return -Math.PI / 2
      case 'left': return Math.PI / 2
      default: return 0
    }
  }, [direction])

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = rot
      if (moving) {
        const step = Math.sin(clock.elapsedTime * 15)
        group.current.position.y = 0.12 + Math.max(0, step) * 0.12
        if (legL.current) legL.current.rotation.x = step * 0.7
        if (legR.current) legR.current.rotation.x = -step * 0.7
      } else {
        group.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 2.2)) * 0.04
      }
    }
  })

  return (
    <group ref={group} position={[x, 0, z]}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.5, 0.62, 0.34]} />
        <meshStandardMaterial color="#2563eb" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.52, 0.12, 0.36]} />
        <meshStandardMaterial color="#eab308" metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.32, 0]} castShadow>
        <sphereGeometry args={[0.27, 20, 20]} />
        <meshStandardMaterial color="#f7c9a3" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.56, 0]}>
        <sphereGeometry args={[0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 1.56, 0.27]}>
        <boxGeometry args={[0.42, 0.08, 0.07]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-0.34, 0.85, 0]} castShadow><boxGeometry args={[0.17, 0.5, 0.17]} /><meshStandardMaterial color="#1d4ed8" /></mesh>
      <mesh position={[0.34, 0.85, 0]} castShadow><boxGeometry args={[0.17, 0.5, 0.17]} /><meshStandardMaterial color="#1d4ed8" /></mesh>
      <group ref={legL} position={[-0.11, 0.28, 0]}>
        <mesh castShadow><boxGeometry args={[0.16, 0.5, 0.17]} /><meshStandardMaterial color="#172554" /></mesh>
      </group>
      <group ref={legR} position={[0.11, 0.28, 0]}>
        <mesh castShadow><boxGeometry args={[0.16, 0.5, 0.17]} /><meshStandardMaterial color="#172554" /></mesh>
      </group>
    </group>
  )
}

// ---------- Smooth world scroll ----------
const MOVE_ORDER = ['up', 'left', 'down', 'right'] as const
const MOVE_DELTA: Record<string, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

// ---------- Roaming wild Pokémon (billboard sprite) ----------
function Roaming({ x, z, image, phase }: { x: number; z: number; image: string; phase: number }) {
  const tex = useLoader(THREE.TextureLoader, image)
  const ref = useRef<THREE.Sprite>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase
    if (ref.current) {
      ref.current.position.y = 0.85 + Math.sin(t * 1.6) * 0.14
      ref.current.material.rotation = Math.sin(t * 1.1) * 0.18
    }
  })
  return (
    <sprite ref={ref} position={[x, 0.85, z]} scale={[2, 2, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  )
}

// ---------- Auto-fit world: scale so the map always fits the screen ----------
function ScaledWorld({ cols, rows, zoom, children }: { cols: number; rows: number; zoom: number; children: ReactNode }) {
  const { viewport } = useThree()
  const fit = useMemo(() => {
    const w = viewport.width / cols
    const h = viewport.height / rows
    const base = Math.min(w, h)
    const boost = viewport.width < viewport.height ? 1.35 : 1
    return base * boost
  }, [viewport.width, viewport.height, cols, rows])
  return <group scale={fit * zoom}>{children}</group>
}

// ---------- Main component ----------
export default function GameMap3D({
  trainer,
  onMove,
  onEncounter,
}: {
  trainer: { currentArea: string; position: { x: number; y: number } }
  onMove: (x: number, y: number) => void
  onEncounter: () => void
}) {
  const area = useMemo(() => AREAS_DATA.find(a => a.id === trainer.currentArea) ?? AREAS_DATA[0], [trainer.currentArea])
  const grid = useMemo(() => scaleGrid(area.grid, MAP_SCALE), [area.grid])
  const rows = grid.length
  const cols = grid[0].length
  const { x, y } = trainer.position
  const wx = x - cols / 2 + 0.5
  const wz = y - rows / 2 + 0.5

  const [moving, setMoving] = useState(false)
  const [direction, setDirection] = useState<'up'|'down'|'left'|'right'>('down')
  const [zoom, setZoom] = useState(1)
  const [battleTick, setBattleTick] = useState(0)
  const battledRef = useRef<Set<string>>(new Set())

  // Visible wild Pokémon roaming the map (one per species pool, on walkable tiles)
  const wildSpecies = useMemo(() => WILD_POKEMON_AREAS[trainer.currentArea] ?? WILD_POKEMON_AREAS['route1'], [trainer.currentArea])
  const roamings = useMemo(() => {
    const spots: { key: string; x: number; z: number; gx: number; gz: number; image: string }[] = []
    const candidates: { x: number; z: number }[] = []
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const t = to3D(grid[r][c])
      if (!t.solid && t.encounter) candidates.push({ x: c, z: r })
    }
    const count = Math.min(8, candidates.length)
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * candidates.length)
      const { x, z } = candidates[idx]
      candidates.splice(idx, 1)
      const sp = wildSpecies[i % wildSpecies.length]
      spots.push({
        key: `${x},${z}`,
        x: x - cols / 2 + 0.5,
        z: z - rows / 2 + 0.5,
        gx: x,
        gz: z,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${sp.id}.png`,
      })
    }
    return spots
  }, [rows, cols, grid, wildSpecies])
  const visibleRoamings = useMemo(() => roamings.filter(r => !battledRef.current.has(r.key)), [roamings, battleTick])
  const roamingSet = useMemo(() => {
    const s = new Set<string>()
    roamings.forEach(r => { if (!battledRef.current.has(r.key)) s.add(`${r.gx},${r.gz}`) })
    return s
  }, [roamings, battleTick])

  // Keep a live copy of the logical position for async/interval handling
  const posRef = useRef({ x, y })
  posRef.current = { x, y }
  const heldRef = useRef<Set<string>>(new Set())
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendEncRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null }
    if (idleRef.current) clearTimeout(idleRef.current)
  }, [])

  const kick = useCallback(() => {
    const held = heldRef.current
    if (held.size === 0) return
    const dir = MOVE_ORDER.find(d => held.has(d))
    if (!dir) return
    const { dx, dy } = MOVE_DELTA[dir]
    const p = posRef.current
    const nx = p.x + dx
    const ny = p.y + dy
    if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) return
    const dest = to3D(grid[ny][nx])
    if (dest.solid && dest.kind !== 'tallgrass' && dest.kind !== 'flower') return
    setDirection(dir)
    setMoving(true)
    onMove(nx, ny)
    const isRoam = roamingSet.has(`${nx},${ny}`)
    if ((dest.encounter && Math.random() < 0.45) || isRoam) {
      if (isRoam) { battledRef.current.add(`${nx},${ny}`); setBattleTick(t => t + 1) }
      if (pendEncRef.current) clearTimeout(pendEncRef.current)
      pendEncRef.current = setTimeout(onEncounter, 550)
    }
  }, [rows, cols, grid, onMove, onEncounter, roamingSet])

  const pressDir = useCallback((dir: 'up'|'down'|'left'|'right') => {
    heldRef.current.add(dir)
    stopHold()
    kick()
    idleRef.current = setTimeout(() => setMoving(false), 320)
    holdTimerRef.current = setInterval(kick, 140)
  }, [kick, stopHold])

  const releaseDir = useCallback((dir: 'up'|'down'|'left'|'right') => {
    heldRef.current.delete(dir)
    if (heldRef.current.size === 0) {
      stopHold()
      idleRef.current = setTimeout(() => setMoving(false), 260)
    } else {
      kick()
    }
  }, [kick, stopHold])

  // ---------- Tap-to-move: walk toward where you touch ----------
  const tapDirRef = useRef<'up'|'down'|'left'|'right' | null>(null)

  const onTapDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (tapDirRef.current) return
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-ignore-tap]')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
    tapDirRef.current = dir
    heldRef.current.clear()
    pressDir(dir as 'up'|'down'|'left'|'right')
  }, [pressDir])

  const onTapEnd = useCallback(() => {
    if (tapDirRef.current) {
      releaseDir(tapDirRef.current)
      tapDirRef.current = null
    }
  }, [releaseDir])

  useEffect(() => {
    const KEYMAP: Record<string, string> = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
    }
    const onDown = (e: KeyboardEvent) => {
      const dir = KEYMAP[e.key]
      if (!dir) return
      e.preventDefault()
      pressDir(dir as 'up'|'down'|'left'|'right')
    }
    const onUp = (e: KeyboardEvent) => {
      const dir = KEYMAP[e.key]
      if (!dir) return
      releaseDir(dir as 'up'|'down'|'left'|'right')
    }
    const stop = () => { if (holdTimerRef.current) clearInterval(holdTimerRef.current); holdTimerRef.current = null }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); stop(); if (pendEncRef.current) clearTimeout(pendEncRef.current) }
  }, [pressDir, releaseDir])

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950">
      <Canvas shadows camera={{ position: [0, 30, 25], fov: 55 }}>
        <color attach="background" args={['#0d1530']} />
        <fog attach="fog" args={['#0d1530', 40, 95]} />
        <ambientLight intensity={0.55} color="#cfd6ff" />
        <hemisphereLight intensity={0.7} color="#fffff0" groundColor="#8fae5a" />
        <directionalLight
          position={[8, 16, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0}
          shadow-camera-far={40}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        <ScaledWorld cols={cols} rows={rows} zoom={zoom}>
          {grid.map((row, rz) => row.map((_, cx) => {
            const t = to3D(grid[rz][cx])
            return <Tile key={`t${rz}-${cx}`} t={t} x={cx - cols / 2 + 0.5} z={rz - rows / 2 + 0.5} />
          }))}

          <Player3D x={wx} z={wz} direction={direction} moving={moving} />

          <Suspense fallback={null}>
            {visibleRoamings.map((r, i) => (
              <Roaming key={r.key} x={r.x} z={r.z} image={r.image} phase={i * 2.1} />
            ))}
          </Suspense>

          <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={Math.max(cols, rows) + 4} blur={2.6} far={5} frames={1} />
        </ScaledWorld>

<OrbitControls
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
        target={[0, 0, 0]}
      />
      </Canvas>

      {/* Transparent tap layer: captures pointer to move the player */}
      <div
        className="absolute inset-0 z-[5]"
        style={{ touchAction: 'none' }}
        onPointerDown={onTapDown}
        onPointerUp={onTapEnd}
        onPointerCancel={onTapEnd}
        onPointerLeave={onTapEnd}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className="absolute top-3 left-3 z-10 px-4 py-2 bg-black/70 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full" style={{ background: area.color }} />
        <p className="text-white font-bold text-lg drop-shadow">{area.name}</p>
      </div>

      <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg border border-white/10 text-gray-200 text-xs font-mono">
        📍 {x},{y}
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">        <button
          onClick={() => setZoom(z => Math.min(1.8, +(z + 0.15).toFixed(2)))}
          className="w-9 h-9 rounded-xl bg-black/70 backdrop-blur border border-white/10 text-white text-xl font-bold hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Zoom in"
        >＋</button>
        <div className="text-center text-white text-xs font-bold bg-black/70 rounded-lg px-2 py-1 border border-white/10">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(z => Math.max(0.55, +(z - 0.15).toFixed(2)))}
          className="w-9 h-9 rounded-lg bg-black/80 backdrop-blur border-white/10 text-white text-xl font-bold hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Zoom out"
        >－</button>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-black/60 backdrop-blur rounded-full border border-white/10 text-gray-200 text-xs select-none md:hidden">
        👆 Tap anywhere on the map to walk
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-black/60 backdrop-blur rounded-full border border-white/10 text-gray-200 text-xs select-none">
        ⌨️ WASD / Arrows · 👆 Tap to move · 🌿 Grass = wild battle · ＋ / － zoom
      </div>
    </div>
  )
}