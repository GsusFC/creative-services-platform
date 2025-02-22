import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { file, code } = await request.json();
    
    // Validar la ruta del archivo
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, file);
    
    // Verificar que el archivo está dentro del proyecto
    if (!filePath.startsWith(projectRoot)) {
      throw new Error('Invalid file path');
    }

    // Crear directorios si no existen
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Escribir el código en el archivo
    await fs.writeFile(filePath, code, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Implement code API error:', error);
    return NextResponse.json(
      { error: 'Failed to implement code' },
      { status: 500 }
    );
  }
}
