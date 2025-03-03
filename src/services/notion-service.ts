import { Client } from '@notionhq/client';

// Tipos para la API de Notion
type NotionDatabaseProperty = {
  id: string;
  name: string;
  type: string;
  options?: Array<{ id: string; name: string; color: string }>;
};

type NotionDatabaseStructure = {
  properties: NotionDatabaseProperty[];
  databaseName: string;
};

type NotionProject = {
  id: string;
  title: string;
  properties: Record<string, unknown>;
  url: string;
  createdTime: string;
  lastEditedTime: string;
};

// Tipos específicos para la API de Notion
interface NotionPropertyValue {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface NotionPageObject {
  id: string;
  properties: Record<string, NotionPropertyValue>;
  url: string;
  created_time: string;
  last_edited_time: string;
}

interface NotionTitleText {
  type: string;
  plain_text: string;
  annotations?: unknown;
  href?: string;
}

interface NotionDatabaseResponse {
  properties: Record<string, NotionPropertyValue>;
  title?: NotionTitleText[];
  description?: unknown;
  id: string;
  name?: string;
}

// Opciones para importar proyectos
type ImportOptions = {
  databaseId?: string;
  validateFields?: boolean;
  autoResolveConflicts?: boolean;
  importImages?: boolean;
  debug?: boolean;
};

// Resultado de una importación
type ImportResult = {
  id: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  databaseId: string;
  totalItems: number;
  importedItems: number;
  updatedItems: number;
  failedItems: number;
  conflicts: number;
  options: ImportOptions;
  details?: unknown;
  error?: string;
};

// Clase principal del servicio de Notion
class NotionService {
  private client: Client;
  private apiKey: string;
  private databaseId: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = process.env.NOTION_API_KEY || '';
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
    this.isConfigured = this.isProperlyConfigured();
    
    // Inicializar el cliente de Notion
    this.client = new Client({
      auth: this.apiKey,
    });
    
    // Registrar el estado de la configuración
    console.log(`NotionService inicializado. Configuración ${this.isConfigured ? 'completa' : 'incompleta'}`);
  }

  // Verifica si el servicio está configurado correctamente
  isProperlyConfigured(): boolean {
    // Verificar que tenemos las credenciales necesarias
    const hasApiKey = !!this.apiKey && this.apiKey.length > 0;
    const hasDatabaseId = !!this.databaseId && this.databaseId.length > 0;
    const isNotMockKey = this.apiKey !== 'secret_development_mock_key_for_testing_only';
    
    // Registrar el estado de la configuración para depuración
    console.log('Configuración de Notion:');
    console.log(`- API Key: ${hasApiKey ? 'Configurada' : 'No configurada'}`);
    console.log(`- Database ID: ${hasDatabaseId ? 'Configurado' : 'No configurado'}`);
    console.log(`- Es clave real: ${isNotMockKey ? 'Sí' : 'No'}`);
    
    return hasApiKey && hasDatabaseId && isNotMockKey;
  }

  // Obtiene la estructura de la base de datos
  async getDatabaseStructure(): Promise<NotionDatabaseStructure> {
    try {
      if (!this.isConfigured) {
        console.log('Usando estructura de base de datos simulada (modo desarrollo)');
        return this.getMockDatabaseStructure();
      }

      // Realizar la petición a la API de Notion
      const response = await this.client.databases.retrieve({
        database_id: this.databaseId
      }) as unknown as NotionDatabaseResponse;

      // Extraer y formatear las propiedades
      const properties = Object.entries(response.properties).map(([key, value]: [string, NotionPropertyValue]) => {
        const type = value.type;
        let options;
        
        // Extraer opciones para tipos select y multi_select
        if (type === 'select' || type === 'multi_select') {
          options = (value[type] as { options?: Array<{ id: string; name: string; color: string }> })?.options?.map((opt) => ({
            id: opt.id,
            name: opt.name,
            color: opt.color
          }));
        }
        
        return {
          id: value.id,
          name: key,
          type,
          options
        };
      });

      // Acceder al título de la base de datos de manera segura
      const databaseName = response.title && response.title.length > 0 
        ? response.title[0]?.plain_text ?? 'Notion Database'
        : 'Notion Database';

      return {
        properties,
        databaseName
      };
    } catch (error) {
      console.error('Error al obtener estructura de la base de datos:', error);
      
      // En caso de error, devolver datos simulados
      return this.getMockDatabaseStructure();
    }
  }

  // Obtiene proyectos de la base de datos
  async getProjects(limit = 10): Promise<NotionProject[]> {
    try {
      // Verificar si el servicio está configurado
      if (!this.isProperlyConfigured()) {
        console.log('Usando proyectos simulados (modo desarrollo) - Configuración incompleta');
        return this.getMockProjects(limit);
      }

      console.log(`Obteniendo proyectos de Notion (database_id: ${this.databaseId})`);
      
      // Realizar la petición a la API de Notion
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        page_size: limit
      });

