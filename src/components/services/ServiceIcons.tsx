'use client'

import { motion } from 'framer-motion'

interface ServiceIconProps {
  className?: string
  isHovered?: boolean
}

const colors = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff'
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export const BrandStrategyIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <rect
            key={i}
            x={45.467 * i}
            y="0"
            width="45.467"
            height="192"
            fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
          />
        ))}
      </motion.g>
    </motion.svg>
  )
}

export const BrandingIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 88 }).map((_, i) => {
          const row = Math.floor(i / 11)
          const col = i % 11
          return (
            <circle
              key={i}
              cx={62 * col + 31}
              cy={48 * row + 24}
              r="31"
              fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
            />
          )
        })}
      </motion.g>
    </motion.svg>
  )
}

export const DigitalProductIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 88 }).map((_, i) => {
          const row = Math.floor(i / 11)
          const col = i % 11
          return (
            <rect
              key={i}
              x={62 * col}
              y={48 * row}
              width="62"
              height="48"
              fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
            />
          )
        })}
      </motion.g>
    </motion.svg>
  )
}

export const MotionDesignIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x="0"
            y={32 * i}
            width="682"
            height="32"
            fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
          />
        ))}
      </motion.g>
    </motion.svg>
  )
}

export const WebDevelopmentIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 66 }).map((_, i) => {
          const row = Math.floor(i / 11)
          const col = i % 11
          const size = 62
          return (
            <polygon
              key={i}
              points={`${col * size},${row * size} ${col * size + size},${row * size} ${col * size + size/2},${row * size + size}`}
              fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
            />
          )
        })}
      </motion.g>
    </motion.svg>
  )
}

export const UiUxDesignIcon = ({ className = '', isHovered = false }: ServiceIconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 682 192"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.g 
        variants={fadeIn}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : { scale: 1 }}
      >
        {Array.from({ length: 88 }).map((_, i) => {
          const row = Math.floor(i / 11)
          const col = i % 11
          const size = 62
          return (
            <rect
              key={i}
              x={col * size}
              y={row * size}
              width={size}
              height={size}
              fill={i % 3 === 0 ? colors.red : i % 3 === 1 ? colors.green : colors.blue}
            />
          )
        })}
      </motion.g>
    </motion.svg>
  )
}
