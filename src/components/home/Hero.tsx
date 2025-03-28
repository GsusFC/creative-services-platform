'use client';

import { motion, TargetAndTransition, Transition } from 'framer-motion';

interface HeroProps {
  isMobile: boolean;
  showScrollIndicator: boolean;
  backgroundAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  contentAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  scrollIndicatorAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
    lineAnimation: {
      animate: TargetAndTransition;
      transition: Transition;
    };
  };
}

export function Hero({
  isMobile,
  showScrollIndicator,
  backgroundAnimation,
  contentAnimation,
  scrollIndicatorAnimation
}: HeroProps) {
  return (
    <div className="flex flex-col min-h-[100svh] bg-black overflow-hidden w-full">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] opacity-30" />

      {/* Main Content */}
      {/* Removed px-6 md:px-24 */}
      <div className="flex-1 w-full bg-black flex items-center" style={{ marginTop: '120px' }}>
        {/* Removed max-w-[90%] md:max-w-[80%] */}
        <div className="text-left w-full"> {/* Added w-full to ensure it takes available space */}
          {/* Mobile Layout */}
          <div className={isMobile ? "block" : "hidden"}>
            <motion.div
              initial={contentAnimation.initial}
              animate={contentAnimation.animate}
              transition={contentAnimation.transition}
            >
              <p 
                className="text-[#00ff00] text-sm sm:text-base mb-8"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                STRATEGIC DESIGN STUDIO
              </p>
              <h1 
                className="text-white font-bold leading-[0.9] tracking-[0.02em] uppercase whitespace-nowrap" 
                style={{ 
                  fontSize: 'clamp(2rem, 8vw, 4rem)',
                  fontFamily: 'var(--font-druk-text-wide)'
                }}
              >
                CRAFTING TOMORROW&apos;S<br />ICONIC BRANDS
              </h1>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className={!isMobile ? "block" : "hidden"}>
            <motion.div
              initial={contentAnimation.initial}
              animate={contentAnimation.animate}
              transition={contentAnimation.transition}
            >
              <p 
                className="text-[#00ff00] text-lg mb-8"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                STRATEGIC DESIGN STUDIO
              </p>
              <h1 
                className="text-white font-bold leading-[0.9] tracking-[0.02em] uppercase text-[7vw]" 
                style={{ 
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
        initial={backgroundAnimation.initial}
        animate={backgroundAnimation.animate}
        transition={backgroundAnimation.transition}
      >
        <div className="relative w-full aspect-video overflow-hidden">
          <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>

      {/* Desktop Scroll Indicator */}
      {showScrollIndicator && !isMobile && (
        <motion.div
          initial={scrollIndicatorAnimation.initial}
          animate={scrollIndicatorAnimation.animate}
          transition={scrollIndicatorAnimation.transition}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div 
          className="text-white/60 text-sm"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          SCROLL
        </div>
        <motion.div
          animate={scrollIndicatorAnimation.lineAnimation.animate}
          transition={scrollIndicatorAnimation.lineAnimation.transition}
          className="w-0.5 h-12 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
      )}
    </div>
  );
}
