import { NextResponse } from 'next/server';
import { getMockCaseStudyBySlug } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies/[slug]
 * Obtiene un case study específico por su slug
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Como el CMS no está activo, usamos el servicio mock
    const caseStudy = await getMockCaseStudyBySlug(slug);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: `No se encontró el case study con slug ${slug}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error(`Error al obtener el case study:`, error);
    return NextResponse.json(
      { error: 'Error interno al obtener el case study' },
      { status: 500 }
    );
  }
}
