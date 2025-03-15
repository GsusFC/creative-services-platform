'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TargetAndTransition, Transition } from 'framer-motion';
import { heroConfig, type HeroConfig } from '@/config/hero';

export interface HeroSettings {
  isMobile: boolean;
  showScrollIndicator: boolean;
  config: HeroConfig;
  autoHideScrollIndicator: boolean;
  scrollThreshold: number;
  autoHideDelay: number;
}

export interface HeroAnimations {
  background: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  content: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  scrollIndicator: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
    lineAnimation: {
      animate: TargetAndTransition;
      transition: Transition;
    };
  };
}

interface UseHeroOptions {
  mobileBreakpoint?: number;
  autoHideScrollIndicator?: boolean;
  scrollThreshold?: number;
  autoHideDelay?: number;
  customConfig?: Partial<HeroConfig>;
  customAnimations?: Partial<HeroAnimations>;
}

export const useHero = (options: UseHeroOptions = {}) => {
  // Configuración con valores por defecto y personalizados
  const {
    mobileBreakpoint = 768,
    autoHideScrollIndicator = true,
    scrollThreshold = 100,
    autoHideDelay = 5000,
    customConfig = {},
    customAnimations = {}
  } = options;
  
  // Estado para determinar si estamos en móvil o desktop
  const [isMobile, setIsMobile] = useState(false);
  
  // Estado para controlar si mostrar el indicador de scroll
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Mezclar configuración por defecto con personalizada
  const config = useMemo(() => {
    return {
      ...heroConfig,
      ...customConfig,
      tagline: {
        ...heroConfig.tagline,
        ...customConfig.tagline
      },
      headline: {
        ...heroConfig.headline,
        ...customConfig.headline
      },
      scroll: {
        ...heroConfig.scroll,
        ...customConfig.scroll
      },
      video: {
        ...heroConfig.video,
        ...customConfig.video
      },
      a11y: {
        ...heroConfig.a11y,
        ...customConfig.a11y
      }
    };
  }, [customConfig]);

  // Función para verificar si estamos en móvil
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < mobileBreakpoint);
  }, [mobileBreakpoint]);

  // Efecto para detectar el tamaño de pantalla
  useEffect(() => {
    // Verificar al inicio
    checkMobile();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkMobile);
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [checkMobile]);

  // Efecto para esconder el indicador de scroll después de cierto tiempo
  useEffect(() => {
    if (!autoHideScrollIndicator) return;
    
    // Función para ocultar el indicador cuando se hace scroll
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setShowScrollIndicator(false);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Configuramos el temporizador para auto ocultar
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, autoHideDelay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [autoHideScrollIndicator, scrollThreshold, autoHideDelay]);

  // Mezclamos las animaciones predeterminadas con las personalizadas
  const animations: HeroAnimations = useMemo(() => {
    // Animaciones predeterminadas para el Hero
    const defaultAnimations: HeroAnimations = {
      background: {
        initial: { scale: 1.1, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 1.5, ease: 'easeOut' }
      },
      content: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.8, delay: 0.2 }
      },
      scrollIndicator: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 1, duration: 0.8 },
        lineAnimation: {
          animate: { y: [0, 8, 0] },
          transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
        }
      }
    };

    return {
      background: {
        ...defaultAnimations.background,
        ...customAnimations.background
      },
      content: {
        ...defaultAnimations.content,
        ...customAnimations.content
      },
      scrollIndicator: {
        ...defaultAnimations.scrollIndicator,
        ...customAnimations.scrollIndicator,
        lineAnimation: {
          ...defaultAnimations.scrollIndicator.lineAnimation,
          ...customAnimations.scrollIndicator?.lineAnimation
        }
      }
    };
  }, [customAnimations]);

  // Devolvemos un objeto con todos los estados, configuraciones y animaciones
  return {
    settings: {
      isMobile,
      showScrollIndicator,
      config,
      autoHideScrollIndicator,
      scrollThreshold,
      autoHideDelay
    },
    animations,
    // Método para controlar manualmente el indicador de scroll
    controls: {
      setShowScrollIndicator
    }
  };
};
