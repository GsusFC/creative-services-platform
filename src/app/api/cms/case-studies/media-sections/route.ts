import { NextRequest, NextResponse } from 'next/server';
import { MockMediaService } from '@/lib/case-studies/mock-media-service';
import { CreateMediaSectionData } from '@/lib/case-studies/media-types';

/**
 * GET /api/cms/case-studies/media-sections
 * Obtiene todas las secciones multimedia
 */
export async function GET() {
  try {
    const mediaSections = await MockMediaService.getAllMediaSections();
    
    return NextResponse.json({
      success: true,
      mediaSections
    });
  } catch (error) {
    console.error('Error al obtener las secciones multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener las secciones multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/case-studies/media-sections
 * Crea una nueva sección multimedia
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as CreateMediaSectionData;
    
    // Validar los datos
    if (!data.layout) {
      return NextResponse.json(
        { success: false, message: 'Se requiere un layout' },
        { status: 400 }
      );
    }
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Se requiere al menos un elemento multimedia' },
        { status: 400 }
      );
    }
    
    // Crear la sección multimedia
    const mediaSection = await MockMediaService.createMediaSection(data);
    
    return NextResponse.json({
      success: true,
      message: 'Sección multimedia creada con éxito',
      mediaSection
    });
  } catch (error) {
    console.error('Error al crear la sección multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al crear la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
