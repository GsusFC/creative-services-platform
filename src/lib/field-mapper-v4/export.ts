/**
 * Utilidades para exportar resultados de benchmark y análisis
 * 
 * Proporciona funciones para exportar los resultados de benchmarks
 * y análisis de optimización a diferentes formatos.
 */

import { BenchmarkResult } from './benchmark';
import { OptimizationSummary } from './optimization';

/**
 * Opciones para exportación
 */
export interface ExportOptions {
  includeTimestamp?: boolean;
  fileName?: string;
  format?: 'json' | 'csv';
}

/**
 * Estructura de datos para la exportación
 */
export interface ExportData {
  timestamp: string;
  benchmarkResults: BenchmarkResult[];
  optimizationSummary?: OptimizationSummary;
  metadata?: Record<string, any>;
}

/**
 * Exporta los resultados de benchmark a un archivo
 * 
 * @param results - Resultados del benchmark
 * @param analysis - Análisis de optimización (opcional)
 * @param options - Opciones de exportación
 * @returns URL del archivo para descarga
 */
export function exportBenchmarkResults(
  results: BenchmarkResult[],
  analysis?: OptimizationSummary,
  options: ExportOptions = {}
): string {
  const {
    includeTimestamp = true,
    fileName = 'field-mapper-benchmark',
    format = 'json'
  } = options;
  
  // Crear estructura de datos para exportar
  const exportData: ExportData = {
    timestamp: includeTimestamp ? new Date().toISOString() : '',
    benchmarkResults: results,
    optimizationSummary: analysis
  };
  
  // Elegir formato y serializar datos
  let blob: Blob;
  let fileExtension: string;
  
  if (format === 'csv') {
    // Convertir a CSV
    const csvContent = convertToCSV(results);
    blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    fileExtension = 'csv';
  } else {
    // Usar JSON por defecto
    const jsonContent = JSON.stringify(exportData, null, 2);
    blob = new Blob([jsonContent], { type: 'application/json' });
    fileExtension = 'json';
  }
  
  // Crear nombre de archivo con timestamp si es necesario
  const timestampStr = includeTimestamp 
    ? `-${new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-')}` 
    : '';
  const fullFileName = `${fileName}${timestampStr}.${fileExtension}`;
  
  // Crear URL para descarga
  return URL.createObjectURL(blob);
}

/**
 * Convierte los resultados de benchmark a formato CSV
 * 
 * @param results - Resultados del benchmark
 * @returns Contenido en formato CSV
 */
function convertToCSV(results: BenchmarkResult[]): string {
  // Cabeceras
  const headers = [
    'Transformación',
    'Tipo Origen',
    'Tipo Destino',
    'Iteraciones',
    'Tiempo Total (ms)',
    'Tiempo Promedio (ms)',
    'Con Caché',
    'Número de Muestras'
  ].join(',');
  
  // Filas
  const rows = results.map(result => [
    `"${result.transformationName}"`,
    `"${result.sourceType}"`,
    `"${result.targetType}"`,
    result.iterations,
    result.totalTime.toFixed(2),
    result.averageTime.toFixed(2),
    result.withCache ? 'Sí' : 'No',
    result.samplesCount
  ].join(','));
  
  return [headers, ...rows].join('\n');
}

/**
 * Guarda los resultados de benchmark en el almacenamiento local
 * 
 * @param key - Clave para guardar los resultados
 * @param data - Datos a guardar
 */
export function saveResultsToLocalStorage(key: string, data: ExportData): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

/**
 * Carga resultados de benchmark desde el almacenamiento local
 * 
 * @param key - Clave para cargar los resultados
 * @returns Datos cargados o null si no existen
 */
export function loadResultsFromLocalStorage(key: string): ExportData | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as ExportData;
  } catch (error) {
    console.error('Error al cargar desde localStorage:', error);
    return null;
  }
}
