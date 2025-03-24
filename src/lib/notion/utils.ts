'use server'

import fetch from 'node-fetch';
import { CaseStudy } from '@/types/case-study';

// Configuración
const CONFIG = {
  // Tiempo de expiración del caché en milisegundos (5 minutos por defecto)
  CACHE_TTL: 5 * 60 * 1000,
  // Número máximo de reintentos para operaciones fallidas
  MAX_RETRIES: 3,
  // Tiempo de espera entre reintentos (en ms)
  RETRY_DELAY: 1000,
  // Nivel de logging (0: ninguno, 1: errores, 2: advertencias, 3: info, 4: debug)
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 4 : 1,
};

// Tipos para el sistema de caché
type CacheItem<T> = {
  value: T;
  timestamp: number;
};

// Caché en memoria
const cache: Record<string, CacheItem<any>> = {};
const imageCache: Record<string, CacheItem<string>> = {};

/**
 * Sistema de logging que respeta el nivel configurado
 */
export async function logError(message: string, ...args: any[]): Promise<void> {
  if (CONFIG.LOG_LEVEL >= 1) console.error(`[ERROR] ${message}`, ...args);
}

export async function logWarn(message: string, ...args: any[]): Promise<void> {
  if (CONFIG.LOG_LEVEL >= 2) console.warn(`[WARN] ${message}`, ...args);
}

export async function logInfo(message: string, ...args: any[]): Promise<void> {
  if (CONFIG.LOG_LEVEL >= 3) console.info(`[INFO] ${message}`, ...args);
}

export async function logDebug(message: string, ...args: any[]): Promise<void> {
  if (CONFIG.LOG_LEVEL >= 4) console.debug(`[DEBUG] ${message}`, ...args);
}

/**
 * Obtiene un valor del caché si existe y no ha expirado
 */
export async function getCacheItem<T>(key: string): Promise<T | null> {
  const item = cache[key];
  if (!item) return null;
  
  // Verificar si el ítem ha expirado
  if (Date.now() - item.timestamp > CONFIG.CACHE_TTL) {
    delete cache[key];
    return null;
  }
  
  return item.value;
}

/**
 * Guarda un valor en el caché
 */
export async function setCacheItem<T>(key: string, value: T): Promise<void> {
  cache[key] = {
    value,
    timestamp: Date.now(),
  };
}

/**
 * Invalida una entrada específica del caché
 */
export async function invalidateCache(key: string): Promise<void> {
  delete cache[key];
}

/**
 * Invalida todas las entradas del caché
 */
export async function invalidateAllCache(): Promise<void> {
  Object.keys(cache).forEach(key => delete cache[key]);
}

/**
 * Obtiene una imagen del caché
 */
export async function getCachedImage(url: string): Promise<string | null> {
  const item = imageCache[url];
  if (!item) return null;
  
  // Las imágenes tienen un TTL más largo (1 hora)
  if (Date.now() - item.timestamp > 60 * 60 * 1000) {
    delete imageCache[url];
    return null;
  }
  
  return item.value;
}

/**
 * Guarda una imagen en el caché
 */
export async function cacheImage(url: string, base64: string): Promise<void> {
  imageCache[url] = {
    value: base64,
    timestamp: Date.now(),
  };
}

/**
 * Función para verificar si podemos conectarnos a la API de Notion
 * Implementa caché para reducir verificaciones repetidas, reintentos y timeout
 * @param options Opciones para personalizar la verificación
 * @returns Promise<boolean> true si Notion está disponible, false en caso contrario
 */
