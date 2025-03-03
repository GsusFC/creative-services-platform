/**
 * Sistema de caché avanzado para el lado del servidor
 * Permite almacenar respuestas de API en caché para mejorar el rendimiento
 */

import { NextResponse } from 'next/server'

// Configuración de la caché
interface CacheConfig {
  // Tiempo de vida del cache en segundos (por defecto: 5 minutos)
  ttl: number;
  // Si los headers deben ser incluidos en la clave de caché
  includeHeaders: boolean;
  // Si los query params deben ser incluidos en la clave de caché
  includeQueryParams: boolean;
  // Headers específicos a incluir (si includeHeaders es true)
  headerWhitelist?: string[];
  // Función para anular el caching basado en la solicitud
  shouldBypassCache?: (req: Request) => boolean;
}

// Estructura de una entrada de caché
interface CacheEntry {
  data: Record<string, unknown>;
  headers: Record<string, string>;
  timestamp: number;
  status: number;
}

// Caché en memoria (en producción podría usar Redis u otro sistema distribuido)
const cache = new Map<string, CacheEntry>();

// Configuración por defecto
const defaultConfig: CacheConfig = {
  ttl: 300, // 5 minutos
  includeHeaders: false,
  includeQueryParams: true,
  headerWhitelist: [],
  shouldBypassCache: (req) => req.method !== 'GET'
};

/**
 * Middleware para cachear respuestas de API
 */
export function withCache(handler: (req: Request) => Promise<Response>, config?: Partial<CacheConfig>) {
  // Configuración mezclada con defaults
  const cacheConfig: CacheConfig = { ...defaultConfig, ...config };
  
  return async (req: Request) => {
    // Bypass el cache si la solicitud lo requiere
    if (cacheConfig.shouldBypassCache && cacheConfig.shouldBypassCache(req)) {
      return handler(req);
    }
    
    // Generar clave de caché
    const cacheKey = generateCacheKey(req, cacheConfig);
    
    // Verificar si tenemos una respuesta en caché
    const cachedResponse = getCachedResponse(cacheKey, cacheConfig.ttl);
    if (cachedResponse) {
      // Devolver respuesta cacheada
      return new NextResponse(JSON.stringify(cachedResponse.data), {
        status: cachedResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
          ...cachedResponse.headers
        }
      });
    }
    
    // Si no hay caché, ejecutar el handler original
    const response = await handler(req);
    
    // Guardar respuesta en caché si es exitosa
    if (response.status >= 200 && response.status < 300) {
      try {
        const responseData = await response.clone().json();
        const headers: Record<string, string> = {};
        
        // Guardar headers relevantes
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        
        // Almacenar en caché
        cache.set(cacheKey, {
          data: responseData,
          headers,
          timestamp: Date.now(),
          status: response.status
        });
      } catch (error) {
        console.error('Error caching response:', error);
      }
    }
    
    // Agregar header para indicar que es un miss de caché
    const enhancedResponse = NextResponse.json(await response.json(), {
      status: response.status,
      headers: response.headers
    });
    enhancedResponse.headers.set('X-Cache', 'MISS');
    
    return enhancedResponse;
  };
}

/**
 * Generar una clave única para la solicitud
 */
function generateCacheKey(req: Request, config: CacheConfig): string {
  const url = new URL(req.url);
  const parts = [req.method, url.pathname];
  
  // Incluir query params si está habilitado
  if (config.includeQueryParams && url.search) {
    parts.push(url.search);
  }
  
  // Incluir headers si está habilitado
  if (config.includeHeaders) {
    const headerValues: string[] = [];
    
    if (config.headerWhitelist && config.headerWhitelist.length > 0) {
      // Solo incluir headers específicos
      config.headerWhitelist.forEach(header => {
        const value = req.headers.get(header);
        if (value) {
          headerValues.push(`${header}=${value}`);
        }
      });
    }
    
    if (headerValues.length > 0) {
      parts.push(headerValues.sort().join(','));
    }
  }
  
  return parts.join('|');
}

/**
 * Obtener respuesta de caché si es válida
 */
function getCachedResponse(key: string, ttl: number): CacheEntry | null {
  const cachedItem = cache.get(key);
  
  if (!cachedItem) {
    return null;
  }
  
  // Verificar si la entrada de caché expiró
  const ageInSeconds = (Date.now() - cachedItem.timestamp) / 1000;
  if (ageInSeconds > ttl) {
    // Eliminar entrada expirada
    cache.delete(key);
    return null;
  }
  
  return cachedItem;
}

/**
 * Limpiar el caché completamente o para una ruta específica
 */
export function clearCache(pathPattern?: string): void {
  if (!pathPattern) {
    // Limpiar todo el caché
    cache.clear();
    return;
  }
  
  // Limpiar solo entradas que coincidan con el patrón
  const keys = Array.from(cache.keys());
  for (const key of keys) {
    if (key.includes(`|${pathPattern}`)) {
      cache.delete(key);
    }
  }
}

/**
 * Invalidar el caché para rutas que coincidan con un patrón
 * Útil cuando se actualiza un recurso y se quiere invalidar el caché relacionado
 */
export function invalidateCache(pathPattern: string): void {
  clearCache(pathPattern);
}

/**
 * Obtener estadísticas del caché
 */
export function getCacheStats() {
  const now = Date.now();
  let totalEntries = 0;
  let activeEntries = 0;
  let expiredEntries = 0;
  let oldestTimestamp = now;
  let newestTimestamp = 0;
  const pathStats: Record<string, number> = {};
  
  // Analizar cada entrada del caché
  cache.forEach((entry, key) => {
    totalEntries++;
    
    // Extraer la ruta de la clave de caché
    const pathMatch = key.match(/[A-Z]+\|(\/[^|?]+)/);
    const path = pathMatch ? pathMatch[1] : 'unknown';
    
    // Contar por ruta
    pathStats[path] = (pathStats[path] || 0) + 1;
    
    // Verificar si está expirado (asumiendo TTL default)
    const ageInSeconds = (now - entry.timestamp) / 1000;
    if (ageInSeconds > defaultConfig.ttl) {
      expiredEntries++;
    } else {
      activeEntries++;
    }
    
    // Actualizar timestamps
    if (entry.timestamp < oldestTimestamp) {
      oldestTimestamp = entry.timestamp;
    }
    if (entry.timestamp > newestTimestamp) {
      newestTimestamp = entry.timestamp;
    }
  });
  
  // Calcular edad del caché en minutos
  const cacheAgeMinutes = oldestTimestamp < now 
    ? Math.round((now - oldestTimestamp) / 60000) 
    : 0;
  
  return {
    totalEntries,
    activeEntries,
    expiredEntries,
    cacheAgeMinutes,
    pathStats,
    memoryUsageKB: Math.round(JSON.stringify(Array.from(cache.entries())).length / 1024)
  };
}
