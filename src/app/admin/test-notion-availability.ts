import { checkNotionAvailability, logInfo } from '@/lib/notion/utils';

/**
 * Script para probar la función checkNotionAvailability refactorizada
 */
async function testNotionAvailability() {
  console.log('=== PRUEBA DE DISPONIBILIDAD DE NOTION ===');
  
  // Prueba 1: Verificación normal
  console.log('\n1. Verificación estándar:');
  const isAvailable1 = await checkNotionAvailability();
  console.log(`Resultado: Notion está ${isAvailable1 ? 'disponible' : 'no disponible'}`);
  
  // Prueba 2: Verificación con caché (debería ser rápida)
  console.log('\n2. Verificación con caché (debería ser instantánea):');
  console.time('Tiempo con caché');
  const isAvailable2 = await checkNotionAvailability();
  console.timeEnd('Tiempo con caché');
  console.log(`Resultado: Notion está ${isAvailable2 ? 'disponible' : 'no disponible'}`);
  
  // Prueba 3: Forzar verificación (ignorar caché)
  console.log('\n3. Forzar verificación (ignorar caché):');
  console.time('Tiempo forzando verificación');
  const isAvailable3 = await checkNotionAvailability({ forceCheck: true });
  console.timeEnd('Tiempo forzando verificación');
  console.log(`Resultado: Notion está ${isAvailable3 ? 'disponible' : 'no disponible'}`);
  
  // Prueba 4: Verificación con timeout corto (1ms)
  console.log('\n4. Verificación con timeout muy corto (1ms, debería fallar):');
  const isAvailable4 = await checkNotionAvailability({ 
    timeoutMs: 1,
    forceCheck: true
  });
  console.log(`Resultado: Notion está ${isAvailable4 ? 'disponible' : 'no disponible'}`);
  
  // Prueba 5: Verificación con múltiples reintentos
  console.log('\n5. Verificación con múltiples reintentos:');
  const isAvailable5 = await checkNotionAvailability({ 
    maxRetries: 2,
    forceCheck: true
  });
  console.log(`Resultado: Notion está ${isAvailable5 ? 'disponible' : 'no disponible'}`);
  
  console.log('\n=== FIN DE PRUEBAS ===');
}

// Ejecutar las pruebas
testNotionAvailability().catch(console.error);
