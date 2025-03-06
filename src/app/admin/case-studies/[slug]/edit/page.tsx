'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { CaseStudy } from '@/types/case-study';
import CaseStudyForm from '@/components/admin/CaseStudyForm';
import { updateCaseStudy, getCaseStudyBySlug } from '@/lib/case-studies/service';

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        const data = await getCaseStudyBySlug(slug);
        
        if (!data) {
          throw new Error('No se encontró el estudio de caso');
        }
        
        setCaseStudy(data);
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError('Error al cargar el estudio de caso. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchCaseStudy();
    }
  }, [slug]);
  
  const handleSubmit = async (caseStudyData: Omit<CaseStudy, 'id'>) => {
    if (!caseStudy) return;
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Asegurar que los campos obligatorios estén presentes
      if (!caseStudyData.title) throw new Error('El título es obligatorio');
      if (!caseStudyData.client) throw new Error('El cliente es obligatorio');
      if (!caseStudyData.description) throw new Error('La descripción corta es obligatoria');
      
      // Actualizar el case study
      const updatedCaseStudy = await updateCaseStudy(caseStudy.id, {
        ...caseStudyData,
        // Si el slug ha cambiado, asegúrate de que esté formateado correctamente
        slug: caseStudyData.slug !== caseStudy.slug 
          ? caseStudyData.slug
              .toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
          : caseStudyData.slug
      });
      
      if (!updatedCaseStudy) {
        throw new Error('Error al actualizar el estudio de caso');
      }
      
      // Redirigir a la lista de estudios de caso
      router.push('/admin/case-studies');
      router.refresh(); // Actualizar los datos en la página de listado
    } catch (err) {
      console.error('Error updating case study:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Cargando...</h1>
              <p className="text-gray-400">Obteniendo datos del estudio de caso</p>
            </div>
          </div>
          
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/5 rounded-md"></div>
            <div className="h-40 bg-white/5 rounded-md"></div>
            <div className="h-80 bg-white/5 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Error</h1>
            <p className="text-red-400">{error || 'No se pudo cargar el estudio de caso'}</p>
            
            <button
              onClick={() => router.push('/admin/case-studies')}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition"
            >
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Editar Case Study</h1>
              <p className="text-gray-400">Actualiza los detalles del estudio de caso</p>
            </div>
            
            <button
              onClick={() => router.push('/admin/case-studies')}
              className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-900 transition"
            >
              Volver al listado
            </button>
          </div>
          
          {error && (
            <div className="mb-8 bg-red-900/50 border border-red-500 p-4 rounded-md">
              <p className="text-red-200">{error}</p>
            </div>
          )}
          
          <CaseStudyForm 
            initialData={caseStudy} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
