'use client';

import { useState, useCallback } from 'react';
import { logosConfig, Logo } from '@/config/logos';

interface UseLogoSliderReturn {
  logos: Logo[];
  imageConfig: typeof logosConfig.imageConfig;
  animationConfig: typeof logosConfig.animationConfig;
  a11y: typeof logosConfig.a11y;
  labels: typeof logosConfig.labels;
  isPaused: boolean;
  togglePause: () => void;
  getAnimationClass: () => string;
  getAnimationStyle: () => React.CSSProperties;
}

export const useLogoSlider = (): UseLogoSliderReturn => {
  // Estado para controlar manualmente si la animación está pausada
  const [isPaused, setIsPaused] = useState(false);
  
  // Función para alternar el estado de pausa
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Obtener la clase de animación
  const getAnimationClass = useCallback(() => {
    const animationClass = `animate-slide${isPaused ? ' [animation-play-state:paused]' : ''}`;
    const hoverEffect = logosConfig.animationConfig.pauseOnHover ? 'md:hover:[animation-play-state:paused]' : '';
    return `${animationClass} ${hoverEffect}`;
  }, [isPaused]);

  // Obtener el estilo para la velocidad de animación
  const getAnimationStyle = useCallback(() => {
    return {
      '--animation-duration': `${logosConfig.animationConfig.speed}s`,
    } as React.CSSProperties;
  }, []);

  return {
    logos: logosConfig.logosList,
    imageConfig: logosConfig.imageConfig,
    animationConfig: logosConfig.animationConfig,
    a11y: logosConfig.a11y,
    labels: logosConfig.labels,
    isPaused,
    togglePause,
    getAnimationClass,
    getAnimationStyle
  };
};
