import { NextResponse } from 'next/server';
import { downloadFileToBase64 } from '@/lib/notion/utils';

export async function GET(request: Request) {
  try {
    // Obtener la URL de la consulta
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 });
    }
    
    console.log(`Intentando descargar: ${fileUrl}`);
    
    // Intentar descargar el archivo
    const base64Data = await downloadFileToBase64(fileUrl);
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: 'No se pudo descargar el archivo', 
        url: fileUrl 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      base64Length: base64Data.length,
      base64Preview: base64Data.substring(0, 100) + '...'
    });
  } catch (error) {
    console.error('Error en la descarga de prueba:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
