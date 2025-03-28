/**
 * Servicio para interactuar con el servidor MCP de Notion
 */

export class MCPNotionService {
  private readonly serverName = 'github.com/pashpashpash/mcp-notion-server';
  private readonly databaseId: string;

  constructor() {
    this.databaseId = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '';
    
    if (!this.databaseId) {
      console.error('NEXT_PUBLIC_NOTION_DATABASE_ID no está configurado');
    }
  }

  /**
   * Llamada genérica a una herramienta MCP
   */
  private async callTool(toolName: string, args: any) {
    try {
      // Esta es una implementación simulada para la demo
      // En una implementación real, se usaría un cliente MCP para llamar a la herramienta
      console.log(`Llamando a MCP: ${toolName} con args:`, JSON.stringify(args, null, 2));
      
      // Simulamos una llamada al servidor MCP
      // Nota: En una implementación real, esto sería reemplazado por la lógica para llamar al servidor MCP
      const response = await fetch('/api/notion/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: this.serverName,
          tool: toolName,
          args
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al llamar a ${toolName}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error al llamar a la herramienta MCP ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene información sobre la base de datos
   */
  async getDatabaseInfo() {
    return this.callTool('notion_retrieve_database', {
      database_id: this.databaseId
    });
  }

  /**
   * Consulta la base de datos con filtros opcionales
   */
  async queryDatabase(filter?: any, sorts?: any[], startCursor?: string, pageSize: number = 100) {
    const args: any = {
      database_id: this.databaseId,
      page_size: pageSize
    };
    
    if (filter) args.filter = filter;
    if (sorts) args.sorts = sorts;
    if (startCursor) args.start_cursor = startCursor;
    
    return this.callTool('notion_query_database', args);
  }

  // Eliminado método getReadyCaseStudies

  // Eliminado método getAllCaseStudies

  /**
   * Obtiene información detallada de una página
   */
  async getPage(pageId: string) {
    return this.callTool('notion_retrieve_page', {
      page_id: pageId
    });
  }

  /**
   * Obtiene los bloques hijos de un bloque
   */
  async getBlockChildren(blockId: string, startCursor?: string, pageSize: number = 100) {
    const args: any = {
      block_id: blockId,
      page_size: pageSize
    };
    
    if (startCursor) args.start_cursor = startCursor;
    
    return this.callTool('notion_retrieve_block_children', args);
  }
}
