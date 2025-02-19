'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative min-h-[100svh] bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] opacity-30" />

      {/* Background Image */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <Image 
          src="/bg.jpg"
          alt="Background"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-transparent" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[100svh] w-full">
        <div className="h-[100svh] md:h-auto md:pt-[160px] px-[40px]">
          {/* Mobile Layout */}
          <div className="md:hidden h-full flex flex-col justify-between pb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="pt-[120px]"
            >
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm text-[#00ff00] mb-3"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                STRATEGIC DESIGN THAT SHAPES TOMORROW
              </motion.p>
              <h1 
                className="text-[clamp(2rem,6vw,6rem)] text-white leading-[1] tracking-[0.02em] uppercase m-0 whitespace-nowrap" 
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                TRANSFORM BY DESIGN
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                SCROLL
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="h-0.5 w-12 bg-gradient-to-r from-white/60 to-transparent mt-2"
                />
              </div>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <h1 
              className="text-[clamp(2rem,6vw,6rem)] text-white leading-[1] tracking-[0.02em] uppercase m-0 whitespace-nowrap" 
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              TRANSFORM BY DESIGN
            </h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm lg:text-lg text-white/90 mt-4"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              STRATEGIC DESIGN THAT SHAPES TOMORROW
            </motion.p>


          </motion.div>
        </div>
      </div>

      {/* Desktop Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <div 
          className="text-white/60 text-sm"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          SCROLL
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-0.5 h-12 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </div>
  )
}
