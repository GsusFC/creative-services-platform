/**
 * API endpoint para manejar llamadas al servidor MCP de Notion
 * 
 * Este endpoint actúa como un proxy entre el frontend y el servidor MCP.
 * Recibe solicitudes para ejecutar herramientas del servidor MCP y devuelve los resultados.
 */

import { NextRequest, NextResponse } from 'next/server';
import { transformNotionToCaseStudy } from '@/lib/notion/transformer';
import { saveCaseStudy } from '@/lib/storage/case-studies';
import { saveMediaFile } from '@/lib/storage/case-studies';
import { CaseStudy } from '@/types/case-study';

// Esta es una simulación simplificada de lo que haría una integración real con MCP
// En una implementación real, esto usaría la API de MCP para llamar al servidor

/**
 * Función simulada para llamar a una herramienta MCP
 */
async function simulateMcpToolCall(server: string, tool: string, args: any) {
  console.log(`[API] Simulando llamada a ${server} - herramienta: ${tool}`);
  console.log(`[API] Argumentos:`, args);
  
  // Comprobamos que el servidor y la herramienta sean válidos
  if (server !== 'github.com/pashpashpash/mcp-notion-server') {
    throw new Error(`Servidor MCP no soportado: ${server}`);
  }
  
  // Aquí simulamos diferentes herramientas de Notion
  switch (tool) {
    case 'notion_query_database': {
      // Abrimos la API actual de Notion
      const { database_id, filter, sorts } = args;
      
      // Llamamos a la API de Notion que ya tenemos configurada
      try {
        console.log(`[API] Consultando base de datos ${database_id}`);

        // Crear la URL para la API de Notion
        const response = await fetch(`${process.env['NEXT_PUBLIC_API_BASE'] || ''}/api/notion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'queryDatabase', filter, sorts }),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Error al consultar la base de datos: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`[API] Respuesta de Notion: ${data.results.length} resultados`);
        
        // Procesamos los case studies
        const results = await Promise.all(data.results.map(async (page: any) => {
          // Transformar el resultado de Notion a nuestro formato CaseStudy
          try {
            const caseStudy = await transformNotionToCaseStudy(page);
            
            // Guardamos el case study para que esté disponible para las páginas
            await saveCaseStudy(caseStudy);
            
            return caseStudy;
          } catch (error) {
            console.error(`[API] Error al transformar página:`, error);
            return null;
          }
        }));
        
        // Filtramos los nulls
        const validResults = results.filter(Boolean);
        console.log(`[API] Procesados ${validResults.length} case studies válidos`);
        
        return {
          object: 'list',
          results: validResults,
          has_more: false,
          next_cursor: null
        };
      } catch (error) {
        console.error(`[API] Error al consultar la base de datos:`, error);
        throw error;
      }
    }
    
    case 'notion_retrieve_page': {
      const { page_id } = args;
      
      try {
        console.log(`[API] Obteniendo página ${page_id}`);
        
        // Llamamos a la API de Notion que ya tenemos configurada
        const response = await fetch(`${process.env['NEXT_PUBLIC_API_BASE'] || ''}/api/notion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getPage', pageId: page_id }),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener la página: ${response.statusText}`);
        }
        
        const page = await response.json();
        console.log(`[API] Página obtenida: ${page.id}`);
        
        // Transformamos y guardamos el case study
        const caseStudy = await transformNotionToCaseStudy(page);
        await saveCaseStudy(caseStudy);
        
        return page;
      } catch (error) {
        console.error(`[API] Error al obtener la página:`, error);
        throw error;
      }
    }

    case 'notion_retrieve_database': {
      const { database_id } = args;
      
      try {
        console.log(`[API] Obteniendo información de la base de datos ${database_id}`);
        
        // Llamamos a la API de Notion que ya tenemos configurada
        const response = await fetch(`${process.env['NEXT_PUBLIC_API_BASE'] || ''}/api/notion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getDatabase', databaseId: database_id }),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener información de la base de datos: ${response.statusText}`);
        }
        
        const database = await response.json();
        console.log(`[API] Base de datos obtenida: ${database.id}`);
        
        return database;
      } catch (error) {
        console.error(`[API] Error al obtener información de la base de datos:`, error);
        throw error;
      }
    }
    
    default:
      throw new Error(`Herramienta no implementada: ${tool}`);
  }
}

/**
 * POST handler para el endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Extraer datos de la solicitud
    const body = await request.json();
    const { server, tool, args } = body;
    
    // Validar que tenemos todos los datos necesarios
    if (!server || !tool || !args) {
      return NextResponse.json(
        { error: 'Se requieren server, tool y args' }, 
        { status: 400 }
      );
    }
    
    // Llamar a la herramienta MCP
    const result = await simulateMcpToolCall(server, tool, args);
    
    // Devolver el resultado
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Error al procesar la solicitud MCP:', error);
    
    // Devolver el error
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}
