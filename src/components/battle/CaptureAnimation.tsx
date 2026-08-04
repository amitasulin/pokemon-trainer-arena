import { motion, AnimatePresence } from 'framer-motion'
import PokeBall from './PokeBall'

interface Props {
  isCapturing: boolean
  animation: 'idle' | 'shaking' | 'success' | 'fail'
  enemyPosition?: { top: string; right: string }
}

const stars = [...Array(12)].map((_, i) => ({
  angle: i * 30,
  delay: i * 0.04,
  color: ['#FFD700', '#FFF', '#FFEC8B', '#FFA500'][i % 4],
}))

const particles = [...Array(20)].map(() => ({
  angle: Math.random() * 360,
  distance: 40 + Math.random() * 60,
  delay: Math.random() * 0.3,
  size: 3 + Math.random() * 4,
  color: ['#FFD700', '#FFF', '#FFEC8B', '#FFA500', '#FFF8DC'][Math.floor(Math.random() * 5)],
}))

export default function CaptureAnimation({ isCapturing, animation, enemyPosition = { top: '5%', right: '5%' } }: Props) {
  const { top, right } = enemyPosition

  return (
    <AnimatePresence>
      {isCapturing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-20 pointer-events-none"
          style={{
            top,
            right,
            width: 'min(86vw, 520px)',
            height: 'min(72vh, 460px)',
            transform: 'translate(50%, -50%)',
            touchAction: 'none',
          }}
        >
          {/* Background darken */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            style={{ top: '-50%', left: '-50%', width: '200%', height: '200%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* === THROW PHASE (shaking state = ball flying + shaking) === */}
          {animation === 'shaking' && (
            <>
              {/* Pokéball flying from bottom-left with arc TO enemy position */}
              <motion.div
                className="absolute"
                initial={{
                  x: '-80%',
                  y: '80%',
                  scale: 0.4,
                  rotate: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [0, '0%', 0],
                  y: ['80%', '-10%', '0%'],
                  scale: [0.4, 1.1, 1],
                  rotate: [0, 360, 720],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <PokeBall animation="throw" size={64} />
              </motion.div>

              {/* Trail particles behind ball */}
              <motion.div
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, #FFD700, transparent)`,
                      left: `${20 + i * 3}%`,
                      top: `${70 - i * 3}%`,
                      boxShadow: '0 0 8px #FFD700',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                      x: (i - 4) * 8,
                      y: -i * 10,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.03,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </motion.div>

              {/* Capture beam from ball TO enemy sprite */}
              <motion.div
                className="absolute"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0],
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{ duration: 1.8, delay: 0.5 }}
              >
                <div
                  className="w-2 h-[180px] -translate-y-full rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,215,0,0.5), transparent)',
                    boxShadow: '0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.2)',
                    filter: 'blur(1px)',
                  }}
                />
                {/* Beam particles */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#FFD700',
                      left: '50%',
                      top: `${100 - i * 5}%`,
                      boxShadow: '0 0 6px #FFD700',
                    }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{
                      x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
                      y: [-i * 8 - 10, -i * 15 - 20],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + i * 0.04,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </motion.div>

              {/* Ball lands and shakes AT enemy position */}
              <motion.div
                className="absolute"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.6 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -22, 22, -18, 18, -12, 12, -8, 8, -4, 4, 0],
                    scale: [1, 1.06, 0.96, 1.05, 0.97, 1.03, 0.98, 1.02, 0.99, 1.01, 1, 1],
                  }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 0.6 }}
                >
                  <PokeBall animation="shaking" size={72} />
                </motion.div>

                {/* Shake rings */}
                <motion.div
                  className="absolute -inset-8 rounded-full border-2"
                  style={{ borderColor: '#FFD700', opacity: 0.6 }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: [0.5, 1.5, 2],
                    opacity: [0.6, 0.3, 0],
                  }}
                  transition={{ duration: 0.6, delay: 0.6, repeat: 2, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute -inset-12 rounded-full border-2"
                  style={{ borderColor: '#FFA500', opacity: 0.4 }}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    scale: [0.3, 1.8, 2.5],
                    opacity: [0.4, 0.2, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.8, repeat: 1, ease: 'easeOut' }}
                />
              </motion.div>

              {/* "Capturing..." progress bar */}
              <motion.div
                className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-56 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #eab308, #ef4444, #eab308, #22c55e)',
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ width: '0%' }}
                    animate={{
                      width: ['0%', '100%'],
                      backgroundPosition: ['0% 0%', '200% 0%'],
                    }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      backgroundSize: '100% 100%',
                    }}
                    animate={{ backgroundPosition: ['-100% 0%', '200% 0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
                <motion.p
                  className="text-yellow-400/80 text-xs mt-1.5 font-medium tracking-wider uppercase"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  Capturing...
                </motion.p>
              </motion.div>
            </>
          )}

          {/* === SUCCESS PHASE === */}
          {animation === 'success' && (
            <motion.div
              className="absolute"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 250, damping: 12 }}
            >
              {/* Capture flash */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.3), transparent)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.5 }}
              />

              {/* Success stars burst */}
              {stars.map((s) => (
                <motion.div
                  key={s.angle}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: s.color,
                    top: '50%',
                    left: '50%',
                    boxShadow: `0 0 10px ${s.color}`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    x: Math.cos(s.angle * Math.PI / 180) * 100,
                    y: Math.sin(s.angle * Math.PI / 180) * 100,
                    scale: [0, 1.8, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 720],
                  }}
                  transition={{ duration: 0.7, delay: s.delay, ease: 'easeOut' }}
                />
              ))}

              {/* Inner ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border-3"
                style={{ borderColor: '#22c55e', opacity: 0.8 }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {/* Outer ring */}
              <motion.div
                className="absolute -inset-8 rounded-full border-2"
                style={{ borderColor: '#4ade80', opacity: 0.6 }}
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: [0.2, 2, 3], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              />

              {/* Pokéball at center */}
              <PokeBall animation="success" size={88} />

              {/* Success text */}
              <motion.div
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
              >
                <motion.div
                  className="text-3xl mb-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.4, 1], rotate: [-180, 0] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.2 }}
                >
                  ⭐
                </motion.div>
                <h2 className="text-green-400 text-2xl font-black tracking-wide drop-shadow-lg">
                  Gotcha!
                </h2>
                <p className="text-green-300 text-sm mt-1">Pokémon was caught!</p>
                <motion.div
                  className="mt-3 px-6 py-2 bg-green-600/30 rounded-full border border-green-500/50 backdrop-blur"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  <span className="text-green-200 text-sm font-bold tracking-wide">✦ Added to collection ✦</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* === FAIL PHASE === */}
          {animation === 'fail' && (
            <motion.div
              className="absolute"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 10 }}
            >
              {/* Red flash */}
              <motion.div
                className="absolute -inset-12 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,50,50,0.4), transparent)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.5, 0], opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.4 }}
              />

              {/* Pokéball breaks */}
              <motion.div
                animate={{
                  rotate: [0, -25, 25, -15, 15, -8, 8, 0],
                  scale: [1, 1.1, 0.95, 1.05, 0.98, 1.02, 0.99, 1],
                  opacity: [1, 1, 1, 1, 1, 1, 1, 0],
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              >
                <PokeBall animation="fail" size={72} />
              </motion.div>

              {/* Explosion particles */}
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: p.color,
                    top: '50%',
                    left: '50%',
                    boxShadow: `0 0 8px ${p.color}`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                    y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
                />
              ))}

              {/* Break lines */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-16 -translate-y-1/2"
                  style={{
                    top: '50%',
                    left: '50%',
                    background: `linear-gradient(to right, #ef4444, #f87171)`,
                    rotate: `${i * 45}deg`,
                    transformOrigin: 'center right',
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.02, ease: 'easeOut' }}
                />
              ))}

              {/* Fail text */}
              <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-red-400 text-lg font-bold">Oh no!</p>
                <p className="text-red-300 text-sm">The Pokémon broke free!</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}