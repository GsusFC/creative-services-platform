"use client"

import { CaseStudy } from '@/types/case-study';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export interface CaseStudyContentProps {
  caseStudy: CaseStudy;
}

export function CaseStudyContent({ caseStudy }: CaseStudyContentProps) {
  // Determinar la primera imagen para usar como hero
  const heroImage = caseStudy.mediaItems && caseStudy.mediaItems.length > 0
    ? caseStudy.mediaItems.find(item => item.type === 'image')?.url || '/projects/quantum.svg'
    : '/projects/quantum.svg';

  // Encontrar la primera imagen para el caso de estudio
  const firstImage = caseStudy.mediaItems?.find(item => item.type === 'image');
  
  // Filtrar las imágenes restantes para la galería principal (excluyendo la primera)
  const galleryImages = caseStudy.mediaItems?.filter(item => 
    item.type === 'image' && item !== firstImage
  );

  // Filtrar videos
  const videos = caseStudy.mediaItems?.filter(item => item.type === 'video');

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <Image 
            src={heroImage}
            alt={caseStudy.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="container relative z-20 px-6 md:px-10 h-full flex flex-col justify-center items-center pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-tight">
              {caseStudy.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {caseStudy.description}
            </p>
            
            <div className="pt-4">
              <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-sm font-mono rounded-full">
                {caseStudy.client}
              </span>
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-white/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Panel - Sticky */}
      <section className="w-full sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 md:px-10 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-white/60 font-mono text-xs uppercase tracking-wider">Cliente</h3>
              <p className="text-white text-sm font-medium">{caseStudy.client}</p>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-white/60 font-mono text-xs uppercase tracking-wider">Proyecto</h3>
              <p className="text-white text-sm font-medium truncate">{caseStudy.title}</p>
            </div>
            
            <div>
              <h3 className="text-white/60 font-mono text-xs uppercase tracking-wider">Categoría</h3>
              <p className="text-white text-sm font-medium">
                {caseStudy.tags && caseStudy.tags.length > 0 
                  ? caseStudy.tags[0] 
                  : 'Case Study'}
              </p>
            </div>
            
            <div className="flex justify-end items-end">
              <Link 
                href="/cases"
                className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors border-b border-white/0 hover:border-white/60"
              >
                <span className="mr-2">←</span> 
                <span>Todos los proyectos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-10 py-24">
        {/* Project Brief */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-10">Sobre el proyecto</h2>
              
              <div className="text-white/80 text-lg leading-relaxed space-y-6">
                {caseStudy.description2?.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white/5 rounded-xl p-8 sticky top-32">
                <h3 className="text-xl font-bold mb-8">Detalles</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white/60 font-mono text-xs uppercase tracking-wider mb-2">Cliente</h4>
                    <p className="text-white font-medium">{caseStudy.client}</p>
                  </div>
                  
                  {caseStudy.tags && caseStudy.tags.length > 0 && (
                    <div>
                      <h4 className="text-white/60 font-mono text-xs uppercase tracking-wider mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {galleryImages && galleryImages.length > 0 && (
          <section className="mb-32">
            <h2 className="text-3xl font-bold mb-10">Galería</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryImages.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl overflow-hidden ${
                    index === 0 && galleryImages.length > 1 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="aspect-video relative">
                    <Image 
                      src={item.url || ''}
                      alt={item.alt || 'Project image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {item.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4">
                      <p className="text-sm text-white/80">{item.alt}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <section className="mb-32">
            <h2 className="text-3xl font-bold mb-10">Videos</h2>
            
            <div className="grid grid-cols-1 gap-10">
              {videos.map((video, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative rounded-xl overflow-hidden"
                >
                  {video.videoType === 'vimeo' ? (
                    <div className="aspect-video">
                      <iframe
                        src={video.url}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video">
                      <video
                        src={video.url}
                        poster={video.thumbnailUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {video.alt && (
                    <div className="p-4 bg-white/5 rounded-b-xl">
                      <p className="text-sm text-white/80">{video.alt}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Next Project */}
      <div className="border-t border-white/10 py-24">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <h2 className="text-white/60 font-mono text-sm uppercase tracking-wider mb-4">¿Siguiente Proyecto?</h2>
          <Link 
            href="/cases"
            className="text-3xl font-bold hover:text-white/70 transition-colors inline-flex items-center"
          >
            Ver más trabajos 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
