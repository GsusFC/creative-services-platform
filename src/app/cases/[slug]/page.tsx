import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProjects } from '@/data/projects';

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = featuredProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-[120px] pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8">{project.title}</h1>
            <p className="text-lg mb-8">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/cases" className="text-[#00ff00] hover:text-white transition-colors">
              ← Back to Cases
            </Link>
          </div>
          <div className="space-y-8">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

