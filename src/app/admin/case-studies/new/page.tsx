'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CaseStudyFormContainer from '@/components/admin/CaseStudyFormContainer'
import { CaseStudy } from '@/types/case-study'

export default function NewCaseStudyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Omit<CaseStudy, 'id'>) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const response = await fetch('/api/cms/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el case study')
      }
      
      // Redireccionar a la lista de case studies después de crear
      router.push('/admin/case-studies')
      router.refresh() // Refrescar la página para mostrar los datos actualizados
    } catch (err) {
      console.error('Error al crear el case study:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-page min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Nuevo Case Study</h1>
          <p className="text-white/60 text-lg">Completa el formulario para crear un nuevo estudio de caso</p>
        </div>
        
        {error && (
          <div className="bg-black/30 border border-red-500/30 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}
        
        <CaseStudyFormContainer
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