export async function checkNotionAvailability(options?: {
  forceCheck?: boolean;      // Forzar verificación ignorando caché
  timeoutMs?: number;        // Timeout en milisegundos
  maxRetries?: number;       // Número máximo de reintentos
}): Promise<boolean> {
  // Configuración con valores por defecto
  const {
    forceCheck = false,
    timeoutMs = 5000,        // 5 segundos de timeout por defecto
    maxRetries = CONFIG.MAX_RETRIES
  } = options || {};
  
  // Clave de caché para esta operación
  const cacheKey = 'notion_availability';
  
  // Si no se fuerza la verificación, intentamos usar el caché
  if (!forceCheck) {
    try {
      const cachedAvailability = await getCacheItem<{available: boolean}>(cacheKey);
      if (cachedAvailability) {
        await logDebug('Usando estado de disponibilidad de Notion desde caché');
        return cachedAvailability.available;
      }
    } catch (cacheError) {
      await logDebug('No se pudo recuperar disponibilidad de Notion desde caché');
      // Continuamos con la verificación en vivo
    }
  }
  
  // Función para realizar un intento con timeout
  const attemptWithTimeout = async (): Promise<boolean> => {
    try {
      // Realizamos la petición con un controlador de aborto para el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env['NEXT_PUBLIC_NOTION_API_KEY']}`,
          'Notion-Version': '2022-06-28',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        await logWarn('Verificación de disponibilidad de Notion abortada por timeout');
      } else {
        await logDebug('Error en intento de verificación de Notion:', error);
      }
      return false;
    }
  };
  
  // Implementamos reintentos
  let isAvailable = false;
  let attempts = 0;
  
  while (attempts < maxRetries) {
    attempts++;
    await logDebug(`Verificando disponibilidad de Notion (intento ${attempts}/${maxRetries})`);
    
    isAvailable = await attemptWithTimeout();
    
    if (isAvailable) {
      await logDebug('Notion está disponible');
      break;
    }
    
    // Si no es el último intento, esperamos antes de reintentar
    if (attempts < maxRetries) {
      const delayMs = CONFIG.RETRY_DELAY * attempts;
      await logDebug(`Esperando ${delayMs}ms antes del siguiente intento`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // Guardamos el resultado en caché
  try {
    await setCacheItem(cacheKey, {available: isAvailable});
    await logDebug(`Estado de disponibilidad de Notion guardado en caché: ${isAvailable}`);
  } catch (cacheError) {
    await logDebug('No se pudo guardar disponibilidad de Notion en caché:', cacheError);
  }
  
  return isAvailable;
}

/**
 * Función para realizar peticiones a la API de Notion con reintentos
 */
export async function fetchNotion(endpoint: string, options: RequestInit = {}): Promise<any> {
  const baseUrl = 'https://api.notion.com/v1';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Configuración por defecto para las peticiones
  const defaultOptions: any = {
    headers: {
      'Authorization': `Bearer ${process.env['NEXT_PUBLIC_NOTION_API_KEY']}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  };
  
  // Combinar opciones
  const finalOptions = { ...defaultOptions, ...options };
  if (options.headers) {
    finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
  }
  
  // Implementación de reintentos
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, finalOptions);
      
      // Si la respuesta no es exitosa, lanzar un error
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la petición a Notion: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      // Parsear la respuesta como JSON
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      await logWarn(`Intento ${attempt + 1}/${CONFIG.MAX_RETRIES} fallido:`, lastError.message);
      
      // Si no es el último intento, esperar antes de reintentar
      if (attempt < CONFIG.MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (attempt + 1)));
      }
    }
  }
  
  // Si llegamos aquí, todos los intentos fallaron
  throw lastError || new Error('Error desconocido al comunicarse con Notion');
}

/**
 * Descarga un archivo desde una URL y lo convierte a base64
 * @param url URL del archivo a descargar
 * @returns String en formato data:URL con el contenido en base64, o null si hay error
 */
export async function downloadFileToBase64(url: string): Promise<string | null> {
  try {
    // Verificar si la URL ya está en formato base64
    if (url.startsWith('data:')) {
      console.log('La URL ya está en formato base64, no es necesario descargarla');
      return url;
    }
    
    // Verificar si la imagen está en caché
    const cachedImage = await getCachedImage(url);
    if (cachedImage) {
      console.log(`Imagen recuperada de caché: ${url}`);
      return cachedImage;
    }
    
    console.log(`Descargando archivo: ${url}`);
    
    // Validar que la URL sea válida
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      console.error(`URL inválida: ${url}`);
      return null;
    }
    
    // Configurar headers para evitar problemas de CORS
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Node.js)',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    
    // Implementar reintentos para la descarga
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`Intento ${attempt + 1}/3 para descargar: ${url}`);
        
        // Usar AbortController para implementar timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
        
        const response = await fetch(url, { 
          headers,
          redirect: 'follow', // Seguir redirecciones automáticamente
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.error(`Error al descargar archivo: ${response.status} ${response.statusText}`);
          // Si es un error 404 o 403, no tiene sentido reintentar
          if (response.status === 404 || response.status === 403) {
            return null;
          }
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        
        // Obtener el tipo MIME del Content-Type
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        console.log(`Tipo de contenido: ${contentType}`);
        
        // Convertir el cuerpo de la respuesta a un ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Verificar que el buffer no esté vacío
        if (buffer.length === 0) {
          console.error(`Archivo descargado con tamaño 0 bytes: ${url}`);
          throw new Error('Archivo vacío');
        }
        
        const base64 = buffer.toString('base64');
        
        console.log(`Archivo descargado correctamente: ${contentType}, tamaño: ${buffer.length} bytes`);
        
        // Asegurar que el tipo de contenido sea válido para imágenes
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        const finalContentType = validImageTypes.includes(contentType) ? contentType : 'image/jpeg';
        
        // Formatear como data URL
        const dataUrl = `data:${finalContentType};base64,${base64}`;
        
        // Guardar en caché
        await cacheImage(url, dataUrl);
        
        return dataUrl;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Error en intento ${attempt + 1}/3 al descargar ${url}:`, lastError.message);
        
        // Si no es el último intento, esperar antes de reintentar
        if (attempt < 2) {
          const delayMs = 1000 * (attempt + 1); // 1s, 2s
          console.log(`Esperando ${delayMs}ms antes del siguiente intento`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error(`Todos los intentos fallaron para descargar ${url}:`, lastError?.message);
    return null;
  } catch (error) {
    console.error(`Error general al descargar archivo ${url}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Descarga múltiples archivos en paralelo
 * @param urls Array de URLs a descargar
 * @returns Array de strings en formato data:URL con los contenidos en base64
 */
export async function downloadFilesInParallel(urls: string[]): Promise<(string | null)[]> {
  // Filtrar URLs vacías o inválidas
  const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '');
  
  if (validUrls.length === 0) return [];
  
  await logDebug(`Descargando ${validUrls.length} archivos en paralelo`);
  
  // Descargar en paralelo con un límite de 5 descargas simultáneas
  const results: (string | null)[] = [];
  const batchSize = 5;
  
  for (let i = 0; i < validUrls.length; i += batchSize) {
    const batch = validUrls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(url => downloadFileToBase64(url)));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Verifica si una URL es válida
 * @param url URL a verificar
 * @returns true si la URL es válida, false en caso contrario
 */
export async function isValidUrl(url: string): Promise<boolean> {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  try {
    // Verificar formato básico de URL
    new URL(url);
    
    // Para URLs que comienzan con data:, asumimos que son válidas
    if (url.startsWith('data:')) {
      return true;
    }
    
    return true;
  } catch (error) {
    await logDebug(`URL inválida: ${url}`, error);
    return false;
  }
}
