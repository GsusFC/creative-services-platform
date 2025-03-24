'use server'

import { NextResponse } from 'next/server'
import { migrateToIndividualFiles } from '@/lib/storage/case-studies'

/**
 * Endpoint para migrar los case studies del formato antiguo (un solo JSON)
 * al nuevo formato (JSON individuales + índice)
 * 
 * Acceder a través de: /api/migrate
 */
export async function GET() {
  try {
    console.log('Iniciando migración de case studies...')
    
    const success = await migrateToIndividualFiles()
    
    if (success) {
      console.log('✅ Migración completada con éxito.')
      console.log('Los case studies ahora están almacenados en archivos individuales.')
      console.log('Se ha creado un índice para acceso rápido a los datos.')
      console.log('El archivo original se ha respaldado como data/case-studies.json.bak')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Migración completada con éxito' 
      })
    } else {
      console.error('❌ La migración falló. Verifica los logs para más detalles.')
      
      return NextResponse.json({ 
        success: false, 
        message: 'La migración falló. Verifica los logs para más detalles.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error durante la migración',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
