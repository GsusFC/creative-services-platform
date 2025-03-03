import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService, CaseStudyDetail } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies/[slug]
 * Obtiene un caso de estudio específico por su slug
 */
export async function GET(
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
    
    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const requirePublished = searchParams.get('published') === 'true';
    
    // Obtener el caso de estudio
    const caseStudy = await CaseStudyService.getCaseStudyBySlug(slug, requirePublished);
    
    if (!caseStudy) {
      return NextResponse.json(
        { success: false, message: 'Caso de estudio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      caseStudy
    });
    
  } catch (error) {
    console.error('Error al obtener el caso de estudio:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener el caso de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/case-studies/[slug]
 * Actualiza un caso de estudio existente
 */
export async function PUT(
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
    
    // Obtener los datos actualizados
    const data = await request.json();
    
    // Actualizar el caso de estudio
    const updatedCaseStudy = await CaseStudyService.updateCaseStudy(slug, data);
    
    return NextResponse.json({
      success: true,
      message: 'Caso de estudio actualizado con éxito',
      caseStudy: updatedCaseStudy
    });
    
  } catch (error) {
    console.error('Error al actualizar el caso de estudio:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al actualizar el caso de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/case-studies/[slug]
 * Elimina un caso de estudio
 */
export async function DELETE(
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
    
    // Eliminar el caso de estudio
    const deleted = await CaseStudyService.deleteCaseStudy(slug);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar el caso de estudio' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Caso de estudio eliminado con éxito'
    });
    
  } catch (error) {
    console.error('Error al eliminar el caso de estudio:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al eliminar el caso de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
