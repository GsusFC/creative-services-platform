/**
 * Script de demostración para sincronizar datos desde Notion usando MCP
 * 
 * Este script muestra cómo se podría utilizar el servidor MCP de Notion
 * para sincronizar los case studies desde Notion a nuestra plataforma.
 * 
 * NOTA: Este es un archivo de demostración conceptual que no funcionará
 * sin la implementación completa del cliente MCP.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Simular un cliente MCP para Notion
class MCPNotionClient {
  constructor(serverName) {
    this.serverName = serverName;
    console.log(`Inicializando cliente MCP para ${serverName}`);
  }

  async callTool(toolName, args) {
    console.log(`Llamando a la herramienta MCP: ${toolName}`);
    console.log('Argumentos:', JSON.stringify(args, null, 2));
    
    // En una implementación real, aquí se llamaría al servidor MCP
    // return await callMCPTool(this.serverName, toolName, args);
    
    // Para la demo, simulamos la respuesta
    return this.simulateResponse(toolName, args);
  }
  
  simulateResponse(toolName, args) {
    // Simular respuestas basadas en la herramienta que se llama
    switch (toolName) {
      case 'notion_retrieve_database':
        return {
          object: 'database',
          id: args.database_id,
          title: [{ text: { content: 'Highlighted Projects' } }],
          properties: {
            'Brand Name': { type: 'title' },
            'Description': { type: 'rich_text' },
            'Services': { type: 'multi_select' },
            'Status': { type: 'select' }
          }
        };
        
      case 'notion_query_database':
        return {
          object: 'list',
          results: [
            {
              id: '1a1a44dc-3505-80e4-9f48-df9510c70c81',
              properties: {
                'Brand Name': { type: 'title', title: [{ text: { content: 'Degen' } }] },
                'Description': { type: 'rich_text', rich_text: [{ text: { content: 'Meme brand with a dream' } }] },
                'Services': { type: 'multi_select', multi_select: [{ name: 'branding' }, { name: 'community' }] },
                'Status': { type: 'select', select: { name: 'Listo' } }
              }
            },
            {
              id: '17aa44dc-3505-8053-96d1-dd7cd8503027',
              properties: {
                'Brand Name': { type: 'title', title: [{ text: { content: 'Vocdoni' } }] },
                'Description': { type: 'rich_text', rich_text: [{ text: { content: 'The voice of digital voting' } }] },
                'Services': { type: 'multi_select', multi_select: [{ name: 'web3' }, { name: 'voting' }] },
                'Status': { type: 'select', select: { name: 'Sin empezar' } }
              }
            }
          ]
        };
        
      case 'notion_retrieve_page':
        return {
          id: args.page_id,
          properties: {
            'Brand Name': { type: 'title', title: [{ text: { content: 'Degen' } }] },
            'Description': { type: 'rich_text', rich_text: [{ text: { content: 'Meme brand with a dream' } }] },
            'Services': { type: 'multi_select', multi_select: [{ name: 'branding' }, { name: 'community' }] },
            'Status': { type: 'select', select: { name: 'Listo' } },
            'Cover': { 
              type: 'files', 
              files: [{ 
                type: 'external', 
                external: { url: 'https://example.com/degen-cover.jpg' } 
              }]
            }
          }
        };
        
      default:
        return { error: 'Herramienta no implementada en la demo' };
    }
  }
}

// Función para transformar los datos de Notion a nuestro formato
function transformCaseStudy(notionPage) {
  const props = notionPage.properties;
  
  // Obtener título
  const titleProp = props['Brand Name'];
  const title = titleProp.title[0]?.text.content || 'Sin título';
  
  // Obtener descripción
  const descProp = props['Description'];
  const description = descProp.rich_text[0]?.text.content || '';
  
  // Obtener servicios
  const servicesProp = props['Services'];
  const tags = servicesProp.multi_select.map(item => item.name);
  
  // Obtener estado
  const statusProp = props['Status'];
  const notionStatus = statusProp.select?.name || 'Sin empezar';
  const status = notionStatus === 'Listo' ? 'published' : 'draft';
  
  // Obtener imágenes (si existen)
  const mediaProp = props['Cover'];
  const mediaItems = [];
  
  if (mediaProp && mediaProp.files && mediaProp.files.length > 0) {
    mediaProp.files.forEach((file, index) => {
      let url = '';
      if (file.type === 'external') url = file.external.url;
      else if (file.type === 'file') url = file.file.url;
      
      if (url) {
        mediaItems.push({
          type: 'image',
          url,
          alt: `Imagen ${index + 1} de ${title}`,
          order: index
        });
      }
    });
  }
  
  // Crear slug desde el título
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return {
    id: notionPage.id,
    title,
    description,
    tags,
    status,
    mediaItems,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Función para guardar archivos multimedia
async function saveMediaFile(mediaItem, slug) {
  const mediaDir = path.join(process.cwd(), 'public', 'case-studies', slug);
  
  // Crear directorio si no existe
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
  
  // Obtener nombre del archivo desde la URL
  const urlParts = mediaItem.url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const filePath = path.join(mediaDir, fileName);
  
  console.log(`  - Descargando archivo: ${fileName}`);
  
  // En una implementación real, aquí descargaríamos el archivo
  // await downloadFile(mediaItem.url, filePath);
  
  // Actualizar la URL para que sea relativa
  return {
    ...mediaItem,
    url: `/case-studies/${slug}/${fileName}`
  };
}

// Función principal
async function syncWithNotion() {
  console.log('Iniciando sincronización con Notion usando MCP');
  const client = new MCPNotionClient('github.com/pashpashpash/mcp-notion-server');
  const DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || 'a3a61fb1fb954b1a9534aeb723597368';
  
  try {
    // 1. Obtener información de la base de datos
    console.log('1. Consultando base de datos:', DATABASE_ID);
    const dbInfo = await client.callTool('notion_retrieve_database', { database_id: DATABASE_ID });
    console.log(`  - Base de datos "${dbInfo.title[0]?.text.content}" encontrada`);
    
    // 2. Consultar los case studies
    console.log('2. Obteniendo case studies');
    const queryResult = await client.callTool('notion_query_database', { 
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Listo'
        }
      }
    });
    console.log(`  - Encontrados ${queryResult.results.length} case studies`);
    
    // 3. Procesar cada case study
    const results = [];
    for (const page of queryResult.results) {
      const pageId = page.id;
      console.log(`3. Procesando case study "${page.properties['Brand Name'].title[0]?.text.content}"`);
      
      // 3.1 Obtener detalles completos de la página
      console.log(`  - Obteniendo detalles completos`);
      const fullPage = await client.callTool('notion_retrieve_page', { page_id: pageId });
      
      // 3.2 Transformar a nuestro formato
      console.log(`  - Transformando datos`);
      const caseStudy = transformCaseStudy(fullPage);
      
      // 3.3 Procesar archivos multimedia (si existen)
      if (caseStudy.mediaItems.length > 0) {
        console.log(`  - Procesando ${caseStudy.mediaItems.length} archivos multimedia`);
        const processedMedia = [];
        
        for (const mediaItem of caseStudy.mediaItems) {
          const processed = await saveMediaFile(mediaItem, caseStudy.slug);
          processedMedia.push(processed);
        }
        
        caseStudy.mediaItems = processedMedia;
      }
      
      // 3.4 Guardar JSON en data/case-studies/
      const dataDir = path.join(process.cwd(), 'data', 'case-studies');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const jsonPath = path.join(dataDir, `${caseStudy.id}.json`);
      console.log(`  - Guardando datos en ${jsonPath}`);
      
      // En una implementación real escribiríamos el archivo
      // fs.writeFileSync(jsonPath, JSON.stringify(caseStudy, null, 2));
      
      results.push(caseStudy);
    }
    
    // 4. Actualizar índice
    console.log('4. Actualizando índice de case studies');
    const indexPath = path.join(process.cwd(), 'data', 'case-studies-index.json');
    const index = results.map(cs => ({
      id: cs.id,
      title: cs.title,
      slug: cs.slug,
      status: cs.status
    }));
    
    // En una implementación real escribiríamos el índice
    // fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    
    console.log('✅ Sincronización completada con éxito');
    return results;
    
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
    throw error;
  }
}

// Esta función es la que se exportaría para usarse en la aplicación
export async function mcpSyncNotionCaseStudies() {
  try {
    const results = await syncWithNotion();
    return {
      success: true,
      message: `Sincronizados ${results.length} case studies desde Notion`,
      data: results
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al sincronizar con Notion: ${error.message}`,
      error
    };
  }
}

// Si se ejecuta directamente (para pruebas)
if (typeof require !== 'undefined' && require.main === module) {
  syncWithNotion()
    .then(() => console.log('Script completado'))
    .catch(err => console.error('Error:', err));
}
