import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService } from '@/lib/case-studies/mock-service';

/**
 * POST /api/cms/case-studies/[slug]/versions/[version]/restore
 * Restaura una versión específica de un caso de estudio
 */
export async function POST(
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
    
    const data = await request.json();
    const { createVersion = true, restoredBy } = data;
    
    // Restaurar la versión
    const restoredCaseStudy = await CaseStudyService.restoreCaseStudyVersion(
      slug,
      versionNumber,
      createVersion,
      restoredBy
    );
    
    if (!restoredCaseStudy) {
      return NextResponse.json(
        { success: false, message: 'No se pudo restaurar la versión' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Versión ${versionNumber} restaurada con éxito`,
      caseStudy: restoredCaseStudy
    });
    
  } catch (error) {
    console.error('Error al restaurar versión:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al restaurar versión: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
