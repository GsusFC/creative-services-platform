import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    slug: 'nebula',
    title: 'NEBULA AI PLATFORM',
    category: 'DIGITAL PRODUCT',
    description: 'AI platform for predictive analytics',
    image: '/projects/nebula.svg',
    content: 'Detailed description of the Nebula AI Platform project...',
    gallery: [
      '/projects/nebula/1.svg',
      '/projects/nebula/2.svg',
    ],
  },
  {
    slug: 'quantum',
    title: 'QUANTUM FINANCE',
    category: 'BRANDING',
    description: 'Visual identity for next-gen fintech',
    image: '/projects/quantum.svg',
    content: 'Detailed description of the Quantum Finance project...',
    gallery: [
      '/projects/quantum/1.svg',
      '/projects/quantum/2.svg',
    ],
  },
];

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-[120px] pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8">{project.title}</h1>
            <p className="text-lg mb-8">{project.content}</p>
            <Link href="/cases" className="text-primary hover:underline">
              ← Back to Cases
            </Link>
          </div>
          <div className="space-y-8">
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              {project.gallery.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${project.title} - Image ${i + 1}`}
                  width={300}
                  height={200}
                  className=""
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
