import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/case-studies/service';
import { CaseStudyContent } from '@/components/case-study/CaseStudyContent';

// Componente para mostrar durante la carga
function LoadingCaseStudy() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-screen bg-gradient-to-b from-black/20 to-black/90 flex items-center justify-center">
        <div className="animate-pulse space-y-6 text-center">
          <div className="h-12 bg-white/10 w-40 mx-auto rounded"></div>
          <div className="h-24 bg-white/10 w-96 mx-auto rounded"></div>
          <div className="h-6 bg-white/10 w-64 mx-auto rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Esto permite generar las páginas estáticas en build time
export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();
  return caseStudies
    .filter(study => study.status === 'published')
    .map(study => ({
      slug: study.slug,
    }));
}

export default async function CaseStudyPage(
  { params }: { params: { slug: string } }
) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy || caseStudy.status !== 'published') {
    return notFound();
  }

  return (
    <Suspense fallback={<LoadingCaseStudy />}>
      <CaseStudyContent caseStudy={caseStudy} />
    </Suspense>
  );
}
