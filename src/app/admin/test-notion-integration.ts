import { checkNotionAvailability, logInfo, logError, logWarn } from '@/lib/notion/utils';
// Importaciones condicionales para evitar errores si faltan variables de entorno
let notionClient: any = {};

// Verificar si podemos importar los módulos de Notion
try {
  notionClient = require('@/lib/notion/client');
} catch (error) {
  console.warn('No se pudieron cargar los módulos de Notion client. Algunas pruebas serán omitidas.');
}

/**
 * Script para probar la función checkNotionAvailability refactorizada
 */
async function testNotionAvailability() {
  console.log('=== PRUEBA DE DISPONIBILIDAD DE NOTION ===');
  console.log('Fecha y hora:', new Date().toISOString());
  
  try {
    // Prueba 1: Verificación estándar
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
    
    // Prueba 4: Verificación con timeout personalizado
    console.log('\n4. Verificación con timeout personalizado (2 segundos):');
    const isAvailable4 = await checkNotionAvailability({ 
      timeoutMs: 2000,
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
    
    // Solo ejecutar pruebas adicionales si el cliente de Notion está disponible
    if (Object.keys(notionClient).length > 0) {
      await testNotionIntegration(isAvailable5);
    } else {
      console.log('\n⚠️ No se pudieron realizar pruebas adicionales porque faltan variables de entorno de Notion.');
    }
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
  
  console.log('\n=== FIN DE PRUEBAS ===');
}

/**
 * Prueba la integración completa con Notion si está disponible
 */
async function testNotionIntegration(isNotionAvailable: boolean) {
  if (!isNotionAvailable) {
    console.log('\n⚠️ Notion no está disponible. Omitiendo pruebas de integración.');
    return;
  }
  
  console.log('\n=== PRUEBAS ADICIONALES DE INTEGRACIÓN CON NOTION ===');
  
  try {
    const { getAllCaseStudies, transformCaseStudyToNotion, transformNotionToCaseStudy } = notionClient;
    
    // Paso 1: Obtener todos los case studies
    console.log('\n1. Obteniendo case studies:');
    console.time('Tiempo de obtención');
    const caseStudies = await getAllCaseStudies({ 
      forceRefresh: true,
      filters: { status: 'published' }
    });
    console.timeEnd('Tiempo de obtención');
    
    console.log(`Se encontraron ${caseStudies.length} case studies.`);
    if (caseStudies.length === 0) {
      console.log('No hay case studies para continuar las pruebas.');
      return;
    }
    
    // Mostrar información del primer case study
    console.log('Primer case study:', {
      id: caseStudies[0].id,
      title: caseStudies[0].title,
      tags: caseStudies[0].tags,
      mediaItems: caseStudies[0].mediaItems?.length || 0
    });
    
    // Paso 2: Probar caché
    console.log('\n2. Probando sistema de caché:');
    console.log('Primera llamada (ya realizada)');
    
    console.log('Segunda llamada (con caché):');
    console.time('Tiempo con caché');
    await getAllCaseStudies();
    console.timeEnd('Tiempo con caché');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas de integración:', error);
  }
}

// Ejecutar las pruebas
testNotionAvailability().catch(console.error);
