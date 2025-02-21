'use client'

import { motion } from 'framer-motion'

interface TooltipProps {
  text: string
  x: number
  y: number
}

export function Tooltip({ text, x, y }: TooltipProps) {
  return (
    <motion.div
      className="absolute bg-black text-[#00FF00] border border-[#00FF00] text-black px-2 py-1 text-sm"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {text}
    </motion.div>
  )
}
