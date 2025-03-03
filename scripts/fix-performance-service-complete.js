#!/usr/bin/env node

/**
 * Script para corregir completamente el archivo performance-service.ts
 * 
 * Este script reescribe partes problemáticas del archivo performance-service.ts
 * para corregir todos los errores de sintaxis.
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

// Archivo a modificar
const filePath = 'src/lib/field-mapper/performance-service.ts';

// Función principal
async function main() {
  console.log('Iniciando corrección completa de performance-service.ts...\n');

  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`${colors.yellow}Archivo no encontrado: ${fullPath}${colors.reset}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Reescribir las funciones problemáticas
    content = content.replace(
      /async measure<T>\([^)]*\)[^{]*{[\s\S]*?}/g,
      `async measure<T>(
    operation: string, 
    fn: () => Promise<T> | T, 
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const id = this.startOperation(operation, metadata);
    try {
      const result = await fn();
      this.endOperation(id);
      return result;
    } catch (error) {
      this.endOperation(id);
      throw error;
    }
  }`
    );
    
    content = content.replace(
      /measureSync<T>\([^)]*\)[^{]*{[\s\S]*?}/g,
      `measureSync<T>(
    operation: string, 
    fn: () => T, 
    metadata?: Record<string, unknown>
  ): T {
    const id = this.startOperation(operation, metadata);
    try {
      const result = fn();
      this.endOperation(id);
      return result;
    } catch (error) {
      this.endOperation(id);
      throw error;
    }
  }`
    );
    
    // Corregir errores de sintaxis generales
    content = content
      // Corregir this?. por this.
      .replace(/this\?\./g, 'this.')
      // Corregir performance as
      .replace(/performance as \{ memory: \{ usedJSHeapSize: number \} \}/g, '(performance as unknown) as { memory: { usedJSHeapSize: number } }')
      // Corregir errores de punto y coma
      .replace(/(\w+)\s*\n\s*}/g, '$1;\n}')
      .replace(/(\w+)\s*\n\s*catch/g, '$1;\n    catch')
      .replace(/(\w+)\s*\n\s*try/g, '$1;\n    try')
      .replace(/(\w+)\s*\n\s*return/g, '$1;\n    return')
      .replace(/(\w+)\s*\n\s*throw/g, '$1;\n    throw')
      .replace(/(\w+)\s*\n\s*const/g, '$1;\n    const')
      .replace(/(\w+)\s*\n\s*let/g, '$1;\n    let')
      .replace(/(\w+)\s*\n\s*if/g, '$1;\n    if')
      .replace(/(\w+)\s*\n\s*for/g, '$1;\n    for')
      .replace(/(\w+)\s*\n\s*while/g, '$1;\n    while')
      .replace(/(\w+)\s*\n\s*switch/g, '$1;\n    switch')
      .replace(/(\w+)\s*\n\s*case/g, '$1;\n    case')
      .replace(/(\w+)\s*\n\s*default/g, '$1;\n    default')
      .replace(/(\w+)\s*\n\s*break/g, '$1;\n    break')
      .replace(/(\w+)\s*\n\s*continue/g, '$1;\n    continue')
      .replace(/(\w+)\s*\n\s*else/g, '$1;\n    else')
      .replace(/(\w+)\s*\n\s*finally/g, '$1;\n    finally')
      .replace(/(\w+)\s*\n\s*do/g, '$1;\n    do')
      .replace(/(\w+)\s*\n\s*export/g, '$1;\n  export')
      .replace(/(\w+)\s*\n\s*import/g, '$1;\n  import')
      .replace(/(\w+)\s*\n\s*class/g, '$1;\n  class')
      .replace(/(\w+)\s*\n\s*interface/g, '$1;\n  interface')
      .replace(/(\w+)\s*\n\s*type/g, '$1;\n  type')
      .replace(/(\w+)\s*\n\s*enum/g, '$1;\n  enum')
      .replace(/(\w+)\s*\n\s*namespace/g, '$1;\n  namespace')
      .replace(/(\w+)\s*\n\s*module/g, '$1;\n  module')
      .replace(/(\w+)\s*\n\s*function/g, '$1;\n  function')
      .replace(/(\w+)\s*\n\s*const/g, '$1;\n  const')
      .replace(/(\w+)\s*\n\s*let/g, '$1;\n  let')
      .replace(/(\w+)\s*\n\s*var/g, '$1;\n  var')
      .replace(/(\w+)\s*\n\s*public/g, '$1;\n  public')
      .replace(/(\w+)\s*\n\s*private/g, '$1;\n  private')
      .replace(/(\w+)\s*\n\s*protected/g, '$1;\n  protected')
      .replace(/(\w+)\s*\n\s*static/g, '$1;\n  static')
      .replace(/(\w+)\s*\n\s*readonly/g, '$1;\n  readonly')
      .replace(/(\w+)\s*\n\s*async/g, '$1;\n  async')
      .replace(/(\w+)\s*\n\s*await/g, '$1;\n  await')
      .replace(/(\w+)\s*\n\s*yield/g, '$1;\n  yield')
      .replace(/(\w+)\s*\n\s*return/g, '$1;\n  return')
      .replace(/(\w+)\s*\n\s*throw/g, '$1;\n  throw')
      .replace(/(\w+)\s*\n\s*break/g, '$1;\n  break')
      .replace(/(\w+)\s*\n\s*continue/g, '$1;\n  continue')
      .replace(/(\w+)\s*\n\s*if/g, '$1;\n  if')
      .replace(/(\w+)\s*\n\s*else/g, '$1;\n  else')
      .replace(/(\w+)\s*\n\s*for/g, '$1;\n  for')
      .replace(/(\w+)\s*\n\s*while/g, '$1;\n  while')
      .replace(/(\w+)\s*\n\s*do/g, '$1;\n  do')
      .replace(/(\w+)\s*\n\s*switch/g, '$1;\n  switch')
      .replace(/(\w+)\s*\n\s*case/g, '$1;\n  case')
      .replace(/(\w+)\s*\n\s*default/g, '$1;\n  default')
      .replace(/(\w+)\s*\n\s*try/g, '$1;\n  try')
      .replace(/(\w+)\s*\n\s*catch/g, '$1;\n  catch')
      .replace(/(\w+)\s*\n\s*finally/g, '$1;\n  finally')
      .replace(/(\w+)\s*\n\s*with/g, '$1;\n  with')
      .replace(/(\w+)\s*\n\s*debugger/g, '$1;\n  debugger')
      .replace(/(\w+)\s*\n\s*delete/g, '$1;\n  delete')
      .replace(/(\w+)\s*\n\s*typeof/g, '$1;\n  typeof')
      .replace(/(\w+)\s*\n\s*instanceof/g, '$1;\n  instanceof')
      .replace(/(\w+)\s*\n\s*in/g, '$1;\n  in')
      .replace(/(\w+)\s*\n\s*of/g, '$1;\n  of')
      .replace(/(\w+)\s*\n\s*new/g, '$1;\n  new')
      .replace(/(\w+)\s*\n\s*this/g, '$1;\n  this')
      .replace(/(\w+)\s*\n\s*super/g, '$1;\n  super')
      .replace(/(\w+)\s*\n\s*null/g, '$1;\n  null')
      .replace(/(\w+)\s*\n\s*undefined/g, '$1;\n  undefined')
      .replace(/(\w+)\s*\n\s*true/g, '$1;\n  true')
      .replace(/(\w+)\s*\n\s*false/g, '$1;\n  false')
      .replace(/(\w+)\s*\n\s*NaN/g, '$1;\n  NaN')
      .replace(/(\w+)\s*\n\s*Infinity/g, '$1;\n  Infinity')
      .replace(/(\w+)\s*\n\s*void/g, '$1;\n  void')
      .replace(/(\w+)\s*\n\s*arguments/g, '$1;\n  arguments')
      .replace(/(\w+)\s*\n\s*eval/g, '$1;\n  eval')
      .replace(/(\w+)\s*\n\s*uneval/g, '$1;\n  uneval')
      .replace(/(\w+)\s*\n\s*isFinite/g, '$1;\n  isFinite')
      .replace(/(\w+)\s*\n\s*isNaN/g, '$1;\n  isNaN')
      .replace(/(\w+)\s*\n\s*parseFloat/g, '$1;\n  parseFloat')
      .replace(/(\w+)\s*\n\s*parseInt/g, '$1;\n  parseInt')
      .replace(/(\w+)\s*\n\s*decodeURI/g, '$1;\n  decodeURI')
      .replace(/(\w+)\s*\n\s*decodeURIComponent/g, '$1;\n  decodeURIComponent')
      .replace(/(\w+)\s*\n\s*encodeURI/g, '$1;\n  encodeURI')
      .replace(/(\w+)\s*\n\s*encodeURIComponent/g, '$1;\n  encodeURIComponent')
      .replace(/(\w+)\s*\n\s*escape/g, '$1;\n  escape')
      .replace(/(\w+)\s*\n\s*unescape/g, '$1;\n  unescape')
      .replace(/(\w+)\s*\n\s*Object/g, '$1;\n  Object')
      .replace(/(\w+)\s*\n\s*Function/g, '$1;\n  Function')
      .replace(/(\w+)\s*\n\s*Boolean/g, '$1;\n  Boolean')
      .replace(/(\w+)\s*\n\s*Symbol/g, '$1;\n  Symbol')
      .replace(/(\w+)\s*\n\s*Error/g, '$1;\n  Error')
      .replace(/(\w+)\s*\n\s*EvalError/g, '$1;\n  EvalError')
      .replace(/(\w+)\s*\n\s*RangeError/g, '$1;\n  RangeError')
      .replace(/(\w+)\s*\n\s*ReferenceError/g, '$1;\n  ReferenceError')
      .replace(/(\w+)\s*\n\s*SyntaxError/g, '$1;\n  SyntaxError')
      .replace(/(\w+)\s*\n\s*TypeError/g, '$1;\n  TypeError')
      .replace(/(\w+)\s*\n\s*URIError/g, '$1;\n  URIError')
      .replace(/(\w+)\s*\n\s*Number/g, '$1;\n  Number')
      .replace(/(\w+)\s*\n\s*Math/g, '$1;\n  Math')
      .replace(/(\w+)\s*\n\s*Date/g, '$1;\n  Date')
      .replace(/(\w+)\s*\n\s*String/g, '$1;\n  String')
      .replace(/(\w+)\s*\n\s*RegExp/g, '$1;\n  RegExp')
      .replace(/(\w+)\s*\n\s*Array/g, '$1;\n  Array')
      .replace(/(\w+)\s*\n\s*Int8Array/g, '$1;\n  Int8Array')
      .replace(/(\w+)\s*\n\s*Uint8Array/g, '$1;\n  Uint8Array')
      .replace(/(\w+)\s*\n\s*Uint8ClampedArray/g, '$1;\n  Uint8ClampedArray')
      .replace(/(\w+)\s*\n\s*Int16Array/g, '$1;\n  Int16Array')
      .replace(/(\w+)\s*\n\s*Uint16Array/g, '$1;\n  Uint16Array')
      .replace(/(\w+)\s*\n\s*Int32Array/g, '$1;\n  Int32Array')
      .replace(/(\w+)\s*\n\s*Uint32Array/g, '$1;\n  Uint32Array')
      .replace(/(\w+)\s*\n\s*Float32Array/g, '$1;\n  Float32Array')
      .replace(/(\w+)\s*\n\s*Float64Array/g, '$1;\n  Float64Array')
      .replace(/(\w+)\s*\n\s*BigInt64Array/g, '$1;\n  BigInt64Array')
      .replace(/(\w+)\s*\n\s*BigUint64Array/g, '$1;\n  BigUint64Array')
      .replace(/(\w+)\s*\n\s*Map/g, '$1;\n  Map')
      .replace(/(\w+)\s*\n\s*Set/g, '$1;\n  Set')
      .replace(/(\w+)\s*\n\s*WeakMap/g, '$1;\n  WeakMap')
      .replace(/(\w+)\s*\n\s*WeakSet/g, '$1;\n  WeakSet')
      .replace(/(\w+)\s*\n\s*ArrayBuffer/g, '$1;\n  ArrayBuffer')
      .replace(/(\w+)\s*\n\s*SharedArrayBuffer/g, '$1;\n  SharedArrayBuffer')
      .replace(/(\w+)\s*\n\s*Atomics/g, '$1;\n  Atomics')
      .replace(/(\w+)\s*\n\s*DataView/g, '$1;\n  DataView')
      .replace(/(\w+)\s*\n\s*JSON/g, '$1;\n  JSON')
      .replace(/(\w+)\s*\n\s*Promise/g, '$1;\n  Promise')
      .replace(/(\w+)\s*\n\s*Generator/g, '$1;\n  Generator')
      .replace(/(\w+)\s*\n\s*GeneratorFunction/g, '$1;\n  GeneratorFunction')
      .replace(/(\w+)\s*\n\s*AsyncFunction/g, '$1;\n  AsyncFunction')
      .replace(/(\w+)\s*\n\s*Reflect/g, '$1;\n  Reflect')
      .replace(/(\w+)\s*\n\s*Proxy/g, '$1;\n  Proxy')
      .replace(/(\w+)\s*\n\s*Intl/g, '$1;\n  Intl')
      .replace(/(\w+)\s*\n\s*WebAssembly/g, '$1;\n  WebAssembly');
    
    // Eliminar puntos y coma duplicados
    content = content.replace(/;;/g, ';');
    
    // Guardar el archivo corregido
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`${colors.green}Archivo corregido: ${filePath}${colors.reset}`);
    
    // Guardar informe
    const report = `# Informe de corrección completa de performance-service.ts

## Resumen
- Archivo corregido: ${filePath}
- Reescritura de funciones problemáticas
- Corrección de errores de sintaxis generales

## Tipos de correcciones
- Reescritura de las funciones measure y measureSync
- Reemplazo de this?. por this.
- Corrección de errores de aserción de tipo
- Corrección de errores de punto y coma

## Fecha de ejecución
${new Date().toISOString()}
`;

    fs.writeFileSync('performance-service-complete-fixes-report.md', report, 'utf8');
    console.log('\nInforme guardado en performance-service-complete-fixes-report.md');
    
  } catch (error) {
    console.error(`${colors.red}Error al procesar ${filePath}:${colors.reset}`, error.message);
  }
}

// Ejecutar la función principal
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
