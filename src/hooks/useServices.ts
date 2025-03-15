'use client';

import { useMemo } from 'react';
import { TargetAndTransition, Transition } from 'framer-motion';

// Definir interfaces
interface ServiceItem {
  title: string;
  image: string;
  description: string;
  items: string[];
}

export interface AnimationSettings {
  titleAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  serviceCardAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  linkAnimation: {
    initial: TargetAndTransition;
    whileInView: TargetAndTransition;
    transition: Transition;
  };
}

export const useServices = () => {
  // Datos de servicios
  const services = useMemo<ServiceItem[]>(() => [
    {
      title: 'STRATEGY',
      image: '/assets/services/STRATEGY.svg',
      description: 'We define your brand positioning and direction',
      items: [
        'Research & Analysis',
        'Brand Strategy',
        'Positioning',
        'Product Roadmap'
      ]
    },
    {
      title: 'BRANDING',
      image: '/assets/services/BRANDING.svg',
      description: 'We create memorable identities and design systems',
      items: [
        'Visual Identity',
        'Design Systems',
        'Brand Guidelines',
        'Brand Applications'
      ]
    },
    {
      title: 'DIGITAL PRODUCT',
      image: '/assets/services/DIGITAL PRODUCT.svg',
      description: 'We design user-centered digital experiences',
      items: [
        'UI/UX Design',
        'Web & Mobile Interfaces',
        'Product Design',
        'Interactive Prototypes'
      ]
    },
    {
      title: 'MOTION',
      image: '/assets/services/MOTION DESGIN.svg',
      description: 'We bring your brand to life through animation',
      items: [
        'Motion Design',
        'Animation Systems',
        'Video Production',
        'Interactive Motion'
      ]
    }
  ], []);

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
      serviceCardAnimation: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }
      },
      linkAnimation: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { delay: 0.5 }
      }
    };
  }, []);

  return {
    services,
    animationSettings
  };
};
