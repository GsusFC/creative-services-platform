/**
 * API para los mappings de componentes
 * 
 * Este endpoint permite cargar y guardar mappings entre componentes de página
 * y componentes de Notion para el Field Mapper V3.
 */

import { NextRequest, NextResponse } from 'next/server'
import { measurePerformance } from '@/lib/field-mapper/performance-service'

// Variable para almacenar los mappings en memoria
// En producción, esto debería guardarse en una base de datos
let storedMappings = []

export async function GET() {
  try {
    // Medimos el rendimiento de la llamada a la API
    const mappings = await measurePerformance('fetchComponentMappings', async () => {
      // Aquí iría la lógica para obtener los mappings guardados
      // Por ahora, devolvemos los mappings almacenados en memoria
      return storedMappings
    })

    return NextResponse.json(mappings)
  } catch (error) {
    console.error('Error fetching component mappings:', error)
    return NextResponse.json(
      { error: 'Error al obtener los mappings de componentes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener los mappings del cuerpo de la solicitud
    const mappings = await request.json()
    
    // Validar los mappings
    if (!Array.isArray(mappings)) {
      return NextResponse.json(
        { error: 'Los mappings deben ser un array' },
        { status: 400 }
      )
    }
    
    // Guardar los mappings
    await measurePerformance('saveComponentMappings', async () => {
      // Aquí iría la lógica para guardar los mappings en una base de datos
      // Por ahora, los almacenamos en memoria
      storedMappings = mappings
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving component mappings:', error)
    return NextResponse.json(
      { error: 'Error al guardar los mappings de componentes' },
      { status: 500 }
    )
  }
}
