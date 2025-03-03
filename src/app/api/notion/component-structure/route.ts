/**
 * API para la estructura de componentes en Notion
 * 
 * Este endpoint proporciona información sobre la estructura de componentes disponibles
 * en Notion para ser usados en el Field Mapper V3.
 */

import { NextResponse } from 'next/server'
import { measurePerformance } from '@/lib/field-mapper/performance-service'

export async function GET() {
  try {
    // Medimos el rendimiento de la llamada a la API
    const notionComponents = await measurePerformance('fetchNotionComponentStructure', async () => {
      // Aquí iría la lógica para obtener la estructura real de Notion
      // Por ahora, devolvemos datos de ejemplo
      return [
        {
          id: "notion-database",
          name: "Base de datos de Cases",
          type: "database",
          fields: [
            { id: "title", name: "Título", type: "title", required: true },
            { id: "cover", name: "Portada", type: "files", required: false },
            { id: "client", name: "Cliente", type: "text", required: false },
            { id: "publish_date", name: "Fecha de publicación", type: "date", required: false },
            { id: "summary", name: "Resumen", type: "rich_text", required: false },
            { id: "services", name: "Servicios", type: "multi_select", required: false },
            { id: "challenge", name: "Desafío", type: "rich_text", required: false },
            { id: "solution", name: "Solución", type: "rich_text", required: false },
            { id: "technologies", name: "Tecnologías", type: "multi_select", required: false },
            { id: "results", name: "Resultados", type: "rich_text", required: false },
            { id: "gallery", name: "Galería", type: "files", required: false },
            { id: "related", name: "Casos relacionados", type: "relation", required: false }
          ]
        },
        {
          id: "notion-page",
          name: "Página de Case Study",
          type: "page",
          fields: [
            { id: "page_title", name: "Título de la página", type: "title", required: true },
            { id: "page_icon", name: "Icono", type: "files", required: false },
            { id: "page_cover", name: "Imagen de portada", type: "files", required: false },
            { id: "blocks", name: "Bloques de contenido", type: "blocks", required: false }
          ]
        }
      ]
    })

    return NextResponse.json(notionComponents)
  } catch (error) {
    console.error('Error fetching Notion component structure:', error)
    return NextResponse.json(
      { error: 'Error al obtener la estructura de componentes de Notion' },
      { status: 500 }
    )
  }
}
