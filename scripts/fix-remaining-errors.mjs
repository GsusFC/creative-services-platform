/**
 * Script para corregir los errores restantes
 * 
 * Este script corrige problemas específicos en los archivos restantes
 * con errores de TypeScript.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Corrigiendo errores restantes...');

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Corregir OptimizationRecommendations.tsx
const optimizationRecommendationsPath = path.join(__dirname, '../src/components/field-mapper/OptimizationRecommendations.tsx');
if (fs.existsSync(optimizationRecommendationsPath)) {
  console.log('Procesando: OptimizationRecommendations.tsx');
  let content = fs.readFileSync(optimizationRecommendationsPath, 'utf8');
  
  // Corregir números con punto opcional
  content = content.replace(/(\d)\?\.(\d)/g, '$1.$2');
  
  fs.writeFileSync(optimizationRecommendationsPath, content);
  console.log('Archivo corregido: OptimizationRecommendations.tsx');
}

// Corregir PerformanceHistory.tsx
const performanceHistoryPath = path.join(__dirname, '../src/components/field-mapper/PerformanceHistory.tsx');
if (fs.existsSync(performanceHistoryPath)) {
  console.log('Procesando: PerformanceHistory.tsx');
  let content = fs.readFileSync(performanceHistoryPath, 'utf8');
  
  // Corregir números con punto opcional
  content = content.replace(/(\d)\?\.(\d)/g, '$1.$2');
  content = content.replace(/Math\?\.random\(\)/g, 'Math.random()');
  
  fs.writeFileSync(performanceHistoryPath, content);
  console.log('Archivo corregido: PerformanceHistory.tsx');
}

// Corregir TransformationConfig.tsx
const transformationConfigPath = path.join(__dirname, '../src/components/field-mapper/TransformationConfig.tsx');
if (fs.existsSync(transformationConfigPath)) {
  console.log('Procesando: TransformationConfig.tsx');
  let content = fs.readFileSync(transformationConfigPath, 'utf8');
  
  // Corregir referencias a React?.ReactNode
  content = content.replace(/React\?\.ReactNode/g, 'React.ReactNode');
  
  fs.writeFileSync(transformationConfigPath, content);
  console.log('Archivo corregido: TransformationConfig.tsx');
}

// Corregir optimization-service.ts
const optimizationServicePath = path.join(__dirname, '../src/lib/field-mapper/optimization-service.ts');
if (fs.existsSync(optimizationServicePath)) {
  console.log('Procesando: optimization-service.ts');
  let content = fs.readFileSync(optimizationServicePath, 'utf8');
  
  // Corregir referencias a import?.url y validation-worker?.ts
  content = content.replace(/import\?\.url/g, 'import.meta.url');
  content = content.replace(/validation-worker\?\.ts/g, 'validation-worker.ts');
  
  fs.writeFileSync(optimizationServicePath, content);
  console.log('Archivo corregido: optimization-service.ts');
}

console.log('Correcciones completadas.');
