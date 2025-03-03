import { NextRequest, NextResponse } from 'next/server';
// Usamos el servicio mock para pruebas sin base de datos
import { MockCaseStudyService as CaseStudyService } from '@/lib/case-studies/mock-service';

/**
 * POST /api/cms/case-studies/generate-slug
 * Genera un slug único para un caso de estudio
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const projectName = data.projectName;
    
    if (!projectName) {
      return NextResponse.json(
        { success: false, message: 'Se requiere un nombre de proyecto' },
        { status: 400 }
      );
    }
    
    // Generar el slug base
    const baseSlug = generateSlug(projectName);
    
    // Verificar si el slug ya existe en los casos de estudio actuales
    const allCaseStudies = await CaseStudyService.getAllCaseStudies();
    const existingCaseStudy = allCaseStudies.find(cs => cs.slug === baseSlug);
    
    // Si no existe, devolver el slug base
    if (!existingCaseStudy) {
      return NextResponse.json({
        success: true,
        slug: baseSlug
      });
    }
    
    // Si existe, generar un slug único añadiendo un número
    let uniqueSlug = '';
    let counter = 1;
    let slugExists = true;
    
    while (slugExists) {
      uniqueSlug = `${baseSlug}-${counter}`;
      const existingWithCounter = allCaseStudies.find(cs => cs.slug === uniqueSlug);
      
      if (!existingWithCounter) {
        slugExists = false;
      } else {
        counter++;
      }
    }
    
    return NextResponse.json({
      success: true,
      slug: uniqueSlug
    });
    
  } catch (error) {
    console.error('Error al generar el slug:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al generar el slug: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * Genera un slug a partir del nombre del proyecto
 * @param name Nombre del proyecto
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Eliminar guiones múltiples
    .trim();
}
