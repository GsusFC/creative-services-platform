'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPricePerCredit, getCurrency, getDiscountForCredits } from '@/lib/pricing'

type Complexity = 'low' | 'medium' | 'high'

interface ServiceType {
  name: string
  complexity: Complexity
  credits: number
  examples: string[]
  color: string
  hoverColor: string
}

const COLORS = {
  low: { bg: 'rgb(255, 0, 0)', hover: 'rgb(255, 51, 51)' },
  medium: { bg: 'rgb(0, 255, 0)', hover: 'rgb(51, 255, 51)' },
  high: { bg: 'rgb(0, 0, 255)', hover: 'rgb(51, 51, 255)' }
} as const

const serviceTypes: ServiceType[] = [
  {
    name: 'LOW COMPLEXITY',
    complexity: 'low',
    credits: 1,
    examples: [
      'UI DESIGN',
      'PRESENTATIONS',
      'GRAPHIC PIECES',
      'BRAND ADAPTATIONS'
    ],
    color: COLORS.low.bg,
    hoverColor: COLORS.low.hover
  },
  {
    name: 'MEDIUM COMPLEXITY',
    complexity: 'medium',
    credits: 1.25,
    examples: [
      'ART DIRECTION',
      'DESIGN SYSTEMS',
      'MOTION DESIGN',
      'USER FLOWS'
    ],
    color: COLORS.medium.bg,
    hoverColor: COLORS.medium.hover
  },
  {
    name: 'HIGH COMPLEXITY',
    complexity: 'high',
    credits: 1.5,
    examples: [
      'FULL BRANDING',
      'WEB DESIGN',
      'APP DESIGN',
      'COMPLEX SYSTEMS'
    ],
    color: COLORS.high.bg,
    hoverColor: COLORS.high.hover
  }
]

export function CreditCalculator() {
  const [mounted, setMounted] = useState(false)
  const [selectedType, setSelectedType] = useState<ServiceType>(serviceTypes[0])
  const [hours, setHours] = useState(10)
  const [pricePerCredit, setPricePerCredit] = useState(getPricePerCredit())
  const [currency, setCurrency] = useState(getCurrency())

  useEffect(() => {
    setMounted(true)
    setPricePerCredit(getPricePerCredit())
    setCurrency(getCurrency())
  }, [])

  const totalCredits = useMemo(() => (
    Math.ceil(hours * selectedType.credits)
  ), [hours, selectedType.credits])

  const finalPrice = useMemo(() => (
    totalCredits * pricePerCredit * (1 - getDiscountForCredits(totalCredits) / 100)
  ), [totalCredits, pricePerCredit])

  const handleTypeSelect = (type: ServiceType) => {
    setSelectedType(type)
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHours(Number(e.target.value))
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full max-w-3xl mx-auto bg-black border border-white/20 p-4 md:p-10 relative group hover:border-white/40 transition-all duration-300">
        <motion.div 
          className="absolute inset-0 bg-white/5 -z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="grid gap-6 md:gap-8">
          <div role="group" aria-labelledby="service-type-label">
            <label 
              id="service-type-label"
              className="block text-sm text-white mb-3 md:mb-4 uppercase"
            >
              SERVICE TYPE
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceTypes.map((type) => (
                <motion.button
                  key={type.complexity}
                  onClick={() => handleTypeSelect(type)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTypeSelect(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 text-left transition-colors duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{
                    backgroundColor: selectedType.complexity === type.complexity ? type.color : 'transparent',
                    borderColor: selectedType.complexity === type.complexity ? type.color : 'rgb(51,51,51)',
                    color: selectedType.complexity === type.complexity ? 'black' : 'white'
                  }}
                  role="radio"
                  aria-checked={selectedType.complexity === type.complexity}
                  tabIndex={0}
                >
                  <div className="text-base mb-2" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
                    {type.name}
                  </div>
                  <div className="text-sm text-inherit opacity-80" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {type.credits} CREDITS/HOUR
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div 
              className="mt-3 md:mt-4 text-xs text-white/80 uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="block md:inline font-medium mb-1 md:mb-0 md:mr-2">EXAMPLES:</span>
              <span className="block md:inline">{selectedType.examples.join(' • ')}</span>
            </motion.div>
          </div>

          <div className="pt-2 md:pt-4">
            <label 
              htmlFor="hours-input"
              className="block text-sm text-white mb-4 md:mb-6 uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              ESTIMATED HOURS
            </label>
            <div className="px-4">
              <input
                id="hours-input"
                type="range"
                min="1"
                max="100"
                value={hours}
                onChange={handleHoursChange}
                className="w-full h-2 appearance-none cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  background: `linear-gradient(to right, ${selectedType.color} 0%, ${selectedType.color} ${hours}%, rgb(51,51,51) ${hours}%, rgb(51,51,51) 100%)`
                }}

                aria-valuemin={1}
                aria-valuemax={100}
                aria-valuenow={hours}
                aria-label="Select estimated hours"
              />
            </div>
            <motion.div 
              className="text-center text-white mt-4 uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-2xl md:text-3xl font-medium">{hours}</span>
              <span className="text-sm md:text-base ml-2">HOURS</span>
            </motion.div>
          </div>

          <motion.div 
            className="border-2 border-[#333333] p-4 md:p-6 mt-2 md:mt-4"
            whileHover={{ borderColor: selectedType.color }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-sm text-white/80 mb-2 md:mb-3 uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                REQUIRED CREDITS
              </div>
              <motion.div 
                className="text-3xl md:text-4xl lg:text-5xl text-white mb-2 md:mb-3 uppercase" style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                key={totalCredits}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {totalCredits}
                <span className="text-lg md:text-xl lg:text-2xl ml-2 text-white/80">CREDITS</span>
              </motion.div>
              <motion.div 
                className="text-sm md:text-base uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}
                style={{ color: selectedType.color }}
                key={finalPrice}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {currency.symbol}{finalPrice.toLocaleString(currency.locale, { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
