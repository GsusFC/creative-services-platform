import { notion } from '@/lib/notion'
import { Mapping } from './store'

export async function testMapping(mappings: Mapping[]) {
  // Set a timeout for the test to prevent hanging
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<{success: false, error: string}>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject({ success: false, error: 'Test mapping operation timed out' });
    }, 10000); // 10 seconds timeout
  });

  try {
    if (!mappings || mappings.length === 0) {
      return {
        success: false,
        error: 'No mappings to test'
      };
    }

    if (!process.env.NOTION_CASES_DATABASE_ID) {
      return {
        success: false,
        error: 'Missing NOTION_CASES_DATABASE_ID'
      };
    }

    // Use Promise.race to implement timeout
    const testPromise = async () => {
      try {
        // Get one page from the database
        const response = await notion.databases.query({
          database_id: process.env.NOTION_CASES_DATABASE_ID,
          page_size: 1
        });

        if (response.results.length === 0) {
          return {
            success: false,
            error: 'No test data available in the database'
          };
        }

        const page = response.results[0];
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
            let value = null;
            
            switch (property.type) {
              case 'title':
                value = property.title?.map((t: any) => t.plain_text).join('') || '';
                break;
              case 'rich_text':
                value = property.rich_text?.map((t: any) => t.plain_text).join('') || '';
                break;
              case 'number':
                value = property.number;
                break;
              case 'select':
                value = property.select?.name || '';
                break;
              case 'multi_select':
                value = property.multi_select?.map((s: any) => s.name) || [];
                break;
              case 'date':
                value = property.date?.start || '';
                break;
              case 'files':
                value = property.files?.map((f: any) => f.file?.url || f.external?.url || '') || [];
                break;
              case 'checkbox':
                value = property.checkbox;
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
          issues: issues.length > 0 ? issues : null
        };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to test mappings'
        };
      }
    };

    const result = await Promise.race([testPromise(), timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to test mappings'
    };
  }
}
