'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <div className="flex flex-col min-h-[100svh] bg-black overflow-hidden w-full">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] opacity-30" />

      {/* Main Content */}
      <div className="flex-1 w-full bg-black">
        <div className="pt-[120px] md:pt-[180px] pb-8 md:pb-12 px-[40px]">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center text-white text-3xl md:text-5xl leading-tight mx-auto"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                TRANSFORM BY DESIGN
              </motion.p>
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

        {/* Video Section */}
        <motion.div 
          className="w-full"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className="relative w-full aspect-video overflow-hidden">
            <video className="w-full h-full object-contain" autoPlay loop muted>
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
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
