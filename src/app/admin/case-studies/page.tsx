'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircleIcon, EditIcon, ChevronRightIcon, StarIcon, TrashIcon, SettingsIcon, DatabaseIcon, FilterIcon, SearchIcon, ArrowUpDownIcon } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all')

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

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
  
  // Filtrar case studies
  const filteredCaseStudies = caseStudies.filter(study => {
    // Filtro por estado
    if (filterStatus !== 'all' && study.status !== filterStatus) {
      return false;
    }
    
    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        study.title.toLowerCase().includes(query) ||
        study.client.toLowerCase().includes(query) ||
        study.slug.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="admin-page min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white">
      {/* Header con efecto de vidrio esmerilado */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DatabaseIcon className="h-6 w-6 text-green-400" />
            <Link href="/admin" className="font-bold text-xl hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
            <span className="text-gray-500 mx-2">/</span>
            <span className="font-bold text-xl">Case Studies</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/case-studies/settings" className="text-sm text-gray-400 hover:text-white transition-colors">
              <SettingsIcon className="h-5 w-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="font-semibold">CS</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        {/* Header de la página */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Gestión de Case Studies
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Crea, edita y gestiona los estudios de caso que se mostrarán en el sitio web.
            Administra la visibilidad y destaca los proyectos más importantes.
          </p>
        </motion.div>
        
        {/* Acciones y filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          {/* Buscador y filtros */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 w-full sm:w-80"
              />
            </div>
            
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'draft' | 'published')}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
              <ArrowUpDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/case-studies/featured" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-white font-medium text-sm transition-all shadow-sm shadow-blue-500/20">
              <StarIcon className="mr-2 h-4 w-4" />
              Gestionar Destacados
            </Link>
            
            <Link href="/admin/case-studies/settings" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-white font-medium text-sm transition-all shadow-sm shadow-purple-500/20">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Integración Notion
            </Link>
            
            <Link href="/admin/case-studies/new" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg text-white font-medium text-sm transition-all shadow-sm shadow-green-500/20">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Nuevo Case Study
            </Link>
          </div>
        </motion.div>
        
        {/* Mensaje de error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-700/50 text-white p-4 rounded-lg mb-6 shadow-lg"
          >
            <p className="flex items-center text-red-200">
              <span className="bg-red-500/20 p-1 rounded mr-2">⚠️</span>
              {error}
            </p>
          </motion.div>
        )}

        {/* Lista de Case Studies */}
        {loading ? (
          // Estado de carga con esqueletos
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800/80 rounded-lg p-6 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-800 rounded w-64"></div>
                    <div className="h-5 bg-gray-800/60 rounded w-40"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-800 rounded"></div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 bg-gray-800/40 rounded w-full"></div>
                  <div className="h-4 bg-gray-800/40 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCaseStudies.length === 0 ? (
          // Estado vacío
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900/40 border border-gray-800/80 rounded-lg text-center p-10 shadow-xl"
          >
            {searchQuery || filterStatus !== 'all' ? (
              // No hay resultados para los filtros
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                  <SearchIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No hay resultados</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  No se encontraron case studies que coincidan con tus criterios de búsqueda.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              // No hay case studies creados
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                  <DatabaseIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No hay case studies</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  No hay estudios de caso creados todavía. Puedes crear uno nuevo o sincronizar con Notion.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/admin/case-studies/new" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg text-white font-medium text-sm transition-all">
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Crear nuevo
                  </Link>
                  <Link href="/admin/case-studies/settings" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-white font-medium text-sm transition-all">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Sincronizar desde Notion
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Lista de case studies
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4"
          >
            {filteredCaseStudies.map((study) => (
              <motion.div key={study.id} variants={itemVariants}>
                <Link href={`/admin/case-studies/${study.slug}/edit`}>
                  <div className="bg-gray-900/40 border border-gray-800/80 hover:border-green-500/50 hover:bg-gray-900/60 rounded-lg p-6 transition-all duration-300 group shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                            {study.title}
                          </h3>
                          {study.featured && (
                            <span className="ml-2 text-yellow-400">
                              <StarIcon className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="text-gray-400">{study.client}</span>
                          {study.status === 'published' ? (
                            <span className="inline-flex items-center text-green-400 text-sm">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-yellow-400 text-sm">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                              Borrador
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-sm text-gray-500">
                        Última actualización: {study.updatedAt ? new Date(study.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                      </span>
                      <div className="flex items-center space-x-3">
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
                          {isDeleting === study.id ? (
                            <span className="h-4 w-4 block border-2 border-t-transparent border-red-500 rounded-full animate-spin"></span>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
