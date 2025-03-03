import { NextRequest, NextResponse } from 'next/server';
import { MockMediaService } from '@/lib/case-studies/mock-media-service';
import { CreateMediaItemData } from '@/lib/case-studies/media-types';

/**
 * GET /api/cms/case-studies/media-items/[id]
 * Obtiene un elemento multimedia por su ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const mediaItem = await MockMediaService.getMediaItem(id);
    
    if (!mediaItem) {
      return NextResponse.json(
        { success: false, message: 'Elemento multimedia no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      mediaItem
    });
  } catch (error) {
    console.error('Error al obtener el elemento multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al obtener el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/case-studies/media-items/[id]
 * Actualiza un elemento multimedia
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json() as Partial<CreateMediaItemData>;
    
    const mediaItem = await MockMediaService.updateMediaItem(id, data);
    
    if (!mediaItem) {
      return NextResponse.json(
        { success: false, message: 'Elemento multimedia no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Elemento multimedia actualizado con éxito',
      mediaItem
    });
  } catch (error) {
    console.error('Error al actualizar el elemento multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al actualizar el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/case-studies/media-items/[id]
 * Elimina un elemento multimedia
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const deleted = await MockMediaService.deleteMediaItem(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Elemento multimedia no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Elemento multimedia eliminado con éxito'
    });
  } catch (error) {
    console.error('Error al eliminar el elemento multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al eliminar el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
