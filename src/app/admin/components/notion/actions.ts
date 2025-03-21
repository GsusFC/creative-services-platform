'use server'

import { revalidatePath } from 'next/cache'
import { getAllCaseStudies } from '@/lib/notion/client'
import { CaseStudy } from '@/types/case-study'

export async function fetchNotionStudies(): Promise<{
  studies: CaseStudy[]
  error?: string
}> {
  try {
    const studies = await getAllCaseStudies()
    return { studies }
  } catch (error) {
    console.error('Error fetching Notion studies:', error)
    return {
      studies: [],
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export async function syncStudy(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Aquí iría la lógica de sincronización directa con Notion
    // Por ahora simplemente revalidamos el path
    revalidatePath('/admin/case-studies')
    return { success: true }
  } catch (error) {
    console.error('Error syncing study:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export async function syncAllStudies(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'sync_all' })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al sincronizar')
    }

    revalidatePath('/admin/case-studies')
    return { success: true }
  } catch (error) {
    console.error('Error syncing all studies:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
