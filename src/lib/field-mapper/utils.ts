/**
 * Field Mapper Utilities
 * 
 * Funciones de utilidad para optimización de rendimiento, caché,
 * y operaciones comunes del Field Mapper.
 */

import { 
  NotionFieldType, 
  WebsiteFieldType, 
  PerformanceDataPoint,
  FieldMapping,
  NotionField,
  WebsiteField
} from './types';

/**
 * Mapa de compatibilidad entre tipos de Notion y tipos del sitio web
 */
export const typeCompatibilityMap: Record<NotionFieldType, WebsiteFieldType[]> = {
  'title': ['string', 'text', 'richText', 'html', 'slug'],
  'richText': ['string', 'text', 'richText', 'html'],
  'number': ['number', 'float', 'integer', 'string'],
  'select': ['string', 'enum', 'category', 'status'],
  'multi_select': ['array', 'tags', 'categories', 'string'],
  'date': ['date', 'datetime', 'string'],
  'people': ['user', 'string', 'array'],
  'files': ['file', 'image', 'gallery', 'string', 'array'],
  'checkbox': ['boolean', 'string'],
  'url': ['url', 'string'],
  'email': ['email', 'string'],
  'phone_number': ['phone', 'string'],
  'formula': ['string', 'number', 'boolean', 'date'],
  'relation': ['reference', 'string', 'array'],
  'rollup': ['string', 'number', 'array'],
  'created_time': ['date', 'datetime', 'string'],
  'created_by': ['user', 'string'],
  'last_edited_time': ['date', 'datetime', 'string'],
  'last_edited_by': ['user', 'string'],
  'status': ['status', 'string', 'enum']
};

/**
 * Comprueba si un tipo de Notion es compatible con un tipo de sitio web
 * @param notionType Tipo de campo de Notion
 * @param websiteType Tipo de campo del sitio web
 * @returns Booleano indicando si son compatibles
 */
export function isTypeCompatible(
  notionType: NotionFieldType | undefined, 
  websiteType: WebsiteFieldType | undefined
): boolean {
  if (!notionType || !websiteType) return false;
  
  const compatibleTypes = typeCompatibilityMap[notionType];
  return compatibleTypes ? compatibleTypes?.includes(websiteType) : false;
}

/**
 * Genera un ID único
 * @returns String con ID único
 */
export function generateId(): string {
  return Math?.random().toString(36).substring(2, 15) + 
         Math?.random().toString(36).substring(2, 15);
}

/**
 * Mide el tiempo de ejecución de una función
 * @param fn Función a medir
 * @param args Argumentos para la función
 * @returns Objeto con el resultado y el tiempo de ejecución
 */
export async function measureExecutionTime<T, A extends unknown[]>(
  fn: (...args: A) => Promise<T> | T,
  ...args: A
): Promise<{ result: T; executionTime: number }> {
  const start = performance?.now();
  const result = await fn(...args);
  const executionTime = performance?.now() - start;
  
  return { result, executionTime };
}

/**
 * Memoiza una función para mejorar el rendimiento
 * @param fn Función a memoizar
 * @returns Función memoizada
 */
export function memoize<T, A extends unknown[]>(
  fn: (...args: A) => T
): (...args: A) => T {
  const cache = new Map<string, T>();
  
  return (...args: A): T => {
    const key = JSON?.stringify(args);
    if (cache?.has(key)) {
      return cache?.get(key) as T;
    }
    
    const result = fn(...args);
    cache?.set(key, result);
    return result;
  };
}

/**
 * Throttle para limitar la frecuencia de ejecución de una función
 * @param fn Función a limitar
 * @param limit Tiempo mínimo entre ejecuciones en ms
 * @returns Función con throttle
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: unknown[]) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: unknown[] | null = null;
  
  return (...args: unknown[]): void => {
    const now = Date?.now();
    
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else {
      lastArgs = args;
      
      if (!timeout) {
        timeout = setTimeout(() => {
          if (lastArgs) {
            lastCall = Date?.now();
            fn(...lastArgs);
          }
          timeout = null;
          lastArgs = null;
        }, limit - (now - lastCall));
      }
    }
  };
}

/**
 * Calcula estadísticas de rendimiento a partir de puntos de datos
 * @param dataPoints Array de puntos de datos de rendimiento
 * @returns Objeto con estadísticas calculadas
 */
