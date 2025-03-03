import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simular una respuesta de la API de Notion
    // En una implementación real, esto consultaría la API de Notion
    const mockResponse = {
      success: true,
      databaseName: 'Proyectos',
      properties: [
        'Nombre',
        'Descripción',
        'Estado',
        'Fecha de inicio',
        'Fecha de finalización',
        'Responsable',
        'Prioridad',
        'Etiquetas',
        'Presupuesto',
        'Cliente',
        'Categoría'
      ]
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error al obtener estructura de la base de datos:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
