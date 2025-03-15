'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, TargetAndTransition, Transition } from 'framer-motion';
import { CaseStudy } from '@/types/case-study';
import { getFeaturedCaseStudies } from '@/lib/case-studies/service';

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

  // Cargar datos de casos destacados
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        const cases = await getFeaturedCaseStudies();
        setFeaturedCases(cases.filter(cs => cs.status === 'published').slice(0, 4));
      } catch (error) {
        console.error('Error al cargar los estudios de caso destacados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  return {
    containerRef,
    scrollAnimations,
    animationSettings,
    featuredCases,
    isLoading
  };
};
