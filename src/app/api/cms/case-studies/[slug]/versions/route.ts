import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies/[slug]/versions
 * Obtiene todas las versiones de un caso de estudio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    
    // Parámetros de paginación
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Obtener versiones
    const versions = await CaseStudyService.getCaseStudyVersions(slug, limit, skip);
    
    if (versions === null) {
      return NextResponse.json(
        { success: false, message: 'Caso de estudio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      versions
    });
    
  } catch (error) {
    console.error('Error al obtener versiones:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener versiones: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
