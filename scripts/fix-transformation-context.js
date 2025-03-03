#!/usr/bin/env node

/**
 * Script para corregir los errores de TransformationContext
 * 
 * Este script corrige los errores relacionados con la propiedad 'type'
 * que no existe en el tipo TransformationContext.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Archivos a modificar
const files = [
  {
    path: 'src/lib/field-mapper/types.ts',
    changes: [
      {
        // Añadir la propiedad 'type' a TransformationContext
        search: /export interface TransformationContext \{[\s\S]*?sourceField: NotionField \| WebsiteField;[\s\S]*?targetField: NotionField \| WebsiteField;[\s\S]*?sourceValue: unknown;[\s\S]*?direction: 'notion-to-website' \| 'website-to-notion';/g,
        replace: (match) => {
          return match + '\n  sourceType?: string;\n  targetType?: string;';
        },
        description: 'Añadir sourceType y targetType a TransformationContext'
      }
    ]
  },
  {
    path: 'src/lib/field-mapper/transformation-service.ts',
    changes: [
      {
        // Reemplazar context?.type con context?.sourceType o context?.targetType según corresponda
        search: /sourceType: context\?\.type,\s*targetType: context\?\.type/g,
        replace: 'sourceType: context?.sourceType || context?.sourceField?.type,\n      targetType: context?.targetType || context?.targetField?.type',
        description: 'Corregir referencias a context.type'
      },
      {
        // Corregir otras referencias a context.type
        search: /context\?\.type/g,
        replace: (match, offset, string) => {
          // Determinar si debemos usar sourceType o targetType basado en el contexto
          const surroundingText = string.substring(Math.max(0, offset - 50), Math.min(string.length, offset + 50));
          if (surroundingText.includes('source') || surroundingText.includes('Source')) {
            return 'context?.sourceType || context?.sourceField?.type';
          } else if (surroundingText.includes('target') || surroundingText.includes('Target')) {
            return 'context?.targetType || context?.targetField?.type';
          } else {
            // Si no podemos determinar, usamos sourceType como predeterminado
            return 'context?.sourceType || context?.sourceField?.type';
          }
        },
        description: 'Corregir otras referencias a context.type'
      }
    ]
  }
];

// Función principal
async function main() {
  console.log('Iniciando corrección de errores de TransformationContext...\n');

  // Estadísticas
  const stats = {
    filesModified: 0,
    totalChanges: 0,
    changesByFile: {}
  };

  // Procesar cada archivo
  for (const file of files) {
    try {
      const filePath = path.resolve(process.cwd(), file.path);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`${colors.yellow}Archivo no encontrado: ${filePath}${colors.reset}`);
        continue;
      }
      
      let content = fs.readFileSync(filePath, 'utf8');
      let fileModified = false;
      stats.changesByFile[file.path] = [];

      // Aplicar cada cambio
      for (const change of file.changes) {
        const originalContent = content;
        content = content.replace(change.search, change.replace);
        
        const changesMade = content !== originalContent;
        if (changesMade) {
          const matchCount = (originalContent.match(change.search) || []).length;
          stats.changesByFile[file.path].push({
            description: change.description,
            count: matchCount
          });
          fileModified = true;
          
          console.log(`${colors.green}${file.path}:${colors.reset} ${matchCount} ${change.description}`);
        }
      }

      // Guardar el archivo modificado
      if (fileModified) {
        fs.writeFileSync(filePath, content, 'utf8');
        stats.filesModified++;
        stats.totalChanges += stats.changesByFile[file.path].reduce((acc, change) => acc + change.count, 0);
      }
    } catch (error) {
      console.error(`${colors.red}Error al procesar ${file.path}:${colors.reset}`, error.message);
    }
  }

  // Mostrar resumen
  console.log('\n=== Resumen de correcciones ===');
  console.log(`Archivos modificados: ${stats.filesModified}`);
  console.log(`Total de cambios: ${stats.totalChanges}\n`);

  for (const [filePath, changes] of Object.entries(stats.changesByFile)) {
    if (changes.length > 0) {
      console.log(`${colors.blue}${filePath}:${colors.reset}`);
      for (const change of changes) {
        console.log(`  - ${change.description}: ${change.count} correcciones`);
      }
      console.log('');
    }
  }

  // Guardar informe
  const report = `# Informe de corrección de errores de TransformationContext

## Resumen
- Archivos modificados: ${stats.filesModified}
- Total de cambios: ${stats.totalChanges}

## Detalles por archivo
${Object.entries(stats.changesByFile).filter(([_, changes]) => changes.length > 0).map(([filePath, changes]) => `
### ${filePath}
${changes.map(change => `- ${change.description}: ${change.count} correcciones`).join('\n')}
`).join('\n')}

## Fecha de ejecución
${new Date().toISOString()}
`;

  fs.writeFileSync('transformation-context-fixes-report.md', report, 'utf8');
  console.log('\nInforme guardado en transformation-context-fixes-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
