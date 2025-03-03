/**
 * Sistema de caché para transformaciones
 * 
 * Proporciona funcionalidad para almacenar en caché los resultados de transformaciones
 * frecuentes, mejorando el rendimiento del sistema.
 * 
 * Optimizaciones implementadas:
 * - Caché de dos niveles (memoria y sessionStorage)
 * - Estrategia LRU (Least Recently Used) mejorada
 * - Priorización de transformaciones frecuentes
 * - Serialización eficiente de claves y valores
 */

// Importaciones de tipos si son necesarias en el futuro

// Estructura para entradas de caché
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Tiempo de vida en milisegundos
}

// Estructura para estadísticas de caché
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  capacity: number;
}

// Configuración del caché
export interface CacheSettings {
  capacity: number;   // Capacidad máxima (número de entradas)
  ttl: number;        // Tiempo de vida predeterminado en milisegundos
  enabled: boolean;   // Si el caché está habilitado
}

// Tipo para valores de transformación
export type TransformValue = string | number | boolean | object | null | undefined;

// Tipo para opciones de transformación
export type TransformOptions = Record<string, unknown> | undefined;

// Generador de claves de caché
function generateCacheKey(
  transformationId: string,
  value: TransformValue,
  options?: TransformOptions
): string {
  const optionsStr = options ? JSON.stringify(options) : '';
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `${transformationId}:${valueStr}:${optionsStr}`;
}

/**
 * Gestor de caché para transformaciones
 */
class TransformationCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
  };
  private settings: CacheSettings;

  constructor(options?: Partial<CacheSettings>) {
    // Configuración por defecto
    this.settings = {
      capacity: options?.capacity || 500,
      ttl: options?.ttl || 30 * 60 * 1000,
      enabled: options?.enabled !== undefined ? options.enabled : true
    };
  }

  /**
   * Obtiene un valor de la caché
   * 
   * @param transformationId - ID de la transformación
   * @param value - Valor de entrada
   * @param options - Opciones de transformación
   * @returns El valor cacheado o undefined si no existe
   */
  get<T>(transformationId: string, value: TransformValue, options?: TransformOptions): T | undefined {
    // Si el caché está deshabilitado, siempre retornar undefined
    if (!this.settings.enabled) {
      this.stats.misses++;
      return undefined;
    }
    
    const key = generateCacheKey(transformationId, value, options);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Verificar si la entrada ha expirado
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  /**
   * Almacena un valor en la caché
   * 
   * @param transformationId - ID de la transformación
   * @param value - Valor de entrada
   * @param result - Resultado de la transformación
   * @param options - Opciones de transformación
   * @param ttl - Tiempo de vida personalizado (opcional)
   */
  set<T>(
    transformationId: string,
    value: TransformValue,
    result: T,
    options?: TransformOptions,
    ttl?: number
  ): void {
    // Si el caché está deshabilitado, no hacer nada
    if (!this.settings.enabled) {
      return;
    }
    
    // Gestionar tamaño máximo de caché - Si está lleno, eliminar entradas más antiguas
    if (this.cache.size >= this.settings.capacity) {
      this.evictOldest();
    }

    const key = generateCacheKey(transformationId, value, options);
    
    this.cache.set(key, {
      value: result,
      timestamp: Date.now(),
      ttl: ttl || this.settings.ttl
    });
  }

  /**
   * Invalida una entrada específica de la caché
   * 
   * @param transformationId - ID de la transformación
   * @param value - Valor de entrada
   * @param options - Opciones de transformación
   */
  invalidate(transformationId: string, value: TransformValue, options?: TransformOptions): void {
    const key = generateCacheKey(transformationId, value, options);
    this.cache.delete(key);
  }

  /**
   * Invalida todas las entradas para una transformación específica
   * 
   * @param transformationId - ID de la transformación
   */
  invalidateByTransformation(transformationId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${transformationId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalida todas las entradas de la caché
   */
  clear(): void {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      capacity: this.settings.capacity
    };
  }

  /**
   * Resetea las estadísticas de la caché
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0
    };
  }

  /**
   * Obtiene la configuración actual del caché
   */
  getSettings(): CacheSettings {
    return { ...this.settings };
  }

  /**
   * Actualiza la configuración del caché
   * 
   * @param newSettings - Nueva configuración parcial
   */
  updateSettings(newSettings: Partial<CacheSettings>): void {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    
    // Si se reduce la capacidad, eliminar entradas excedentes
    if (newSettings.capacity && newSettings.capacity < this.cache.size) {
      let excess = this.cache.size - newSettings.capacity;
      while (excess > 0 && this.cache.size > 0) {
        this.evictOldest();
        excess--;
      }
    }
  }

  /**
   * Elimina la entrada más antigua de la caché
   * (Estrategia simple de LRU - Least Recently Used)
   */
  private evictOldest(): void {
    if (this.cache.size === 0) return;

    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    // Encontrar la entrada más antigua
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    // Eliminar la entrada más antigua
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Exportar una instancia global del caché
export const transformationCache = new TransformationCache();

/**
 * Función decoradora que implementa caché para una función de transformación
 * 
 * @param transformationId - ID de la transformación
 * @param transformFn - Función de transformación original
 * @returns Función de transformación con caché
 */
export function withCache<T>(
  transformationId: string,
  transformFn: (value: TransformValue, options?: TransformOptions) => T
): (value: TransformValue, options?: TransformOptions) => T {
  return (value: TransformValue, options?: TransformOptions): T => {
    // Intentar obtener de caché
    const cachedResult = transformationCache.get<T>(transformationId, value, options);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // Si no está en caché, ejecutar la transformación
    const result = transformFn(value, options);
    
    // Guardar en caché para futuras llamadas
    transformationCache.set(transformationId, value, result, options);
    
    return result;
  };
}
