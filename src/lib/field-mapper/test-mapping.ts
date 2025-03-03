import { notion, isUsingMockData } from '../../lib/notion'
import { FieldMapping } from './types'; // Importar FieldMapping en lugar de Mapping

interface TestMappingResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
  issues?: Array<{field: string, error: string}>;
  usingMockData?: boolean;
}

interface PageProperties {
  [key: string]: {
    id: string;
    type: string;
    title?: { plain_text: string }[];
    rich_text?: { plain_text: string }[];
    number?: number;
    select?: { name: string };
    multi_select?: { name: string }[];
    date?: { start: string };
    files?: { file?: { url: string }, external?: { url: string } }[];
    checkbox?: boolean;
    url?: string;
    email?: string;
    [key: string]: unknown; // Para permitir otras propiedades dinámicas
  }
}

interface Page {
  properties: PageProperties;
}

interface Notion {
  databases: {
    query: (options: { database_id: string, page_size: number }) => Promise<{ results: Page[], next_cursor: string | null, has_more: boolean }>;
  }
}

interface NotionClient {
  databases: {
    query: (options: { database_id: string, page_size: number }) => Promise<{ results: Page[], next_cursor: string | null, has_more: boolean }>;
  }
}

interface DataType {
  databases: {
    query: (options: { database_id: string, page_size: number }) => Promise<{ results: Page[], next_cursor: string | null, has_more: boolean }>;
  }
}

interface MappedType {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
  issues?: Array<{field: string, error: string}>;
  usingMockData?: boolean;
}

const handleConversion = (client: NotionClient): Notion => {
  try {
    // Implement conversion logic here
    // For example:
    const notionClient: Notion = {
      databases: {
        query: async (options) => {
          const response = await client.databases.query(options);
          // Perform any necessary data transformations here
          return response;
        }
      }
    };
    return notionClient;
  } catch (error) {
    throw new Error(`Failed to convert Notion client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para manejar el mapeo de datos (no implementada aún)
const handleMapping = (data: DataType): MappedType => {
  // Implementación básica para evitar error de TypeScript
  return {
    success: false,
    error: 'Not implemented',
    usingMockData: isUsingMockData()
  };
};

export const testMapping = async (mappings: FieldMapping[]): Promise<TestMappingResult> => {
  // Set a timeout for the test to prevent hanging
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<TestMappingResult>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject({ success: false, error: 'Test mapping operation timed out', usingMockData: isUsingMockData() });
    }, 10000); // 10 seconds timeout
  });

  try {
    if (!mappings || mappings.length === 0) {
      return {
        success: false,
        error: 'No mappings to test',
        usingMockData: isUsingMockData()
      };
    }

    if (!process.env.NOTION_CASES_DATABASE_ID) {
      return {
        success: false,
        error: 'Missing NOTION_CASES_DATABASE_ID',
        usingMockData: isUsingMockData()
      };
    }

    // Use Promise.race to implement timeout
    const testPromise = async (): Promise<TestMappingResult> => {
      try {
        // Get one page from the database
        const response = await handleConversion(notion as unknown as NotionClient).databases.query({
          database_id: process.env.NOTION_CASES_DATABASE_ID || '',
          page_size: 1
        });

        if (response.results.length === 0) {
          return {
            success: false,
            error: 'No test data available in the database',
            usingMockData: isUsingMockData()
          };
        }

        const page = response.results[0] as Page;
        const mappedData: Record<string, any> = {};
        const issues: Array<{field: string, error: string}> = [];

        // Try to apply each mapping
        for (const mapping of mappings) {
          try {
            // Check if the property exists
            const propertyName = Object.keys(page.properties).find(
              name => page.properties[name].id === mapping.notionField
            );
            
            if (!propertyName) {
              issues.push({
                field: mapping.websiteField,
                error: `Property with ID ${mapping.notionField} not found in Notion page`
              });
              continue;
            }

            const property = page.properties[propertyName];
            
            // Extract the value based on the property type
            let value: string | number | boolean | string[] | null = null;
            
            switch (property.type) {
              case 'title':
                value = property.title?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
                break;
              case 'rich_text':
                value = property.rich_text?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
                break;
              case 'number':
                value = property.number !== undefined ? property.number : null;
                break;
              case 'select':
                value = property.select?.name || '';
                break;
              case 'multi_select':
                value = property.multi_select?.map((s: { name: string }) => s.name) || [];
                break;
              case 'date':
                value = property.date?.start || '';
                break;
              case 'files':
                value = property.files?.map((f: { file?: { url: string }, external?: { url: string } }) => 
                  f.file?.url || f.external?.url || '') || [];
                break;
              case 'checkbox':
                value = property.checkbox !== undefined ? property.checkbox : null;
                break;
              case 'url':
                value = property.url || '';
                break;
              case 'email':
                value = property.email || '';
                break;
              default:
                value = 'Unsupported type: ' + property.type;
            }
            
            mappedData[mapping.websiteField] = value;
          } catch (err) {
            issues.push({
              field: mapping.websiteField,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        }

        return {
          success: true,
          data: mappedData,
          issues: issues.length > 0 ? issues : undefined,
          usingMockData: isUsingMockData()
        };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to test mappings',
          usingMockData: isUsingMockData()
        };
      }
    };

    return await Promise.race([testPromise(), timeoutPromise]).then(result => {
      if (timeoutId) clearTimeout(timeoutId);
      return result;
    });
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to test mappings',
      usingMockData: isUsingMockData()
    };
  }
};