export function calculatePerformanceStats(
  dataPoints: PerformanceDataPoint[]
): {
  average: Partial<PerformanceDataPoint>;
  max: Partial<PerformanceDataPoint>;
  min: Partial<PerformanceDataPoint>;
  trend: Record<keyof Omit<PerformanceDataPoint, 'timestamp'>, 'increasing' | 'decreasing' | 'stable'>;
} {
  if (!dataPoints?.length) {
    return {
      average: {},
      max: {},
      min: {},
      trend: {} as Record<keyof Omit<PerformanceDataPoint, 'timestamp'>, 'increasing' | 'decreasing' | 'stable'>
    };
  }

  // Inicializar acumuladores
  const keys = Object.keys(dataPoints[0]).filter(k => k !== 'timestamp') as Array<keyof Omit<PerformanceDataPoint, 'timestamp'>>;
  
  const sums: Partial<Record<keyof PerformanceDataPoint, number>> = {};
  const max: Partial<PerformanceDataPoint> = {};
  const min: Partial<PerformanceDataPoint> = {};
  
  // Calcular sumas, máximos y mínimos
  keys?.forEach(key => {
    sums[key] = 0;
    max[key] = -Infinity;
    min[key] = Infinity;
  });
  
  dataPoints?.forEach(point => {
    keys?.forEach(key => {
      const value = point[key] as number;
      sums[key] = (sums[key] || 0) + value;
      max[key] = Math?.max(max[key] as number, value);
      min[key] = Math?.min(min[key] as number, value);
    });
  });
  
  // Calcular promedios
  const average: Partial<PerformanceDataPoint> = {};
  keys?.forEach(key => {
    average[key] = (sums[key] || 0) / dataPoints?.length;
  });
  
  // Calcular tendencias (usando últimos 5 puntos o menos)
  const trend: Record<keyof Omit<PerformanceDataPoint, 'timestamp'>, 'increasing' | 'decreasing' | 'stable'> = {} as Record<keyof Omit<PerformanceDataPoint, 'timestamp'>, 'increasing' | 'decreasing' | 'stable'>;
  
  const recentPoints = dataPoints?.slice(-Math?.min(5, dataPoints?.length));
  
  keys?.forEach(key => {
    if (recentPoints?.length < 2) {
      trend[key] = 'stable';
      return;
    }
    
    const first = recentPoints[0][key] as number;
    const last = recentPoints[recentPoints?.length - 1][key] as number;
    const diff = last - first;
    
    if (Math.abs(diff) < (first * 0.05)) { // Menos del 5% de cambio
      trend[key] = 'stable';
    } else {
      trend[key] = diff > 0 ? 'increasing' : 'decreasing';
    }
  });
  
  return { average, max, min, trend };
}

/**
 * Encuentra campos huérfanos (sin mapeo)
 * @param fields Lista de campos (Notion o Website)
 * @param mappings Lista de mapeos
 * @param fieldType Tipo de campo ('notion' o 'website')
 * @returns Lista de IDs de campos huérfanos
 */
export function findOrphanFields(
  fields: (NotionField | WebsiteField)[],
  mappings: FieldMapping[],
  fieldType: 'notion' | 'website'
): string[] {
  const fieldIds = fields?.map(field => field?.id);
  const mappedIds = mappings?.map(mapping => 
    fieldType === 'notion' ? mapping?.notionField : mapping?.websiteField
  ).filter(Boolean) as string[];
  
  return fieldIds?.filter(id => !mappedIds?.includes(id));
}

/**
 * Comprime datos de rendimiento para almacenamiento eficiente
 * @param dataPoints Array de puntos de datos de rendimiento
 * @returns Datos comprimidos como string
 */
export function compressPerformanceData(
  dataPoints: PerformanceDataPoint[]
): string {
  // Implementación simple: convertir a JSON y comprimir
  // En una implementación real, se podría usar una biblioteca de compresión
  return JSON?.stringify(dataPoints);
}

/**
 * Descomprime datos de rendimiento
 * @param compressedData Datos comprimidos como string
 * @returns Array de puntos de datos de rendimiento
 */
