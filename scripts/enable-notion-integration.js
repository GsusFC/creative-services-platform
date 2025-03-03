/**
 * Script para habilitar las funcionalidades de integración con Notion
 * 
 * Este script modifica el archivo de configuración de características para activar
 * el acceso a los componentes relacionados con Notion, como el importador de proyectos,
 * la conversión a case studies, etc.
 * 
 * Uso:
 * - Para ejecutar: node scripts/enable-notion-integration.js
 */

import fs from 'fs';
import path from 'path';
import { enableNotionIntegration } from '../src/lib/notion/enable-integration';
import { log } from '../src/lib/utils/logger';

// Archivo de configuración de características
const featuresPath = path.join(process.cwd(), 'src/config/features.ts');

// Función para actualizar el archivo de características
function updateFeaturesFile() {
  try {
    // Leer el archivo de configuración actual
    let featuresContent = fs.readFileSync(featuresPath, 'utf8');

    // Asegurarse de que exista la configuración para Notion
    if (!featuresContent.includes('notion: {')) {
      // Si no existe, agregarla después de la configuración de fieldMapper
      featuresContent = featuresContent.replace(
        /fieldMapper: {[^}]*},/s,
        (match) => `${match}\n  notion: {\n    enabled: true,\n    importer: true,\n    converter: true,\n    scheduler: true\n  },`
      );
    } else {
      // Si ya existe, activar todas las funcionalidades
      featuresContent = featuresContent.replace(
        /notion: {[^}]*}/s,
        `notion: {\n    enabled: true,\n    importer: true,\n    converter: true,\n    scheduler: true\n  }`
      );
    }

    // Guardar los cambios
    fs.writeFileSync(featuresPath, featuresContent);
    log('✅ Configuración de Notion actualizada');
  } catch (error) {
    log('Error al actualizar el archivo de características:', error);
  }
}

// Ejecutar la función
updateFeaturesFile();

log('✅ Integración con Notion habilitada correctamente');
