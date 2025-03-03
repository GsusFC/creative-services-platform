/**
 * Script simplificado para deshabilitar las funcionalidades de integración con Notion
 * 
 * Este script modifica el archivo de configuración de características para desactivar
 * todas las funcionalidades relacionadas con Notion.
 * 
 * Para ejecutar: node scripts/disable-notion-simple.js
 */

// Usamos la sintaxis ES6 para evitar problemas con la configuración del proyecto
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
    console.log('✅ Configuración de Notion actualizada');
  } catch (error) {
    console.error('Error al actualizar el archivo de características:', error);
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
    console.log('✅ Layout de redirección creado para notion-importer');
  } catch (error) {
    console.error('Error al crear el layout de redirección:', error);
  }
}

// Ejecutar las funciones
updateFeaturesFile();
createImporterLayout();

console.log('✅ Integración con Notion deshabilitada correctamente');
console.log('✅ Ahora puedes centrarte en el CMS y los Case Studies');
