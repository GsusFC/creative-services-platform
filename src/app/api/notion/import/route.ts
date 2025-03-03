import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json();
    const { projectIds, databaseId } = body;
    
    // Validar los datos de entrada
    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere un array de IDs de proyectos' 
        },
        { status: 400 }
      );
    }
    
    if (!databaseId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere el ID de la base de datos' 
        },
        { status: 400 }
      );
    }
    
    // Simular un retraso para la operación de importación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular una respuesta exitosa
    // En una implementación real, esto importaría los proyectos de Notion
    // Simular algunos errores aleatorios
    
    // Simular que algunos proyectos fallan aleatoriamente
    const successfulImports = projectIds.filter(() => Math.random() > 0.1);
    
    return NextResponse.json({
      success: true,
      imported: successfulImports.length,
      errors: projectIds.length - successfulImports.length,
      importedIds: successfulImports,
      message: `Importación completada. ${successfulImports.length} proyectos importados, ${projectIds.length - successfulImports.length} errores.`
    });
  } catch (error) {
    console.error('Error al importar proyectos:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
