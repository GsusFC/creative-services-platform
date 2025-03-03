'use client';

import React from 'react';
import { ArrowDownIcon } from 'lucide-react';

interface HeroSectionProps {
  imageUrl: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ imageUrl }) => {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.8)'
        }}
      ></div>
      
      <div className="relative z-20 h-full flex flex-col justify-end container mx-auto px-6 pb-24">
        <div className="inline-flex items-center gap-2 text-white/70 mb-16 text-sm font-geist-mono">
          <ArrowDownIcon size={16} />
          <span>Desplázate para explorar</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
