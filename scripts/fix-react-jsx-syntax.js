/**
 * Script para corregir errores de sintaxis en archivos React/JSX
 * 
 * Este script corrige problemas comunes en los componentes React
 * como operadores opcionales incorrectos, sintaxis JSX malformada, etc.
 */

'use strict';

const fs = require('fs');
const path = require('path');

console.log('Corrigiendo errores de sintaxis en archivos React/JSX...');

// Archivos a procesar
const filesToFix = [
  'src/components/field-mapper/Mapping.tsx',
  'src/components/field-mapper/MappingList.tsx',
  'src/components/field-mapper/OptimizationRecommendations.tsx',
  'src/components/field-mapper/OptimizedMapping.tsx',
  'src/components/field-mapper/PerformanceHistory.tsx',
  'src/components/field-mapper/TransformationConfig.tsx',
  'src/components/field-mapper/VirtualizedMappingList.tsx'
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
  
  // Corregir referencias a React?.FC
  content = content.replace(/React\?\.FC/g, 'React.FC');
  
  // Corregir operadores de acceso opcional
  content = content.replace(/state\?\.(\w+)/g, 'state.$1');
  content = content.replace(/mapping\?\.(\w+)/g, 'mapping.$1');
  content = content.replace(/f\?\.(\w+)/g, 'f.$1');
  content = content.replace(/parentRef\?\.(\w+)/g, 'parentRef.$1');
  content = content.replace(/CompatibilityLevel\?\.(\w+)/g, 'CompatibilityLevel.$1');
  
  // Corregir arrow functions
  content = content.replace(/(\w+)\s+=>\s+(\w+)\?\.(\w+)/g, '$1 => $2.$3');
  
  // Corregir operadores de flecha en JSX
  content = content.replace(/=>\s*{/g, '=> {');
  
  // Corregir referencias a Date?.now
  content = content.replace(/Date\?\.now/g, 'Date.now');
  
  // Guardar el archivo corregido
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`Corregido: ${relativeFilePath}`);
});

console.log('¡Correcciones completadas!');
