import { NextRequest, NextResponse } from 'next/server';
import { notionService } from '@/services/notion-service';

// Definir tipos para la respuesta de importación
type ImportedProject = {
  id: string;
  success: boolean;
  title: string;
  lastEditedTime?: string;
  createdTime?: string;
  importedAt?: string;
  error?: string;
};

type ImportStats = {
  total: number;
  success: number;
  failed: number;
  startTime: string;
  endTime: string;
  durationMs: number;
};

type ImportResponse = {
  success: boolean;
  message: string;
  results: ImportedProject[];
  stats: ImportStats;
};

// Simulación de latencia para realizar pruebas realistas
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 800));

/**
 * Endpoint para importar proyectos seleccionados de Notion
 * @param request Solicitud HTTP con los IDs de los proyectos a importar
 * @returns Respuesta con el resultado de la importación
 */
export async function POST(request: NextRequest) {
  try {
    // Simular latencia para pruebas
    await simulateLatency();
    
    // Obtener los IDs de los proyectos seleccionados del cuerpo de la solicitud
    const body = await request.json();
    const { projectIds } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array de IDs de proyectos' },
        { status: 400 }
      );
    }

    console.log(`Iniciando importación de ${projectIds.length} proyectos seleccionados:`, projectIds);

    // Verificar que el servicio de Notion esté configurado correctamente
    if (!notionService.isProperlyConfigured()) {
      return NextResponse.json(
        { success: false, error: 'El servicio de Notion no está configurado correctamente' },
        { status: 500 }
      );
    }

    // Obtener los proyectos completos para tener más información
    const allProjects = await notionService.getProjects(100);
    
    // Filtrar los proyectos seleccionados
    const selectedProjects = allProjects.filter(project => 
      projectIds.includes(project.id)
    );

    if (selectedProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se encontraron los proyectos seleccionados' },
        { status: 404 }
      );
    }

    // Simular la importación de cada proyecto
    const startTime = new Date();
    const importedProjects: ImportedProject[] = selectedProjects.map(project => {
      try {
        // En una implementación real, aquí guardaríamos el proyecto en la base de datos
        console.log(`Proyecto importado con éxito: ${project.id}`);
        
        return {
          id: project.id,
          success: true,
          title: project.title || 'Proyecto sin título',
          lastEditedTime: project.lastEditedTime,
          createdTime: project.createdTime,
          importedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error al importar proyecto ${project.id}:`, error);
        return {
          id: project.id,
          success: false,
          title: project.title || 'Proyecto sin título',
          error: error instanceof Error ? error.message : 'Error desconocido'
        };
      }
    });

    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();

    // Contar proyectos importados con éxito
    const successCount = importedProjects.filter(p => p.success).length;
    const failedCount = importedProjects.length - successCount;

    const response: ImportResponse = {
      success: true,
      message: `${successCount} de ${projectIds.length} proyectos importados con éxito`,
      results: importedProjects,
      stats: {
        total: projectIds.length,
        success: successCount,
        failed: failedCount,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMs
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al procesar la importación de proyectos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al importar proyectos' 
      },
      { status: 500 }
    );
  }
}
