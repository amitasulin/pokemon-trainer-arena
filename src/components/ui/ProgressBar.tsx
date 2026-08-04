import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
  color?: string
  label?: string
  showValue?: boolean
  className?: string
}

export default function ProgressBar({ value, max, color = '#4ade80', label, showValue = true, className = '' }: Props) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
          {showValue && (
            <span className="text-xs font-bold text-gray-400">{value}/{max}</span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}60, 0 0 12px ${color}20`,
          }}
        />
      </div>
      {!label && showValue && (
        <div className="text-xs text-gray-400 mt-0.5 font-medium">{value}/{max}</div>
      )}
    </div>
  )
}
