'use client';

import { useMemo } from 'react';
import { TargetAndTransition, Transition } from 'framer-motion';

export interface AnimationSettings {
  titleAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  leftColumnAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  rightColumnAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
}

export const usePricing = () => {
  // Configuraciones de animación
  const animationSettings = useMemo<AnimationSettings>(() => {
    return {
      titleAnimation: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }
      },
      leftColumnAnimation: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8 }
      },
      rightColumnAnimation: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8 }
      }
    };
  }, []);

  return {
    animationSettings
  };
};
