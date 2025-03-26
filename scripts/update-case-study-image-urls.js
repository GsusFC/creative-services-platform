#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Busca un archivo de imagen local en el directorio del caso de estudio
 * basado en el nombre o hash de la URL original
 */
async function findLocalImage(s3Url, caseStudyId) {
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
    
    // Extraer la extensión del archivo de la URL de S3
    const urlParts = s3Url.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0];
    const extension = filename.split('.').pop().toLowerCase();
    console.log(`Buscando archivo con extensión: ${extension}`);
    
    // Filtrar archivos por extensión
    const matchingFiles = files.filter(file => file.toLowerCase().endsWith(`.${extension}`));
    
    if (matchingFiles.length > 0) {
      // Obtener stats de los archivos
      const fileStats = await Promise.all(
        matchingFiles.map(async (file) => {
          const stat = await fs.stat(path.join(imagesDir, file));
          return { file, mtime: stat.mtimeMs };
        })
      );
      
      // Ordenar por fecha de modificación más reciente
      fileStats.sort((a, b) => b.mtime - a.mtime);
      
      const file = fileStats[0].file; // Usar el archivo más reciente
      console.log(`Usando archivo más reciente: ${file}`);
      return `/images/${caseStudyId}/${file}`;
    }
    
    console.log(`No se encontró imagen local con extensión ${extension}`);
    return null;
  } catch (error) {
    console.error('Error buscando imagen local:', error);
    return null;
  }
}

/**
 * Actualiza las URLs de imágenes en un caso de estudio
 */
async function updateCaseStudyImages(caseStudyId) {
  try {
    // Ruta al archivo JSON del caso de estudio
    const caseStudyPath = path.join(process.cwd(), 'data', 'case-studies', `${caseStudyId}.json`);
    
    // Verificar que el archivo existe
    try {
      await fs.access(caseStudyPath);
    } catch (error) {
      console.error(`No se encontró el archivo: ${caseStudyPath}`);
      console.log('Asegúrate de ejecutar el script desde la raíz del proyecto:');
      console.log('node scripts/update-case-study-image-urls.js <caseStudyId>');
      process.exit(1);
    }
    
    // Leer el archivo
    const caseStudyRaw = await fs.readFile(caseStudyPath, 'utf-8');
    const caseStudy = JSON.parse(caseStudyRaw);
    
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
      console.log('Uso: node update-case-study-image-urls.js <caseStudyId>');
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
