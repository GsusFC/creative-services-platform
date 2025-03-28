#!/usr/bin/env node
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

interface NotionFile {
  type: 'file' | 'external';
  name?: string;
  file?: { 
    url: string; 
    expiry_time?: string 
  };
  external?: { 
    url: string 
  };
}

interface NotionProperty {
  id: string;
  type: string;
  files?: NotionFile[];
  url?: string;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

interface ImageAnalysisResult {
  propertyName: string;
  files: NotionFile[];
  status: 'ok' | 'empty' | 'duplicate' | 'unexpected' | 'invalid';
  invalidFormats?: NotionFile[];
}

interface VideoAnalysisResult {
  propertyName: string;
  url: string | null;
  status: 'ok' | 'missing';
}

// Configuración
const EXPECTED_IMAGE_PROPERTIES = [
  'Avatar',
  'Cover', 
  'Hero Image',
  ...Array.from({length: 12}, (_, i) => `Image [${i + 1}]`)
];

const EXPECTED_VIDEO_PROPERTIES = [
  'Video 1',
  'Video 2'
];

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

/**
 * Valida y obtiene la API key de Notion
 * @throws Error si la API key no está configurada
 */
function getNotionApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_NOTION_API_KEY no está configurada en .env.local');
  }
  return apiKey;
}

/**
 * Obtiene una página de Notion
 * @param notionClient Cliente de Notion
 * @param pageId ID de la página
 * @returns Promise<NotionPage>
 * @throws Error si falla la consulta o la página no tiene propiedades
 */
async function getNotionPage(notionClient: Client, pageId: string): Promise<NotionPage> {
  const page = await notionClient.pages.retrieve({ page_id: pageId }) as unknown as NotionPage;
  
  if (!page?.properties) {
    throw new Error(`La página ${pageId} no tiene propiedades válidas`);
  }
  
  return page;
}

async function main() {
  console.log('🚀 Iniciando análisis de imágenes en Notion...');
  
  try {
    // 1. Configuración inicial
    const apiKey = getNotionApiKey();
    const notion = new Client({ auth: apiKey });
    const pageId = '137a44dc-3505-8037-a0aa-f3ce17af874d';
    
    // 2. Obtener página
    console.log('🔍 Obteniendo página de Notion...');
    const page = await getNotionPage(notion, pageId);

    // 3. Analizar propiedades de imagen
    console.log('\n📊 Analizando propiedades de imagen...');
    const imageResults = analyzeImageProperties(page.properties);
    
    // Mostrar resultados
    console.log('\n📝 Resultados del análisis:');
    imageResults.forEach(result => {
      const statusIcon = result.status === 'ok' ? chalk.green('✅') : 
                        result.status === 'empty' ? chalk.yellow('⚠️') : 
                        result.status === 'duplicate' ? chalk.blue('🔄') :
                        result.status === 'invalid' ? chalk.red('❌') : '❓';
      
      console.log(chalk.bold(`\n${statusIcon} ${result.propertyName}:`));
      
      if (result.files.length === 0) {
        console.log(chalk.dim('   Sin archivos'));
      } else {
        result.files.forEach(file => {
          const fileName = getFileNameFromUrl(file);
          const isInvalid = result.invalidFormats?.includes(file);
          
          if (isInvalid) {
            const ext = file.type === 'file' 
              ? file.file?.url.split('.').pop()?.toUpperCase()
              : file.external?.url.split('.').pop()?.toUpperCase();
            console.log(chalk.red(`   - ${fileName} (Formato no soportado: ${ext})`));
          } else {
            console.log(`   - ${fileName}`);
          }

          if (file.type === 'file' && file.file?.expiry_time) {
            console.log(chalk.dim(`     ⏳ Expira: ${file.file.expiry_time}`));
          }
        });
      }
    });

    // 4. Analizar propiedades de video
    console.log('\n🎥 Analizando propiedades de video...');
    const videoResults = analyzeVideoProperties(page.properties);
    
    videoResults.forEach(result => {
      const statusIcon = result.status === 'ok' ? '✅' : '⚠️';
      console.log(`\n${statusIcon} ${result.propertyName}:`);
      console.log(`   ${result.url || 'No configurado'}`);
    });

    // 5. Resumen final
    console.log('\n📌 Resumen:');
    const totalImages = imageResults.reduce((sum, r) => sum + r.files.length, 0);
    const missingImages = imageResults.filter(r => r.status === 'empty').length;
    const duplicateImages = imageResults.filter(r => r.status === 'duplicate').length;
    
    const invalidImages = imageResults.filter(r => r.status === 'invalid').length;
    
    console.log(chalk.bold('\n📊 Estadísticas finales:'));
    console.log(`- ${chalk.green(totalImages)} imágenes encontradas`);
    console.log(`- ${chalk.yellow(missingImages)} propiedades vacías`);
    console.log(`- ${chalk.blue(duplicateImages)} propiedades duplicadas`);
    console.log(`- ${chalk.red(invalidImages)} formatos no soportados`);

    // Mostrar URLs problemáticas
    const invalidFiles = imageResults.flatMap(r => r.invalidFormats || []);
    if (invalidFiles.length > 0) {
      console.log(chalk.bold('\n⚠️ Archivos con formatos no soportados:'));
      invalidFiles.forEach(file => {
        const url = file.type === 'file' ? file.file?.url : file.external?.url;
        const ext = url?.split('.').pop()?.toUpperCase();
        console.log(chalk.red(`- ${url} (${ext})`));
      });
    }

  } catch (error) {
    console.error('\n❌ Error en el análisis:');
    if (error instanceof Error) {
      console.error(`- Mensaje: ${error.message}`);
      if (error.stack) {
        console.error(`- Stack: ${error.stack.split('\n')[1]?.trim()}`);
      }
    } else {
      console.error('- Error desconocido:', error);
    }
    process.exit(1);
  }
}

