import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService } from '@/lib/case-studies/mock-service';

/**
 * PATCH /api/cms/case-studies/[slug]/publish
 * Cambia el estado de publicación de un caso de estudio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = await Promise.resolve(params.slug);
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Se requiere un slug válido' },
        { status: 400 }
      );
    }
    
    // Verificar que el caso de estudio existe
    const existingCaseStudy = await CaseStudyService.getCaseStudyBySlug(slug);
    
    if (!existingCaseStudy) {
      return NextResponse.json(
        { success: false, message: 'Caso de estudio no encontrado' },
        { status: 404 }
      );
    }
    
    // Obtener el nuevo estado de publicación
    const data = await request.json();
    const published = data.published;
    
    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Se requiere un valor booleano para "published"' },
        { status: 400 }
      );
    }
    
    // Cambiar el estado de publicación
    const updatedCaseStudy = await CaseStudyService.togglePublishStatus(slug, published);
    
    const action = published ? 'publicado' : 'despublicado';
    
    return NextResponse.json({
      success: true,
      message: `Caso de estudio ${action} con éxito`,
      caseStudy: updatedCaseStudy
    });
    
  } catch (error) {
    console.error('Error al cambiar el estado de publicación:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al cambiar el estado de publicación: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
