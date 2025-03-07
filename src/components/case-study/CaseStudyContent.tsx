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

  // Encontrar el primer video para usar como hero si existe
  const heroVideo = caseStudy.mediaItems?.find(item => item.type === 'video' && item.order === 1);
  
  // Filtrar las imágenes restantes para la galería principal (excluyendo la primera)
  const galleryImages = caseStudy.mediaItems?.filter(item => 
    item.type === 'image' && item.url !== heroImage
  );

  // Filtrar videos (excluyendo el hero video si existe)
  const videos = caseStudy.mediaItems?.filter(item => 
    item.type === 'video' && (!heroVideo || item !== heroVideo)
  );

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        {/* Hero media (imagen o video) */}
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video
              src={heroVideo.url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image 
              src={heroImage}
              alt={caseStudy.title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>
        
        {/* Overlay con flecha de scroll down */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
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
      </section>

      {/* Content Section - Fullscreen */}
      <section className="min-h-screen flex items-center w-full">
        <div className="px-16 py-40 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Left column - Title and client */}
            <div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <p className="mb-6 font-mono text-2xl uppercase">
                  {caseStudy.client}
                </p>
                
                <h1 
                  className="text-[50px] font-black uppercase tracking-tight leading-[0.95] mb-8"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  {caseStudy.title}
                </h1>
              </motion.div>
            </div>
            
            {/* Right column - Description and tags */}
            <div className="font-mono text-2xl leading-relaxed">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="mb-6">{caseStudy.description}</p>
                
                {caseStudy.description2?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">{paragraph}</p>
                ))}
                
                {/* Línea divisoria */}
                <div className="border-t border-white/20 my-10 pt-6"></div>
                
                <div className="font-mono text-sm tracking-wider">
                  {caseStudy.tags?.map((tag, index) => (
                    <span key={index}>
                      {tag.toUpperCase()}
                      {index < (caseStudy.tags?.length || 0) - 1 && (
                        <span className="mx-2">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="bg-black w-full pt-0 pb-24">
          <div className="px-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {galleryImages.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos && videos.length > 0 && (
        <section className="bg-black w-full pt-0 pb-24">
          <div className="px-16 w-full">
            <div className="grid grid-cols-1 gap-20">
              {videos.map((video, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative w-full"
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next Projects Navigation */}
      <div className="border-t border-white/10 py-10">
        <div className="px-16 w-full">
          <div className="flex justify-between items-center">
            <Link 
              href="/cases"
              className="font-mono text-sm text-white/60 hover:text-white transition-colors flex items-center"
            >
              <span className="mr-2">←</span> 
              <span>TODOS LOS PROYECTOS</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
