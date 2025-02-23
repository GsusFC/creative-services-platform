'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { getPricePerCredit, getCurrency, getDiscountForCredits } from '@/lib/pricing'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

type Complexity = 'low' | 'medium' | 'high'

interface ServiceType {
  name: string
  complexity: Complexity
  creditsPerHour: number
  examples: string[]
  color: string
  hoverColor: string
}

const COLORS = {
  low: { bg: 'rgb(255, 0, 0)', hover: 'rgb(255, 51, 51)' },
  medium: { bg: 'rgb(0, 255, 0)', hover: 'rgb(51, 255, 51)' },
  high: { bg: 'rgb(0, 0, 255)', hover: 'rgb(51, 51, 255)' }
} as const

const serviceTypeDetails = {
  low: {
    description: 'Simple design tasks with clear requirements and minimal iterations. Perfect for quick turnarounds and straightforward projects.',
    timeline: '1-3 days',
    iterations: '2 rounds of revisions',
  },
  medium: {
    description: 'More complex projects requiring strategic thinking and multiple design elements. Ideal for establishing brand consistency.',
    timeline: '3-7 days',
    iterations: '3 rounds of revisions',
  },
  high: {
    description: 'Comprehensive design projects involving multiple stakeholders and complex requirements. Best for full-scale branding and design systems.',
    timeline: '7-14 days',
    iterations: 'Unlimited revisions',
  },
} as const

const serviceTypes: ServiceType[] = [
  {
    name: 'LOW COMPLEXITY',
    complexity: 'low',
    creditsPerHour: 1,
    examples: [
      'UI DESIGN',
      'PRESENTATIONS',
      'GRAPHIC PIECES',
      'BRAND ADAPTATIONS'
    ],
    color: COLORS.low.bg,
    hoverColor: COLORS.low.hover,
  },
  {
    name: 'MEDIUM COMPLEXITY',
    complexity: 'medium',
    creditsPerHour: 1.25,
    examples: [
      'ART DIRECTION',
      'DESIGN SYSTEMS',
      'MOTION DESIGN',
      'USER FLOWS'
    ],
    color: COLORS.medium.bg,
    hoverColor: COLORS.medium.hover,
  },
  {
    name: 'HIGH COMPLEXITY',
    complexity: 'high',
    creditsPerHour: 1.5,
    examples: [
      'FULL BRANDING',
      'WEB DESIGN',
      'APP DESIGN',
      'COMPLEX SYSTEMS'
    ],
    color: COLORS.high.bg,
    hoverColor: COLORS.high.hover,
  }
]

