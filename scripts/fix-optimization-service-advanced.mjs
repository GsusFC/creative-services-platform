/**
 * Script para corregir errores avanzados en optimization-service.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Corrigiendo errores avanzados en optimization-service.ts...');

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo
const filePath = path.join(__dirname, '../src/lib/field-mapper/optimization-service.ts');

// Verificar si el archivo existe
if (!fs.existsSync(filePath)) {
  console.log('Archivo no encontrado: optimization-service.ts');
  process.exit(1);
}

// Leer el contenido del archivo
let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

// 1. Corregir imports
content = content.replace(
  /import type { useCallback, useEffect, useRef, useState } from 'react';/,
  `import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldMapping, PerformanceMetrics, OptimizationRecommendation, TransformationResult } from './types';`
);

// 2. Corregir operadores de acceso opcional innecesarios
content = content.replace(/startTimeRef\?\.current/g, 'startTimeRef.current');
content = content.replace(/performance\?\.now/g, 'performance.now');
content = content.replace(/this\?\.config/g, 'this.config');
content = content.replace(/this\?\.initWorker/g, 'this.initWorker');
content = content.replace(/this\?\.has/g, 'this.has');
content = content.replace(/this\?\.get/g, 'this.get');
content = content.replace(/this\?\.delete/g, 'this.delete');
content = content.replace(/this\?\.callbacks/g, 'this.callbacks');
content = content.replace(/this\?\.worker/g, 'this.worker');
content = content.replace(/this\?\.handleWorkerMessage/g, 'this.handleWorkerMessage');
content = content.replace(/this\?\.terminate/g, 'this.terminate');

// 3. Corregir tipos genéricos sin definir
content = content.replace(
  /export function useIncrementalLoading\(/g,
  'export function useIncrementalLoading<T>('
);

content = content.replace(
  /export function useLazyComponent\(/g,
  'export function useLazyComponent<T extends React.ComponentType<any>>'
);

content = content.replace(
  /export function useDebounce\(/g,
  'export function useDebounce<T extends (...args: any[]) => any>'
);

content = content.replace(
  /export function useThrottle\(/g,
  'export function useThrottle<T extends (...args: any[]) => any>'
);

// 4. Corregir inicialización de Worker
content = content.replace(
  /this\.worker = new Worker\(new URL\('\.\/validation-worker\.ts', import\.url\)\);/g,
  `if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./validation-worker.ts', import.meta.url));
    }`
);

// 5. Corregir tipos de retorno en funciones
content = content.replace(
  /export function useRenderTime\(\) {/g,
  'export function useRenderTime(): { renderTime: number; startMeasurement: () => void } {'
);

content = content.replace(
  /export function useMemoryUsage\(\) {/g,
  'export function useMemoryUsage(): { memoryUsage: number } {'
);

content = content.replace(
  /export function useIntersectionObserver\(/g,
  'export function useIntersectionObserver<T extends HTMLElement>('
);

// 6. Corregir métodos de clase
content = content.replace(
  /private initWorker\(\) {/g,
  'private initWorker(): void {'
);

content = content.replace(
  /terminate\(\) {/g,
  'terminate(): void {'
);

// 7. Corregir promesas y callbacks
content = content.replace(
  /return new Promise\(\(resolve\) => {/g,
  'return new Promise<TransformationResult>((resolve) => {'
);

// 8. Corregir manejo de eventos
content = content.replace(
  /private handleWorkerMessage = \(event: MessageEvent\) => {/g,
  'private handleWorkerMessage = (event: MessageEvent<any>): void => {'
);

// 9. Corregir métodos de Map
content = content.replace(
  /this\.callbacks\.set\(id, resolve\);/g,
  'this.callbacks.set(id, resolve as (result: TransformationResult) => void);'
);

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(filePath, content);
  console.log('Archivo corregido: optimization-service.ts');
} else {
  console.log('No se requirieron cambios en: optimization-service.ts');
}

console.log('Correcciones completadas.');
