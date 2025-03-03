/**
 * Script de prueba para validar el funcionamiento del Field Mapper
 */

console.log('=== Iniciando pruebas del Field Mapper ===');

// Prueba simple para verificar que los archivos se pueden importar sin errores
try {
  console.log('Intentando importar validation.js...');
  require('./validation');
  console.log('✅ Importación de validation.js exitosa');
  
  console.log('Intentando importar cache-service.js...');
  require('./cache-service');
  console.log('✅ Importación de cache-service.js exitosa');
  
  console.log('Intentando importar transformation-service.js...');
  require('./transformation-service');
  console.log('✅ Importación de transformation-service.js exitosa');
  
  console.log('=== Todas las importaciones exitosas ===');
  console.log('Los cambios realizados no han afectado la capacidad de importar los módulos.');
} catch (error) {
  console.error('❌ Error durante la importación:', error);
}

console.log('=== Pruebas completadas ===');
