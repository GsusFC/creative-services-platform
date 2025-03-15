'use client';

import React from 'react';
import { useHero } from '@/hooks/useHero';
import { Hero } from './Hero';

const HeroContainer: React.FC = () => {
  // Utilizamos nuestro hook personalizado para obtener todos los estados y animaciones
  const { settings, animations } = useHero();

  return (
    <Hero 
      isMobile={settings.isMobile}
      showScrollIndicator={settings.showScrollIndicator}
      backgroundAnimation={animations.background}
      contentAnimation={animations.content}
      scrollIndicatorAnimation={animations.scrollIndicator}
    />
  );
};

export default HeroContainer;
