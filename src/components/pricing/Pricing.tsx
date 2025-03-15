'use client'

import { motion } from 'framer-motion'
import { CreditCalculator } from './CreditCalculator'
import { PricingCards } from './PricingCards'
import { AnimationSettings } from '@/hooks/usePricing'

export interface PricingProps {
  animationSettings: AnimationSettings;
}

export function Pricing({ animationSettings }: PricingProps) {
  const { titleAnimation, leftColumnAnimation, rightColumnAnimation } = animationSettings;
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <div className="w-full max-w-[1600px] px-8 mx-auto">
        <motion.div 
          initial={titleAnimation.initial}
          animate={titleAnimation.animate}
          transition={titleAnimation.transition}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            PRICING
          </h2>
          <p 
            className="text-base md:text-lg text-white max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            FLEXIBLE PLANS AND CREDIT CALCULATOR
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 h-full">
          <motion.div
            initial={leftColumnAnimation.initial}
            animate={leftColumnAnimation.animate}
            transition={leftColumnAnimation.transition}
            className="h-full"
          >
            <PricingCards />
          </motion.div>

          <motion.div
            initial={rightColumnAnimation.initial}
            animate={rightColumnAnimation.animate}
            transition={rightColumnAnimation.transition}
            className="h-full"
          >
            <CreditCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
