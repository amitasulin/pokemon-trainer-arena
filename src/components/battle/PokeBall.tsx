import { motion } from 'framer-motion'

interface Props {
  animation: 'idle' | 'throw' | 'shaking' | 'success' | 'fail'
  size?: number
}

export default function PokeBall({ animation, size = 80 }: Props) {
  const half = size / 2

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={
        animation === 'throw'
          ? {
              x: [0, 0, 0],
              y: [0, -40, 0],
              rotate: [0, 360, 720],
              scale: [1, 0.85, 1],
            }
          : animation === 'shaking'
            ? {
                rotate: [0, -22, 22, -18, 18, -12, 12, -8, 8, -4, 4, 0],
                scale: [1, 1.06, 0.96, 1.05, 0.97, 1.03, 0.98, 1.02, 0.99, 1.01, 1, 1],
              }
            : animation === 'success'
              ? { scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }
              : animation === 'fail'
                ? { scale: [1, 1.15, 1, 0.8], rotate: [0, -12, 20, -8], opacity: [1, 1, 1, 0] }
                : {}
      }
      transition={
        animation === 'shaking'
          ? { duration: 2, ease: 'easeInOut' }
          : animation === 'throw'
            ? { duration: 0.55, ease: 'easeOut' }
            : { duration: 0.35 }
      }
    >
      {/* Main body */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-gray-800"
        style={{
          background: 'linear-gradient(180deg, #ee1515 0%, #ee1515 48%, #222 48%, #222 52%, #f0f0f0 52%, #f0f0f0 100%)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute"
          style={{
            top: 4,
            left: size * 0.15,
            width: size * 0.35,
            height: size * 0.22,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.35), transparent)',
          }}
        />
        {/* Bottom shadow */}
        <div
          className="absolute"
          style={{
            bottom: 4,
            left: size * 0.2,
            width: size * 0.4,
            height: size * 0.15,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.2), transparent)',
          }}
        />
      </div>

      {/* Center button */}
      <div
        className="absolute rounded-full border-[2.5px] border-gray-800"
        style={{
          top: half - size * 0.1,
          left: half - size * 0.1,
          width: size * 0.2,
          height: size * 0.2,
          background: 'radial-gradient(circle at 35% 35%, #f5f5f5, #ddd 50%, #aaa)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.2)',
          zIndex: 2,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: size * 0.025,
            left: size * 0.0375,
            width: size * 0.075,
            height: size * 0.0625,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)',
          }}
        />
      </div>

      {/* Success stars burst */}
      {animation === 'success' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: size * 0.06,
                height: size * 0.06,
                backgroundColor: ['#FFD700', '#FFF', '#FFEC8B', '#FFA500'][i % 4],
                borderRadius: '50%',
                top: half - size * 0.03,
                left: half - size * 0.03,
                boxShadow: '0 0 10px #FFD700',
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: Math.cos(i * 0.785) * (half + size * 0.15),
                y: Math.sin(i * 0.785) * (half + size * 0.15),
                scale: [0, 2, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}
          {/* Center flash */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.4), transparent)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.45, delay: 0.1 }}
          />
          {/* Success ring */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2"
            style={{ borderColor: '#22c55e', opacity: 0.8 }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 2, 0], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          />
        </>
      )}

      {/* Fail break effect */}
      {animation === 'fail' && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(255,50,50,0.25)' }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className="absolute text-xl"
            style={{ top: half - size * 0.15, left: half - size * 0.125 }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.8, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            💥
          </motion.div>
        </>
      )}
    </motion.div>
  )
}