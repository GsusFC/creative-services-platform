import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Endpoint para subir imágenes locales
 * POST /api/media/upload
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validar que se ha enviado un archivo
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo (solo imágenes)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      // Convertir el archivo a un ArrayBuffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Guardar el archivo en el directorio de uploads
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      
      // Devolver la URL pública del archivo
      const fileUrl = `/uploads/${fileName}`;
      
      return NextResponse.json({ 
        url: fileUrl,
        fileName,
        type: file.type,
        size: file.size
      });
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      return NextResponse.json(
        { error: 'Error al guardar el archivo' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
