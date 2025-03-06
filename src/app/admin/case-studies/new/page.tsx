'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseStudy } from '@/types/case-study';
import CaseStudyForm from '@/components/admin/CaseStudyForm';
import { createCaseStudy } from '@/lib/case-studies/service';

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (caseStudyData: Omit<CaseStudy, 'id'>) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Asegurar que los campos obligatorios estén presentes
      if (!caseStudyData.title) throw new Error('El título es obligatorio');
      if (!caseStudyData.client) throw new Error('El cliente es obligatorio');
      if (!caseStudyData.description) throw new Error('La descripción corta es obligatoria');
      
      // Generar slug si no existe
      if (!caseStudyData.slug) {
        caseStudyData.slug = caseStudyData.title
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .replace(/-+/g, '-'); // Eliminar guiones duplicados
      }
      
      const newCaseStudy = await createCaseStudy(caseStudyData);
      
      if (!newCaseStudy) {
        throw new Error('Error al crear el caso de estudio');
      }
      
      // Redirigir a la lista de casos de estudio
      router.push('/admin/case-studies');
      router.refresh(); // Actualizar los datos en la página de listado
    } catch (err) {
      console.error('Error creating case study:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Nuevo Case Study</h1>
              <p className="text-gray-400">Crea un nuevo caso de estudio para mostrar en tu portafolio</p>
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
          
          {/* Formulario con validación integrada */}
          <CaseStudyForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
          
          {/* Tips para crear un buen case study */}
          <div className="mt-8 bg-blue-900/20 border border-blue-800/30 p-4 rounded-md">
            <h3 className="font-medium text-blue-300 mb-2">Consejos para un buen case study</h3>
            <ul className="text-blue-200 text-sm space-y-1 ml-4 list-disc">
              <li>Usa un título conciso y descriptivo</li>
              <li>La descripción corta aparecerá en listados, mantenla breve</li>
              <li>La descripción larga puede incluir más detalles sobre el proyecto</li>
              <li>Usa tags relevantes para facilitar la búsqueda</li>
              <li>Las imágenes principales se mostrarán en proporción 16:9</li>
              <li>Para videos, considera usar miniaturas personalizadas</li>
              <li>Utiliza el modo de visualización adecuado para cada tipo de contenido</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
