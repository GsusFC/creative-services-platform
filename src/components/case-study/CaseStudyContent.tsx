"use client"

import React, { memo, useCallback } from 'react';
import { CaseStudy, MediaItem } from '@/types/case-study';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { AnimationSettings, MediaFilters } from '@/hooks/useCaseStudyContent';
import { caseStudyConfig } from '@/config/case-study';

export interface CaseStudyContentProps {
  caseStudy: CaseStudy;
  mediaFilters: MediaFilters;
  animationSettings: AnimationSettings;
}

// Componente principal memoizado para evitar renderizaciones innecesarias
const CaseStudyContent = memo<CaseStudyContentProps>(({ 
  caseStudy, 
  mediaFilters, 
  animationSettings 
}) => {
  // Extraer valores de mediaFilters
  const { heroImage, heroVideo, galleryImages, videos } = mediaFilters;
  
  // Extraer configuraciones de animación
  const { titleAnimation, contentAnimation, scrollIndicatorAnimation, galleryAnimation } = animationSettings;

  // Renderizar párrafos de descripción
  const renderParagraphs = useCallback((text?: string) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => (
      <p key={`paragraph-${index}`} className="mb-6">{paragraph}</p>
    ));
  }, []);

  // Renderizar etiquetas de categorías
  const renderTags = useCallback((tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    return tags.map((tag, index) => (
      <span key={`tag-${index}`}>
        {tag.toUpperCase()}
        {index < tags.length - 1 && (
          <span className="mx-2" aria-hidden="true">•</span>
        )}
      </span>
    ));
  }, []);

  // Renderizar un ítem de imagen
  const renderGalleryItem = useCallback((item: MediaItem, index: number, totalItems: number) => {
    const isFirstAndMany = index === 0 && totalItems > 1;
    return (
      <motion.div 
        key={`gallery-${index}`}
        initial={galleryAnimation.initial}
        whileInView={galleryAnimation.whileInView}
        viewport={{ once: true }}
        transition={{ ...galleryAnimation.transition, delay: index * 0.1 }}
        className="relative w-full"
      >
        <div className="aspect-video relative">
          <Image 
            src={item.url || caseStudyConfig.placeholders.fallbackImage}
            alt={item.alt || `${caseStudy.title} - ${caseStudyConfig.placeholders.imageAlt} ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    );
  }, [galleryAnimation, caseStudy.title]);

  // Renderizar un ítem de video
  const renderVideoItem = useCallback((video: MediaItem, index: number) => {
    return (
      <motion.div 
        key={`video-${index}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative w-full"
      >
        {video.videoType === 'vimeo' ? (
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <iframe
              src={video.url}
              title={`${caseStudy.title} - Video ${index + 1}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLIFrameElement;
                target.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'w-full h-full flex items-center justify-center text-white/50';
                errorDiv.textContent = 'Error al cargar el video';
                target.parentElement?.appendChild(errorDiv);
              }}
            />
          </div>
        ) : (
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <video
              src={video.url}
              poster={video.thumbnailUrl}
              controls
              playsInline
              preload="metadata"
              aria-label={`${caseStudy.title} - Video ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'w-full h-full flex items-center justify-center text-white/50';
                errorDiv.textContent = 'Error al cargar el video';
                target.parentElement?.appendChild(errorDiv);
              }}
            />
          </div>
        )}
      </motion.div>
    );
  }, [caseStudy.title]);

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section 
        className="relative w-full h-screen"
        aria-label={caseStudyConfig.a11y.heroSection}
      >
        {/* Hero Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            {...scrollIndicatorAnimation}
            className="flex flex-col items-center text-white/60"
          >
            <div className="w-px h-16 bg-white/20 mb-4"></div>
            <span className="text-sm tracking-widest uppercase">Scroll</span>
          </motion.div>
        </div>
        {/* Hero media (imagen o video) */}
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video
              src={heroVideo.url}
              autoPlay
              loop
              muted
              playsInline
              aria-label={`${caseStudy.title} - Video de portada`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image 
              src={heroImage}
              alt={`${caseStudy.title} - Imagen de portada`}
              fill
              priority
              className="object-cover"
            />
          )}

        </div>
        
        {/* Overlay con flecha de scroll down */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <motion.div
            initial={scrollIndicatorAnimation.initial}
            animate={scrollIndicatorAnimation.animate}
            transition={scrollIndicatorAnimation.transition}
            className="text-white/60"
            aria-label={caseStudyConfig.a11y.scrollIndicator}
            role="img"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Content Section - Fullscreen */}
      <section 
        className="min-h-screen flex items-center w-full" 
        aria-label={caseStudyConfig.a11y.contentSection}
      >
        <div className="px-16 py-40 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Left column - Title and client */}
            <div>
              <motion.div 
                initial={titleAnimation.initial}
                animate={titleAnimation.animate}
                transition={titleAnimation.transition}
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
                initial={contentAnimation.initial}
                animate={contentAnimation.animate}
                transition={contentAnimation.transition}
              >
                {/* Descripción larga */}
                {renderParagraphs(caseStudy.description)}
                
                {/* Línea divisoria */}
                <div className="border-t border-white/20 my-10 pt-6" aria-hidden="true"></div>
                
                {/* Etiquetas/Categorías */}
                <div className="font-mono text-sm tracking-wider">
                  {renderTags(caseStudy.tags)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section 
          className="bg-black w-full pt-0 pb-24"
          aria-label={caseStudyConfig.a11y.gallerySection}
        >
          <div className="w-full">
            <div className="grid grid-cols-1 gap-12">
              {galleryImages
                .filter(item => item.type !== 'avatar')
                .map((item, index) => 
                  renderGalleryItem(item, index, galleryImages.length)
              )}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos && videos.length > 0 && (
        <section 
          className="bg-black w-full pt-0 pb-24"
          aria-label={caseStudyConfig.a11y.videosSection}
        >
          <div className="px-16 w-full">
            <div className="grid grid-cols-1 gap-12">
              {videos.map((video, index) => renderVideoItem(video, index))}
            </div>
          </div>
        </section>
      )}

      {/* Closing Claim Section */}
      {caseStudy.closingClaim && (
        <section className="bg-black w-full py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.p
              className="text-3xl md:text-4xl font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {caseStudy.closingClaim}
            </motion.p>
          </div>
        </section>
      )}

      {/* Next Projects Navigation */}
      <nav 
        className="border-t border-white/10 py-10"
        aria-label={caseStudyConfig.a11y.navigationSection}
      >
        <div className="px-16 w-full">
          <div className="flex justify-between items-center">
            <Link 
              href="/cases"
              className="font-mono text-sm text-white/60 hover:text-white transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1"
              aria-label={caseStudyConfig.navigation.allProjects}
              tabIndex={0}
            >
              <span className="mr-2" aria-hidden="true">←</span> 
              <span>{caseStudyConfig.navigation.allProjects}</span>
            </Link>
            
            {caseStudy.nextProject && (
              <Link 
                href={`/case-study/${caseStudy.nextProject.slug}`}
                className="font-mono text-sm text-white/60 hover:text-white transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1"
                aria-label={`${caseStudyConfig.navigation.nextProject}: ${caseStudy.nextProject.title || ''}`}
                tabIndex={0}
              >
                <span>{caseStudyConfig.navigation.nextProject}</span>
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
});

// Añadimos displayName para mejorar la depuración
CaseStudyContent.displayName = 'CaseStudyContent';

export default CaseStudyContent;
