#!/usr/bin/env node

/**
 * Script para corregir errores misceláneos de TypeScript
 * 
 * Este script corrige varios errores específicos de TypeScript
 * que aún persisten después de las correcciones anteriores.
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
    path: 'src/lib/field-mapper/test-mapping.ts',
    changes: [
      {
        search: /let timeoutId: NodeJS\?\.Timeout \| undefined;/g,
        replace: 'let timeoutId: NodeJS.Timeout | undefined;',
        description: 'Corregir NodeJS?.Timeout'
      }
    ]
  },
  {
    path: 'src/lib/field-mapper/transformations.ts',
    changes: [
      {
        search: /new Intl\?\.NumberFormat/g,
        replace: 'new Intl.NumberFormat',
        description: 'Corregir Intl?.NumberFormat'
      }
    ]
  },
  {
    path: 'src/lib/field-mapper/use-validation-worker.ts',
    changes: [
      {
        search: /new URL\('\.\/validation-worker\?\.ts', import\?\.url\)/g,
        replace: "new URL('./validation-worker.ts', import.meta.url)",
        description: 'Corregir URL y import?.url'
      }
    ]
  },
  {
    path: 'src/components/field-mapper/FieldTypeBadge.tsx',
    changes: [
      {
        search: /const typeConfig: Record<string, \{ icon: React\?\.ReactNode; variant: string; description: string \}>/g,
        replace: 'const typeConfig: Record<string, { icon: React.ReactNode; variant: string; description: string }>',
        description: 'Corregir React?.ReactNode'
      },
      {
        search: /type FieldTypeBadgeProps = \{[\s\S]*?field: Field[\s\S]*?className\?: string[\s\S]*?compareWith\?: Field[\s\S]*?showCompatibility\?: boolean[\s\S]*?\}/g,
        replace: `type FieldTypeBadgeProps = {
  field: Field;
  className?: string;
  compareWith?: Field;
  showCompatibility?: boolean;
}`,
        description: 'Corregir FieldTypeBadgeProps'
      }
    ]
  },
  {
    path: 'src/components/field-mapper/Mapping.tsx',
    changes: [
      {
        search: /const validateMapping = \(mapping: FieldMapping\) => \{/g,
        replace: 'const validateMapping = (mapping: FieldMapping): { isValid: boolean; message?: string } => {',
        description: 'Añadir tipo de retorno a validateMapping'
      }
    ]
  },
  {
    path: 'src/components/field-mapper/MappingList.tsx',
    changes: [
      {
        search: /const MappingList: React\.FC<MappingListProps> = \(\{ mappings, onDelete, onEdit \}\) => \{/g,
        replace: 'const MappingList: React.FC<MappingListProps> = ({ mappings, onDelete, onEdit }) => {',
        description: 'Corregir paréntesis en MappingList'
      }
    ]
  }
];

// Función principal
async function main() {
  console.log('Iniciando corrección de errores misceláneos de TypeScript...\n');

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
  const report = `# Informe de corrección de errores misceláneos de TypeScript

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

  fs.writeFileSync('misc-ts-errors-fixes-report.md', report, 'utf8');
  console.log('\nInforme guardado en misc-ts-errors-fixes-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
