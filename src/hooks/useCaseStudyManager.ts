'use client'

import { useState, useEffect } from 'react'
import { CaseStudy } from '@/types/case-study'


const STORAGE_KEY = 'syncedStudies'
const MAX_FEATURED = 999

export interface UseCaseStudyManagerReturn {
  studies: CaseStudy[]
  featuredStudies: CaseStudy[]
  publishedStudies: CaseStudy[]
  draftStudies: CaseStudy[]
  unsyncedStudies: CaseStudy[]
  addStudy: (study: CaseStudy) => void
  updateStudy: (study: CaseStudy) => void
  removeStudy: (id: string) => void
  publishStudy: (id: string) => void
  unpublishStudy: (id: string) => void
  toggleFeatured: (id: string, order?: number) => void
  updateFeaturedOrder: (id: string, order: number) => void
  reorderStudies: (studies: CaseStudy[]) => void
}

export function useCaseStudyManager(): UseCaseStudyManagerReturn {
  // Inicializar el estado con los estudios del localStorage
  const [studies, setStudies] = useState<CaseStudy[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      console.log('[Debug] useCaseStudyManager - Cargando estudios iniciales')
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        console.log('[Debug] useCaseStudyManager - No hay estudios guardados')
        return []
      }
      const parsed = JSON.parse(saved)
      const initialStudies = Array.isArray(parsed) ? parsed.map(study => ({
        ...study,

        status: study.status || 'draft',
        featured: study.featured || false
      })) : []
      console.log('[Debug] useCaseStudyManager - Estudios cargados:', {
        count: initialStudies.length,
        titles: initialStudies.map(s => s.title)
      })
      return initialStudies
    } catch (error) {
      console.error('Error loading initial studies:', error)
      return []
    }
  })

  // Función para cargar estudios del localStorage
  const loadStudiesFromStorage = () => {
    console.log('Cargando estudios desde localStorage...')
    const savedStudies = localStorage.getItem(STORAGE_KEY)
    if (savedStudies) {
      try {
        const parsed = JSON.parse(savedStudies)
        const validStudies = Array.isArray(parsed) ? parsed : []
        // Asegurarnos de que todos los estudios cargados mantengan su estado de sincronización
        const updatedStudies = validStudies.map(study => ({
          ...study,
  
          status: study.status || 'draft',
          featured: study.featured || false
        }))
        setStudies(updatedStudies)
        console.log('Estudios cargados:', updatedStudies)
      } catch (error) {
        console.error('Error parsing studies from localStorage:', error)
        setStudies([])
      }
    }
  }

  // Sincronizar con Notion y recargar estudios cuando el componente se monta
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        console.log('Storage changed, reloading studies...')
        loadStudiesFromStorage()
      }
    }

    const handleRouteChange = () => {
      console.log('Route changed, reloading studies...')
      loadStudiesFromStorage()
    }

    const syncWithNotion = async () => {
      try {
        console.log('Sincronizando con Notion...')
        const response = await fetch('/api/notion')
        if (!response.ok) throw new Error('Error al sincronizar con Notion')
        const data = await response.json()
        if (data.studies) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.studies))
          setStudies(data.studies)
          console.log('Sincronización con Notion completada:', {
            count: data.studies.length,
            titles: data.studies.map((s: CaseStudy) => s.title)
          })
        }
      } catch (error) {
        console.error('Error sincronizando con Notion:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('popstate', handleRouteChange)
    
    // Sincronizar con Notion y luego cargar del storage
    syncWithNotion()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Guardar estudios en localStorage cuando cambien
  useEffect(() => {
    console.log('Guardando estudios en localStorage:', studies)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studies))
  }, [studies])

  // Estudios filtrados
  const featuredStudies = studies
    .filter(study => study.status === 'published' && study.featured)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
    .slice(0, MAX_FEATURED)

  const publishedStudies = studies
    .filter(study => study.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const draftStudies = studies
    .filter(study => study.status === 'draft')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const unsyncedStudies: CaseStudy[] = []

  // Funciones de gestión
  const addStudy = (study: CaseStudy) => {
    console.log('[Debug] useCaseStudyManager.addStudy - Añadiendo estudio:', {
      id: study.id,
      title: study.title,
      status: study.status,
      featured: study.featured
    })
    setStudies(prev => {
      // Si el estudio ya existe, actualizamos sus datos manteniendo estado y featured
      const existingStudy = prev.find(s => s.id === study.id)
      if (existingStudy) {
        console.log('[Debug] useCaseStudyManager.addStudy - Actualizando estudio existente:', {
          id: study.id,
          oldStatus: existingStudy.status,
          newStatus: study.status,
          oldFeatured: existingStudy.featured,
          newFeatured: study.featured
        })
        return prev.map(s => s.id === study.id ? {
          ...study,
          status: study.status || existingStudy.status,
          featured: study.featured || existingStudy.featured,
          featuredOrder: study.featuredOrder || existingStudy.featuredOrder || 0,

        } : s)
      }
      // Añadir nuevo estudio manteniendo su estado o usando draft por defecto
      console.log('[Debug] useCaseStudyManager.addStudy - Añadiendo nuevo estudio')
      return [...prev, { 
        ...study,
        status: study.status || 'draft',
        featured: study.featured || false,
        featuredOrder: study.featuredOrder || 0,
        synced: true
      }]
    })
  }

  const updateStudy = (study: CaseStudy) => {
    setStudies(prev => prev.map(s => s.id === study.id ? study : s))
  }

  const publishStudy = (id: string) => {
    setStudies(prev => prev.map(study => 
      study.id === id 
        ? { ...study, status: 'published' }
        : study
    ))
  }

  const unpublishStudy = (id: string) => {
    setStudies(prev => prev.map(study => 
      study.id === id 
        ? { ...study, status: 'draft', featured: false }
        : study
    ))
  }

  const removeStudy = (id: string) => {
    setStudies(prev => prev.filter(study => study.id !== id))
  }

  const toggleFeatured = (id: string, order?: number) => {
    setStudies(prev => {
      const study = prev.find(s => s.id === id)
      if (!study) return prev

      // Si ya está destacado, lo quitamos
      if (study.featured) {
        return prev.map(s => s.id === id ? { ...s, featured: false, featuredOrder: 0 } : s)
      }

      // Obtener los estudios destacados actuales
      const currentFeatured = prev.filter(s => s.featured)

      // Asignar orden automáticamente si no se proporciona
      const newOrder = order ?? Math.max(...currentFeatured.map(s => s.featuredOrder), 0) + 1

      return prev.map(s => s.id === id ? { ...s, featured: true, featuredOrder: newOrder } : s)
    })
  }

  const updateFeaturedOrder = (id: string, order: number) => {
    if (order < 1 || order > MAX_FEATURED) return

    setStudies(prev => {
      const study = prev.find(s => s.id === id)
      if (!study?.featured) return prev

      // Actualizar el orden del estudio y reordenar los demás
      return prev.map(s => {
        if (s.id === id) return { ...s, featuredOrder: order }
        if (s.featured && s.featuredOrder >= order) {
          return { ...s, featuredOrder: s.featuredOrder + 1 }
        }
        return s
      })
    })
  }

  const reorderStudies = (newStudies: CaseStudy[]) => {
    setStudies(newStudies)
  }

  return {
    studies,
    featuredStudies,
    publishedStudies,
    draftStudies,
    unsyncedStudies,
    addStudy,
    updateStudy,
    removeStudy,
    publishStudy,
    unpublishStudy,
    toggleFeatured,
    updateFeaturedOrder,
    reorderStudies
  }
}
