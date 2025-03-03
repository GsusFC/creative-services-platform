'use client';

import React from 'react';
import HeroSection from './HeroSection';
import MainInfoSection from './MainInfoSection';
import GallerySection from './GallerySection';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';

interface CaseStudyLandingLayoutProps {
  data: CaseStudyDataV4;
}

export const CaseStudyLandingLayout: React.FC<CaseStudyLandingLayoutProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Sección HERO */}
      <HeroSection imageUrl={data.hero_image} />
      
      {/* Sección MAIN_INFO - Estructura a dos columnas */}
      <MainInfoSection 
        projectName={data.project_name}
        tagline={data.tagline}
        description={data.description}
        services={data.services}
      />
      
      {/* Sección GALLERY - Listado de imágenes en formato 16:9 */}
      {data.gallery && data.gallery.length > 0 && (
        <GallerySection images={data.gallery} />
      )}
      
      {/* Footer simple */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6">
          <p className="text-white/50 text-xs font-geist-mono">
            Case Study generado desde Notion usando Field Mapper V4
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudyLandingLayout;
