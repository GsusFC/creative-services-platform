/**
 * Script para corregir errores en optimization-service.ts
 */

import fs from 'fs';
import path from 'path';

console.log('Corrigiendo errores en optimization-service.ts...');

const filePath = path.join(process.cwd(), 'src/lib/field-mapper/optimization-service.ts');

// Verificar si el archivo existe
if (!fs.existsSync(filePath)) {
  console.log('Archivo no encontrado: optimization-service.ts');
  process.exit(1);
}

// Leer el contenido del archivo
let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

// 1. Corregir imports
if (!content.includes('import type {')) {
  content = content.replace(
    /import {/,
    'import type {'
  );
}

// 2. Corregir tipos de retorno en funciones
content = content.replace(
  /export function analyzePerformance\(mappings\)/,
  'export function analyzePerformance(mappings: FieldMapping[]): PerformanceMetrics'
);

content = content.replace(
  /export function generateOptimizationRecommendations\(metrics, mappings\)/,
  'export function generateOptimizationRecommendations(metrics: PerformanceMetrics, mappings: FieldMapping[]): OptimizationRecommendation[]'
);

// 3. Corregir acceso a propiedades posiblemente undefined
content = content.replace(/mapping\.source/g, 'mapping?.source');
content = content.replace(/mapping\.target/g, 'mapping?.target');
content = content.replace(/mapping\.transformation/g, 'mapping?.transformation');

// 4. Corregir tipos en funciones internas
content = content.replace(
  /function calculateComplexityScore\(mapping\)/,
  'function calculateComplexityScore(mapping: FieldMapping): number'
);

content = content.replace(
  /function identifyBottlenecks\(mappings, metrics\)/,
  'function identifyBottlenecks(mappings: FieldMapping[], metrics: PerformanceMetrics): string[]'
);

// 5. Corregir acceso a arrays posiblemente undefined
content = content.replace(/mappings\.filter/g, 'mappings?.filter');
content = content.replace(/mappings\.map/g, 'mappings?.map');
content = content.replace(/mappings\.forEach/g, 'mappings?.forEach');
content = content.replace(/mappings\.reduce/g, 'mappings?.reduce');
content = content.replace(/mappings\.length/g, 'mappings?.length');

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(filePath, content);
  console.log('Archivo corregido: optimization-service.ts');
} else {
  console.log('No se requirieron cambios en: optimization-service.ts');
}

console.log('Correcciones completadas.');
