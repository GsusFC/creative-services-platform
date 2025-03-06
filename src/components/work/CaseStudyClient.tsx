"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseStudy } from '@/types/case-study';
import { Suspense } from 'react';
import MediaGallery from '@/components/gallery/MediaGallery';

interface CaseStudyClientProps {
  caseStudy: CaseStudy;
  nextCaseStudy: { slug: string; title: string } | null;
}

export default function CaseStudyClient({ 
  caseStudy, 
  nextCaseStudy 
}: CaseStudyClientProps) {
  // Definir transiciones para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        ease: "easeOut", 
        duration: 0.5 
      }
    }
  };

  return (
    <motion.div 
      className="bg-white min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Header - Full Width */}
      <motion.div 
        className="w-full pt-32 pb-24 px-8" 
        variants={itemVariants}
      >
        <div className="max-w-screen-xl mx-auto">
          <Link 
            href="/work" 
            className="inline-flex items-center text-sm mb-8 hover:underline font-mono"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a proyectos
          </Link>
          
          <h1 className="text-5xl sm:text-6xl font-druk tracking-tight mb-6 uppercase">
            {caseStudy.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 font-mono">
            <span className="mr-6 text-base">{caseStudy.client}</span>
            <div className="flex flex-wrap">
              {caseStudy.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 mr-3 mb-2 bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Descripción a dos columnas */}
      <motion.div 
        className="w-full px-8 mb-24" 
        variants={itemVariants}
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-druk mb-6 uppercase">Sobre el proyecto</h2>
            </div>
            <div>
              <div className="prose prose-lg font-mono">
                <p>{caseStudy.description2}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Galería de media */}
      <motion.div className="w-full px-8 mb-32" variants={itemVariants}>
        <div className="max-w-screen-xl mx-auto">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
            <MediaGallery mediaItems={caseStudy.mediaItems} />
          </Suspense>
        </div>
      </motion.div>
      
      {/* Navegación a siguiente proyecto */}
      {nextCaseStudy && (
        <motion.div 
          className="w-full px-8 border-t border-gray-200 py-16"
          variants={itemVariants}
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-sm text-gray-500 mb-1 font-mono">
                  Siguiente proyecto
                </span>
                <h2 className="text-2xl font-druk uppercase">
                  {nextCaseStudy.title}
                </h2>
              </div>
              <Link 
                href={`/work/${nextCaseStudy.slug}`}
                className="inline-flex items-center bg-black text-white px-8 py-4 hover:bg-gray-800 transition-all font-mono"
              >
                Ver proyecto
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
