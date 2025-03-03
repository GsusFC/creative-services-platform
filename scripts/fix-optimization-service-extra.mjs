/**
 * Script para corregir errores específicos en optimization-service.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Corrigiendo errores específicos en optimization-service.ts...');

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

// 1. Corregir operadores de acceso opcional innecesarios
content = content.replace(/performance\s*\)\s*\.memory\?\.usedJSHeapSize/g, 'performance).memory.usedJSHeapSize');
content = content.replace(/timeoutRef\?\.current/g, 'timeoutRef.current');
content = content.replace(/Math\?\.min/g, 'Math.min');
content = content.replace(/items\?\.length/g, 'items.length');
content = content.replace(/items\?\.slice/g, 'items.slice');
content = content.replace(/Math\?\.max/g, 'Math.max');
content = content.replace(/Math\?\.floor/g, 'Math.floor');
content = content.replace(/Math\?\.ceil/g, 'Math.ceil');
content = content.replace(/Array\?\.from/g, 'Array.from');
content = content.replace(/containerRef\?\.current/g, 'containerRef.current');
content = content.replace(/containerRef\?\.scrollTop/g, 'containerRef.current.scrollTop');
content = content.replace(/container\?\.clientHeight/g, 'container.clientHeight');
content = content.replace(/container\?\.addEventListener/g, 'container.addEventListener');
content = content.replace(/container\?\.removeEventListener/g, 'container.removeEventListener');
content = content.replace(/module\?\.default/g, 'module.default');
content = content.replace(/ref\?\.current/g, 'ref.current');
content = content.replace(/observer\?\.observe/g, 'observer.observe');
content = content.replace(/observer\?\.disconnect/g, 'observer.disconnect');
content = content.replace(/entry\?\.isIntersecting/g, 'entry.isIntersecting');
content = content.replace(/argsRef\?\.current/g, 'argsRef.current');
content = content.replace(/lastRun\?\.current/g, 'lastRun.current');
content = content.replace(/Date\?\.now/g, 'Date.now');
content = content.replace(/console\?\.error/g, 'console.error');
content = content.replace(/this\?\.addEventListener/g, 'this.worker.addEventListener');
content = content.replace(/this\?\.removeEventListener/g, 'this.worker.removeEventListener');
content = content.replace(/this\?\.set/g, 'this.callbacks.set');
content = content.replace(/this\?\.postMessage/g, 'this.worker.postMessage');

// 2. Corregir problemas con NodeJS.Timeout
content = content.replace(/NodeJS\?\.Timeout/g, 'NodeJS.Timeout');

// 3. Corregir acceso a propiedades de Worker
content = content.replace(/this\.workerEnabled/g, 'this.config.workerEnabled');

// 4. Corregir método has en ValidationWorkerManager
content = content.replace(/this\.has\(id\)/g, 'this.callbacks.has(id)');

// 5. Corregir método get en ValidationWorkerManager
content = content.replace(/this\.get\(id\)/g, 'this.callbacks.get(id)');

// 6. Corregir método delete en ValidationWorkerManager
content = content.replace(/this\.delete\(id\)/g, 'this.callbacks.delete(id)');

// 7. Corregir el método terminate que se llama a sí mismo
content = content.replace(/this\.terminate\(\);/g, 'this.worker.terminate();');

// 8. Añadir importación de React.ComponentType si falta
if (!content.includes('React.ComponentType')) {
  content = content.replace(
    /import { useCallback, useEffect, useRef, useState } from 'react';/,
    "import { useCallback, useEffect, useRef, useState } from 'react';\nimport type { ComponentType } from 'react';"
  );
}

// 9. Corregir la definición del tipo para useLazyComponent
content = content.replace(
  /export function useLazyComponent<T>\(/g,
  'export function useLazyComponent<T extends ComponentType<any>>('
);

// Guardar el archivo con los cambios
fs.writeFileSync(filePath, content);
console.log('Archivo corregido: optimization-service.ts');
console.log('Correcciones completadas.');
