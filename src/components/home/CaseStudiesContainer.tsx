'use client';

import { useCaseStudies } from '@/hooks/useCaseStudies';
import { CaseStudies } from './CaseStudies';

const CaseStudiesContainer = () => {
  // Utilizamos el hook para obtener los datos, animaciones y referencias
  const {
    containerRef,
    scrollAnimations,
    animationSettings,
    featuredCases,
    isLoading
  } = useCaseStudies();
  
  return (
    <CaseStudies 
      containerRef={containerRef}
      scrollAnimations={scrollAnimations}
      animationSettings={animationSettings}
      featuredCases={featuredCases}
      isLoading={isLoading}
    />
  );
};

export default CaseStudiesContainer;
