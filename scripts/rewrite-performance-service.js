/**
 * Script para reescribir completamente performance-service.ts
 * 
 * Este script reemplaza el archivo con una versión corregida
 * que mantiene la misma funcionalidad pero con sintaxis correcta.
 */

const fs = require('fs');
const path = require('path');

// Ruta al archivo
const filePath = path.join(__dirname, '../src/lib/field-mapper/performance-service.ts');

console.log('Reescribiendo performance-service.ts...');

// Contenido corregido
const newContent = `/**
 * Field Mapper Performance Service
 * 
 * Servicio para monitorear, registrar y analizar el rendimiento del Field Mapper.
 * Proporciona funciones para medir tiempos de operación, uso de memoria y
 * estadísticas de caché.
 */

// Tipos para los datos de rendimiento
export type PerformanceMetric = {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  metadata?: Record<string, unknown>;
};

export type PerformanceSnapshot = {
  timestamp: number;
  metrics: {
    validationTime: number;
    renderTime: number;
    apiResponseTime: number;
    cacheHitRate: number;
    memoryUsage: number;
    operationsPerSecond: number;
  };
  recentOperations: PerformanceMetric[];
};

// Interfaz para la memoria del navegador (solo disponible en algunos navegadores)
interface MemoryInfo {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo;
}

// Clase para el servicio de rendimiento
class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private snapshots: PerformanceSnapshot[] = [];
  private activeOperations: Map<string, { id: string; startTime: number; metadata?: Record<string, unknown> }> = new Map();
  private cacheStats = {
    hits: 0,
    misses: 0,
    total: 0
  };
  private snapshotInterval: NodeJS.Timeout | null = null;
  private maxMetricsLength = 1000; // Limitar el número de métricas almacenadas
  private maxSnapshotsLength = 100; // Limitar el número de snapshots almacenados

  constructor() {
    // Iniciar captura de snapshots automáticos
    this.startSnapshotCapture();
  }
  
  /**
   * Inicia una operación para medir su tiempo de ejecución
   */
  startOperation(operation: string, metadata?: Record<string, unknown>): string {
    const id = \`\${operation}-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`;
    this.activeOperations.set(id, {
      id,
      startTime: performance.now(),
      metadata
    });
    return id;
  }
  
  /**
   * Finaliza una operación y registra su tiempo de ejecución
   */
  endOperation(id: string): PerformanceMetric | null {
    const operation = this.activeOperations.get(id);
    if (!operation) {
      console.warn(\`Operation with id \${id} not found\`);
      return null;
    }
    
    const endTime = performance.now();
    const duration = endTime - operation.startTime;
    const metric: PerformanceMetric = {
      operation: id.split('-')[0], // Extraer el nombre de la operación del ID
      startTime: operation.startTime,
      endTime,
      duration,
      metadata: operation.metadata
    };
    
    this.metrics.push(metric);
    
    // Limitar el tamaño del array de métricas
    if (this.metrics.length > this.maxMetricsLength) {
      this.metrics = this.metrics.slice(-this.maxMetricsLength);
    }
    
    this.activeOperations.delete(id);
    return metric;
  }
  
  /**
   * Registra un acceso a caché (hit o miss)
   */
  recordCacheAccess(hit: boolean): void {
    this.cacheStats.total++;
    if (hit) {
      this.cacheStats.hits++;
    } else {
      this.cacheStats.misses++;
    }
  }
  
  /**
   * Obtiene la tasa de aciertos de caché
   */
  getCacheHitRate(): number {
    if (this.cacheStats.total === 0) return 0;
    return this.cacheStats.hits / this.cacheStats.total;
  }
  
  /**
   * Captura un snapshot del rendimiento actual
   */
  captureSnapshot(): PerformanceSnapshot {
    // Calcular métricas agregadas
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => m.endTime > performance.now() - 60000); // Últimos 60 segundos
    
    // Calcular tiempos promedio por tipo de operación
    const validationMetrics = recentMetrics.filter(m => m.operation === 'validation');
    const renderMetrics = recentMetrics.filter(m => m.operation === 'render');
    const apiMetrics = recentMetrics.filter(m => m.operation === 'api');
    
    const avgValidationTime = validationMetrics.length > 0
      ? validationMetrics.reduce((sum, m) => sum + m.duration, 0) / validationMetrics.length
      : 0;
    const avgRenderTime = renderMetrics.length > 0
      ? renderMetrics.reduce((sum, m) => sum + m.duration, 0) / renderMetrics.length
      : 0;
    const avgApiTime = apiMetrics.length > 0
      ? apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length
      : 0;
    
    // Calcular operaciones por segundo
    const operationsPerSecond = recentMetrics.length / 60;
    
    // Estimar uso de memoria (en una aplicación real, esto podría usar performance.memory en navegadores que lo soporten)
    const memoryUsage = this.estimateMemoryUsage();
    
    const snapshot: PerformanceSnapshot = {
      timestamp: now,
      metrics: {
        validationTime: avgValidationTime,
        renderTime: avgRenderTime,
        apiResponseTime: avgApiTime,
        cacheHitRate: this.getCacheHitRate(),
        memoryUsage,
        operationsPerSecond
      },
      recentOperations: recentMetrics.slice(-10) // Últimas 10 operaciones
    };
    
    this.snapshots.push(snapshot);
    
    // Limitar el tamaño del array de snapshots
    if (this.snapshots.length > this.maxSnapshotsLength) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshotsLength);
    }
    
    return snapshot;
  }
  
  /**
   * Inicia la captura automática de snapshots
   */
  startSnapshotCapture(intervalMs: number = 60000): void {
    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
    }
    
    // Capturar snapshots cada minuto (o según el intervalo especificado)
    this.snapshotInterval = setInterval(() => {
      this.captureSnapshot();
    }, intervalMs);
  }
  
  /**
   * Detiene la captura automática de snapshots
   */
  stopSnapshotCapture(): void {
    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
      this.snapshotInterval = null;
    }
  }
  
  /**
   * Obtiene los snapshots de rendimiento
   */
  getSnapshots(limit?: number): PerformanceSnapshot[] {
    if (limit) {
      return this.snapshots.slice(-limit);
    }
    return this.snapshots;
  }
  
  /**
   * Obtiene las métricas de rendimiento
   */
  getMetrics(limit?: number): PerformanceMetric[] {
    if (limit) {
      return this.metrics.slice(-limit);
    }
    return this.metrics;
  }
  
  /**
   * Obtiene el snapshot más reciente
   */
  getLatestSnapshot(): PerformanceSnapshot | null {
    if (this.snapshots.length === 0) {
      return null;
    }
    return this.snapshots[this.snapshots.length - 1];
  }
  
  /**
   * Estima el uso de memoria (en MB)
   * Nota: Esta es una aproximación, ya que JavaScript no proporciona acceso directo
   * al uso de memoria en todos los entornos
   */
  private estimateMemoryUsage(): number {
    // En navegadores que soportan performance.memory
    if (typeof performance !== 'undefined') {
      const performanceWithMemory = performance as PerformanceWithMemory;
      if (performanceWithMemory.memory && performanceWithMemory.memory.usedJSHeapSize) {
        return performanceWithMemory.memory.usedJSHeapSize / (1024 * 1024); // Convertir a MB
      }
    }
    
    // Estimación basada en el tamaño de los datos almacenados
    // (muy aproximada, solo para demostración)
    const metricsSize = JSON.stringify(this.metrics).length / (1024 * 1024);
    const snapshotsSize = JSON.stringify(this.snapshots).length / (1024 * 1024);
    const baseMemory = 10; // MB base estimados
    return baseMemory + metricsSize + snapshotsSize;
  }
  
  /**
   * Limpia todos los datos de rendimiento
   */
  clearData(): void {
    this.metrics = [];
    this.snapshots = [];
    this.activeOperations.clear();
    this.cacheStats = { hits: 0, misses: 0, total: 0 };
  }
  
  /**
   * Función de utilidad para medir el tiempo de ejecución de una función
   */
  async measure<T>(
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
  }
  
  /**
   * Función de utilidad para medir el tiempo de ejecución de una función síncrona
   */
  measureSync<T>(
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
  }
}

// Exportar una instancia singleton del servicio
export const performanceService = new PerformanceService();

// Exportar funciones de utilidad para facilitar el uso
export const measurePerformance = async <T>(
  operation: string, 
  fn: () => Promise<T> | T, 
  metadata?: Record<string, unknown>
): Promise<T> => {
  return performanceService.measure(operation, fn, metadata);
};

export const measurePerformanceSync = <T>(
  operation: string, 
  fn: () => T, 
  metadata?: Record<string, unknown>
): T => {
  return performanceService.measureSync(operation, fn, metadata);
};

export const recordCacheHit = () => performanceService.recordCacheAccess(true);
export const recordCacheMiss = () => performanceService.recordCacheAccess(false);
`;

// Guardar el archivo reescrito
fs.writeFileSync(filePath, newContent);

console.log('Archivo reescrito: ' + filePath);
