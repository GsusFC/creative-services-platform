import { NextResponse } from 'next/server';
import { getMockCaseStudies } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies
 * Obtiene todos los case studies
 */
export async function GET() {
  try {
    // Como el CMS no está activo, usamos el servicio mock
    const caseStudies = await getMockCaseStudies();
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Error al obtener los case studies:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener los case studies' },
      { status: 500 }
    );
  }
}
