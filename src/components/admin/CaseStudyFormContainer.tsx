'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CaseStudyForm from './CaseStudyForm';
import { useCaseStudy } from '@/hooks/useCaseStudy';
import { CaseStudy } from '@/types/case-study';

interface CaseStudyFormContainerProps {
  caseStudyId?: string;
  slug?: string;
  initialData?: CaseStudy;
  onSubmit?: (data: Omit<CaseStudy, 'id'>) => Promise<void>;
  isSubmitting?: boolean;
}

const CaseStudyFormContainer: React.FC<CaseStudyFormContainerProps> = ({ 
  // Prefijamos con _ para indicar que no se usa por ahora
  // pero mantenemos el parámetro para futura implementación
  caseStudyId: _caseStudyId,
  slug,
  initialData,
  onSubmit: externalSubmitHandler,
  isSubmitting: externalSubmitting
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    caseStudy,
    loading,
    error,
    loadCaseStudyBySlug,
    createCaseStudy,
    updateCaseStudy
  } = useCaseStudy();
  
  // Cargar el estudio de caso si tenemos un slug o ID y no nos han pasado datos iniciales
  useEffect(() => {
    const loadCaseStudy = async () => {
      if (slug && !initialData) {
        await loadCaseStudyBySlug(slug);
      }
      // Aquí se podría agregar lógica para cargar por ID si es necesario
    };
    
    loadCaseStudy();
  }, [slug, loadCaseStudyBySlug, initialData]);
  
  // Mostrar mensajes de error del hook
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  const handleSubmit = async (data: Omit<CaseStudy, 'id'>) => {
    try {
      setErrorMessage(null);
      
      // Si tenemos un manejador externo, lo usamos
      if (externalSubmitHandler) {
        await externalSubmitHandler(data);
        return;
      }
      
      // Lógica interna para cuando no hay manejador externo
      if (caseStudy?.id) {
        // Actualizar estudio existente
        await updateCaseStudy({
          id: caseStudy.id,
          ...data
        });
      } else {
        // Crear nuevo estudio
        await createCaseStudy(data);
      }
      
      setSuccessMessage('¡Caso de estudio guardado con éxito!');
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push('/admin/case-studies');
      }, 2000);
      
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar el estudio de caso');
    }
  };
  
  return (
    <div className="admin-container">
      {errorMessage && (
        <div className="bg-black/30 border border-red-500/30 text-red-400 p-4 rounded mb-6" role="alert">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-black/30 border border-white/20 text-white p-4 rounded mb-6" role="alert">
          {successMessage}
        </div>
      )}
      
      <CaseStudyForm
        initialData={initialData || caseStudy || {}}
        onSubmit={handleSubmit}
        isSubmitting={externalSubmitting !== undefined ? externalSubmitting : loading}
      />
    </div>
  );
};

export default CaseStudyFormContainer;
