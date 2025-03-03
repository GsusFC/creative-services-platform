import { NextRequest, NextResponse } from 'next/server';

// Tipos
type ConflictType = 'different_values' | 'new_item' | 'deleted_in_notion' | 'deleted_locally' | 'unknown';
type ConflictResolution = 'notion' | 'local' | 'merge' | 'skip';

interface Conflict {
  id: string;
  projectId: string;
  projectName: string;
  type: ConflictType;
  description: string;
  detectedAt: string;
  notionData: Record<string, string | number>;
  platformData: Record<string, string | number>;
  resolved?: boolean;
  resolvedAt?: string;
  resolution?: ConflictResolution;
}

// Datos mock para desarrollo
const mockConflicts: Conflict[] = [
  {
    id: 'conflict-001',
    projectId: 'project-001',
    projectName: 'Campaña de Marketing Digital Q1',
    type: 'different_values',
    description: 'Los valores de los campos "fecha de entrega" y "responsable" difieren entre Notion y la plataforma.',
    detectedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    notionData: {
      'fecha_entrega': '2023-04-15',
      'responsable': 'Ana García'
    },
    platformData: {
      'fecha_entrega': '2023-04-20',
      'responsable': 'Carlos López'
    }
  },
  {
    id: 'conflict-002',
    projectId: 'project-002',
    projectName: 'Rediseño de Página Web Corporativa',
    type: 'new_item',
    description: 'Este proyecto existe en Notion pero no en la plataforma.',
    detectedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    notionData: {
      'nombre': 'Rediseño de Página Web Corporativa',
      'cliente': 'TechSolutions Inc',
      'presupuesto': '15000'
    },
    platformData: {}
  },
  {
    id: 'conflict-003',
    projectId: 'project-003',
    projectName: 'Vídeo Promocional Producto X',
    type: 'deleted_in_notion',
    description: 'Este proyecto ha sido eliminado en Notion pero existe en la plataforma.',
    detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    notionData: {},
    platformData: {
      'nombre': 'Vídeo Promocional Producto X',
      'cliente': 'Consumer Goods Ltd',
      'estado': 'En progreso'
    }
  }
];

// Función para simular respuestas con algo de latencia
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 500));

// Manejador de peticiones GET para obtener conflictos
export async function GET(request: NextRequest) {
  await simulateLatency();
  
  try {
    // Parámetros de consulta (filtros)
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type');
    
    let conflicts = [...mockConflicts];
    
    // Aplicar filtros si existen
    if (projectId) {
      conflicts = conflicts.filter(c => c.projectId === projectId);
    }
    
    if (type) {
      conflicts = conflicts.filter(c => c.type === type);
    }
    
    return NextResponse.json({ 
      success: true, 
      count: conflicts.length,
      conflicts 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener conflictos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Manejador de peticiones POST para resolver conflictos
export async function POST(request: NextRequest) {
  await simulateLatency();
  
  try {
    const body = await request.json();
    const { conflictId, resolution } = body;
    
    // Validaciones
    if (!conflictId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requiere un ID de conflicto',
        errorCode: 'MISSING_CONFLICT_ID'
      }, { status: 400 });
    }
    
    if (!resolution || !['notion', 'local', 'merge', 'skip'].includes(resolution)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Resolución no válida. Debe ser "notion", "local", "merge" o "skip"',
        errorCode: 'INVALID_RESOLUTION'
      }, { status: 400 });
    }
    
    // Verificar si el conflicto existe
    const conflict = mockConflicts.find(c => c.id === conflictId);
    if (!conflict) {
      return NextResponse.json({ 
        success: false, 
        message: `No se encontró ningún conflicto con ID: ${conflictId}`,
        errorCode: 'CONFLICT_NOT_FOUND'
      }, { status: 404 });
    }
    
    // En un sistema real, aquí implementaríamos la lógica de resolución
    // Aquí simplemente simulamos una respuesta exitosa
    
    // Procesar según el tipo de resolución
    let responseMessage = '';
    
    switch (resolution) {
      case 'notion':
        responseMessage = 'Conflicto resuelto utilizando datos de Notion';
        break;
      case 'local':
        responseMessage = 'Conflicto resuelto manteniendo datos de la plataforma';
        break;
      case 'merge':
        responseMessage = 'Conflicto resuelto combinando datos de ambas fuentes';
        break;
      case 'skip':
        responseMessage = 'Conflicto omitido y marcado para revisión posterior';
        break;
    }
    
    // Simulamos que el conflicto se ha resuelto
    const updatedConflict = {
      ...conflict,
      resolved: true,
      resolvedAt: new Date().toISOString(),
      resolution
    };
    
    return NextResponse.json({
      success: true,
      message: responseMessage,
      conflict: updatedConflict
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al resolver conflicto:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido',
      errorCode: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Manejador de peticiones DELETE para eliminar conflictos (para uso administrativo)
export async function DELETE(request: NextRequest) {
  await simulateLatency();
  
  try {
    const { searchParams } = new URL(request.url);
    const conflictId = searchParams.get('conflictId');
    
    if (!conflictId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requiere un ID de conflicto',
        errorCode: 'MISSING_CONFLICT_ID'
      }, { status: 400 });
    }
    
    // Verificar si el conflicto existe
    const conflictIndex = mockConflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: `No se encontró ningún conflicto con ID: ${conflictId}`,
        errorCode: 'CONFLICT_NOT_FOUND'
      }, { status: 404 });
    }
    
    // En un sistema real, aquí eliminaríamos el conflicto de la base de datos
    // Aquí simplemente simulamos una respuesta exitosa
    
    return NextResponse.json({
      success: true,
      message: `Conflicto ${conflictId} eliminado con éxito`,
      conflictId
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al eliminar conflicto:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido',
      errorCode: 'SERVER_ERROR'
    }, { status: 500 });
  }
}