      console.log(`Proyectos obtenidos: ${response.results.length}`);
      
      // Procesar los resultados
      const projects = response.results.map((page) => {
        const pageObj = page as NotionPageObject;
        
        // Extraer el título (asumiendo que hay una propiedad de tipo título)
        let title = 'Proyecto sin título';
        
        // Buscar la propiedad de tipo título
        const titleProp = Object.values(pageObj.properties).find(
          (prop) => prop.type === 'title'
        );
        
        if (titleProp && 'title' in titleProp && Array.isArray(titleProp.title) && titleProp.title.length > 0) {
          title = titleProp.title.map((t: { plain_text: string }) => t.plain_text).join('');
        }

        return {
          id: pageObj.id,
          title,
          properties: pageObj.properties,
          url: pageObj.url,
          createdTime: pageObj.created_time,
          lastEditedTime: pageObj.last_edited_time
        };
      });

      console.log('Proyectos procesados correctamente');
      
      return projects;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      
      // En caso de error, mostrar detalles
      if (error instanceof Error) {
        console.error(`Mensaje de error: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
      }
      
      // Devolver datos simulados como fallback
      console.log('Devolviendo proyectos simulados debido al error');
      return this.getMockProjects(limit);
    }
  }

  // Obtiene un proyecto específico por su ID
  async getProjectById(projectId: string): Promise<NotionProject | null> {
    try {
      if (!this.isConfigured) {
        console.log('NotionService: Usando datos simulados para getProjectById');
        // Devolver un proyecto simulado para desarrollo
        return {
          id: projectId,
          title: `Proyecto ${projectId.slice(0, 8)}`,
          properties: this.getMockProjectProperties(),
          url: `https://notion.so/${projectId}`,
          createdTime: new Date().toISOString(),
          lastEditedTime: new Date().toISOString(),
        };
      }
      
      // En una implementación real, obtendríamos el proyecto de Notion
      const response = await this.client.pages.retrieve({
        page_id: projectId
      });
      
      // Extraer el título del proyecto
      let title = 'Proyecto sin título';
      
      // Verificar que response sea un PageObjectResponse (no un PartialPageObjectResponse)
      if ('properties' in response) {
        const titleProperty = Object.values(response.properties).find(
          prop => 'type' in prop && prop.type === 'title'
        );
        
        if (
          titleProperty && 
          'type' in titleProperty && 
          titleProperty.type === 'title' && 
          'title' in titleProperty && 
          Array.isArray(titleProperty.title) && 
          titleProperty.title.length > 0 && 
          'plain_text' in titleProperty.title[0]
        ) {
          title = titleProperty.title[0].plain_text;
        }
        
        return {
          id: response.id,
          title,
          properties: response.properties,
          url: 'url' in response ? response.url : `https://notion.so/${response.id}`,
          createdTime: 'created_time' in response ? response.created_time : new Date().toISOString(),
          lastEditedTime: 'last_edited_time' in response ? response.last_edited_time : new Date().toISOString(),
        };
      }
      
