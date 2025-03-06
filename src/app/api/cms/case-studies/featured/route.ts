import { NextResponse } from 'next/server';
import { getMockFeaturedCaseStudies } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies/featured
 * Obtiene los case studies destacados para la home
 */
export async function GET() {
  try {
    // Como el CMS no está activo, usamos el servicio mock
    const featuredCaseStudies = await getMockFeaturedCaseStudies();
    
    return NextResponse.json(featuredCaseStudies);
  } catch (error) {
    console.error('Error al obtener los case studies destacados:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener los case studies destacados' },
      { status: 500 }
    );
  }
}
