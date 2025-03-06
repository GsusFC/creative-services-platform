import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMockCaseStudyBySlug, getMockCaseStudies } from '@/lib/case-studies/mock-service';
import { CaseStudyClient } from '@/components/case-study/CaseStudyClient';

// Define the types for page parameters
type PageParams = {
  slug: string;
};

type PageProps = {
  params: PageParams;
};

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  // Instead of directly accessing params.slug, use it as an argument to the service function
  const caseStudy = await getMockCaseStudyBySlug(String(params.slug));
  
  if (!caseStudy) {
    return {
      title: 'Caso de estudio no encontrado',
      description: 'El caso de estudio que buscas no existe'
    };
  }

  return {
    title: `${caseStudy.title} | ${caseStudy.client}`,
    description: caseStudy.description,
  };
}

// Generate static params
export async function generateStaticParams() {
  const caseStudies = await getMockCaseStudies();
  
  return caseStudies.map(caseStudy => ({
    slug: caseStudy.slug,
  }));
}

// Page component - use a different approach to handle the params
export default async function Page({ params }: PageProps) {
  // Safely convert params.slug to string and pass directly to the function
  const caseStudy = await getMockCaseStudyBySlug(String(params.slug));
  
  if (!caseStudy) {
    return notFound();
  }

  return <CaseStudyClient caseStudy={caseStudy} />;
}
