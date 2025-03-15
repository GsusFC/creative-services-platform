'use client';

import { useMemo } from 'react';
import { CaseStudy, MediaItem } from '@/types/case-study';
import { TargetAndTransition, Transition } from 'framer-motion';

export type MediaFilters = {
  heroImage: string;
  heroVideo: MediaItem | undefined;
  galleryImages: MediaItem[];
  videos: MediaItem[];
};

export type AnimationSettings = {
  titleAnimation: {
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
  };
  galleryAnimation: {
    initial: TargetAndTransition;
    whileInView: TargetAndTransition;
    transition: Transition;
  };
};

export const useCaseStudyContent = (caseStudy: CaseStudy) => {
  // Filtrar los elementos multimedia para las diferentes secciones
  const mediaFilters = useMemo<MediaFilters>(() => {
    // Determinar la primera imagen para usar como hero
    const heroImage = caseStudy.mediaItems && caseStudy.mediaItems.length > 0
      ? caseStudy.mediaItems.find(item => item.type === 'image')?.url || '/projects/quantum.svg'
      : '/projects/quantum.svg';

    // Encontrar el primer video para usar como hero si existe
    const heroVideo = caseStudy.mediaItems?.find(item => item.type === 'video' && item.order === 1);
    
    // Filtrar las imágenes restantes para la galería principal (excluyendo la primera)
    const galleryImages = caseStudy.mediaItems?.filter(item => 
      item.type === 'image' && item.url !== heroImage
    ) || [];

    // Filtrar videos (excluyendo el hero video si existe)
    const videos = caseStudy.mediaItems?.filter(item => 
      item.type === 'video' && (!heroVideo || item !== heroVideo)
    ) || [];

    return {
      heroImage,
      heroVideo,
      galleryImages,
      videos
    };
  }, [caseStudy]);

  // Configuraciones de animación
  const animationSettings = useMemo<AnimationSettings>(() => {
    return {
      titleAnimation: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8 }
      },
      contentAnimation: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.2 }
      },
      scrollIndicatorAnimation: {
        initial: { opacity: 0 },
        animate: { y: [0, 10, 0] },
        transition: { repeat: Infinity, duration: 2 }
      },
      galleryAnimation: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
      }
    };
  }, []);

  return {
    mediaFilters,
    animationSettings
  };
};
