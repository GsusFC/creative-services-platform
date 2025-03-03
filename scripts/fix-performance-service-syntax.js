/**
 * Script para corregir errores de sintaxis en performance-service.ts
 * 
 * Este script corrige específicamente problemas de sintaxis como:
 * - Puntos y comas incorrectos
 * - Bloques try/catch duplicados
 * - Problemas con las funciones de clase
 */

const fs = require('fs');
const path = require('path');

// Ruta al archivo
const filePath = path.join(__dirname, '../src/lib/field-mapper/performance-service.ts');

console.log('Iniciando corrección de sintaxis en performance-service.ts...');

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

// Correcciones específicas

// 1. Corregir puntos y comas incorrectos
content = content.replace(/total: 0;/g, 'total: 0');
content = content.replace(/metadata;/g, 'metadata');
content = content.replace(/operationsPerSecond;/g, 'operationsPerSecond');

// 2. Corregir operadores ternarios incorrectos
content = content.replace(/avgValidationTime = validationMetrics\?.length > 0;/g, 'avgValidationTime = validationMetrics?.length > 0');
content = content.replace(/avgRenderTime = renderMetrics\?.length > 0;/g, 'avgRenderTime = renderMetrics?.length > 0');
content = content.replace(/avgApiTime = apiMetrics\?.length > 0;/g, 'avgApiTime = apiMetrics?.length > 0');

// 3. Corregir bloques try/catch duplicados
content = content.replace(/\} catch \(error\) \{\n\s*this\.endOperation\(id\);\n\s*throw error;\n\s*\}\n\s*\} catch \(error\) \{\n\s*this\.endOperation\(id\);\n\s*throw error;\n\s*\}/g, 
`} catch (error) {
      this.endOperation(id);
      throw error;
    }`);

// 4. Corregir métodos de acceso a Map
content = content.replace(/this\.set\(id,/g, 'this.activeOperations.set(id,');
content = content.replace(/this\.get\(id\)/g, 'this.activeOperations.get(id)');
content = content.replace(/this\.delete\(id\)/g, 'this.activeOperations.delete(id)');
content = content.replace(/this\.clear\(\)/g, 'this.activeOperations.clear()');

// 5. Corregir accesos a arrays
content = content.replace(/this\.push\(metric\)/g, 'this.metrics.push(metric)');
content = content.replace(/this\.push\(snapshot\)/g, 'this.snapshots.push(snapshot)');
content = content.replace(/this\.filter\(/g, 'this.metrics.filter(');
content = content.replace(/this\.slice\(-this\.maxMetricsLength\)/g, 'this.metrics.slice(-this.maxMetricsLength)');
content = content.replace(/this\.slice\(-this\.maxSnapshotsLength\)/g, 'this.snapshots.slice(-this.maxSnapshotsLength)');
content = content.replace(/this\.slice\(-limit\)/g, 'this.snapshots.slice(-limit)');
content = content.replace(/this\.length/g, 'this.snapshots.length');

// 6. Corregir accesos a cacheStats
content = content.replace(/this\.total\+\+/g, 'this.cacheStats.total++');
content = content.replace(/this\.hits\+\+/g, 'this.cacheStats.hits++');
content = content.replace(/this\.misses\+\+/g, 'this.cacheStats.misses++');
content = content.replace(/this\.total === 0/g, 'this.cacheStats.total === 0');
content = content.replace(/this\.hits \/ this\.total/g, 'this.cacheStats.hits / this.cacheStats.total');

// 7. Corregir accesos opcionales innecesarios
content = content.replace(/Date\?\.now\(\)/g, 'Date.now()');
content = content.replace(/Math\?\.random\(\)/g, 'Math.random()');
content = content.replace(/performance\?\.now\(\)/g, 'performance.now()');
content = content.replace(/console\?\.warn/g, 'console.warn');
content = content.replace(/JSON\?\.stringify/g, 'JSON.stringify');
content = content.replace(/performanceService\?\.measure/g, 'performanceService.measure');
content = content.replace(/performanceService\?\.measureSync/g, 'performanceService.measureSync');
content = content.replace(/performanceService\?\.recordCacheAccess/g, 'performanceService.recordCacheAccess');

// Guardar el archivo corregido
fs.writeFileSync(filePath, content);

console.log('Archivo corregido: ' + filePath);
