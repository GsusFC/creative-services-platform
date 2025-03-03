import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simular una respuesta de la API de Notion
    // En una implementación real, esto consultaría la API de Notion
    const mockStats = {
      success: true,
      total: 42,
      synced: 28,
      pending: 10,
      withErrors: 4,
      conflicts: [
        {
          id: 'conflict_1',
          notionItem: {
            id: 'notion_item_1',
            title: 'Proyecto Conflictivo 1',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          localItem: {
            id: 'local_item_1',
            title: 'Proyecto Local 1',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          fields: ['Nombre', 'Descripción', 'Estado'],
          type: 'different_values'
        },
        {
          id: 'conflict_2',
          notionItem: null,
          localItem: {
            id: 'local_item_2',
            title: 'Proyecto Local 2',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          fields: ['*'],
          type: 'deleted_in_notion'
        },
        {
          id: 'conflict_3',
          notionItem: {
            id: 'notion_item_3',
            title: 'Proyecto Nuevo en Notion',
            date: new Date()
          },
          localItem: null,
          fields: ['*'],
          type: 'new_item'
        }
      ],
      schedule: {
        enabled: true,
        frequency: 'daily',
        time: '03:00',
        lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      }
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Error al obtener estadísticas de la base de datos:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
