import { NextRequest, NextResponse } from 'next/server';
// Comentamos el servicio original que accede al sistema de archivos
// import { FileService } from '@/lib/case-studies/file-service';
// Usamos los servicios mock para pruebas sin acceso al sistema de archivos
import { MockFileService as FileService } from '@/lib/case-studies/mock-file-service';
import { MockMediaService } from '@/lib/case-studies/mock-media-service';

/**
 * POST /api/cms/case-studies/upload
 * Sube un archivo para un caso de estudio
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar que la solicitud es multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Se requiere una solicitud multipart/form-data' },
        { status: 400 }
      );
    }
    
    // Obtener el formulario
    const formData = await request.formData();
    
    // Obtener el archivo y el slug
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;
    
    // Validar que se proporcionaron los datos necesarios
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Se requiere un archivo' },
        { status: 400 }
      );
    }
    
    // Si no hay slug, usamos un slug temporal
    const effectiveSlug = slug || `temp-${Date.now()}`;
    
    // Validar el tipo de archivo (imágenes y videos)
    const fileType = file.type;
    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      return NextResponse.json(
        { success: false, message: 'Solo se permiten archivos de imagen o video' },
        { status: 400 }
      );
    }
    
    // Guardar el archivo y crear un elemento multimedia
    const fileUrl = await FileService.saveFile(file, effectiveSlug);
    
    // Crear un elemento multimedia con el archivo
    const mediaItem = await MockMediaService.createMediaItemFromFile(
      file,
      effectiveSlug,
      formData.get('alt') as string || '',
      formData.get('caption') as string || ''
    );
    
    return NextResponse.json({
      success: true,
      message: 'Archivo subido con éxito',
      fileUrl,
      mediaItem
    });
    
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al subir el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/case-studies/upload
 * Elimina un archivo
 */
export async function DELETE(request: NextRequest) {
  try {
    // Obtener la URL del archivo a eliminar
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');
    
    if (!fileUrl) {
      return NextResponse.json(
        { success: false, message: 'Se requiere la URL del archivo' },
        { status: 400 }
      );
    }
    
    // Obtener el ID del elemento multimedia si se proporciona
    const mediaItemId = searchParams.get('mediaItemId');
    
    // Eliminar el archivo
    const fileDeleted = FileService.deleteFile(fileUrl);
    
    if (!fileDeleted) {
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar el archivo' },
        { status: 500 }
      );
    }
    
    // Si se proporcionó un ID de elemento multimedia, eliminarlo también
    let mediaDeleted = true;
    if (mediaItemId) {
      mediaDeleted = await MockMediaService.deleteMediaItem(mediaItemId);
      
      if (!mediaDeleted) {
        console.warn(`No se pudo eliminar el elemento multimedia con ID: ${mediaItemId}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado con éxito',
      fileDeleted: true,
      mediaDeleted
    });
    
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Error al eliminar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      },
      { status: 500 }
    );
  }
}
