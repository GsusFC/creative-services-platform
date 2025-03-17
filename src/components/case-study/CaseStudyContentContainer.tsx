'use client';

import { CaseStudy } from '@/types/case-study';
import { useCaseStudyContent } from '@/hooks/useCaseStudyContent';
import CaseStudyContent from './CaseStudyContent';

interface CaseStudyContentContainerProps {
  caseStudy: CaseStudy;
}

const CaseStudyContentContainer = ({ caseStudy }: CaseStudyContentContainerProps): React.ReactNode => {
  // Utilizamos el hook para obtener la lógica de filtrado y animaciones
  const { mediaFilters, animationSettings } = useCaseStudyContent(caseStudy);
  
  return (
    <CaseStudyContent 
      caseStudy={caseStudy}
      mediaFilters={mediaFilters}
      animationSettings={animationSettings}
    />
  );
};

export default CaseStudyContentContainer;
