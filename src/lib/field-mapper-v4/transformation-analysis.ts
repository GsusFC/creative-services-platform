/**
 * Sistema de análisis de transformaciones
 * 
 * Este módulo proporciona utilidades para analizar el rendimiento
 * de las transformaciones y generar recomendaciones basadas en patrones
 * de uso y resultados de benchmarks.
 */

import { BenchmarkResult } from './benchmark';
import { transformations } from './transformations';
import { CacheStats } from './cache';
import { Recommendation, RecommendationImpact, RecommendationType } from './optimization';

export interface TransformationAnalysisResult {
  // Nombre de la transformación
  transformationId: string;
  transformationName: string;
  
  // Métricas clave
  averageTime: number;         // Tiempo promedio en ms
  averageTimeWithCache: number;// Tiempo promedio con caché
  timeImprovement: number;     // Mejora con caché (%)
  
  // Costos y beneficios
  complexity: number;          // Complejidad computacional (estimada)
  cacheEfficiency: number;     // Eficiencia del uso de caché (0-1)
  costBenefitRatio: number;    // Ratio costo/beneficio
  
  // Estadísticas de uso
  usageCount: number;          // Veces usada en mapeos
  cacheHits: number;           // Aciertos de caché
  cacheMisses: number;         // Fallos de caché
}

/**
 * Analiza los resultados de benchmarks y estadísticas de caché
 * para generar un análisis detallado de cada transformación.
 */
export function analyzeTransformations(
  benchmarkResults: BenchmarkResult[],
  cacheStats: CacheStats
): TransformationAnalysisResult[] {
  if (!benchmarkResults.length) return [];
  
  // Agrupar resultados por transformación
  const resultsByTransformation = new Map<string, BenchmarkResult[]>();
  
  benchmarkResults.forEach(result => {
    const existing = resultsByTransformation.get(result.transformationId) || [];
    resultsByTransformation.set(result.transformationId, [...existing, result]);
  });
  
  // Inicializar contadores para estadísticas de caché por transformación
  // (Esto sería más preciso si el sistema de caché proporcionara estadísticas por transformación)
  const hitsByTransformation = new Map<string, number>();
  const missesByTransformation = new Map<string, number>();
  
  // En un sistema real, estas estadísticas vendrían del sistema de caché
  // Como aproximación, distribuimos proporcionalmente según los resultados de benchmark
  const totalBenchmarks = benchmarkResults.length;
  
  if (totalBenchmarks > 0) {
    resultsByTransformation.forEach((results, transformationId) => {
      const proportion = results.length / totalBenchmarks;
      hitsByTransformation.set(transformationId, Math.round(cacheStats.hits * proportion));
      missesByTransformation.set(transformationId, Math.round(cacheStats.misses * proportion));
    });
  }
  
  // Generar análisis para cada transformación
  return Array.from(resultsByTransformation.entries()).map(([transformationId, results]) => {
    // Encontrar resultados con y sin caché
    const withoutCache = results.find(r => !r.withCache);
    const withCache = results.find(r => r.withCache);
    
    // Calcular métricas básicas
    const averageTime = withoutCache?.averageTime || 0;
    const averageTimeWithCache = withCache?.averageTime || averageTime;
    const timeImprovement = averageTime > 0 
      ? ((averageTime - averageTimeWithCache) / averageTime) * 100 
      : 0;
    
    // Obtener datos de uso de caché
    const hits = hitsByTransformation.get(transformationId) || 0;
    const misses = missesByTransformation.get(transformationId) || 0;
    const totalCalls = hits + misses;
    
    // Estimar complejidad (en un sistema real, esto vendría del análisis del código)
    const transformationInfo = Object.values(transformations).find(t => t.id === transformationId);
    let complexity = 1; // Valor predeterminado
    
    if (transformationInfo) {
      // @ts-ignore - Estas propiedades se añadirán más adelante
      if (transformationInfo.isComplex) {
        complexity = 3; // Alta complejidad
      // @ts-ignore - Estas propiedades se añadirán más adelante
      } else if (transformationInfo.isAsync || transformationInfo.usesManyRegex) {
        complexity = 2; // Complejidad media
      }
    }
    
    // Calcular eficiencia de caché
    const cacheEfficiency = totalCalls > 0 ? hits / totalCalls : 0;
    
    // Calcular ratio costo/beneficio (mayor es mejor)
    // Consideramos: mejora, complejidad y eficiencia de caché
    const costBenefitRatio = (timeImprovement * cacheEfficiency) / complexity;
    
    return {
      transformationId,
      transformationName: transformationInfo?.name || transformationId,
      averageTime,
      averageTimeWithCache,
      timeImprovement,
      complexity,
      cacheEfficiency,
      costBenefitRatio,
      usageCount: totalCalls,
      cacheHits: hits,
      cacheMisses: misses
    };
  });
}

