'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CaseStudyForm from '@/components/admin/CaseStudyForm'
import { CaseStudy } from '@/types/case-study'

interface EditCaseStudyPageProps {
  params: {
    slug: string
  }
}

export default function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const router = useRouter()
  // Obtener el slug de manera segura
  const slugValue = params?.slug || '';
  
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
    if (!caseStudy) return
    
    try {
      setIsSubmitting(true)
      setError(null)
      
      const response = await fetch('/api/cms/case-studies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: caseStudy.id, // Incluir el ID para la actualización
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el estudio de caso')
      }
      
      // Redireccionar a la lista después de actualizar
      router.push('/admin/case-studies')
      router.refresh()
    } catch (err) {
      console.error('Error al actualizar el case study:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-page min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Editar Estudio de Caso
            {caseStudy && `: ${caseStudy.title}`}
          </h1>
          <p className="text-gray-400">Actualiza la información del estudio de caso</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="h-64 bg-white/10 rounded"></div>
            <div className="h-96 bg-white/10 rounded"></div>
          </div>
        ) : caseStudy ? (
          <CaseStudyForm
            initialData={caseStudy}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-400 mb-4">
              No se pudo cargar el estudio de caso
            </p>
            <button
              onClick={() => router.push('/admin/case-studies')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white font-medium transition-colors"
            >
              Volver al listado
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
