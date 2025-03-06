"use client"

import { CaseHero } from '@/components/cases/CaseHero';
import { CaseStudy } from '@/types/case-study';
import MediaGallery from '@/components/gallery/MediaGallery';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface CaseStudyContentProps {
  caseStudy: CaseStudy;
}

export function CaseStudyContent({ caseStudy }: CaseStudyContentProps) {
  // Determinar la primera imagen para usar como hero
  const heroImage = caseStudy.mediaItems && caseStudy.mediaItems.length > 0
    ? caseStudy.mediaItems.find(item => item.type === 'image')?.url || '/projects/quantum.svg'
    : '/projects/quantum.svg';

  return (
    <div className="min-h-screen bg-black">
      <CaseHero
        title={caseStudy.title}
        category={caseStudy.client} // Usamos el cliente como categoría
        description={caseStudy.description}
        image={heroImage}
        color="#00ff00" // Color estándar para todos
      />
      
      <div className="w-full px-6 py-24">
        {/* Project Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-[2000px] mx-auto"
        >
          <div className="space-y-4">
            <h3 className="text-white/60 font-mono uppercase text-sm tracking-wider">Cliente</h3>
            <p className="text-white">{caseStudy.client}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white/60 font-mono uppercase text-sm tracking-wider">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags?.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-white rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Descripción detallada */}
        {caseStudy.description2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 max-w-[2000px] mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Descripción
            </h2>
            <div className="text-white/80 text-lg leading-relaxed space-y-4">
              {caseStudy.description2.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Galería de imágenes */}
        {caseStudy.mediaItems && caseStudy.mediaItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-12" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              Galería
            </h2>
            <MediaGallery mediaItems={caseStudy.mediaItems} />
          </motion.div>
        )}
      </div>

      {/* Navegación a otros proyectos */}
      <div className="border-t border-white/10 py-12">
        <div className="w-full px-6 max-w-[2000px] mx-auto">
          <div className="flex justify-between items-center">
            <Link 
              href="/cases"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <span className="text-[#00ff00] transform transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Ver todos los proyectos
            </Link>
            <Link 
              href="/admin/case-studies/new"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
            >
              Crear nuevo proyecto
              <span className="text-[#00ff00] transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
