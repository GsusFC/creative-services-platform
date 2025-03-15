'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CaseStudyFormContainer from '@/components/admin/CaseStudyFormContainer'
import { CaseStudy } from '@/types/case-study'

interface EditCaseStudyPageProps {
  params: {
    slug: string
  }
}

/**
 * Este componente ignora los parámetros params.slug y usa el URL del navegador
 * como fuente de verdad para obtener el slug del case study.
 * 
 * Esto evita el uso de React.use() y los problemas de Suspense asociados.
 */
export default function EditCaseStudyPage({ params: _params }: EditCaseStudyPageProps) {
  const router = useRouter()
  
  // Obtenemos el slug a partir de la URL en lugar de params
  const [slugValue, setSlugValue] = useState('')
  
  useEffect(() => {
    // Extraer el slug de la URL actual
    const path = window.location.pathname
    const slugMatch = path.match(/\/admin\/case-studies\/([^\/]+)\/edit/)
    if (slugMatch && slugMatch[1]) {
      setSlugValue(slugMatch[1])
    }
  }, [])
  
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del case study
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/cms/case-studies/${slugValue}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('El estudio de caso no existe')
          }
          throw new Error('Error al cargar el estudio de caso')
        }
        
        const data = await response.json()
        setCaseStudy(data)
      } catch (err) {
        console.error('Error al cargar el case study:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    if (slugValue) {
      fetchCaseStudy()
    }
  }, [slugValue])

  const handleSubmit = async (data: Omit<CaseStudy, 'id'>) => {
    if (!caseStudy || !caseStudy.id) {
      setError('No se puede actualizar: falta ID del case study');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Actualizando case study con ID:', caseStudy.id);
      
      // Preparar datos completos
      const dataToUpdate = {
        ...data,
        id: caseStudy.id,
      };
      
      // Usar CaseStudyFormContainer para manejar la actualización
      // y delegar la lógica a través de una promesa directa
      return new Promise<void>((resolve, reject) => {
        fetch('/api/cms/case-studies', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpdate),
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              let errorMsg = `Error de servidor: ${response.status}`;
              try {
                // Intentar parsear el texto como JSON
                const errorData = JSON.parse(text);
                if (errorData && errorData.error) {
                  errorMsg = errorData.error;
                }
              } catch (e) {
                // Si no es JSON, usar el texto tal cual si existe
                if (text) errorMsg = text;
              }
              throw new Error(errorMsg);
            });
          }
          return response.json();
        })
        .then(() => {
          // Éxito - redirigir
          router.push('/admin/case-studies');
          router.refresh();
          resolve();
        })
        .catch(err => {
          console.error('Error completo:', err);
          setError(err instanceof Error ? err.message : 'Error interno al actualizar');
          reject(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
      });
    } catch (err) {
      console.error('Error en preparación de actualización:', err);
      setError(err instanceof Error ? err.message : 'Error interno al preparar actualización');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-page min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera simple */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">
            {caseStudy?.client || 'Case Study'}
          </h1>
          {caseStudy && (
            <p className="text-white/60 text-lg">{caseStudy.title}</p>
          )}
        </div>
        
        {/* Mensajes de error */}
        {error && (
          <div className="bg-black/30 border border-red-500/30 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Contenido principal */}
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="h-64 bg-white/10 rounded"></div>
            <div className="h-96 bg-white/10 rounded"></div>
          </div>
        ) : caseStudy ? (
          <CaseStudyFormContainer
            initialData={caseStudy}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : error ? (
          <div className="text-center py-12 bg-black/30 border border-white/10 rounded-lg">
            <p className="text-xl text-white/80">
              No se pudo cargar el estudio de caso
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
