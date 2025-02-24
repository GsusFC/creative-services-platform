'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { plans } from '@/lib/plans'
import { getPricePerCredit, getCurrency, getDiscountForCredits } from '@/lib/pricing'

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]) // PRO plan por defecto
  const [pricePerCredit] = useState(getPricePerCredit())
  const [currency] = useState(getCurrency())

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <motion.div
          key={plan.id}
          className={`
            relative h-full bg-black border transition-all duration-300
            ${selectedPlan.id === plan.id ? 'border-[#00ff00]' : 'border-white/20 hover:border-white/40'}
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedPlan(plan)}
        >
          {plan.isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff00] text-black px-3 py-1 text-xs uppercase tracking-wider font-mono">
              Popular
            </div>
          )}
          {plan.isBestValue && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0000ff] text-white px-3 py-1 text-xs uppercase tracking-wider font-mono">
              Best Value
            </div>
          )}

          <div className="p-8">
            <div className="text-center mb-8">
              <h3 
                className="text-2xl text-white mb-2"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                {plan.name}
              </h3>
              <p 
                className="text-white/60 text-sm mb-4"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {plan.description}
              </p>
              <div className="text-3xl text-white mb-2">
                {currency.symbol}{(plan.credits * pricePerCredit * (1 - getDiscountForCredits(plan.credits) / 100)).toLocaleString(currency.locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-base text-white/50 ml-2">/month</span>
              </div>
              <div 
                className="text-[#00ff00] text-sm uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {plan.credits} CREDITS
              </div>
            </div>

            <div className="space-y-4">
              {plan.features.map((feature, index) => (
                <motion.div 
                  key={feature.title} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <svg
                    className={`w-4 h-4 mt-1 flex-shrink-0 ${feature.included ? 'text-[#00ff00]' : 'text-white/20'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feature.included ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    )}
                  </svg>
                  <div>
                    <div 
                      className={`text-sm ${feature.included ? 'text-white' : 'text-white/40'}`}
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {feature.title}
                    </div>
                    {feature.description && (
                      <div 
                        className={`text-xs mt-1 ${feature.included ? 'text-white/60' : 'text-white/20'}`}
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        {feature.description}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              className={`
                w-full mt-8 transition-all duration-300 uppercase tracking-wider
                ${selectedPlan.id === plan.id ? 'bg-[#00ff00] hover:bg-[#00ff00]/90 text-black' : 'bg-white/5 text-white hover:bg-white/10'}
              `}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {selectedPlan.id === plan.id ? 'GET STARTED' : 'SELECT PLAN'}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
