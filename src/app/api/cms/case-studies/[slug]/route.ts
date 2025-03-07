import { NextRequest, NextResponse } from 'next/server';
import { getCaseStudyBySlug } from '@/lib/case-studies/service';

/**
 * GET /api/cms/case-studies/[slug]
 * Obtiene un case study específico por su slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!params || typeof params !== 'object') {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  try {
    // Manejar el caso donde params es un objeto pero slug podría ser undefined
    const slugStr = String(params.slug || '');
    
    if (!slugStr) {
      return NextResponse.json(
        { error: 'Slug no proporcionado' },
        { status: 400 }
      );
    }
    
    const caseStudy = await getCaseStudyBySlug(slugStr);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study no encontrado' },
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
