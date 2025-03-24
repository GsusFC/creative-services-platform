'use client'

import { useState, useEffect } from 'react'
import { CaseStudy, MediaItem } from '@/types/case-study'
import { v4 as uuidv4 } from 'uuid'

// Flag para desactivar la sincronización hacia Notion
// Si es true, solo se sincronizará desde Notion hacia la plataforma
// Si es false, se sincronizará en ambas direcciones
const DISABLE_SYNC_TO_NOTION = true

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
          // Procesamos los estudios para reducir el tamaño de los datos multimedia
          const processedStudies = data.studies.map((study: CaseStudy) => {
            // Creamos una versión ligera del estudio para localStorage
            return {
              ...study,
              // Eliminamos los datos multimedia grandes del almacenamiento local
              // y mantenemos solo referencias o versiones reducidas
              mediaItems: study.mediaItems?.map((item: MediaItem) => ({
                ...item,
                // Si es una url en base64, guardamos solo la referencia
                url: item.url && item.url.startsWith('data:') 
                  ? `ref:${item.order}` // Guardamos solo una referencia
                  : item.url
              })) || []
            };
          });
          
          try {
            // Intentamos guardar los estudios procesados
            localStorage.setItem(STORAGE_KEY, JSON.stringify(processedStudies))
            console.log('Estudios guardados en localStorage con éxito');
          } catch (storageError) {
            console.error('Error al guardar en localStorage:', storageError);
            // Si falla, intentamos una versión aún más ligera sin multimedia
            const minimalStudies = processedStudies.map((study: CaseStudy) => ({
              ...study,
              mediaItems: study.mediaItems?.map((item: MediaItem) => ({
                ...item,
                // Guardamos versión reducida sin datos base64
                url: item.url && item.url.startsWith('data:') ? null : item.url
              })) || []
            }));
            
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalStudies));
              console.warn('Guardados estudios en versión mínima sin multimedia');
            } catch (minimalError) {
              console.error('Error al guardar versión mínima:', minimalError);
              // Como último recurso, guardamos solo los IDs y títulos
              const essentialData = processedStudies.map((study: CaseStudy) => ({
                id: study.id,
                title: study.title,
                status: study.status,
                featured: study.featured,
                featuredOrder: study.featuredOrder,
                order: study.order,
                synced: study.synced
              }));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(essentialData));
              console.warn('Guardados solo datos esenciales de los estudios');
            }
          }
          
          // Siempre actualizamos el estado con los datos completos
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
    if (studies.length === 0) return;
    
    console.log('Guardando estudios en localStorage:', studies)
    
    try {
      // Procesamos los estudios para reducir el tamaño
      const processedStudies = studies.map((study: CaseStudy) => ({
        ...study,
        mediaItems: study.mediaItems?.map((item: MediaItem) => ({
          ...item,
          // Si es una url en base64, guardamos solo la referencia
          url: item.url && item.url.startsWith('data:') 
            ? `ref:${item.order}` // Guardamos solo una referencia
            : item.url
        })) || []
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(processedStudies))
    } catch (error) {
      console.error('Error al guardar estudios en localStorage:', error)
      
      try {
        // Si falla, intentamos una versión más ligera sin multimedia
        const minimalStudies = studies.map((study: CaseStudy) => ({
          ...study,
          mediaItems: study.mediaItems?.map((item: MediaItem) => ({
            ...item,
            // Guardamos versión reducida sin datos base64
            url: item.url && item.url.startsWith('data:') ? null : item.url
          })) || []
        }));
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalStudies))
        console.warn('Guardados estudios en versión mínima sin multimedia');
      } catch (minimalError) {
        console.error('Error al guardar versión mínima:', minimalError);
        
        // Como último recurso, guardamos solo los IDs y títulos
        const essentialData = studies.map(study => ({
          id: study.id,
          title: study.title,
          status: study.status,
          featured: study.featured,
          featuredOrder: study.featuredOrder,
          order: study.order,
          synced: study.synced
        }));
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(essentialData))
          console.warn('Guardados solo datos esenciales de los estudios');
        } catch (essentialError) {
          console.error('Error al guardar datos esenciales:', essentialError);
        }
      }
    }
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

  // Función auxiliar para esperar un tiempo determinado
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const updateStudy = async (study: CaseStudy, retryCount = 0, maxRetries = 3) => {
    console.log(`[Debug] useCaseStudyManager.updateStudy - Actualizando estudio:`, {
      id: study.id,
      title: study.title,
      status: study.status,
      featured: study.featured
    });

    // Actualizamos el estado local para una experiencia de usuario fluida
    const updatedStudy = {
      ...study,
      updatedAt: new Date().toISOString(),
      // Si la sincronización hacia Notion está desactivada, marcamos como sincronizado
      // para evitar indicadores de error en la UI
      synced: DISABLE_SYNC_TO_NOTION ? true : false
    };
    
    setStudies(prev => prev.map(s => s.id === study.id ? updatedStudy : s));

    // Si la sincronización hacia Notion está desactivada, simplemente devolvemos el estudio actualizado
    if (DISABLE_SYNC_TO_NOTION) {
      console.log('[Debug] Sincronización hacia Notion desactivada. Solo se actualizó localmente.');
      return updatedStudy;
    }

    try {
      // Intentar actualizar en Notion
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          study: {
            ...study,
            updatedAt: new Date().toISOString()
          }
        }),
        // Aseguramos que no se use caché
        cache: 'no-store'
      });

      // Si la respuesta no es exitosa, intentamos extraer más información del error
      if (!response.ok) {
        let errorMessage = 'Error al actualizar en Notion';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Si no podemos parsear la respuesta como JSON, usamos el texto de la respuesta
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Intentamos parsear la respuesta como JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error al parsear respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      // Si la actualización en Notion fue exitosa, actualizamos el estado con los datos retornados
      if (data.study) {
        console.log('[Debug] useCaseStudyManager.updateStudy - Actualización exitosa:', data.study);
        setStudies(prev => prev.map(s => s.id === study.id ? { ...data.study, synced: true } : s));
        return data.study;
      } else {
        // Si no hay datos retornados pero la respuesta fue exitosa
        console.log('[Debug] useCaseStudyManager.updateStudy - Respuesta exitosa sin datos de estudio');
        setStudies(prev => prev.map(s => s.id === study.id ? { ...study, synced: true } : s));
        return study;
      }
    } catch (error) {
      console.error(`Error updating study:`, error);
      
      // Si no hemos alcanzado el número máximo de reintentos, esperamos y reintentamos
      if (retryCount < maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // Backoff exponencial: 1s, 2s, 4s...
        console.log(`Reintentando en ${retryDelay}ms...`);
        await wait(retryDelay);
        return updateStudy(study, retryCount + 1, maxRetries);
      }
      
      // Si hemos agotado los reintentos, mantenemos el estudio como no sincronizado
      console.error('Se agotaron los reintentos. El estudio quedará marcado como no sincronizado.');
      
      // Notificamos el error pero devolvemos el estudio para que la UI pueda continuar
      return study;
    }
  }

  const publishStudy = async (id: string) => {
    const study = studies.find(s => s.id === id)
    if (!study) return

    // Primero actualizamos el estado local para una experiencia de usuario más fluida
    setStudies(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: 'published', updatedAt: new Date().toISOString() }
        : s
    ))

    // Luego sincronizamos con Notion
    try {
      await updateStudy({
        ...study,
        status: 'published'
      })
    } catch (error) {
      console.error('Error publishing study:', error)
    }
  }

  const unpublishStudy = async (id: string) => {
    const study = studies.find(s => s.id === id)
    if (!study) return

    // Primero actualizamos el estado local para una experiencia de usuario más fluida
    setStudies(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: 'draft', featured: false, updatedAt: new Date().toISOString() }
        : s
    ))

    // Luego sincronizamos con Notion
    try {
      await updateStudy({
        ...study,
        status: 'draft',
        featured: false
      })
    } catch (error) {
      console.error('Error unpublishing study:', error)
    }
  }

  const removeStudy = (id: string) => {
    setStudies(prev => prev.filter(study => study.id !== id))
  }

  const toggleFeatured = async (id: string, order?: number) => {
    const study = studies.find(s => s.id === id)
    if (!study) return

    // Si el estudio no está publicado, no permitimos destacarlo
    if (study.status !== 'published') return

    // Primero actualizamos el estado local para una experiencia de usuario más fluida
    let updatedStudy: CaseStudy | null = null

    setStudies(prev => {
      // Si ya está destacado, lo quitamos
      if (study.featured) {
        updatedStudy = { ...study, featured: false, featuredOrder: 0, updatedAt: new Date().toISOString() }
        return prev.map(s => s.id === id ? updatedStudy! : s)
      }

      // Obtener los estudios destacados actuales
      const currentFeatured = prev.filter(s => s.featured)

      // Asignar orden automáticamente si no se proporciona
      const newOrder = order ?? Math.max(...currentFeatured.map(s => s.featuredOrder || 0), 0) + 1

      updatedStudy = { ...study, featured: true, featuredOrder: newOrder, updatedAt: new Date().toISOString() }
      return prev.map(s => s.id === id ? updatedStudy! : s)
    })

    // Luego sincronizamos con Notion
    try {
      if (updatedStudy) {
        await updateStudy(updatedStudy)
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
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
