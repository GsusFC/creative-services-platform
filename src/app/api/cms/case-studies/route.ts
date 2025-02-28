import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que usa MongoDB
// import { CaseStudyService } from '@/lib/case-studies/service';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService, CaseStudyDetail } from '@/lib/case-studies/mock-service';

/**
 * GET /api/cms/case-studies
 * Obtiene todos los casos de estudio
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const onlyPublished = searchParams.get('published') === 'true';
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tags = searchParams.get('tags') ? searchParams.get('tags')?.split(',') : [];
    
    let caseStudies;
    
    // Si hay un término de búsqueda, usar la función de búsqueda
    if (search) {
      caseStudies = await CaseStudyService.searchCaseStudies(search, onlyPublished);
    } 
    // Si hay categoría o tags, usar la función de filtrado
    else if (category || (tags && tags.length > 0)) {
      caseStudies = await CaseStudyService.filterCaseStudies(
        category || undefined,
        tags || undefined,
        onlyPublished
      );
    } 
    // De lo contrario, obtener todos los casos de estudio
    else {
      // Obtener todos los casos y aplicar paginación manualmente (el mock no soporta limit y skip)
      const allCaseStudies = await CaseStudyService.getAllCaseStudies(onlyPublished);
      caseStudies = allCaseStudies.slice(skip, skip + limit);
    }
    
    return NextResponse.json({
      success: true,
      count: caseStudies.length,
      caseStudies
    });
    
  } catch (error) {
    console.error('Error al obtener los casos de estudio:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener los casos de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/case-studies
 * Crea un nuevo caso de estudio
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar datos mínimos requeridos solo si no es un borrador
    if (data.published !== false) {
      if (!data.title || !data.description || (!data.heroImage && !data.heroVideo)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Se requieren los campos: title, description y al menos heroImage o heroVideo para publicar' 
          },
          { status: 400 }
        );
      }
    }
    
    // Crear el caso de estudio
    const caseStudy = await CaseStudyService.createCaseStudy(data);
    
    return NextResponse.json({
      success: true,
      message: 'Caso de estudio creado con éxito',
      caseStudy
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear el caso de estudio:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al crear el caso de estudio: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
