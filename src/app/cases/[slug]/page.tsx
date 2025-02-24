import { notFound } from 'next/navigation';
import { featuredProjects } from '@/data/projects';
import { CaseHero } from '@/components/cases/CaseHero';
import { CaseContent } from '@/components/cases/CaseContent';
import { ProjectNavigation } from '@/components/cases/ProjectNavigation';

export default function CaseStudyPage(
  { params }: { params: { slug: string } & { [key: string]: string } }
) {
  const project = featuredProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <CaseHero
        title={project.title}
        category={project.category}
        description={project.description}
        image={project.image}
        color={project.color}
        heroVideo={project.heroVideo}
      />
      
      <CaseContent project={project} />

      <ProjectNavigation
        previousProject={project.previousProject}
        nextProject={project.nextProject}
      />
    </div>
  );
}
