import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  image: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animate?: boolean
}

const sizes = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-32 h-32', xl: 'w-48 h-48' }

export default function PokemonSprite({ image, name, size = 'md', className = '', animate = true }: Props) {
  const [error, setError] = useState(false)

  return (
    <motion.div
      className={`${sizes[size]} flex items-center justify-center ${className}`}
      initial={animate ? { scale: 0, rotate: -180 } : {}}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {error ? (
        <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-3xl">
          ?
        </div>
      ) : (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain drop-shadow-lg pixelated"
          onError={() => setError(true)}
        />
      )}
    </motion.div>
  )
}
