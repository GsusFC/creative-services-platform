import { NextRequest, NextResponse } from 'next/server';
import { MockMediaService } from '@/lib/case-studies/mock-media-service';
import { CreateMediaItemData } from '@/lib/case-studies/media-types';

/**
 * POST /api/cms/case-studies/media-items
 * Crea un nuevo elemento multimedia
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar el tipo de contenido
    const contentType = request.headers.get('content-type') || '';
    
    // Si es multipart/form-data, procesamos un archivo
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      const file = formData.get('file') as File | null;
      const slug = formData.get('slug') as string | null;
      const alt = formData.get('alt') as string | null;
      const caption = formData.get('caption') as string | null;
      
      if (!file) {
        return NextResponse.json(
          { success: false, message: 'Se requiere un archivo' },
          { status: 400 }
        );
      }
      
      if (!slug) {
        return NextResponse.json(
          { success: false, message: 'Se requiere un slug' },
          { status: 400 }
        );
      }
      
      // Validar el tipo de archivo (solo imágenes)
      const fileType = file.type;
      if (!fileType.startsWith('image/')) {
        return NextResponse.json(
          { success: false, message: 'Solo se permiten archivos de imagen' },
          { status: 400 }
        );
      }
      
      // Crear el elemento multimedia a partir del archivo
      const mediaItem = await MockMediaService.createMediaItemFromFile(
        file,
        slug,
        alt || '',
        caption || ''
      );
      
      return NextResponse.json({
        success: true,
        message: 'Elemento multimedia creado con éxito',
        mediaItem
      });
    } 
    // Si es application/json, procesamos una URL
    else if (contentType.includes('application/json')) {
      const data = await request.json() as CreateMediaItemData;
      
      // Validar los datos
      if (!data.source) {
        return NextResponse.json(
          { success: false, message: 'Se requiere una fuente (source)' },
          { status: 400 }
        );
      }
      
      if (!data.type) {
        return NextResponse.json(
          { success: false, message: 'Se requiere un tipo' },
          { status: 400 }
        );
      }
      
      // Si es una URL, crear el elemento multimedia a partir de la URL
      if (data.type === 'url') {
        const mediaItem = await MockMediaService.createMediaItemFromUrl(
          data.source,
          data.alt,
          data.caption
        );
        
        return NextResponse.json({
          success: true,
          message: 'Elemento multimedia creado con éxito',
          mediaItem
        });
      } 
      // Si es otro tipo, crear un elemento multimedia genérico
      else {
        const mediaItem = await MockMediaService.createMediaItem(data);
        
        return NextResponse.json({
          success: true,
          message: 'Elemento multimedia creado con éxito',
          mediaItem
        });
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Tipo de contenido no soportado' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error al crear el elemento multimedia:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al crear el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
