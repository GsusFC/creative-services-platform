/**
 * Script de diagnóstico para la conexión con Notion
 * Este script verifica la conexión con Notion y muestra información detallada
 * sobre el proceso de obtención de case studies.
 */

// Importamos dotenv para cargar manualmente las variables de entorno
import * as dotenv from 'dotenv';

// Cargamos las variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

import { getAllCaseStudies, getCaseStudy } from '@/lib/notion/client';
import { checkNotionAvailability, fetchNotion } from '@/lib/notion/utils';

async function testNotionConnection() {
  console.log('=== DIAGNÓSTICO DE CONEXIÓN CON NOTION ===');
  
  // Verificar variables de entorno
  console.log('\n1. Verificando variables de entorno:');
  const apiKey = process.env['NEXT_PUBLIC_NOTION_API_KEY'];
  const databaseId = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'];
  
  console.log(`- NEXT_PUBLIC_NOTION_API_KEY: ${apiKey ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`- NEXT_PUBLIC_NOTION_DATABASE_ID: ${databaseId ? '✅ Configurada' : '❌ No configurada'}`);
  
  if (!apiKey || !databaseId) {
    console.error('\n❌ ERROR: Faltan variables de entorno necesarias para conectar con Notion.');
    console.log('Por favor, configura las variables NEXT_PUBLIC_NOTION_API_KEY y NEXT_PUBLIC_NOTION_DATABASE_ID en el archivo .env.local');
    return;
  }
  
  // Verificar disponibilidad del servicio
  console.log('\n2. Verificando disponibilidad del servicio Notion:');
  try {
    const isAvailable = await checkNotionAvailability({ forceCheck: true });
    console.log(`- Servicio Notion: ${isAvailable ? '✅ Disponible' : '❌ No disponible'}`);
    
    if (!isAvailable) {
      console.error('\n❌ ERROR: El servicio de Notion no está disponible.');
      return;
    }
  } catch (error) {
    console.error('\n❌ ERROR al verificar disponibilidad:', error);
    return;
  }
  
  // Verificar acceso a la base de datos
  console.log('\n3. Verificando acceso a la base de datos:');
  try {
    console.log('- Intentando consulta directa a la base de datos...');
    
    // Consulta directa a la API de Notion
    const queryBody = {
      page_size: 10,
      filter: {
        property: 'Status',
        select: {
          equals: 'Listo'
        }
      }
    };
    
    const response = await fetchNotion(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(queryBody)
    });
    
    if (response && response.results) {
      console.log(`✅ Éxito: Se encontraron ${response.results.length} resultados en la base de datos.`);
      
      if (response.results.length > 0) {
        console.log('\nPrimeros resultados:');
        response.results.slice(0, 3).forEach((result: any, index: number) => {
          const title = result.properties['Brand Name']?.title?.[0]?.plain_text || 'Sin título';
          const id = result.id;
          console.log(`${index + 1}. "${title}" (ID: ${id})`);
        });
      } else {
        console.log('⚠️ No se encontraron resultados con el filtro actual.');
        console.log('Intentando sin filtro...');
        
        // Intentar sin filtro
        const responseWithoutFilter = await fetchNotion(`/databases/${databaseId}/query`, {
          method: 'POST',
          body: JSON.stringify({ page_size: 10 })
        });
        
        if (responseWithoutFilter && responseWithoutFilter.results && responseWithoutFilter.results.length > 0) {
          console.log(`✅ Se encontraron ${responseWithoutFilter.results.length} resultados sin filtro.`);
          console.log('Esto sugiere que el problema puede estar en los filtros o en la estructura de los datos.');
        } else {
          console.log('❌ No se encontraron resultados incluso sin filtro.');
        }
      }
    } else {
      console.error('❌ ERROR: La respuesta de Notion no tiene el formato esperado.');
    }
  } catch (error) {
    console.error('❌ ERROR al consultar la base de datos:', error);
    return;
  }
  
  // Probar getAllCaseStudies
  console.log('\n4. Probando función getAllCaseStudies:');
  try {
    const studies = await getAllCaseStudies({ forceRefresh: true });
    console.log(`- Resultado: ${studies.length > 0 ? '✅' : '❌'} Se obtuvieron ${studies.length} case studies.`);
    
    if (studies.length > 0) {
      console.log('\nPrimeros case studies:');
      studies.slice(0, 3).forEach((study, index) => {
        console.log(`${index + 1}. "${study.title}" (ID: ${study.id})`);
      });
    } else {
      console.log('⚠️ No se obtuvieron case studies.');
    }
  } catch (error) {
    console.error('❌ ERROR al obtener case studies:', error);
  }
  
  console.log('\n=== FIN DEL DIAGNÓSTICO ===');
}

// Ejecutar el diagnóstico
testNotionConnection().catch(console.error);

export {};
