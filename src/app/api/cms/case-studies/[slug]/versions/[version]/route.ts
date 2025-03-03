import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies/[slug]/versions/[version]
 * Obtiene una versión específica de un caso de estudio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; version: string } }
) {
  try {
    const { slug, version } = params;
    const versionNumber = parseInt(version);
    
    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { success: false, message: 'Número de versión inválido' },
        { status: 400 }
      );
    }
    
    // Obtener la versión
    const versionData = await CaseStudyService.getCaseStudyVersion(slug, versionNumber);
    
    if (!versionData) {
      return NextResponse.json(
        { success: false, message: 'Versión no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      version: versionData
    });
    
  } catch (error) {
    console.error('Error al obtener versión:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener versión: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
