import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMockCaseStudies } from '@/lib/case-studies/mock-service';

export const metadata: Metadata = {
  title: 'Trabajos | Nuestros Proyectos',
  description: 'Explora nuestra colección de casos de estudio y proyectos destacados.',
};

export default async function WorkPage() {
  const caseStudies = await getMockCaseStudies();
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-6xl md:text-8xl font-bold mb-8 md:mb-16">TRABAJOS</h1>
      
      {/* Filtros */}
      <div className="mb-12 flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-black text-white rounded-full">TODOS</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">APPLICATION</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">BRANDING</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">CAMPAIGN</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">DASHBOARD</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">DATA VISUALIZATION</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">ENVIRONMENTAL</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">SCIENTIFIC</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">UI/UX</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">WEB</button>
      </div>
      
      {/* Listado de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {caseStudies.map((caseStudy) => (
          <Link
            href={`/work/${caseStudy.slug}`}
            key={caseStudy.id}
            className="group"
          >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              {caseStudy.mediaItems[0] && (
                <Image
                  src={caseStudy.mediaItems[0].url}
                  alt={caseStudy.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{caseStudy.title}</h2>
              <p className="text-gray-600">{caseStudy.client}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {caseStudy.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
