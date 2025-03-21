'use client'

import { useState, useEffect } from 'react'
import { CaseStudy } from '@/types/case-study'
import { syncStudyWithNotion } from '@/services/notion-sync'

const STORAGE_KEY = 'syncedStudies'
const MAX_FEATURED = 4

export interface UseCaseStudyManagerReturn {
  studies: CaseStudy[]
  featuredStudies: CaseStudy[]
  publishedStudies: CaseStudy[]
  draftStudies: CaseStudy[]
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
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.map(study => ({
        ...study,
        synced: study.synced || false,
        status: study.status || 'draft',
        featured: study.featured || false
      })) : []
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
          synced: study.synced || false,
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

  // Recargar estudios cuando el componente se monta y cuando cambia la ruta
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

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('popstate', handleRouteChange)
    
    // Carga inicial
    loadStudiesFromStorage()

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
    .filter(study => study.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, MAX_FEATURED)

  const publishedStudies = studies
    .filter(study => study.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const draftStudies = studies
    .filter(study => study.status === 'draft')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // Funciones de gestión
  const addStudy = (study: CaseStudy) => {
    setStudies(prev => {
      // Si el estudio ya existe, actualizamos sus datos manteniendo estado y featured
      const existingStudy = prev.find(s => s.id === study.id)
      if (existingStudy) {
        return prev.map(s => s.id === study.id ? {
          ...study,
          status: existingStudy.status,
          featured: existingStudy.featured,
          featuredOrder: existingStudy.featuredOrder,
          synced: true
        } : s)
      }
      // Añadir nuevo estudio manteniendo su estado o usando draft por defecto
      return [...prev, { 
        ...study,
        status: study.status || 'draft',
        featured: study.featured || false,
        synced: true
      }]
    })
  }

  const updateStudy = async (study: CaseStudy) => {
    // Actualizar localmente
    setStudies(prev => prev.map(s => s.id === study.id ? { ...study, synced: false } : s))

    // Sincronizar con Notion
    const success = await syncStudyWithNotion(study)

    // Actualizar el estado de sincronización
    setStudies(prev => prev.map(s => s.id === study.id ? { ...s, synced: success } : s))

    // Mostrar feedback al usuario
    if (!success) {
      console.error('Error al sincronizar con Notion')
    }
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

      // Si no está destacado y hay menos de 4 destacados, lo añadimos
      const currentFeatured = prev.filter(s => s.featured)
      if (currentFeatured.length >= MAX_FEATURED) {
        console.warn('Ya hay 4 estudios destacados')
        return prev
      }

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
