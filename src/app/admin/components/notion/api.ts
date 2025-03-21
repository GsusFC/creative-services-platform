'use client'

export async function syncStudyApi(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, action: 'sync' })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al sincronizar')
    }

    return { success: true }
  } catch (error) {
    console.error('Error syncing study:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export async function syncAllStudiesApi(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'syncAll' })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al sincronizar')
    }

    return { success: true }
  } catch (error) {
    console.error('Error syncing all studies:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
