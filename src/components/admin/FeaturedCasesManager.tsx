'use client'

import { useState } from 'react'
import { CaseStudy } from '@/types/case-study'
import { ArrowUpCircleIcon, ArrowDownCircleIcon, StarIcon, XCircleIcon } from 'lucide-react'
import { useFeaturedCases } from '@/hooks/useFeaturedCases'

export default function FeaturedCasesManager() {
  const { 
    cases: caseStudies, 
    loading, 
    error: apiError, 
    updateOrder
  } = useFeaturedCases() as {
    cases: CaseStudy[];
    loading: boolean;
    error: string | null;
    updateOrder: (cases: CaseStudy[]) => Promise<boolean>;
  }
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Mover un case study hacia arriba en el orden de destacados
  const moveUp = (caseStudy: CaseStudy) => {
    if (!caseStudy.featured) return
    
    const featuredCases = caseStudies.filter(cs => cs.featured)
    const currentIndex = featuredCases.findIndex(cs => cs.id === caseStudy.id)
    
    if (currentIndex <= 0) return // Ya está en la primera posición
    
    // Intercambiar con el elemento anterior
    const updatedCaseStudies = [...caseStudies]
    const featuredIndex = updatedCaseStudies.findIndex(cs => cs.id === caseStudy.id)
    const prevFeaturedIndex = updatedCaseStudies.findIndex(cs => cs.id === featuredCases[currentIndex - 1].id)
    
    // Intercambiar featuredOrder
    const temp = updatedCaseStudies[featuredIndex].featuredOrder
    updatedCaseStudies[featuredIndex].featuredOrder = updatedCaseStudies[prevFeaturedIndex].featuredOrder
    updatedCaseStudies[prevFeaturedIndex].featuredOrder = temp
    
    // Actualizar el orden a través del hook
    updateOrder(updatedCaseStudies)
  }

  // Mover un case study hacia abajo en el orden de destacados  
  const moveDown = (caseStudy: CaseStudy) => {
    if (!caseStudy.featured) return
    
    const featuredCases = caseStudies.filter(cs => cs.featured)
    const currentIndex = featuredCases.findIndex(cs => cs.id === caseStudy.id)
    
    if (currentIndex >= featuredCases.length - 1 || currentIndex === -1) return // Ya está en la última posición
    
    // Intercambiar con el elemento siguiente
    const updatedCaseStudies = [...caseStudies]
    const featuredIndex = updatedCaseStudies.findIndex(cs => cs.id === caseStudy.id)
    const nextFeaturedIndex = updatedCaseStudies.findIndex(cs => cs.id === featuredCases[currentIndex + 1].id)
    
    // Intercambiar featuredOrder
    const temp = updatedCaseStudies[featuredIndex].featuredOrder
    updatedCaseStudies[featuredIndex].featuredOrder = updatedCaseStudies[nextFeaturedIndex].featuredOrder
    updatedCaseStudies[nextFeaturedIndex].featuredOrder = temp
    
    // Actualizar el orden a través del hook
    updateOrder(updatedCaseStudies)
  }

  // Añadir un case study a destacados
  const addToFeatured = (caseStudy: CaseStudy) => {
    if (caseStudy.featured) return
    
    const featuredCases = caseStudies.filter(cs => cs.featured)
    
    // Solo permitir un máximo de 4 casos destacados
    if (featuredCases.length >= 4) {
      setError('Solo se pueden tener 4 proyectos destacados como máximo')
      return
    }
    
    const updatedCaseStudies = [...caseStudies]
    const index = updatedCaseStudies.findIndex(cs => cs.id === caseStudy.id)
    
    updatedCaseStudies[index] = {
      ...updatedCaseStudies[index],
      featured: true,
      featuredOrder: featuredCases.length + 1
    }
    
    // Actualizar el orden a través del hook
    updateOrder(updatedCaseStudies)
    setError(null)
  }

  // Eliminar un case study de destacados
  const removeFromFeatured = (caseStudy: CaseStudy) => {
    if (!caseStudy.featured) return
    
    const updatedCaseStudies = [...caseStudies]
    const index = updatedCaseStudies.findIndex(cs => cs.id === caseStudy.id)
    
    updatedCaseStudies[index] = {
      ...updatedCaseStudies[index],
      featured: false,
      featuredOrder: 999
    }
    
    // Reordenar los featured cases restantes
    const remainingFeatured = updatedCaseStudies
      .filter(cs => cs.id !== caseStudy.id && cs.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
    
    // Actualizar el orden de los featured cases restantes
    remainingFeatured.forEach((cs, i) => {
      const csIndex = updatedCaseStudies.findIndex(item => item.id === cs.id)
      if (csIndex !== -1) {
        updatedCaseStudies[csIndex].featuredOrder = i + 1
      }
    })
    
    // Actualizar el orden a través del hook
    updateOrder(updatedCaseStudies)
    setError(null)
  }

  // Ordenar case studies (helper function no longer needed as it's handled by the service)

  // Guardar los cambios de destacados
  const saveFeaturedChanges = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)
      
      // Actualizar el orden a través del hook
      const success = await updateOrder(caseStudies)
      
      if (success) {
        setSuccessMessage('Cambios guardados correctamente')
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } else {
        throw new Error('No se pudieron guardar los cambios')
      }
    } catch (err) {
      console.error('Error saving featured changes:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page bg-black/30 p-6 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Proyectos Destacados</h2>
          <p className="text-gray-400 text-sm">Gestiona los proyectos que aparecerán en la sección destacada de la home</p>
        </div>
        
        <button
          onClick={saveFeaturedChanges}
          disabled={saving || loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800/50 rounded-md text-white font-medium transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
      
      {/* Mensajes de error o éxito */}
      {(error || apiError) && (
        <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6">
          {error || apiError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900/50 border border-green-500 text-white p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      {/* Tabla de case studies */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/10 rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-black p-3 border-b border-gray-800 rounded-t-md">
            <h3 className="font-bold text-white">
              Proyectos Destacados ({caseStudies.filter(cs => cs.featured).length}/4)
            </h3>
          </div>
          
          {/* Lista de destacados */}
          {caseStudies.filter(cs => cs.featured).length === 0 ? (
            <div className="bg-black/50 rounded-md p-8 text-center">
              <p className="text-gray-400">No hay proyectos destacados seleccionados</p>
              <p className="text-gray-500 text-sm mt-2">Selecciona hasta 4 proyectos para mostrar en la home</p>
            </div>
          ) : (
            <div className="space-y-2">
              {caseStudies
                .filter(cs => cs.featured)
                .sort((a, b) => a.featuredOrder - b.featuredOrder)
                .map(cs => (
                  <div 
                    key={cs.id} 
                    className="flex items-center justify-between p-4 bg-gray-900/30 rounded-md border border-white/5 hover:border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-3">
                          {cs.featuredOrder}
                        </span>
                        <h4 className="font-bold text-white">{cs.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{cs.client}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => moveUp(cs)}
                        disabled={caseStudies.filter(c => c.featured).findIndex(c => c.id === cs.id) === 0}
                        className="p-1 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
                        title="Mover arriba"
                      >
                        <ArrowUpCircleIcon className="h-6 w-6" />
                      </button>
                      
                      <button
                        onClick={() => moveDown(cs)}
                        disabled={
                          caseStudies.filter(c => c.featured).findIndex(c => c.id === cs.id) === 
                          caseStudies.filter(c => c.featured).length - 1
                        }
                        className="p-1 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
                        title="Mover abajo"
                      >
                        <ArrowDownCircleIcon className="h-6 w-6" />
                      </button>
                      
                      <button
                        onClick={() => removeFromFeatured(cs)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Quitar de destacados"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {/* Divider */}
          <div className="border-t border-gray-800 my-6"></div>
          
          {/* Lista de proyectos disponibles */}
          <div className="bg-black p-3 border-b border-gray-800 rounded-t-md">
            <h3 className="font-bold text-white">
              Proyectos Disponibles
            </h3>
          </div>
          
          {caseStudies.filter(cs => !cs.featured).length === 0 ? (
            <div className="bg-black/50 rounded-md p-8 text-center">
              <p className="text-gray-400">Todos los proyectos están marcados como destacados</p>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              {caseStudies
                .filter(cs => !cs.featured)
                .map(cs => (
                  <div 
                    key={cs.id} 
                    className="flex items-center justify-between p-4 bg-gray-900/30 rounded-md border border-white/5 hover:border-white/10"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{cs.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{cs.client}</p>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => addToFeatured(cs)}
                        disabled={caseStudies.filter(c => c.featured).length >= 4}
                        className="p-1 text-yellow-400 hover:text-yellow-300 disabled:text-gray-600"
                        title={caseStudies.filter(c => c.featured).length >= 4 ? 
                          "Máximo de 4 proyectos destacados alcanzado" : 
                          "Añadir a destacados"}
                      >
                        <StarIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
