'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="flex flex-col min-h-[100svh] bg-black overflow-hidden w-full">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] opacity-30" />

      {/* Main Content */}
      <div className="flex-1 w-full bg-black px-6 flex items-center justify-center">
        <div className="text-center">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p 
                className="text-[#00ff00] text-sm sm:text-base mb-3"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                STRATEGIC DESIGN STUDIO
              </p>
              <h1 
                className="text-white font-bold leading-[0.85] tracking-[0.02em] uppercase whitespace-nowrap" 
                style={{ 
                  fontSize: 'clamp(2rem, 10vw, 5rem)',
                  fontFamily: 'var(--font-druk-text-wide)'
                }}
              >
                DESIGNING THE NEXT<br />BRANDS TOGETHER
              </h1>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p 
                className="text-[#00ff00] text-lg mb-4"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                STRATEGIC DESIGN STUDIO
              </p>
              <h1 
                className="text-white font-bold leading-[0.85] tracking-[0.02em] uppercase whitespace-nowrap" 
                style={{ 
                  fontSize: 'clamp(4rem, 8vw, 10rem)',
                  fontFamily: 'var(--font-druk-text-wide)'
                }}
              >
                DESIGNING THE NEXT<br />BRANDS TOGETHER
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <motion.div
        className="w-full"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="relative w-full aspect-video overflow-hidden">
          <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>

      {/* Desktop Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="hidden md:flex justify-center pb-8"
      >
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>SCROLL</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="7" y="6" width="2" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

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
