import { NextRequest, NextResponse } from 'next/server';
import { MockMediaService } from '@/lib/case-studies/mock-media-service';
import { CreateMediaSectionData } from '@/lib/case-studies/media-types';

/**
 * GET /api/cms/case-studies/media-sections/[id]
 * Obtiene una sección multimedia por su ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const mediaSection = await MockMediaService.getMediaSection(id);
    
    if (!mediaSection) {
      return NextResponse.json(
        { success: false, message: 'Sección multimedia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      mediaSection
    });
  } catch (error) {
    console.error('Error al obtener la sección multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/case-studies/media-sections/[id]
 * Actualiza una sección multimedia
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json() as Partial<CreateMediaSectionData>;
    
    const mediaSection = await MockMediaService.updateMediaSection(id, data);
    
    if (!mediaSection) {
      return NextResponse.json(
        { success: false, message: 'Sección multimedia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sección multimedia actualizada con éxito',
      mediaSection
    });
  } catch (error) {
    console.error('Error al actualizar la sección multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al actualizar la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/case-studies/media-sections/[id]
 * Elimina una sección multimedia
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const deleted = await MockMediaService.deleteMediaSection(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Sección multimedia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sección multimedia eliminada con éxito'
    });
  } catch (error) {
    console.error('Error al eliminar la sección multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al eliminar la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
