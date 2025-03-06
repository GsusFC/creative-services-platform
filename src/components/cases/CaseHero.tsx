'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface CaseHeroProps {
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  heroVideo?: string;
}

export function CaseHero({ title, category, description, image, color, heroVideo }: CaseHeroProps) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <div className="absolute inset-0">
          {heroVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={heroVideo}
            />
          ) : (
            <Image
              src={image}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full px-6 pt-32 md:pt-40 pb-24 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p 
              className="text-sm uppercase tracking-wider"
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                color: color 
              }}
            >
              {category}
            </p>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl text-white font-bold"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              {title}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {description}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </>
  );
}
