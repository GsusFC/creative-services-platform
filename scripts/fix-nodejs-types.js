/**
 * Script para corregir errores relacionados con NodeJS?.Timeout
 * 
 * Este script corrige los errores de sintaxis en referencias a NodeJS.Timeout
 * que aparecen en varios archivos del proyecto.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Corrigiendo referencias a NodeJS?.Timeout...');

// Archivos a procesar
const filesToFix = [
  'src/app/api/notion/mappings/route.ts',
  'src/app/api/notion/test-mapping/route.ts',
  'src/components/field-mapper/Dashboard.tsx',
  'src/components/field-mapper/FieldMapperContainer.tsx',
  'src/components/field-mapper/IncrementalLoadProvider.tsx'
];

// Procesar cada archivo
filesToFix.forEach(relativeFilePath => {
  const filePath = path.join(__dirname, '..', relativeFilePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Archivo no encontrado: ${filePath}`);
    return;
  }
  
  console.log(`Procesando: ${relativeFilePath}`);
  
  // Leer el contenido del archivo
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corregir referencias a NodeJS?.Timeout
  content = content.replace(/NodeJS\?\.Timeout/g, 'NodeJS.Timeout');
  
  // Corregir referencias a NodeJS?.ErrnoException
  content = content.replace(/NodeJS\?\.ErrnoException/g, 'NodeJS.ErrnoException');
  
  // Corregir referencias a React?.FC
  content = content.replace(/React\?\.FC/g, 'React.FC');
  
  // Corregir referencias a LoadProgressContext?.Provider
  content = content.replace(/LoadProgressContext\?\.Provider/g, 'LoadProgressContext.Provider');
  
  // Corregir referencias a LoadStage?.NotionFields
  content = content.replace(/LoadStage\?\.(\w+)/g, 'LoadStage.$1');
  
  // Corregir referencias a números con punto opcional (0?.2)
  content = content.replace(/(\d)\?\.(\d)/g, '$1.$2');
  
  // Guardar el archivo corregido
  fs.writeFileSync(filePath, content);
  
  console.log(`Archivo corregido: ${relativeFilePath}`);
});

console.log('Correcciones completadas.');
