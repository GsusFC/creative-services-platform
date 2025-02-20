'use client'

import { useState, useEffect } from 'react'
import { getPricePerCredit, getCurrency, getDiscountForCredits } from '@/lib/pricing'

interface ServiceType {
  name: string
  complexity: 'low' | 'medium' | 'high'
  credits: number
  examples: string[]
}

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
    ]
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
    ]
  },
  {
    name: 'HIGH COMPLEXITY',
    complexity: 'high',
    credits: 1.5,
    examples: [
      'BRAND STRATEGY',
      'PRODUCT DESIGN',
      'CREATIVE DIRECTION',
      'BRAND ARCHITECTURE'
    ]
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

  if (!mounted) {
    return null
  }

  const totalCredits = Math.ceil(hours * selectedType.credits)

  return (
    <div>

        <div className="h-full max-w-3xl mx-auto bg-black border border-white/20 p-4 md:p-10 relative group hover:border-white/40 transition-all duration-300">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="grid gap-6 md:gap-8">
            <div>
              <label className="block text-sm font-medium text-white mb-3 md:mb-4">
                <span 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >SERVICE TYPE</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceTypes.map((type) => (
                  <button
                    key={type.complexity}
                    onClick={() => setSelectedType(type)}
                    className={`
                      p-4 text-left transition-all duration-300
                      ${
                        selectedType.complexity === type.complexity
                          ? type.complexity === 'low' ? 'bg-[#FF0000] text-black' : type.complexity === 'medium' ? 'bg-[#00FF00] text-black' : 'bg-[#0000FF] text-black'
                          : type.complexity === 'low' ? 'border-2 border-[#333333] text-white hover:border-[#FF0000]' : type.complexity === 'medium' ? 'border-2 border-[#333333] text-white hover:border-[#00FF00]' : 'border-2 border-[#333333] text-white hover:border-[#0000FF]'
                      }
                      active:scale-[0.98] touch-manipulation
                    `}
                  >
                    <div 
                      className="text-base mb-2" 
                      style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                    >
                      {type.name}
                    </div>
                    <div 
                      className="text-sm text-inherit opacity-80"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {type.credits} CREDITS/HOUR
                    </div>
                  </button>
                ))}
              </div>
              <div 
                className="mt-3 md:mt-4 text-xs text-white/80"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <span className="block md:inline font-medium mb-1 md:mb-0 md:mr-2">EXAMPLES:</span>
                <span className="block md:inline">{selectedType.examples.join(' • ')}</span>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <label className="block text-sm font-medium text-white mb-4 md:mb-6">
                <span 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >ESTIMATED HOURS</span>
              </label>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-[#333333] rounded-lg appearance-none cursor-pointer accent-[#00FF00] touch-manipulation"
                  style={{
                    background: `linear-gradient(to right, #00FF00 0%, #00FF00 ${hours}%, #333333 ${hours}%, #333333 100%)`
                  }}
                />
              </div>
              <div 
                className="text-center text-white mt-4"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <span className="text-2xl md:text-3xl font-medium">{hours}</span>
                <span className="text-sm md:text-base ml-2">HOURS</span>
              </div>
            </div>

            <div className="border-2 border-[#333333] p-4 md:p-6 mt-2 md:mt-4">
              <div className="text-center">
                <div className="text-sm text-white/80 mb-2 md:mb-3">
                  <span 
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >REQUIRED CREDITS</span>
                </div>
                <div 
                  className="text-3xl md:text-4xl lg:text-5xl text-white mb-2 md:mb-3"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  {totalCredits}
                  <span className="text-lg md:text-xl lg:text-2xl ml-2 text-white/80">CREDITS</span>
                </div>
                <div 
                  className="text-sm md:text-base text-[#00FF00]"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {currency.symbol}{(totalCredits * pricePerCredit * (1 - getDiscountForCredits(totalCredits) / 100)).toLocaleString(currency.locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
