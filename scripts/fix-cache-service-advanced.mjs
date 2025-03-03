/**
 * Script para corregir errores avanzados en cache-service.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Corrigiendo errores avanzados en cache-service.ts...');

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo
const filePath = path.join(__dirname, '../src/lib/field-mapper/cache-service.ts');

// Verificar si el archivo existe
if (!fs.existsSync(filePath)) {
  console.log('Archivo no encontrado: cache-service.ts');
  process.exit(1);
}

// Leer el contenido del archivo
let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

// 1. Corregir definición de clase genérica
content = content.replace(
  /export class CacheService {/g,
  'export class CacheService<T> {'
);

// 2. Corregir acceso a propiedades de opciones
content = content.replace(/options\?\.maxSize/g, 'options.maxSize');
content = content.replace(/options\?\.ttl/g, 'options.ttl');
content = content.replace(/options\?\.persistent/g, 'options.persistent');
content = content.replace(/options\?\.storageKey/g, 'options.storageKey');

// 3. Corregir acceso a propiedades de this
content = content.replace(/this\.persistent/g, 'this.options.persistent');
content = content.replace(/this\.ttl/g, 'this.options.ttl');
content = content.replace(/this\.storageKey/g, 'this.options.storageKey');
content = content.replace(/this\.maxSize/g, 'this.options.maxSize');

// 4. Corregir acceso a propiedades de entradas de caché
content = content.replace(/entry\?\.timestamp/g, 'entry.timestamp');
content = content.replace(/entry\?\.value/g, 'entry.value');
content = content.replace(/entry\?\.hits/g, 'entry.hits');
content = content.replace(/entry\?\.lastAccessed/g, 'entry.lastAccessed');

// 5. Corregir métodos de Map
content = content.replace(/this\.cache\?\.get/g, 'this.cache.get');
content = content.replace(/this\.cache\?\.set/g, 'this.cache.set');
content = content.replace(/this\.cache\?\.has/g, 'this.cache.has');
content = content.replace(/this\.cache\?\.delete/g, 'this.cache.delete');
content = content.replace(/this\.cache\?\.clear/g, 'this.cache.clear');
content = content.replace(/this\.cache\?\.size/g, 'this.cache.size');
content = content.replace(/this\.cache\?\.keys/g, 'this.cache.keys');
content = content.replace(/this\.cache\?\.values/g, 'this.cache.values');
content = content.replace(/this\.cache\?\.entries/g, 'this.cache.entries');
content = content.replace(/this\.cache\?\.forEach/g, 'this.cache.forEach');

// 6. Corregir métodos de Array
content = content.replace(/this\.stats\?\.accessTimes/g, 'this.stats.accessTimes');
content = content.replace(/this\.stats\?\.hits/g, 'this.stats.hits');
content = content.replace(/this\.stats\?\.misses/g, 'this.stats.misses');

// 7. Corregir operaciones con localStorage
content = content.replace(/localStorage\?\.getItem/g, 'localStorage.getItem');
content = content.replace(/localStorage\?\.setItem/g, 'localStorage.setItem');
content = content.replace(/localStorage\?\.removeItem/g, 'localStorage.removeItem');

// 8. Corregir manejo de JSON
content = content.replace(/JSON\?\.parse/g, 'JSON.parse');
content = content.replace(/JSON\?\.stringify/g, 'JSON.stringify');

// 9. Corregir tipos de retorno en métodos
content = content.replace(
  /get\(key: string\): T \| undefined {/g,
  'get(key: string): T | undefined {'
);

content = content.replace(
  /set\(key: string, value: T\): void {/g,
  'set(key: string, value: T): void {'
);

content = content.replace(
  /has\(key: string\): boolean {/g,
  'has(key: string): boolean {'
);

content = content.replace(
  /delete\(key: string\): boolean {/g,
  'delete(key: string): boolean {'
);

content = content.replace(
  /clear\(\): void {/g,
  'clear(): void {'
);

content = content.replace(
  /getStats\(\): CacheStats {/g,
  'getStats(): CacheStats {'
);

content = content.replace(
  /cleanup\(\): number {/g,
  'cleanup(): number {'
);

content = content.replace(
  /startCleanupInterval\(\): void {/g,
  'startCleanupInterval(): void {'
);

content = content.replace(
  /evictLRU\(\): void {/g,
  'evictLRU(): void {'
);

content = content.replace(
  /saveToStorage\(\): void {/g,
  'saveToStorage(): void {'
);

content = content.replace(
  /loadFromStorage\(\): void {/g,
  'loadFromStorage(): void {'
);

// 10. Corregir manejo de localStorage
content = content.replace(
  /if \(typeof localStorage !== 'undefined'\) {/g,
  'if (typeof window !== "undefined" && typeof localStorage !== "undefined") {'
);

// Si se hicieron cambios, guardar el archivo
if (content !== originalContent) {
  fs.writeFileSync(filePath, content);
  console.log('Archivo corregido: cache-service.ts');
} else {
  console.log('No se requirieron cambios en: cache-service.ts');
}

console.log('Correcciones completadas.');
