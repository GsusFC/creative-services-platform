#!/usr/bin/env node

/**
 * Script para mejorar el uso de tipos 'any' en el Field Mapper
 * 
 * Este script reemplaza automáticamente los tipos 'any' con tipos más específicos
 * basándose en el contexto y uso de las variables.
 */

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

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

// Directorios a analizar
const directories = [
  'src/lib/field-mapper',
  'src/components/field-mapper',
  'src/app/api/notion'
];

// Mapa de tipos específicos para reemplazar 'any'
const typeReplacements = {
  // API y datos
  'Record<string, any>': 'Record<string, unknown>',
  'Record<string, any[]>': 'Record<string, unknown[]>',
  'Array<any>': 'unknown[]',
  'any[]': 'unknown[]',
  'Promise<any>': 'Promise<unknown>',
  'as any': '',
  
  // Tipos específicos del Field Mapper
  '(t: any)': '(t: { plain_text: string })',
  '(option: any)': '(option: { name: string; id?: string; color?: string })',
  '(s: any)': '(s: { name: string })',
  '(f: any)': '(f: { file?: { url: string }; external?: { url: string } })',
  '(group: any)': '(group: { name: string; id?: string; color?: string })',
  '(...args: any[])': '(...args: Parameters<T>)',
  '(result: any)': '(result: TransformationResult)',
  'useState<any': 'useState<unknown',
  
  // Performance API
  '(performance as any).memory': 'performance as { memory: { usedJSHeapSize: number } }'
};

// Función para determinar el tipo específico basado en el contexto
function determineSpecificType(content, match, position) {
  // Extraer contexto alrededor del match (50 caracteres antes y después)
  const start = Math.max(0, position - 50);
  const end = Math.min(content.length, position + match.length + 50);
  const context = content.substring(start, end);
  
  // Verificar si es un tipo de Notion
  if (context.includes('Notion') || context.includes('notion')) {
    if (context.includes('Field')) return 'NotionField';
    if (context.includes('Type')) return 'NotionFieldType';
    if (context.includes('Value')) return 'unknown';
  }
  
  // Verificar si es un tipo de Website
  if (context.includes('Website') || context.includes('website')) {
    if (context.includes('Field')) return 'WebsiteField';
    if (context.includes('Type')) return 'WebsiteFieldType';
    if (context.includes('Value')) return 'unknown';
  }
  
  // Verificar si es un mapping
  if (context.includes('mapping') || context.includes('Mapping')) {
    return 'FieldMapping';
  }
  
  // Verificar si es un resultado de transformación
  if (context.includes('transform') || context.includes('Transform')) {
    return 'TransformationResult';
  }
  
  // Verificar si es un resultado de test
  if (context.includes('test') || context.includes('Test')) {
    return 'TestResult';
  }
  
  // Por defecto, usar unknown
  return 'unknown';
}

// Función principal
async function main() {
  console.log('Iniciando mejora de tipos any en el Field Mapper...\n');

  // Buscar archivos TypeScript en los directorios especificados
  let allFiles = [];
  directories.forEach(dir => {
    try {
      const output = execSync(`find ${dir} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' });
      allFiles = allFiles.concat(output.trim().split('\n').filter(Boolean));
    } catch (error) {
      console.error(`${colors.red}Error al buscar archivos en ${dir}:${colors.reset}`, error.message);
    }
  });

  console.log(`Encontrados ${allFiles.length} archivos para procesar\n`);

  // Estadísticas
  const stats = {
    filesModified: 0,
    totalChanges: 0,
    changesByType: {}
  };

  // Procesar cada archivo
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      let fileModified = false;
      
      // Primero, aplicar reemplazos directos
      for (const [anyType, specificType] of Object.entries(typeReplacements)) {
        const regex = new RegExp(anyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex) || [];
        
        if (matches.length > 0) {
          newContent = newContent.replace(regex, specificType);
          stats.changesByType[anyType] = (stats.changesByType[anyType] || 0) + matches.length;
          fileModified = true;
          
          console.log(`${colors.green}${file}:${colors.reset} ${matches.length} reemplazos de ${anyType} a ${specificType}`);
        }
      }
      
      // Luego, buscar otros usos de 'any' y determinar el tipo específico
      const anyRegex = /: any(?![a-zA-Z])/g;
      let match;
      const specificReplacements = [];
      
      while ((match = anyRegex.exec(newContent)) !== null) {
        const specificType = determineSpecificType(newContent, match[0], match.index);
        specificReplacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `: ${specificType}`
        });
      }
      
      // Aplicar reemplazos específicos (de atrás hacia adelante para no afectar los índices)
      if (specificReplacements.length > 0) {
        specificReplacements.sort((a, b) => b.start - a.start);
        
        for (const replacement of specificReplacements) {
          newContent = 
            newContent.substring(0, replacement.start) + 
            replacement.replacement + 
            newContent.substring(replacement.end);
          
          stats.changesByType[': any'] = (stats.changesByType[': any'] || 0) + 1;
          fileModified = true;
        }
        
        console.log(`${colors.green}${file}:${colors.reset} ${specificReplacements.length} reemplazos de 'any' con tipos específicos`);
      }

      // Guardar el archivo modificado
      if (fileModified) {
        fs.writeFileSync(file, newContent, 'utf8');
        stats.filesModified++;
        stats.totalChanges += Object.values(stats.changesByType).reduce((acc, count) => acc + count, 0);
      }
    } catch (error) {
      console.error(`${colors.red}Error al procesar ${file}:${colors.reset}`, error.message);
    }
  }

  // Mostrar resumen
  console.log('\n=== Resumen de mejoras ===');
  console.log(`Archivos modificados: ${stats.filesModified}`);
  console.log(`Total de cambios: ${stats.totalChanges}\n`);

  for (const [anyType, count] of Object.entries(stats.changesByType)) {
    const specificType = anyType === ': any' ? 'tipos específicos' : typeReplacements[anyType] || 'tipo específico';
    console.log(`${anyType} → ${specificType}: ${count} reemplazos`);
  }

  // Guardar informe
  const report = `# Informe de mejora de tipos any en el Field Mapper

## Resumen
- Archivos modificados: ${stats.filesModified}
- Total de cambios: ${stats.totalChanges}

## Detalles por tipo de reemplazo
${Object.entries(stats.changesByType).map(([anyType, count]) => {
  const specificType = anyType === ': any' ? 'tipos específicos' : typeReplacements[anyType] || 'tipo específico';
  return `- ${anyType} → ${specificType}: ${count} reemplazos`;
}).join('\n')}

## Fecha de ejecución
${new Date().toISOString()}
`;

  fs.writeFileSync('field-mapper-any-improvements-report.md', report, 'utf8');
  console.log('\nInforme guardado en field-mapper-any-improvements-report.md');
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