      // Si no es un PageObjectResponse completo, devolver un objeto con datos mínimos
      const responseId = response.id;
      return {
        id: responseId,
        title,
        properties: {},
        url: `https://notion.so/${responseId}`,
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error al obtener proyecto ${projectId}:`, error);
      return null;
    }
  }

  // Importa proyectos desde Notion
  async importProjects(options: ImportOptions): Promise<ImportResult> {
    try {
      if (!this.isConfigured) {
        console.log('Usando importación simulada (modo desarrollo)');
        return this.getMockImportResult(options);
      }

      // Aquí iría la implementación real de importación
      // Por ahora, devolvemos un resultado simulado
      return this.getMockImportResult(options);
    } catch (error) {
      console.error('Error al importar proyectos:', error);
      
      // Devolver un resultado de error
      return {
        id: `import-${Date.now()}`,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        status: 'error',
        databaseId: options.databaseId || this.databaseId,
        totalItems: 0,
        importedItems: 0,
        updatedItems: 0,
        failedItems: 0,
        conflicts: 0,
        options,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Obtiene detalles de una importación
  async getImportDetails(importId: string): Promise<ImportResult | null> {
    // En una implementación real, buscaríamos en una base de datos
    // Por ahora, devolvemos datos simulados
    if (importId.startsWith('import-')) {
      return {
        id: importId,
        startTime: new Date(Date.now() - 60000).toISOString(),
        endTime: new Date().toISOString(),
        status: 'completed',
        databaseId: this.databaseId,
        totalItems: 15,
        importedItems: 12,
        updatedItems: 3,
        failedItems: 0,
        conflicts: 2,
        options: {
          validateFields: true,
          autoResolveConflicts: false,
          importImages: true
        },
        details: {
          newProjects: [
            { id: 'p1', title: 'Proyecto A', status: 'Activo' },
            { id: 'p2', title: 'Proyecto B', status: 'Planificación' },
          ],
          updatedProjects: [
            { id: 'p3', title: 'Proyecto C', status: 'Actualizado' }
          ],
          conflictIds: ['conflict-001', 'conflict-002']
        }
      };
    }
    
    return null;
  }

  // Obtiene historial de importaciones
  async getImportHistory(): Promise<ImportResult[]> {
    // En una implementación real, buscaríamos en una base de datos
    // Por ahora, devolvemos datos simulados
    return [
      {
        id: 'import-1682424315000',
        startTime: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 días atrás
        endTime: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
        status: 'completed',
        databaseId: this.databaseId,
        totalItems: 20,
        importedItems: 18,
        updatedItems: 2,
        failedItems: 0,
        conflicts: 1,
        options: {
          validateFields: true,
          autoResolveConflicts: false,
          importImages: true
        }
      },
      {
        id: 'import-1682337915000',
        startTime: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 días atrás
        endTime: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
        status: 'completed',
        databaseId: this.databaseId,
        totalItems: 20,
        importedItems: 15,
        updatedItems: 5,
        failedItems: 0,
        conflicts: 3,
        options: {
          validateFields: true,
          autoResolveConflicts: true,
          importImages: true
        }
      },
      {
        id: 'import-1682251515000',
        startTime: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 días atrás
        endTime: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
        status: 'error',
        databaseId: this.databaseId,
        totalItems: 20,
        importedItems: 5,
        updatedItems: 2,
        failedItems: 13,
        conflicts: 0,
        options: {
          validateFields: true,
          autoResolveConflicts: false,
          importImages: true
        },
        error: 'Error de conexión con la API de Notion'
      }
    ];
  }

  // Obtiene una estructura de base de datos simulada para desarrollo
  private getMockDatabaseStructure(): NotionDatabaseStructure {
    return {
      properties: [
        {
          id: 'title',
          name: 'Nombre',
          type: 'title'
        },
        {
          id: 'status',
          name: 'Estado',
          type: 'select',
          options: [
            { id: 'opt1', name: 'Activo', color: 'green' },
            { id: 'opt2', name: 'Completado', color: 'blue' },
            { id: 'opt3', name: 'Planificación', color: 'yellow' },
            { id: 'opt4', name: 'Cancelado', color: 'red' }
          ]
        },
        {
          id: 'client',
          name: 'Cliente',
          type: 'rich_text'
        },
        {
          id: 'startDate',
          name: 'Fecha de Inicio',
          type: 'date'
        },
        {
          id: 'endDate',
          name: 'Fecha de Finalización',
          type: 'date'
        },
        {
          id: 'budget',
          name: 'Presupuesto',
          type: 'number'
        },
        {
          id: 'team',
          name: 'Equipo',
          type: 'multi_select',
          options: [
            { id: 'team1', name: 'Diseño', color: 'purple' },
            { id: 'team2', name: 'Desarrollo', color: 'blue' },
            { id: 'team3', name: 'Marketing', color: 'orange' },
            { id: 'team4', name: 'Contenido', color: 'green' }
          ]
        },
        {
          id: 'priority',
          name: 'Prioridad',
          type: 'select',
          options: [
            { id: 'p1', name: 'Alta', color: 'red' },
            { id: 'p2', name: 'Media', color: 'yellow' },
            { id: 'p3', name: 'Baja', color: 'green' }
          ]
        },
        {
          id: 'description',
          name: 'Descripción',
          type: 'rich_text'
        },
        {
          id: 'completed',
          name: 'Completado',
          type: 'checkbox'
        }
      ],
      databaseName: 'Proyectos Creativos'
    };
  }

  // Obtiene proyectos simulados para desarrollo
  private getMockProjects(limit: number): NotionProject[] {
    const mockProjects: NotionProject[] = [];
    
    for (let i = 0; i < limit; i++) {
      mockProjects.push({
        id: `project-${i + 1}`,
        title: `Proyecto de Ejemplo ${i + 1}`,
        url: `https://notion.so/project-${i + 1}`,
        createdTime: new Date(Date.now() - i * 86400000).toISOString(),
        lastEditedTime: new Date(Date.now() - i * 43200000).toISOString(),
        properties: {
          title: {
            type: 'title',
            title: [{ type: 'text', text: { content: `Proyecto de Ejemplo ${i + 1}` }, plain_text: `Proyecto de Ejemplo ${i + 1}` }]
          },
          status: {
            type: 'select',
            select: { id: `opt${(i % 4) + 1}`, name: ['Activo', 'Completado', 'Planificación', 'Cancelado'][i % 4], color: ['green', 'blue', 'yellow', 'red'][i % 4] }
          },
          client: {
            type: 'rich_text',
            rich_text: [{ type: 'text', text: { content: `Cliente ${String.fromCharCode(65 + i % 26)}` }, plain_text: `Cliente ${String.fromCharCode(65 + i % 26)}` }]
          },
          startDate: {
            type: 'date',
            date: { start: new Date(Date.now() - i * 86400000 * 30).toISOString() }
          },
          endDate: {
            type: 'date',
            date: { start: new Date(Date.now() + i * 86400000 * 30).toISOString() }
          },
          budget: {
            type: 'number',
            number: 10000 + i * 5000
          },
          team: {
            type: 'multi_select',
            multi_select: [
              { id: 'team1', name: 'Diseño', color: 'purple' },
              { id: 'team2', name: 'Desarrollo', color: 'blue' }
            ]
          },
          priority: {
            type: 'select',
            select: { id: `p${(i % 3) + 1}`, name: ['Alta', 'Media', 'Baja'][i % 3], color: ['red', 'yellow', 'green'][i % 3] }
          },
          description: {
            type: 'rich_text',
            rich_text: [{ type: 'text', text: { content: `Descripción del proyecto ${i + 1}. Este es un proyecto de ejemplo para desarrollo.` }, plain_text: `Descripción del proyecto ${i + 1}. Este es un proyecto de ejemplo para desarrollo.` }]
          },
          completed: {
            type: 'checkbox',
            checkbox: i % 2 === 0
          }
        }
      });
    }
    
    return mockProjects;
  }

  // Obtiene un resultado de importación simulado
  private getMockImportResult(options: ImportOptions): ImportResult {
    const totalItems = Math.floor(Math.random() * 15) + 5;
    const importedItems = Math.floor(Math.random() * totalItems);
    const updatedItems = Math.floor(Math.random() * (totalItems - importedItems));
    const failedItems = totalItems - importedItems - updatedItems;
    const conflicts = Math.floor(Math.random() * 5);
    
    return {
      id: `import-${Date.now()}`,
      startTime: new Date(Date.now() - 5000).toISOString(),
      endTime: new Date().toISOString(),
      status: 'completed',
      databaseId: options.databaseId || this.databaseId,
      totalItems,
      importedItems,
      updatedItems,
      failedItems,
      conflicts,
      options,
      details: {
        newProjects: Array.from({ length: importedItems }, (_, i) => ({
          id: `p${i + 1}`,
          title: `Proyecto Nuevo ${i + 1}`,
          status: ['Activo', 'Planificación'][i % 2]
        })),
        updatedProjects: Array.from({ length: updatedItems }, (_, i) => ({
          id: `p${importedItems + i + 1}`,
          title: `Proyecto Actualizado ${i + 1}`,
          status: 'Actualizado'
        })),
        conflictIds: Array.from({ length: conflicts }, (_, i) => `conflict-00${i + 1}`)
      }
    };
  }

  // Obtiene propiedades simuladas de un proyecto para desarrollo
  private getMockProjectProperties(): Record<string, unknown> {
    return {
      title: {
        type: 'title',
        title: [{ type: 'text', text: { content: 'Proyecto de Ejemplo' }, plain_text: 'Proyecto de Ejemplo' }]
      },
      status: {
        type: 'select',
        select: { id: 'opt1', name: 'Activo', color: 'green' }
      },
      client: {
        type: 'rich_text',
        rich_text: [{ type: 'text', text: { content: 'Cliente A' }, plain_text: 'Cliente A' }]
      },
      startDate: {
        type: 'date',
        date: { start: new Date(Date.now() - 86400000 * 30).toISOString() }
      },
      endDate: {
        type: 'date',
        date: { start: new Date(Date.now() + 86400000 * 30).toISOString() }
      },
      budget: {
        type: 'number',
        number: 10000
      },
      team: {
        type: 'multi_select',
        multi_select: [
          { id: 'team1', name: 'Diseño', color: 'purple' },
          { id: 'team2', name: 'Desarrollo', color: 'blue' }
        ]
      },
      priority: {
        type: 'select',
        select: { id: 'p1', name: 'Alta', color: 'red' }
      },
      description: {
        type: 'rich_text',
        rich_text: [{ type: 'text', text: { content: 'Descripción del proyecto. Este es un proyecto de ejemplo para desarrollo.' }, plain_text: 'Descripción del proyecto. Este es un proyecto de ejemplo para desarrollo.' }]
      },
      completed: {
        type: 'checkbox',
        checkbox: false
      }
    };
  }
}

// Exportar una instancia singleton del servicio
export const notionService = new NotionService();