/**
 * Analiza las propiedades de imagen de una página de Notion
 */
function analyzeImageProperties(properties: Record<string, NotionProperty>): ImageAnalysisResult[] {
  // Obtener todas las propiedades de tipo 'files'
  const fileEntries = Object.entries(properties)
    .filter(([_, value]) => value.type === 'files' && Array.isArray(value.files))
    .map(([key, value]) => ({ key, value }));

  // Agrupar por nombre base (sin espacios)
  const propertyGroups = fileEntries.reduce<Record<string, Array<{key: string; value: NotionProperty}>>>(
    (groups, {key, value}) => {
      const baseKey = key.trim();
      if (!groups[baseKey]) groups[baseKey] = [];
      groups[baseKey].push({ key, value });
      return groups;
    }, {});

  return Object.entries(propertyGroups).map(([baseKey, group]) => {
    const isExpected = EXPECTED_IMAGE_PROPERTIES.includes(baseKey);
    const isDuplicate = group.length > 1;
    const isEmpty = group.every(({ value }) => !value.files || value.files.length === 0);
    const files = group.flatMap(({ value }) => value.files || []);

    // Validar formatos de imagen
    const invalidFormats = files.filter(file => {
      const url = file.type === 'file' ? file.file?.url : file.external?.url;
      if (!url) return false;
      const ext = url.split('.').pop()?.toLowerCase();
      return ext && !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
    });

    const status: 'duplicate' | 'empty' | 'unexpected' | 'ok' | 'invalid' = 
      invalidFormats.length > 0 ? 'invalid' :
      isDuplicate ? 'duplicate' : 
      isEmpty && isExpected ? 'empty' :
      !isExpected ? 'unexpected' : 'ok';

    return {
      propertyName: baseKey,
      files,
      status,
      invalidFormats
    };
  }).sort((a, b) => {
    // Ordenar: especiales -> numéricas -> otras
    const special = ['Avatar', 'Cover', 'Hero Image'];
    const aIsSpecial = special.includes(a.propertyName);
    const bIsSpecial = special.includes(b.propertyName);
    
    if (aIsSpecial && !bIsSpecial) return -1;
    if (!aIsSpecial && bIsSpecial) return 1;
    
    const aNum = a.propertyName.match(/Image \[(\d+)\]/)?.[1];
    const bNum = b.propertyName.match(/Image \[(\d+)\]/)?.[1];
    
    if (aNum && bNum) return parseInt(aNum) - parseInt(bNum);
    if (aNum) return -1;
    if (bNum) return 1;
    
    return a.propertyName.localeCompare(b.propertyName);
  });
}

/**
 * Analiza las propiedades de video de una página de Notion
 */
function analyzeVideoProperties(properties: Record<string, NotionProperty>): VideoAnalysisResult[] {
  return EXPECTED_VIDEO_PROPERTIES.map(propName => {
    const prop = properties[propName];
    const url = prop?.type === 'url' ? prop.url ?? null : null;
    
    return {
      propertyName: propName,
      url,
      status: url ? 'ok' : 'missing' as const
    };
  });
}

/**
 * Obtiene el nombre del archivo desde una URL
 */
function getFileNameFromUrl(file: NotionFile): string {
  const url = file.type === 'file' ? file.file?.url : file.external?.url;
  if (!url) return 'Sin nombre';
  
  const fileName = url.split('/').pop() || 'Sin nombre';
  return fileName.split('?')[0]; // Eliminar query params
}

main();
