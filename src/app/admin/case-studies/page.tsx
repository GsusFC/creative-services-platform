'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircleIcon, EditIcon, ChevronRightIcon, StarIcon, TrashIcon, SettingsIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/admin/components/ui/card"

interface CaseStudy {
  id: string
  slug: string
  title: string
  client: string
  status: 'draft' | 'published'
  featured: boolean
  updatedAt: string
}

export default function CaseStudiesAdmin() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cms/case-studies')
        
        if (!response.ok) {
          throw new Error('Error al cargar los estudios de caso')
        }
        
        const data = await response.json()
        setCaseStudies(data)
      } catch (err) {
        console.error('Error fetching case studies:', err)
        setError('Error al cargar los estudios de caso. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudies()
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudio de caso? Esta acción no se puede deshacer.')) {
      try {
        setIsDeleting(id)
        const response = await fetch(`/api/cms/case-studies?id=${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Error al eliminar el estudio de caso')
        }
        
        // Eliminar de la lista local
        setCaseStudies(prev => prev.filter(cs => cs.id !== id))
      } catch (err) {
        console.error('Error deleting case study:', err)
        setError('Error al eliminar el estudio de caso. Por favor, intenta de nuevo.')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Estudios de Caso</h1>
            <p className="text-gray-400">Administra los estudios de caso de tu sitio web</p>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/admin/case-studies/featured" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors">
              <StarIcon className="mr-2 h-5 w-5" />
              Gestionar Destacados
            </Link>
            
            <Link href="/admin/case-studies/settings" className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors">
              <SettingsIcon className="mr-2 h-5 w-5" />
              Integración Notion
            </Link>
            
            <Link href="/admin/case-studies/new" className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Nuevo Estudio
            </Link>
          </div>
        </div>
        
        <p className="text-gray-400 mb-8">
          Aquí puedes ver todos los estudios de caso, crear nuevos, editarlos o eliminarlos.
          Para gestionar qué proyectos aparecen en la sección destacada de la home, usa el botón "Gestionar Destacados".
        </p>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-black/30 border border-white/10">
                <CardHeader className="pb-2 animate-pulse">
                  <div className="h-7 bg-white/10 rounded w-2/3 mb-2"></div>
                  <div className="h-5 bg-white/10 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-4/5"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : caseStudies.length === 0 ? (
          <Card className="bg-black/20 border border-white/10 text-center p-8">
            <p className="text-gray-400 mb-4">No hay estudios de caso creados todavía.</p>
            <Link href="/admin/case-studies/new" className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white font-medium transition-colors">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Crear el primero
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {caseStudies.map((study) => (
              <Link key={study.id} href={`/admin/case-studies/${study.slug}/edit`}>
                <Card className="bg-black/30 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white group-hover:text-blue-400 transition-colors flex items-center">
                          {study.title}
                          {study.featured && (
                            <span className="ml-2 text-yellow-400">
                              <StarIcon className="h-4 w-4" />
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-gray-400 flex items-center mt-1">
                          <span className="text-gray-500 mr-2">{study.client}</span>
                          {study.status === 'published' ? (
                            <span className="inline-flex items-center text-green-500">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-yellow-500">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                              Borrador
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Última actualización: {study.updatedAt ? new Date(study.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.location.href = `/admin/case-studies/${study.slug}/edit`;
                          }}
                          title="Editar"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        
                        <button 
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          onClick={(e) => handleDelete(study.id, e)}
                          disabled={isDeleting === study.id}
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
