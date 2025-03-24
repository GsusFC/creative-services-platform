'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCaseStudyAction } from '@/app/actions'
import { CaseStudy } from '@/types/case-study'
import EditCaseStudyForm from './EditCaseStudyForm'
import { ArrowLeftIcon } from 'lucide-react'

interface EditCaseStudyPageProps {
  id: string
}

export default function EditCaseStudyPage({ id }: EditCaseStudyPageProps) {
  const router = useRouter()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCaseStudy = async () => {
      if (!id) {
        setError('ID de caso de estudio no proporcionado')
        setIsLoading(false)
        return
      }
      
      try {
        console.log('Intentando cargar caso de estudio con ID:', id)
        // Envolvemos la llamada en un bloque try/catch específico para la Server Action
        const study = await getCaseStudyAction(id)
        console.log('Caso de estudio cargado:', study ? 'Éxito' : 'No encontrado')
        
        if (!study) {
          setError('No se encontró el caso de estudio')
        } else {
          setCaseStudy(study)
        }
      } catch (err) {
        console.error('Error al cargar el caso de estudio:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar el estudio')
      } finally {
        setIsLoading(false)
      }
    }

    loadCaseStudy()
  }, [id])

  const handleSaveAction = async (updatedStudy: CaseStudy) => {
    setCaseStudy(updatedStudy)
    router.push('/admin')
  }

  const handleCancelAction = async () => {
    router.push('/admin')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-800 text-red-300 p-4 rounded-md">
            {error || 'No se encontró el estudio'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Volver al dashboard</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Editar Case Study
        </h1>

        <EditCaseStudyForm
          caseStudy={caseStudy}
          onSaveAction={handleSaveAction}
          onCancelAction={handleCancelAction}
        />
      </div>
    </div>
  )
}
