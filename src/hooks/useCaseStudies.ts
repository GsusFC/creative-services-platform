'use client';

import { useRef, useEffect, useState } from 'react';
import { useCaseStudyManager } from './useCaseStudyManager';
import { useScroll, useTransform, TargetAndTransition, Transition } from 'framer-motion';
import { CaseStudy } from '@/types/case-study';

export interface ScrollAnimations {
  y: ReturnType<typeof useTransform<number, number>>;
  opacity: ReturnType<typeof useTransform<number, number>>;
}

export interface AnimationSettings {
  arrowAnimation: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  };
  headerAnimation: {
    initial: TargetAndTransition;
    whileInView: TargetAndTransition;
    transition?: Transition;
  };
  caseAnimation: {
    initial: TargetAndTransition;
    whileInView: TargetAndTransition;
    transition?: Transition;
  };
}

export const useCaseStudies = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [featuredCases, setFeaturedCases] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Configurar animaciones de scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const scrollAnimations: ScrollAnimations = {
    y: useTransform(scrollYProgress, [0, 1], [100, 0]),
    opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1])
  };

  // Configuraciones de animación
  const animationSettings: AnimationSettings = {
    arrowAnimation: {
      initial: { y: '-100%' },
      animate: { y: '0%' },
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
        repeatType: "loop"
      }
    },
    headerAnimation: {
      initial: { opacity: 0, x: -20 },
      whileInView: { opacity: 1, x: 0 },
    },
    caseAnimation: {
      initial: { opacity: 0, x: -20 },
      whileInView: { opacity: 1, x: 0 },
    }
  };

  // Usar el hook de gestión de estudios
  const { studies, updateStudy } = useCaseStudyManager();

  // Sincronizar con Notion al montar el componente
  useEffect(() => {
    const syncWithNotion = async () => {
      try {
        const response = await fetch('/api/notion');
        if (!response.ok) throw new Error('Error al sincronizar con Notion');
        
        const { studies: notionStudies } = await response.json();
        
        // Actualizar estudios locales con datos de Notion
        notionStudies.forEach((study: any) => {
          updateStudy(study);
        });
      } catch (error) {
        console.error('Error sincronizando con Notion:', error);
      }
    };

    syncWithNotion();
  }, []); // Solo al montar el componente

  // Actualizar los casos destacados cuando cambien los estudios
  useEffect(() => {
    setIsLoading(true);
    const featured = studies
      .filter(cs => cs.status === 'published' && cs.featured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
      .slice(0, 4);
    setFeaturedCases(featured);
    setIsLoading(false);
  }, [studies]);

  return {
    containerRef,
    scrollAnimations,
    animationSettings,
    featuredCases,
    isLoading
  };
};
