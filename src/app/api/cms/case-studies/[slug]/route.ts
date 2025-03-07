import { NextRequest, NextResponse } from 'next/server';
import { getCaseStudyBySlug } from '@/lib/case-studies/supabase-service';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/cms/case-studies/[slug]
 * Obtiene un case study específico por su slug
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug no proporcionado' },
        { status: 400 }
      );
    }
    
    const caseStudy = await getCaseStudyBySlug(slug);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error(`Error al obtener el case study con slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Error interno al obtener el case study' },
      { status: 500 }
    );
  }
}
