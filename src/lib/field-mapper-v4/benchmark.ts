/**
 * Sistema de benchmark para transformaciones
 * 
 * Proporciona funcionalidad para medir el rendimiento de las transformaciones
 * con diferentes volúmenes de datos y configuraciones.
 */

import { FieldType } from './types';
import { Transformation, transformations, getTransformation } from './transformations';
import { transformationCache } from './cache';

// Resultado de una ejecución de benchmark
export interface BenchmarkResult {
  transformationId: string;
  transformationName: string;
  sourceType: FieldType;
  targetType: FieldType;
  iterations: number;
  totalTime: number;
  averageTime: number;
  withCache: boolean;
  samplesCount: number;
}

// Configuración para el benchmark
export interface BenchmarkConfig {
  transformationId: string;
  iterations: number;
  samplesCount: number;
  withCache: boolean;
}

/**
 * Genera datos de muestra para un tipo de campo específico
 * 
 * @param type - Tipo de campo
 * @param count - Número de muestras a generar
 * @returns Array de valores de muestra
 */
export function generateSampleData(type: FieldType, count: number = 10): any[] {
  const samples: any[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case FieldType.TEXT:
      case FieldType.TITLE:
        samples.push(`Texto de ejemplo ${i+1}`);
        break;
      case FieldType.RICH_TEXT:
        samples.push([{ 
          text: { 
            content: `Texto con formato ${i+1}` 
          } 
        }]);
        break;
      case FieldType.NUMBER:
        samples.push(i * 10.5 + 0.1);
        break;
      case FieldType.DATE:
        const date = new Date();
        date.setDate(date.getDate() + i);
        samples.push({ 
          start: date.toISOString().split('T')[0] 
        });
        break;
      case FieldType.SELECT:
        samples.push({ 
          name: `Opción ${i+1}` 
        });
        break;
      case FieldType.MULTI_SELECT:
        samples.push([
          { name: `Opción A${i}` }, 
          { name: `Opción B${i}` }
        ]);
        break;
      case FieldType.URL:
        samples.push(`https://example${i}.com`);
        break;
      case FieldType.EMAIL:
        samples.push(`usuario${i}@example.com`);
        break;
      case FieldType.CHECKBOX:
        samples.push(i % 2 === 0);
        break;
      case FieldType.FILES:
        samples.push([
          { name: `documento${i}.pdf`, url: `https://example.com/documento${i}.pdf` },
          { name: `imagen${i}.jpg`, url: `https://example.com/imagen${i}.jpg` }
        ]);
        break;
      case FieldType.IMAGE:
        samples.push({ 
          url: `https://example.com/imagen${i}.jpg` 
        });
        break;
      default:
        samples.push(`Valor ${i}`);
    }
  }
  
  return samples;
}

/**
 * Ejecuta un benchmark para una transformación específica
 * 
 * @param config - Configuración del benchmark
 * @returns Resultado del benchmark
 */
export async function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
  const { transformationId, iterations, samplesCount, withCache } = config;
  
  // Limpiar caché si es necesario
  if (!withCache) {
    transformationCache.clear();
  }
  
  const transformation = getTransformation(transformationId);
  if (!transformation) {
    throw new Error(`Transformación no encontrada: ${transformationId}`);
  }
  
  // Generar datos de muestra
  const samples = generateSampleData(transformation.sourceType, samplesCount);
  
  let totalTime = 0;
  
  // Ejecutar benchmark
  for (let i = 0; i < iterations; i++) {
    // Para cada iteración, procesar todas las muestras
    const startTime = performance.now();
    
    for (const sample of samples) {
      try {
        transformation.transform(sample);
      } catch (error) {
        console.error(`Error al transformar muestra:`, error);
      }
    }
    
    const endTime = performance.now();
    totalTime += (endTime - startTime);
  }
  
  // Calcular tiempo promedio por iteración
  const averageTime = totalTime / iterations;
  
  return {
    transformationId,
    transformationName: transformation.name,
    sourceType: transformation.sourceType,
    targetType: transformation.targetType,
    iterations,
    totalTime,
    averageTime,
    withCache,
    samplesCount
  };
}

/**
 * Ejecuta un benchmark comparativo con y sin caché
 * 
 * @param transformationId - ID de la transformación
 * @param iterations - Número de iteraciones
 * @param samplesCount - Número de muestras
 * @returns Array con resultados con y sin caché
 */
export async function runComparativeBenchmark(
  transformationId: string,
  iterations: number = 10,
  samplesCount: number = 50
): Promise<BenchmarkResult[]> {
  // Primero ejecutar sin caché
  const withoutCacheResult = await runBenchmark({
    transformationId,
    iterations,
    samplesCount,
    withCache: false
  });
  
  // Luego ejecutar con caché
  const withCacheResult = await runBenchmark({
    transformationId,
    iterations,
    samplesCount,
    withCache: true
  });
  
  return [withoutCacheResult, withCacheResult];
}

/**
 * Calcula el porcentaje de mejora entre dos resultados
 * 
 * @param withoutCache - Resultado sin caché
 * @param withCache - Resultado con caché
 * @returns Porcentaje de mejora
 */
export function calculateImprovement(
  withoutCache: BenchmarkResult,
  withCache: BenchmarkResult
): number {
  return ((withoutCache.averageTime - withCache.averageTime) / withoutCache.averageTime) * 100;
}
