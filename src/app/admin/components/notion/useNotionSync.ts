'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CaseStudy } from '@/types/case-study'
import { fetchNotionStudies } from './actions'
import { syncStudyApi, syncAllStudiesApi } from './api'
import { useCaseStudyManager } from '@/hooks/useCaseStudyManager'

export interface SyncStatus {
  state: 'idle' | 'loading' | 'syncing' | 'error'
  isLoading: boolean
  error: string | null
  success: string | null
  lastSync: string | null
  totalItems: number
}

export interface UseNotionSyncReturn {
  syncStatus: SyncStatus
  pendingStudies: CaseStudy[]
  syncedStudies: CaseStudy[]
  handleSyncSingle: (study: CaseStudy) => Promise<void>
  handleSyncAll: () => Promise<void>
  searchQuery: string
  setSearchQuery: (query: string) => void
  formatLastSync: (date: string | null) => string
  error: string | null
  setPendingStudies: React.Dispatch<React.SetStateAction<CaseStudy[]>>
}

export function useNotionSync(): UseNotionSyncReturn {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    state: 'idle',
    isLoading: false,
    error: null,
    success: null,
    lastSync: null,
    totalItems: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingStudies, setPendingStudies] = useState<CaseStudy[]>([])
  const { studies: syncedStudies, addStudy } = useCaseStudyManager()
  const isInitialMount = useRef(true)
  const loadedRef = useRef(false)

  // Cargar estudios de Notion
  const loadNotionStudies = useCallback(async (): Promise<void> => {
    // Evitar cargas múltiples
    if (loadedRef.current || syncStatus.isLoading) {
      return
    }
    
    loadedRef.current = true
    
    console.log('[Debug] loadNotionStudies - Estado inicial:', {
      isInitialMount: isInitialMount.current,
      loadedRef: loadedRef.current,
      syncStatus,
      pendingStudiesCount: pendingStudies.length,
      syncedStudiesCount: syncedStudies.length
    })
    try {
      setSyncStatus(prev => ({ ...prev, state: 'loading', isLoading: true }))
      console.log('[Debug] loadNotionStudies - Iniciando fetchNotionStudies')
      const { studies, error: fetchError } = await fetchNotionStudies()
      console.log('[Debug] loadNotionStudies - Resultado:', {
        studiesCount: studies.length,
        hasError: !!fetchError,
        error: fetchError
      })
      
      if (fetchError) {
        setSyncStatus(prev => ({
          ...prev,
          state: 'error',
          isLoading: false,
          error: fetchError
        }))
        return
      }
      
      // Filtrar estudios que ya están sincronizados
      const existingSynced = new Set(syncedStudies.map(study => study.id))
      
      // Separar estudios nuevos y existentes
      const pending: CaseStudy[] = []
      const newSynced: CaseStudy[] = []
      
      studies.forEach(study => {
        if (existingSynced.has(study.id)) {
          // Si ya está sincronizado, lo ignoramos
          return
        }
        if (study.synced) {
          newSynced.push({ ...study, synced: true })
        } else {
          pending.push(study)
        }
      })
      
      // Actualizar estudios pendientes
      setPendingStudies(pending)
      
      // Añadir solo los nuevos estudios sincronizados
      newSynced.forEach(study => addStudy(study))
      
      setSyncStatus(prev => ({
        ...prev,
        state: 'idle',
        isLoading: false,
        error: null,
        totalItems: studies.length,
        lastSync: new Date().toISOString()
      }))
      isInitialMount.current = false
    } catch (err) {
      console.error('Error loading Notion studies:', err)
      setSyncStatus(prev => ({
        ...prev,
        state: 'error',
        isLoading: false,
        error: 'Error al cargar los estudios de Notion'
      }))
    }
  }, [addStudy, syncedStudies, pendingStudies.length, syncStatus])

  // Cargar estudios al montar el componente
  useEffect(() => {
    loadNotionStudies()
  }, [loadNotionStudies]) // Incluimos loadNotionStudies como dependencia

  const handleSyncSingle = useCallback(async (study: CaseStudy) => {
    // Si ya está sincronizado, no hacemos nada
    if (study.synced) return
    try {
      setSyncStatus(prev => ({ ...prev, state: 'syncing', isLoading: true }))
      const { success, error: syncError } = await syncStudyApi(study.id)
      
      if (!success) {
        setSyncStatus(prev => ({
          ...prev,
          state: 'error',
          isLoading: false,
          error: syncError || 'Error al sincronizar el estudio'
        }))
        return
      }

      // Actualizar estudio como sincronizado
      const updatedStudy = { ...study, synced: true, status: study.status || 'draft' }
      addStudy(updatedStudy)
      setPendingStudies(prev => prev.filter(s => s.id !== study.id))

      setSyncStatus(prev => ({
        ...prev,
        state: 'idle',
        isLoading: false,
        error: null,
        success: 'Estudio sincronizado correctamente'
      }))
    } catch (err) {
      console.error('Error syncing study:', err)
      setSyncStatus(prev => ({
        ...prev,
        state: 'error',
        isLoading: false,
        error: 'Error al sincronizar el estudio'
      }))
    }
  }, [addStudy, pendingStudies.length, syncStatus])

  const handleSyncAll = useCallback(async () => {
    try {
      setSyncStatus(prev => ({ ...prev, state: 'syncing', isLoading: true }))
      const { success, error: syncError } = await syncAllStudiesApi()
      
      if (!success) {
        setSyncStatus(prev => ({
          ...prev,
          state: 'error',
          isLoading: false,
          error: syncError || 'Error al sincronizar los estudios'
        }))
        return
      }
      
      // Forzar recarga de estudios
      isInitialMount.current = true
      await loadNotionStudies()
      setSyncStatus(prev => ({
        ...prev,
        state: 'idle',
        isLoading: false,
        success: 'Todos los estudios sincronizados correctamente'
      }))
    } catch (err) {
      console.error('Error syncing all studies:', err)
      setSyncStatus(prev => ({
        ...prev,
        state: 'error',
        isLoading: false,
        error: 'Error al sincronizar los estudios'
      }))
    }
  }, [loadNotionStudies, pendingStudies.length, syncStatus])

  const formatLastSync = useCallback((date: string | null) => {
    if (!date) return 'Nunca'
    return new Date(date).toLocaleString('es-ES')
  }, [])

  return {
    syncStatus,
    pendingStudies,
    syncedStudies,
    handleSyncSingle,
    handleSyncAll,
    searchQuery,
    setSearchQuery,
    formatLastSync,
    error: syncStatus.error,
    setPendingStudies
  }
}
