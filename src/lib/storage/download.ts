'use server'

import path from 'path'
import { saveMediaFile } from './case-studies'

export async function downloadAndSaveMedia(url: string, slug: string): Promise<string> {
  try {
    // Extraer el nombre del archivo de la URL
    const filename = path.basename(new URL(url).pathname)
    
    // Descargar el archivo
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error downloading file: ${response.statusText}`)
    }
    
    const buffer = await response.arrayBuffer()
    
    // Guardar el archivo localmente
    const localPath = await saveMediaFile(slug, filename, Buffer.from(buffer))
    
    return localPath
  } catch (error) {
    console.error('Error downloading media:', error)
    throw error
  }
}