/**
 * Genera recomendaciones específicas para optimizar transformaciones
 * basadas en el análisis de rendimiento.
 */
export function generateTransformationRecommendations(
  analysisResults: TransformationAnalysisResult[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Ordenar por potencial de optimización (bajo rendimiento, alta utilización)
  const sortedByOptimizationPotential = [...analysisResults]
    .sort((a, b) => {
      // Dar prioridad a transformaciones lentas con alto uso
      const aPotential = (a.averageTime * a.usageCount) / (a.cacheEfficiency + 0.1);
      const bPotential = (b.averageTime * b.usageCount) / (b.cacheEfficiency + 0.1);
      return bPotential - aPotential;
    });
  
  // Generar recomendaciones para las transformaciones con mayor potencial
  sortedByOptimizationPotential.slice(0, 3).forEach(analysis => {
    // Solo recomendar si hay margen de mejora
    if (analysis.cacheEfficiency < 0.7 && analysis.averageTime > 5) {
      let impact = RecommendationImpact.LOW;
      
      if (analysis.usageCount > 100 && analysis.averageTime > 20) {
        impact = RecommendationImpact.HIGH;
      } else if (analysis.usageCount > 50 || analysis.averageTime > 10) {
        impact = RecommendationImpact.MEDIUM;
      }
      
      recommendations.push({
        type: RecommendationType.OPTIMIZE_TRANSFORMATION,
        transformationId: analysis.transformationId,
        transformationName: analysis.transformationName,
        description: `Optimizar la transformación "${analysis.transformationName}" que tiene un tiempo promedio de ${analysis.averageTime.toFixed(2)}ms y se usa ${analysis.usageCount} veces`,
        impact,
        // No sugerimos valores específicos porque dependería de la implementación
      });
    }
  });
  
  // Identificar transformaciones que se beneficiarían de pre-cálculo
  analysisResults.forEach(analysis => {
    if (analysis.complexity > 2 && analysis.usageCount > 20 && analysis.cacheEfficiency < 0.5) {
      recommendations.push({
        type: RecommendationType.PRECALCULATE_VALUES,
        transformationId: analysis.transformationId,
        transformationName: analysis.transformationName,
        description: `Considerar pre-calcular valores para "${analysis.transformationName}" que tiene alta complejidad y se usa frecuentemente`,
        impact: RecommendationImpact.MEDIUM,
      });
    }
  });
  
  return recommendations;
}

/**
 * Identifica transformaciones problemáticas basándose en rendimiento
 * y uso de recursos.
 */
export function identifyProblemTransformations(
  analysisResults: TransformationAnalysisResult[]
): string[] {
  return analysisResults
    .filter(analysis => {
      // Transformaciones lentas con baja eficiencia de caché
      return analysis.averageTime > 20 && 
             analysis.cacheEfficiency < 0.3 &&
             analysis.usageCount > 10;
    })
    .map(a => a.transformationId);
}

/**
 * Estima el impacto general de la optimización de transformaciones
 * en el rendimiento del sistema.
 */
export function estimateOptimizationImpact(
  analysisResults: TransformationAnalysisResult[]
): { timeReduction: number; efficencyIncrease: number } {
  if (analysisResults.length === 0) {
    return { timeReduction: 0, efficencyIncrease: 0 };
  }
  
  // Calcular tiempo total y eficiencia ponderada actual
  let totalTime = 0;
  let totalUsage = 0;
  let weightedEfficiency = 0;
  
  analysisResults.forEach(analysis => {
    totalTime += analysis.averageTime * analysis.usageCount;
    totalUsage += analysis.usageCount;
    weightedEfficiency += analysis.cacheEfficiency * analysis.usageCount;
  });
  
  const currentAvgEfficiency = totalUsage > 0 ? weightedEfficiency / totalUsage : 0;
  
  // Estimar reducción de tiempo con optimizaciones ideales
  // (asumiendo que todas las transformaciones funcionan a la velocidad de la más rápida)
  const fastestTransform = analysisResults.reduce(
    (fastest, current) => current.averageTimeWithCache < fastest.averageTimeWithCache ? current : fastest,
    analysisResults[0]
  );
  
  const potentialTime = fastestTransform.averageTimeWithCache * totalUsage;
  const timeReduction = totalTime > 0 ? (totalTime - potentialTime) / totalTime * 100 : 0;
  
  // Estimar aumento de eficiencia (asumiendo que podemos llegar a 0.9 en todas)
  const potentialEfficiency = 0.9; // 90% es un objetivo razonable
  const efficencyIncrease = potentialEfficiency - currentAvgEfficiency;
  
  return {
    timeReduction: Math.round(timeReduction * 10) / 10, // Redondear a 1 decimal
    efficencyIncrease: Math.round(efficencyIncrease * 100) // Convertir a porcentaje
  };
}
