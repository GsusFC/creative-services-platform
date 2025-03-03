import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion'
import { FieldMapping } from '@/lib/field-mapper/types'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

// Función para acceso seguro a propiedades
function hasProperties(page: any): page is PageObjectResponse {
  return page && 'properties' in page;
}

export async function POST(request: Request) {
  // Set a timeout for the test to prevent hanging
  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<{success: false, error: string}>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject({ success: false, error: 'Test mapping operation timed out' });
    }, 15000); // 15 seconds timeout
  });

  try {
    // Parse and validate input
    let mappings: FieldMapping[];
    try {
      const body = await request.json();
      
      if (!Array?.isArray(body)) {
        return NextResponse?.json(
          { success: false, error: 'Invalid mappings format: expected array' },
          { status: 400 }
        );
      }
      
      mappings = body;
    } catch (error) {
      console?.error('Error parsing request body:', error);
      return NextResponse?.json(
        { success: false, error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    if (!mappings || mappings?.length === 0) {
      return NextResponse?.json(
        { success: false, error: 'No mappings to test' },
        { status: 400 }
      );
    }

    if (!process.env.NOTION_CASES_DATABASE_ID) {
      return NextResponse?.json(
        { success: false, error: 'Missing NOTION_CASES_DATABASE_ID' },
        { status: 500 }
      );
    }

    // Use Promise?.race to implement timeout
    const testPromise = async () => {
      try {
        console?.log('Testing mappings with Notion API...');
        
        // Get one page from the database
        const response = await notion.databases.query({
          database_id: process.env.NOTION_CASES_DATABASE_ID || "", // Aseguramos que nunca sea undefined
          page_size: 1
        });

        if (!response || response.results.length === 0) {
          return {
            success: false,
            error: 'No test data available in the database'
          };
        }

        const page = response?.results[0];
        const mappedData: Record<string, unknown> = {};
        const issues: Array<{field: string, error: string}> = [];

        // Try to apply each mapping
        for (const mapping of mappings) {
          try {
            // Check if the property exists
            const propertyName = hasProperties(page) 
              ? Object.keys(page.properties).find(
                  name => page.properties[name].id === mapping?.notionField
                ) 
              : null;
            
            if (!propertyName) {
              issues?.push({
                field: mapping?.websiteField,
                error: `Property with ID ${mapping?.notionField} not found in Notion page`
              });
              continue;
            }

            const property = hasProperties(page) && propertyName ? page.properties[propertyName] : null;
            
            // Extract the value based on the property type
            let value = null;
            
            switch ((property as any).type) {
              case 'title':
                value = (property as any).title?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
                break;
              case 'richText':
                value = (property as any).rich_text.map((t: { plain_text: string }) => t.plain_text).join('') || '';
                break;
              case 'number':
                value = (property as any).number;
                break;
              case 'select':
                value = (property as any).select.name ?? '';
                break;
              case 'multi_select':
                value = (property as any).multi_select.map((s: { name: string }) => s?.name) || [];
                break;
              case 'date':
                value = (property as any).date?.start ?? '';
                break;
              case 'files':
                value = (property as any).files?.map((f: { file?: { url: string }; external?: { url: string } }) => (f?.file?.url || f?.external?.url || "")) || [];
                break;
              case 'checkbox':
                value = (property as any).checkbox;
                break;
              case 'url':
                value = (property as any).url ?? '';
                break;
              case 'email':
                value = (property as any).email ?? '';
                break;
              default:
                value = `Unsupported type: ${(property as any).type}`;
            }
            
            mappedData[mapping?.websiteField] = value;
          } catch (err) {
            issues?.push({
              field: mapping?.websiteField,
              error: err instanceof Error ? err?.message : 'Unknown error'
            });
          }
        }

        // Clear timeout and return results
        return {
          success: true,
          data: mappedData,
          issues: issues?.length > 0 ? issues : null
        };
      } catch (err) {
        console?.error('Error testing mappings:', err);
        return {
          success: false,
          error: err instanceof Error ? err?.message : 'Failed to test mappings'
        };
      }
    };

    // Race between the test operation and timeout
    const result = await Promise?.race([testPromise(), timeoutPromise]);
    
    // Clear timeout if it hasn't fired yet
    if (timeoutId) clearTimeout(timeoutId);
    
    return NextResponse?.json(result);
  } catch (err) {
    // Clear timeout if it exists
    if (timeoutId) clearTimeout(timeoutId);
    
    console?.error('Unexpected error in test mapping:', err);
    return NextResponse?.json(
      { 
        success: false, 
        error: err instanceof Error ? err?.message : 'Unexpected error occurred during mapping test' 
      },
      { status: 500 }
    );
  }
}
