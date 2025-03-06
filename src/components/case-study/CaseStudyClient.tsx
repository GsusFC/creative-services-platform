"use client";

import Link from 'next/link';
import { CaseStudy } from '@/types/case-study';
import MediaGallery from '@/components/gallery/MediaGallery';

interface CaseStudyClientProps {
  caseStudy: CaseStudy;
}

export function CaseStudyClient({ caseStudy }: CaseStudyClientProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        {/* Encabezado */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{caseStudy.title}</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <div>
            <p className="text-xl text-gray-600 mb-2">Cliente: {caseStudy.client}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {caseStudy.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-black text-white text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="text-lg">
            <h2 className="text-2xl font-semibold mb-4">El Proyecto</h2>
            <p className="mb-4">{caseStudy.description}</p>
            <p>{caseStudy.description2}</p>
          </div>
          <div className="text-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestro Enfoque</h2>
            <p className="mb-4">
              Abordamos este proyecto con un análisis detallado de las necesidades del cliente y los usuarios finales.
              Diseñamos una solución que combina usabilidad, estética moderna y rendimiento óptimo.
            </p>
            <p>
              Nuestra metodología se centró en un proceso iterativo, con validación constante por parte del cliente y pruebas de usuario en cada etapa.
            </p>
          </div>
        </div>

        {/* Galería de medios */}
        <MediaGallery mediaItems={caseStudy.mediaItems} />

        {/* Navegación a siguiente proyecto */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <Link 
            href="/work" 
            className="inline-flex items-center text-lg font-medium hover:underline"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </main>
  );
}
