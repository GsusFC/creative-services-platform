'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CaseStudyDataV4 } from '@/lib/case-studies/mapper-utils';
import CaseStudyLandingLayout from '@/components/case-studies/CaseStudyLandingLayout';

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [caseStudy, setCaseStudy] = useState<CaseStudyDataV4 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        setLoading(true);
        
        // En una implementación real, obtendríamos los datos del Case Study de la API
        const response = await fetch(`/api/case-studies/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Error al cargar el Case Study: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCaseStudy(data.caseStudy);
        } else {
          throw new Error(data.message || 'Error desconocido');
        }
        
      } catch (error) {
        console.error('Error al cargar el Case Study:', error);
        setError('No se pudo cargar el Case Study. Usando datos de ejemplo.');
        
        // Usar datos de ejemplo en caso de error
        setCaseStudy({
          hero_image: '/placeholder-hero.jpg',
          project_name: `Case Study: ${slug}`,
          tagline: 'Transformación digital para empresas líderes',
          description: 'Un completo rediseño de experiencia digital para optimizar conversiones y mejorar la experiencia de usuario. Implementamos soluciones centradas en la interacción y usabilidad, mejorando significativamente las métricas de participación y retención de usuarios.',
          services: ['Diseño UX/UI', 'Desarrollo Frontend', 'Optimización SEO', 'Análisis de Datos'],
          gallery: [
            '/placeholder1.jpg',
            '/placeholder2.jpg',
            '/placeholder3.jpg',
            '/placeholder4.jpg'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCaseStudy();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando Case Study...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
        {caseStudy && <CaseStudyLandingLayout data={caseStudy} />}
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>No se encontró el Case Study solicitado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CaseStudyLandingLayout data={caseStudy} />
    </div>
  );
}
