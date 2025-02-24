'use client'

import { useState, useEffect } from 'react'
import { getPricePerCredit, getCurrency, getDiscountForCredits } from '@/lib/pricing'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const creditOptions = [40, 80, 120, 160, 200]

interface Feature {
  title: string
  included: boolean
}

const features: Feature[] = [
  { title: 'ACCESS TO ALL CREATIVE SERVICES', included: true },
  { title: 'DEDICATED CREATIVE TEAM', included: true },
  { title: 'PROJECT MANAGEMENT TEAM', included: true },
  { title: 'MULTIPLE BRANDS', included: true },
  { title: 'TEAM MEMBERS', included: true },
  { title: 'REVISION ROUNDS', included: true },
  { title: 'BASIC SUPPORT', included: true },
]

export function PricingCards() {
  const [mounted, setMounted] = useState(false)
  const [selectedCredits, setSelectedCredits] = useState(120)
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

  const creditDiscount = getDiscountForCredits(selectedCredits)
  const creditOriginalPrice = selectedCredits * pricePerCredit
  const creditDiscountedPrice = creditOriginalPrice * (1 - creditDiscount / 100)

  return (
    <div className="h-full">
      {/* Módulo de Créditos Personalizados */}
      <div className="h-full">
        <div className="h-full bg-black border border-white/20 hover:border-white/40 p-8 relative group transition-all duration-300">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="text-center mb-10">
            <div 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 leading-none text-white"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              {currency.symbol}{creditDiscountedPrice.toLocaleString(currency.locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span className="text-base sm:text-lg font-normal text-white/50 ml-1 sm:ml-2 tracking-normal">/month</span>
            </div>
            <div 
              className="text-white text-sm uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {selectedCredits} CREDITS PER MONTH
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mb-12 px-2">
            {creditOptions.map((credits) => (
              <motion.button
                key={credits}
                onClick={() => setSelectedCredits(credits)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  py-2 text-sm font-mono transition-all duration-300 cursor-pointer hover:cursor-pointer
                  ${
                    selectedCredits === credits
                      ? 'bg-[#00ff00] text-black border-[#00ff00]'
                      : 'border-2 border-white/40 text-white hover:border-white hover:bg-white/5'
                  }
                `}
              >
                {credits}
              </motion.button>
            ))}
          </div>

          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title} 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1
                }}
              >
                <svg
                  className="w-4 h-4 text-white mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span 
                  className="text-white text-sm tracking-tight"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-base rounded-none bg-white hover:bg-white/90 text-black transition-all duration-300 tracking-wide uppercase"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            GET STARTED
          </Button>

          <p 
            className="text-center text-xs text-white/50 mt-4 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            NO COMMITMENT REQUIRED
          </p>
        </div>
      </div>
    </div>
  )
}