export function CreditCalculator() {
  const [mounted, setMounted] = useState(false)
  const [selectedType, setSelectedType] = useState<ServiceType>(serviceTypes[0])
  const [hours, setHours] = useState(10)
  const [pricePerCredit, setPricePerCredit] = useState(getPricePerCredit())
  const [currency, setCurrency] = useState(getCurrency())
  const [isHovering, setIsHovering] = useState(false)


  useEffect(() => {
    setMounted(true)
    setPricePerCredit(getPricePerCredit())
    setCurrency(getCurrency())
  }, [])

  const resetCalculator = () => {
    setHours(10)
    setSelectedType(serviceTypes[0])
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const details = serviceTypeDetails[selectedType.complexity]
    
    doc.setFontSize(16)
    doc.text("Creative Services Estimate", 20, 20)
    
    doc.setFontSize(12)
    doc.text([
      `Service: ${selectedType.name}`,
      `Complexity: ${selectedType.complexity.toUpperCase()}`,
      `Estimated Hours: ${hours}`,
      `Credits per Hour: ${selectedType.creditsPerHour}`,
      `Timeline: ${details.timeline}`,
      `Iterations: ${details.iterations}`,
      `Total Credits: ${totalCredits}`,
      `Estimated Price: ${currency}${(totalCredits * pricePerCredit).toFixed(2)}`,
    ], 20, 40)

    doc.save("creative-services-estimate.pdf")
  }

  const totalCredits = useMemo(() => {
    // Calculamos los créditos multiplicando las horas por el factor de complejidad
    const rawCredits = hours * selectedType.creditsPerHour;
    // Redondeamos al alza para asegurar que siempre tengamos un número entero de créditos
    return Math.ceil(rawCredits);
  }, [hours, selectedType.creditsPerHour]);

  const finalPrice = useMemo(() => {
    // Calculamos el precio base multiplicando los créditos totales por el precio por crédito
    const basePrice = totalCredits * pricePerCredit;
    // Aplicamos el descuento por volumen si corresponde
    const discount = getDiscountForCredits(totalCredits) / 100;
    // Calculamos el precio final aplicando el descuento
    return Math.round(basePrice * (1 - discount));
  }, [totalCredits, pricePerCredit])

  const handleTypeSelect = (type: ServiceType) => {
    setSelectedType(type)
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Number(e.target.value);
    if (!isNaN(newHours) && newHours >= 1 && newHours <= 100) {
      setHours(newHours);
    }
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
                <Tooltip key={type.complexity}>
                  <TooltipTrigger asChild>
                    <motion.button
                        onClick={() => handleTypeSelect(type)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTypeSelect(type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 text-left transition-colors duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-white/50 relative"
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
                          {type.creditsPerHour} CREDITS/HOUR
                        </div>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      align="center"
                      accentColor={type.color}
                    >
                      <div className="max-w-xs space-y-2">
                        <p className="text-white font-medium">{serviceTypeDetails[type.complexity].description}</p>
                        <div className="text-white/60 space-y-1">
                          <p>⏳ {serviceTypeDetails[type.complexity].timeline}</p>
                          <p>↻ {serviceTypeDetails[type.complexity].iterations}</p>
                          <p className="text-white font-medium mt-2">
                            {type.creditsPerHour} CREDITS PER HOUR
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                </Tooltip>
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
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full h-2 appearance-none cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/50 relative"
                style={{
                  background: `linear-gradient(to right, ${selectedType.color} 0%, ${selectedType.color} ${(hours / 100) * 100}%, rgb(51,51,51) ${(hours / 100) * 100}%, rgb(51,51,51) 100%)`
                }}
                aria-valuemin={1}
                aria-valuemax={100}
                aria-valuenow={hours}
                aria-label="Select estimated hours"
              />
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black border border-white/20 px-2 py-1 text-xs text-white/80"
                    style={{
                      fontFamily: 'var(--font-geist-mono)',
                      left: `${(hours / 100) * 100}%`,
                      transform: `translateX(-${(hours / 100) * 100}%)`
                    }}
                  >
                    {hours} HOURS
                  </motion.div>
                )}
              </AnimatePresence>
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
                <div style={{ color: selectedType.color }}>
                  {totalCredits}
                  <span className="text-lg md:text-xl lg:text-2xl ml-2">CREDITS</span>
                </div>
                {hours < 5 && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    Mínimo recomendado: 5 horas
                  </p>
                )}
              </motion.div>
              <motion.div 
                className="text-sm md:text-base uppercase"
                style={{ 
                  fontFamily: 'var(--font-geist-mono)',
                  color: selectedType.color 
                }}
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

              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  onClick={resetCalculator}
                  className="px-4 py-2 text-sm uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-geist-mono)',
                    color: selectedType.color,
                    border: `1px solid ${selectedType.color}`,
                    backgroundColor: selectedType.color + '10'
                  }}
                  whileHover={{ 
                    backgroundColor: selectedType.color + '20',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
                
                <motion.button
                  onClick={exportToPDF}
                  className="px-4 py-2 text-sm text-black uppercase tracking-wider"
                  style={{ 
                    backgroundColor: selectedType.color,
                    fontFamily: 'var(--font-geist-mono)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export PDF
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
