import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Obtener el parámetro limit de la URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Simular una respuesta de la API de Notion
    // En una implementación real, esto consultaría la API de Notion
    const mockProjects = Array.from({ length: limit }).map((_, index) => ({
      id: `proj_${Math.random().toString(36).substring(2, 9)}`,
      title: `Proyecto ${index + 1}`,
      properties: {
        Nombre: `Proyecto ${index + 1}`,
        Descripción: `Descripción del proyecto ${index + 1}`,
        Estado: index % 3 === 0 ? 'Completado' : index % 3 === 1 ? 'En progreso' : 'Pendiente',
        'Fecha de inicio': `2023-${(index % 12) + 1}-${(index % 28) + 1}`,
        'Fecha de finalización': index % 3 === 0 ? `2023-${((index + 2) % 12) + 1}-${((index + 15) % 28) + 1}` : null,
        Responsable: `Usuario ${(index % 5) + 1}`,
        Prioridad: index % 4 === 0 ? 'Alta' : index % 4 === 1 ? 'Media' : 'Baja',
        Etiquetas: [
          `Etiqueta ${index % 5 + 1}`, 
          `Etiqueta ${(index + 2) % 5 + 1}`
        ],
        Presupuesto: Math.floor(Math.random() * 10000) + 1000,
        Cliente: `Cliente ${(index % 8) + 1}`,
        Categoría: index % 3 === 0 ? 'Desarrollo' : index % 3 === 1 ? 'Diseño' : 'Marketing'
      },
      last_edited_time: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }));

    return NextResponse.json({
      success: true,
      projects: mockProjects
    });
  } catch (error) {
    console.error('Error al obtener muestra de la base de datos:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
