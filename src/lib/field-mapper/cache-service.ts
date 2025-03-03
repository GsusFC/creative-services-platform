/**
 * Field Mapper Cache Service
 * 
 * Servicio de caché optimizado para el Field Mapper con soporte para:
 * - Caché LRU (Least Recently Used)
 * - TTL (Time To Live) configurable
 * - Almacenamiento persistente opcional
 * - Monitoreo de rendimiento
 */

import { recordCacheHit, recordCacheMiss } from './performance-service';
import { ValidationResult } from './v3-validation';

// Tipo para las entradas de caché
type CacheEntry<T> = {
  value: T;
  timestamp: number;
  hits: number;
  lastAccessed: number;
};

// Opciones de configuración de caché
export type CacheOptions = {
  maxSize?: number;        // Tamaño máximo de la caché
  ttl?: number;            // Tiempo de vida en ms (0 = sin expiración)
  persistent?: boolean;    // Si la caché debe persistir entre sesiones
  storageKey?: string;     // Clave para almacenamiento persistente
  cleanupInterval?: number; // Intervalo para limpieza automática (ms)
};

// Estadísticas de caché
export type CacheStats = {
  size: number;            // Número actual de entradas
  hits: number;            // Número de fallos
  misses: number;          // Número de aciertos
  hitRate: number;         // Tasa de aciertos (hits / (hits + misses))
  avgAccessTime: number;   // Tiempo promedio de acceso en ms
  oldestEntry: number;     // Timestamp de la entrada más antigua
  newestEntry: number;     // Timestamp de la entrada más reciente
  memoryUsageEstimate: number; // Estimación del uso de memoria en bytes
};

/**
 * Servicio de caché con soporte para LRU, TTL y almacenamiento persistente
 * @template T - Tipo de datos almacenados en la caché
 */
