/**
 * Script para deshabilitar o habilitar las funcionalidades de integración con Notion
 * 
 * Este script modifica el archivo de configuración de características para controlar
 * el acceso a los componentes relacionados con Notion, como el importador de proyectos,
 * la conversión a case studies, etc.
 * 
 * Uso:
 * - Para ejecutar: node scripts/disable-notion-integration.js
 */

import { disableNotionIntegration } from '../src/lib/notion/disable-integration';
import { log } from '../src/lib/utils/logger';
import fs from 'fs';
import path from 'path';

// Archivo de configuración de características
const featuresPath = path.join(process.cwd(), 'src/config/features.ts');

// Ruta para el layout del importador de Notion
const notionImporterLayoutPath = path.join(process.cwd(), 'src/app/admin/notion-importer/layout.tsx');

// Contenido para el layout de redirección
const layoutContent = `'use client';

import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function NotionImporterLayout({ children }: { children: ReactNode }) {
  if (!FEATURES.notion.enabled || !FEATURES.notion.importer) {
    redirect('/admin/not-available');
  }
  
  return <>{children}</>;
}
`;

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
        (match) => `${match}\n  notion: {\n    enabled: false,\n    importer: false,\n    converter: false,\n    scheduler: false\n  },`
      );
    } else {
      // Si ya existe, asegurarse de que todas las funcionalidades estén desactivadas
      featuresContent = featuresContent.replace(
        /notion: {[^}]*}/s,
        `notion: {\n    enabled: false,\n    importer: false,\n    converter: false,\n    scheduler: false\n  }`
      );
    }

    // Guardar los cambios
    fs.writeFileSync(featuresPath, featuresContent);
    log('✅ Configuración de Notion actualizada');
  } catch (error) {
    log('Error al actualizar el archivo de características:', error);
  }
}

// Función para crear o actualizar el layout del importador de Notion
function createImporterLayout() {
  try {
    // Asegurarse de que la carpeta exista
    const layoutDir = path.dirname(notionImporterLayoutPath);
    if (!fs.existsSync(layoutDir)) {
      fs.mkdirSync(layoutDir, { recursive: true });
    }

    // Crear o sobrescribir el archivo de layout
    fs.writeFileSync(notionImporterLayoutPath, layoutContent);
    log('✅ Layout de redirección creado para notion-importer');
  } catch (error) {
    log('Error al crear el layout de redirección:', error);
  }
}

// Ejecutar las funciones
updateFeaturesFile();
createImporterLayout();

log('✅ Integración con Notion deshabilitada correctamente');
log('✅ Ahora puedes centrarte en el CMS y los Case Studies');
