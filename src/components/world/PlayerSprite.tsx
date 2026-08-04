import { motion } from 'framer-motion'

interface Props {
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
  avatar: string
}

export default function PlayerSprite({ direction, isMoving, avatar }: Props) {
  const rotations = { up: 0, down: 180, left: -90, right: 90 }

  return (
    <motion.div
      className="relative"
      animate={isMoving ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 0.3, repeat: isMoving ? Infinity : 0 }}
    >
      {/* Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/30 rounded-full" />

      {/* Character body */}
      <div className="relative" style={{ transform: `rotate(${rotations[direction]}deg)` }}>
        {/* Body */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-lg border-2 border-blue-300 shadow-lg">
          {avatar}
        </div>

        {/* Direction indicator */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          animate={{ opacity: isMoving ? [0.3, 1, 0.3] : 0.6 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="w-1 h-1 bg-yellow-400 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}