export class CacheService<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private options: Required<CacheOptions>;
  private stats = {
    hits: 0,
    misses: 0,
    accessTimes: [] as number[],
  };
  private cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Constructor del servicio de caché
   * @param options - Opciones de configuración
   */
  constructor(options: CacheOptions = {}) {
    // Valores por defecto
    this.options = {
      maxSize: options.maxSize || 1000,
      ttl: options.ttl || 0, // 0 = sin expiración
      persistent: options.persistent || false,
      storageKey: options.storageKey || 'fieldMapperCache',
      cleanupInterval: options.cleanupInterval || 60000, // 1 minuto por defecto
    };

    // Cargar caché persistente si es necesario
    if (this.options.persistent) {
      this.loadFromStorage();
    }

    // Iniciar limpieza automática si hay TTL o tamaño máximo
    if (this.options.ttl > 0 || this.options.maxSize > 0) {
      this.startCleanupTimer();
    }
  }

  /**
   * Obtiene un valor de la caché
   * @param key - Clave a buscar
   * @returns El valor almacenado o undefined si no existe o expiró
   */
  public get(key: string): T | undefined {
    const startTime = performance.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      recordCacheMiss();
      return undefined;
    }

    // Verificar si la entrada ha expirado
    if (this.options.ttl > 0) {
      const now = Date.now();
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
        this.stats.misses++;
        recordCacheMiss();
        return undefined;
      }
    }

    // Actualizar estadísticas de acceso
    entry.hits++;
    entry.lastAccessed = Date.now();
    this.cache.set(key, entry);
    this.stats.hits++;
    
    const endTime = performance.now();
    this.stats.accessTimes.push(endTime - startTime);
    if (this.stats.accessTimes.length > 100) {
      this.stats.accessTimes.shift();
    }
    
    recordCacheHit();
    return entry.value;
  }

  /**
   * Almacena un valor en la caché
   * @param key - Clave a almacenar
   * @param value - Valor a almacenar
   * @param ttl - Tiempo de vida específico para esta entrada (opcional)
   * @returns true si se almacenó correctamente
   */
  public set(key: string, value: T, ttl?: number): boolean {
    try {
      // Verificar si necesitamos hacer espacio
      if (this.options.maxSize > 0 && this.cache.size >= this.options.maxSize) {
        this.evictLRU();
      }

      const now = Date.now();
      this.cache.set(key, {
        value,
        timestamp: now,
        hits: 0,
        lastAccessed: now,
      });

      // Persistir si es necesario
      if (this.options.persistent) {
        this.saveToStorage();
      }

      return true;
    } catch (error) {
      console.error('Error al almacenar en caché:', error);
      return false;
    }
  }

  /**
   * Elimina una entrada de la caché
   * @param key - Clave a eliminar
   * @returns true si se eliminó correctamente
   */
  public delete(key: string): boolean {
    try {
      const result = this.cache.delete(key);
      
      // Persistir si es necesario
      if (result && this.options.persistent) {
        this.saveToStorage();
      }
      
      return result;
    } catch (error) {
      console.error('Error al eliminar de caché:', error);
      return false;
    }
  }

  /**
   * Limpia toda la caché
   */
  public clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      accessTimes: [],
    };
    
    // Persistir si es necesario
    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  /**
   * Comprueba si una clave existe en la caché
   * @param key - Clave a comprobar
   * @returns true si la clave existe y no ha expirado
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Verificar si la entrada ha expirado
    if (this.options.ttl > 0) {
      const now = Date.now();
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Obtiene estadísticas de la caché
   * @returns Objeto con estadísticas
   */
  public getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const oldestEntry = entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0;
    const newestEntry = entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0;
    const totalHits = this.stats.hits + this.stats.misses;
    const avgAccessTime = this.stats.accessTimes.length > 0
      ? this.stats.accessTimes.reduce((sum, time) => sum + time, 0) / this.stats.accessTimes.length
      : 0;
    
    // Estimar el uso de memoria
    let memoryUsageEstimate = 0;
    try {
      // Estimar ~50 bytes por la clave y estructura básica
      memoryUsageEstimate = this.cache.size * 50;
      
      // Muestrear algunas entradas para estimar el tamaño promedio
      const sampleSize = Math.min(20, this.cache.size);
      if (sampleSize > 0) {
        const sample = Array.from(this.cache.entries()).slice(0, sampleSize);
        const sampleSizeEstimate = sample.reduce((sum, [key, entry]) => {
          return sum + key.length * 2 + JSON.stringify(entry.value).length * 2;
        }, 0);
        memoryUsageEstimate += (sampleSizeEstimate / sampleSize) * this.cache.size;
      }
    } catch (error) {
      console.warn('Error al estimar uso de memoria:', error);
    }
    
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: totalHits > 0 ? this.stats.hits / totalHits : 0,
      avgAccessTime,
      oldestEntry,
      newestEntry,
      memoryUsageEstimate
    };
  }

  /**
   * Actualiza las opciones de la caché
   * @param options - Nuevas opciones
   */
  public updateOptions(options: Partial<CacheOptions>): void {
    // Actualizar opciones
    this.options = {
      ...this.options,
      ...options
    };
    
    // Reiniciar el timer de limpieza si es necesario
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    if (this.options.ttl > 0 || this.options.maxSize > 0) {
      this.startCleanupTimer();
    }
    
    // Persistir si es necesario
    if (this.options.persistent) {
      if (options.storageKey) {
        // Si cambia la clave de almacenamiento, cargar de nuevo
        this.loadFromStorage();
      } else {
        this.saveToStorage();
      }
    }
  }

  /**
   * Inicia el temporizador de limpieza automática
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  /**
   * Limpia entradas expiradas y reduce el tamaño si es necesario
   */
  private cleanup(): void {
    try {
      // Si hay TTL, eliminar entradas expiradas
      if (this.options.ttl > 0) {
        const now = Date.now();
        let expiredCount = 0;
        
        // Usar Array.from para compatibilidad con versiones anteriores de JavaScript
        const entries = Array.from(this.cache.entries());
        for (let i = 0; i < entries.length; i++) {
          const [key, entry] = entries[i];
          if (now - entry.timestamp > this.options.ttl) {
            this.cache.delete(key);
            expiredCount++;
          }
        }
        
        // Si eliminamos algo y es persistente, guardar
        if (expiredCount > 0 && this.options.persistent) {
          this.saveToStorage();
        }
      }
      
      // Si seguimos por encima del tamaño máximo, eliminar por LRU
      while (this.options.maxSize > 0 && this.cache.size > this.options.maxSize) {
        this.evictLRU();
      }
    } catch (error) {
      console.error('Error durante limpieza de caché:', error);
    }
  }

  /**
   * Elimina la entrada menos usada recientemente
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Date.now();
    
    // Usar Array.from para compatibilidad con versiones anteriores de JavaScript
    const entries = Array.from(this.cache.entries());
    for (let i = 0; i < entries.length; i++) {
      const [key, entry] = entries[i];
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Guarda la caché en almacenamiento persistente
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Convertir a estructura serializable
      const serializableCache: Record<string, { v: unknown; t: number; h: number; la: number }> = {};
      
      // Usar Array.from para compatibilidad con versiones anteriores de JavaScript
      const entries = Array.from(this.cache.entries());
      for (let i = 0; i < entries.length; i++) {
        const [key, entry] = entries[i];
        serializableCache[key] = {
          v: entry.value,
          t: entry.timestamp,
          h: entry.hits,
          la: entry.lastAccessed
        };
      }
      
      localStorage.setItem(this.options.storageKey, JSON.stringify(serializableCache));
    } catch (error) {
      console.error('Error al guardar caché en almacenamiento:', error);
    }
  }

  /**
   * Carga la caché desde almacenamiento persistente
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      
      if (!stored) return;
      
      const serializableCache = JSON.parse(stored) as Record<string, { v: T; t: number; h: number; la: number }>;
      
      this.cache.clear();
      
      // Usar Object.entries para compatibilidad con versiones anteriores de JavaScript
      const entries = Object.entries(serializableCache);
      for (let i = 0; i < entries.length; i++) {
        const [key, entry] = entries[i];
        this.cache.set(key, {
          value: entry.v,
          timestamp: entry.t,
          hits: entry.h,
          lastAccessed: entry.la
        });
      }
    } catch (error) {
      console.error('Error al cargar caché desde almacenamiento:', error);
    }
  }
}

// Exportar instancias de caché
export const fieldCache = new CacheService<unknown>({
  maxSize: 500,
  ttl: 60 * 60 * 1000, // 1 hora
  persistent: true,
  storageKey: 'fieldMapperFieldCache'
});

export const validationCache = new CacheService<ValidationResult>({
  maxSize: 200,
  ttl: 24 * 60 * 60 * 1000, // 24 horas
  persistent: true,
  storageKey: 'fieldMapperValidationCache'
});

export const transformationCache = new CacheService<unknown>({
  maxSize: 300,
  ttl: 12 * 60 * 60 * 1000, // 12 horas
  persistent: true,
  storageKey: 'fieldMapperTransformationCache'
});

export const fieldTransformationCache = new CacheService<unknown>({
  maxSize: 300,
  ttl: 12 * 60 * 60 * 1000, // 12 horas
  persistent: true,
  storageKey: 'fieldMapperFieldTransformationCache'
});

export const typeValidationCache = new CacheService<ValidationResult>({
  maxSize: 100,
  ttl: 60 * 60 * 1000,
  persistent: true,
  storageKey: 'typeValidationCache'
});
