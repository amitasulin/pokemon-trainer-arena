import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  moveType: string
  isAttacking: boolean
  position: 'player' | 'enemy'
}

export default function AttackEffect({ moveType, isAttacking, position }: Props) {
  const direction = position === 'player' ? 1 : -1

  return (
    <AnimatePresence>
      {isAttacking && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fire */}
          {moveType === 'fire' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-12 rounded-full"
                  style={{
                    background: `linear-gradient(to top, #FF4500, #FFD700)`,
                    transformOrigin: 'center bottom',
                    rotate: `${i * 45}deg`,
                    filter: 'blur(2px)',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    y: [0, -60],
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Water */}
          {moveType === 'water' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#1E90FF' }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 1.047) * 100 * direction],
                    y: [0, -80],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                />
              ))}
              {/* Splash */}
              <motion.div
                className="absolute w-20 h-20 rounded-full border-4"
                style={{ borderColor: '#1E90FF' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          )}

          {/* Electric */}
          {moveType === 'electric' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 3,
                    height: 40 + Math.random() * 40,
                    background: `linear-gradient(to top, #FFD700, #FFF)`,
                    transformOrigin: 'center bottom',
                    rotate: `${(i - 2) * 15}deg`,
                    filter: 'drop-shadow(0 0 6px #FFD700)',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: [0, 1, 0.5, 1, 0],
                    opacity: [0, 1, 0.5, 1, 0],
                  }}
                  transition={{ duration: 0.3, delay: i * 0.05, repeat: 2 }}
                />
              ))}
            </motion.div>
          )}

          {/* Grass */}
          {moveType === 'grass' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1"
                  style={{
                    height: 20 + Math.random() * 20,
                    background: `linear-gradient(to top, #32CD32, #90EE90)`,
                    transformOrigin: 'center bottom',
                    rotate: `${(i - 6) * 12}deg`,
                    y: 30,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (i - 6) * 8],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                />
              ))}
            </motion.div>
          )}

          {/* Ice */}
          {moveType === 'ice' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2"
                  style={{
                    backgroundColor: '#E0FFFF',
                    borderRadius: i % 2 === 0 ? '50%' : '2px',
                    boxShadow: '0 0 6px #00FFFF',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 0.628) * 60 * direction],
                    y: [0, -40 - Math.random() * 40],
                    opacity: [0, 1, 0],
                    rotate: [0, 180],
                  }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                />
              ))}
            </motion.div>
          )}

          {/* Psychic */}
          {moveType === 'psychic' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 40 + i * 30,
                    height: 40 + i * 30,
                    border: `3px solid #FF69B4`,
                    boxShadow: '0 0 20px #FF69B480',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                    rotate: [0, 180],
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          )}

          {/* Ghost */}
          {moveType === 'ghost' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#7B68EE',
                    borderRadius: '50%',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px #7B68EE',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 80],
                    y: [0, -40 - Math.random() * 40],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              ))}
              <motion.div
                className="absolute"
                style={{
                  width: 60,
                  height: 60,
                  border: '2px solid #7B68EE',
                  borderRadius: '50% 50% 0 0',
                  opacity: 0.3,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}

          {/* Dragon */}
          {moveType === 'dragon' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1"
                  style={{
                    height: 10 + Math.random() * 30,
                    background: `linear-gradient(to top, #6A0DAD, #FF4500)`,
                    transformOrigin: 'center bottom',
                    rotate: `${i * 30}deg`,
                    filter: 'blur(1px)',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                />
              ))}
              <motion.div
                className="absolute w-16 h-16"
                style={{
                  border: '3px solid #FF4500',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px #6A0DAD',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          )}

          {/* Default / Normal - Impact stars */}
          {(!moveType || moveType === 'normal') && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    rotate: '45deg',
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(i * 1.257) * 50,
                    y: Math.sin(i * 1.257) * 50,
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Fighting */}
          {moveType === 'fighting' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute"
                style={{
                  width: 40,
                  height: 40,
                  border: '4px solid #CD5C5C',
                  borderRadius: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: [0, 40 * direction, 0],
                  y: [0, 0],
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 0.3 }}
              />
              {/* Impact lines */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-0.5 bg-red-400"
                  style={{ rotate: `${i * 45}deg` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 2, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              ))}
            </motion.div>
          )}

          {/* Ground */}
          {moveType === 'ground' && (
            <motion.div className="absolute inset-0 flex items-end justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 4 + Math.random() * 4,
                    height: 4 + Math.random() * 4,
                    backgroundColor: '#8B7355',
                    borderRadius: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, (i - 4) * 15],
                    y: [0, -20 - Math.random() * 30],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                />
              ))}
            </motion.div>
          )}

          {/* Poison */}
          {moveType === 'poison' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: '#9932CC',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 8px #9932CC',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 0.785) * 50],
                    y: [0, -30],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}
              <motion.div
                className="absolute w-16 h-16 rounded-full"
                style={{ backgroundColor: '#9932CC40' }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          )}

          {/* Flying */}
          {moveType === 'flying' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 4,
                    height: 20 + Math.random() * 20,
                    backgroundColor: '#87CEEB',
                    borderRadius: '2px',
                    transformOrigin: 'center bottom',
                    rotate: `${(i - 3) * 20}deg`,
                    opacity: 0.4,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: [0, 1, 0],
                    y: [0, -30],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}
              <motion.div
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: [0, 40 * direction],
                  y: [0, -40],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 0.4 }}
              >
                💨
              </motion.div>
            </motion.div>
          )}

          {/* Bug */}
          {moveType === 'bug' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 3,
                    height: 3 + Math.random() * 4,
                    backgroundColor: '#9ACD32',
                    borderRadius: '50%',
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 1.047) * 30],
                    y: [0, -20 + Math.sin(i * 1.047) * 20],
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                />
              ))}
            </motion.div>
          )}

          {/* Rock */}
          {moveType === 'rock' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 8 + Math.random() * 12,
                    height: 8 + Math.random() * 12,
                    backgroundColor: '#8B7355',
                    borderRadius: '3px',
                    rotate: `${Math.random() * 90}deg`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: [(i - 2) * 30, (i - 2) * 50 * direction],
                    y: [0, -20 - Math.random() * 20],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180],
                  }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                />
              ))}
            </motion.div>
          )}

          {/* Dark */}
          {moveType === 'dark' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #2F2F2F, transparent)',
                  boxShadow: '0 0 40px #2F2F2F80',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.6 }}
              />
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 2,
                    height: 20 + Math.random() * 20,
                    backgroundColor: '#2F2F2F',
                    rotate: `${i * 45 + 22.5}deg`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Steel */}
          {moveType === 'steel' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute"
                style={{
                  width: 50,
                  height: 50,
                  border: '4px solid #C0C0C0',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px #C0C0C080',
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.3, 0],
                  rotate: [0, 45, 90],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 0.5 }}
              />
              {/* Sparks */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(i * 1.571) * 40,
                    y: Math.sin(i * 1.571) * 40,
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
              ))}
            </motion.div>
          )}

          {/* Fairy */}
          {moveType === 'fairy' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 4 + Math.random() * 4,
                    height: 4 + Math.random() * 4,
                    backgroundColor: ['#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB'][i % 4],
                    borderRadius: '50%',
                    boxShadow: '0 0 8px #FFB6C1',
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 0.785) * 50],
                    y: [0, -30 + Math.sin(i * 0.785) * 20],
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 0.7, delay: i * 0.04 }}
                />
              ))}
              <motion.div
                className="absolute"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #FFB6C1, transparent)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
