import { NextResponse } from 'next/server'
import { caseStudiesService } from '@/lib/cms/case-studies-service'

/**
 * API para obtener casos de estudio destacados
 * @route GET /api/cms/case-studies/featured
 */
export async function GET(request: Request) {
  try {
    // Obtenemos parámetros de la URL
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4', 10)
    const preview = searchParams.get('preview') === 'true'
    
    // Obtenemos casos de estudio destacados desde el servicio
    const featuredCaseStudies = await caseStudiesService.getFeaturedCaseStudies(
      limit,
      { preview, cache: 'no-store' } // No usamos caché para siempre obtener datos frescos
    )
    
    // Devolvemos respuesta
    return NextResponse.json({
      success: true, 
      caseStudies: featuredCaseStudies,
      count: featuredCaseStudies.length
    })
  } catch (error) {
    console.error('Error fetching featured case studies:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching featured case studies',
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
