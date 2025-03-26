#!/usr/bin/env ts-node

import fs from 'fs/promises';
import path from 'path';
import * as crypto from 'crypto';

interface MediaItem {
  type: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  order?: number;
  displayMode?: string;
  videoType?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  mediaItems: MediaItem[];
  [key: string]: any;
}

/**
 * Busca un archivo de imagen local en el directorio del caso de estudio
 * basado en el nombre o hash de la URL original
 */
async function findLocalImage(s3Url: string, caseStudyId: string): Promise<string | null> {
  try {
    // Directorio donde se almacenan las imágenes para este caso de estudio
    const imagesDir = path.join(process.cwd(), 'public', 'images', caseStudyId);
    
    // Comprobar si el directorio existe
    try {
      await fs.access(imagesDir);
    } catch (error) {
      console.log(`No existe directorio de imágenes para ${caseStudyId}`);
      return null;
    }
    
    // Obtener la lista de archivos en el directorio
    const files = await fs.readdir(imagesDir);
    
    // Crear un hash de la URL para buscar coincidencias
    const urlHash = crypto.createHash('md5').update(s3Url).digest('hex').slice(0, 8);
    
    // Buscar archivos que coincidan con el hash
    for (const file of files) {
      if (file.includes(urlHash)) {
        console.log(`Encontrada coincidencia para ${urlHash}: ${file}`);
        return `/images/${caseStudyId}/${file}`;
      }
    }
    
    console.log(`No se encontró imagen local para ${urlHash}`);
    return null;
  } catch (error) {
    console.error('Error buscando imagen local:', error);
    return null;
  }
}

/**
 * Actualiza las URLs de imágenes en un caso de estudio
 */
async function updateCaseStudyImages(caseStudyId: string): Promise<void> {
  try {
    // Ruta al archivo JSON del caso de estudio
    const caseStudyPath = path.join(process.cwd(), 'data', 'case-studies', `${caseStudyId}.json`);
    
    // Leer el archivo
    const caseStudyRaw = await fs.readFile(caseStudyPath, 'utf-8');
    const caseStudy = JSON.parse(caseStudyRaw) as CaseStudy;
    
    console.log(`Procesando caso de estudio: ${caseStudy.title} (${caseStudyId})`);
    console.log(`Tiene ${caseStudy.mediaItems.length} elementos multimedia`);
    
    // Guardar copia de respaldo
    await fs.writeFile(`${caseStudyPath}.bak`, caseStudyRaw);
    
    // Actualizar las URLs de las imágenes
    let updatedCount = 0;
    
    for (let i = 0; i < caseStudy.mediaItems.length; i++) {
      const item = caseStudy.mediaItems[i];
      
      // Verificar que el item existe
      if (!item) {
        console.log(`Elemento ${i} es undefined, omitiendo`);
        continue;
      }
      
      // Solo procesar imágenes (no videos)
      if (item.type !== 'image' && item.type !== 'avatar' && item.type !== 'hero') {
        continue;
      }
      
      // Verificar que el item tiene una URL
      if (!item.url) {
        console.log(`Elemento ${i} no tiene URL, omitiendo`);
        continue;
      }
      
      // Verificar si la URL es de Amazon S3
      if (item.url.includes('prod-files-secure.s3.us-west-2.amazonaws.com')) {
        console.log(`Elemento ${i}: URL de S3 detectada`);
        
        // Buscar una imagen local
        const localUrl = await findLocalImage(item.url, caseStudyId);
        if (localUrl) {
          console.log(`Reemplazando URL de S3 con local: ${localUrl}`);
          // Verificar que el elemento sigue existiendo antes de modificarlo
          const mediaItem = caseStudy.mediaItems[i];
          if (mediaItem) {
            mediaItem.url = localUrl;
            updatedCount++;
          }
        }
      }
    }
    
    // Si se actualizaron URLs, guardar los cambios
    if (updatedCount > 0) {
      console.log(`Se actualizaron ${updatedCount} URLs de imágenes`);
      await fs.writeFile(caseStudyPath, JSON.stringify(caseStudy, null, 2));
      console.log(`Caso de estudio actualizado: ${caseStudyPath}`);
    } else {
      console.log('No se realizaron cambios');
    }
  } catch (error) {
    console.error(`Error procesando caso de estudio ${caseStudyId}:`, error);
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    // Obtener el ID del caso de estudio de los argumentos
    const caseStudyId = process.argv[2];
    
    if (!caseStudyId) {
      console.error('Debe proporcionar un ID de caso de estudio');
      console.log('Uso: ts-node update-case-study-image-urls.ts <caseStudyId>');
      process.exit(1);
    }
    
    await updateCaseStudyImages(caseStudyId);
    
  } catch (error) {
    console.error('Error en la función principal:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main().catch(console.error);