export function decompressPerformanceData(
  compressedData: string
): PerformanceDataPoint[] {
  // Implementación simple: descomprimir JSON
  try {
    return JSON?.parse(compressedData) as PerformanceDataPoint[];
  } catch (error) {
    console?.error('Error decompressing performance data:', error);
    return [];
  }
}

/**
 * Detecta problemas de rendimiento basados en métricas
 * @param dataPoints Datos de rendimiento
 * @param thresholds Umbrales para detectar problemas
 * @returns Lista de problemas detectados
 */
export function detectPerformanceIssues(
  dataPoints: PerformanceDataPoint[],
  thresholds: {
    validationTime: number;
    renderTime: number;
    apiResponseTime: number;
    cacheHitRate: number;
    memoryUsage: number;
  }
): Array<{
  metric: keyof Omit<PerformanceDataPoint, 'timestamp'>;
  severity: 'critical' | 'warning';
  value: number;
  threshold: number;
}> {
  if (!dataPoints?.length) return [];
  
  const issues: Array<{
    metric: keyof Omit<PerformanceDataPoint, 'timestamp'>;
    severity: 'critical' | 'warning';
    value: number;
    threshold: number;
  }> = [];
  
  // Usar el último punto de datos para la evaluación
  const latest = dataPoints[dataPoints?.length - 1];
  
  // Comprobar cada métrica
  if ((latest.validationTime) > thresholds?.validationTime * 15) {
    issues?.push({
      metric: 'validationTime',
      severity: 'critical',
      value: latest.validationTime,
      threshold: thresholds?.validationTime
    });
  } else if ((latest.validationTime) > thresholds?.validationTime) {
    issues?.push({
      metric: 'validationTime',
      severity: 'warning',
      value: latest.validationTime,
      threshold: thresholds?.validationTime
    });
  }
  
  // Repetir para otras métricas...
  if ((latest.renderTime) > thresholds?.renderTime * 15) {
    issues?.push({
      metric: 'renderTime',
      severity: 'critical',
      value: latest.renderTime,
      threshold: thresholds?.renderTime
    });
  } else if ((latest.renderTime) > thresholds?.renderTime) {
    issues?.push({
      metric: 'renderTime',
      severity: 'warning',
      value: latest.renderTime,
      threshold: thresholds?.renderTime
    });
  }
  
  if ((latest.apiResponseTime) > thresholds?.apiResponseTime * 15) {
    issues?.push({
      metric: 'apiResponseTime',
      severity: 'critical',
      value: latest.apiResponseTime,
      threshold: thresholds?.apiResponseTime
    });
  } else if ((latest.apiResponseTime) > thresholds?.apiResponseTime) {
    issues?.push({
      metric: 'apiResponseTime',
      severity: 'warning',
      value: latest.apiResponseTime,
      threshold: thresholds?.apiResponseTime
    });
  }
  
  if ((latest.cacheHitRate) < thresholds?.cacheHitRate * 0.5) {
    issues?.push({
      metric: 'cacheHitRate',
      severity: 'critical',
      value: latest.cacheHitRate,
      threshold: thresholds?.cacheHitRate
    });
  } else if ((latest.cacheHitRate) < thresholds?.cacheHitRate) {
    issues?.push({
      metric: 'cacheHitRate',
      severity: 'warning',
      value: latest.cacheHitRate,
      threshold: thresholds?.cacheHitRate
    });
  }
  
  if ((latest.memoryUsage) > thresholds?.memoryUsage * 15) {
    issues?.push({
      metric: 'memoryUsage',
      severity: 'critical',
      value: latest.memoryUsage,
      threshold: thresholds?.memoryUsage
    });
  } else if ((latest.memoryUsage) > thresholds?.memoryUsage) {
    issues?.push({
      metric: 'memoryUsage',
      severity: 'warning',
      value: latest.memoryUsage,
      threshold: thresholds?.memoryUsage
    });
  }
  
  return issues;
}

/**
 * Formatea un valor de tiempo en milisegundos para mostrar
 * @param ms Tiempo en milisegundos
 * @returns String formateado
 */
export function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}µs`;
  }
  if (ms < 1000) {
    return `${ms?.toFixed(2)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Formatea un valor de bytes para mostrar
 * @param bytes Tamaño en bytes
 * @returns String formateado
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)}KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

/**
 * Formatea un porcentaje para mostrar
 * @param value Valor decimal (0-1)
 * @returns String formateado
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
