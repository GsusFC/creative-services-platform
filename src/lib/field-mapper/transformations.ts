/**
 * Servicio de transformaciones para el Field Mapper
 * Proporciona funciones para transformar datos entre Notion y el sitio web
 */

import { FieldMapping, TransformationTemplate } from './types'

/**
 * Aplica una transformación a un valor basado en la configuración de mapeo
 * @param value Valor original a transformar
 * @param mapping Configuración de mapeo con la transformación a aplicar
 * @returns Valor transformado
 */
export function applyTransformation(value: unknown, mapping: FieldMapping): unknown {
  // Si no hay transformación o el tipo es 'none', devolver el valor original
  if (!mapping?.transformation || mapping?.type === 'none') {
    return value
  }

  // Si el valor es null o undefined, devolverlo sin transformar
  if (value === null || value === undefined) {
    return value
  }

  const { type, options = {} } = mapping?.transformation

  // Aplicar transformación según el tipo
  switch (type) {
    // Transformaciones de texto
    case 'lowercase':
      return typeof value === 'string' ? value?.toLowerCase() : value
    
    case 'uppercase':
      return typeof value === 'string' ? value?.toUpperCase() : value
    
    case 'capitalize':
      return typeof value === 'string' 
        ? value?.replace(/\b\w/g, (char) => char?.toUpperCase()) 
        : value
    
    case 'slug':
      if (typeof value === 'string') {
        return createSlug(value, 
          typeof options?.separator === 'string' ? options?.separator : '-', 
          options?.lowercase !== false
        );
      }
      return value;
    
    case 'trim':
      return typeof value === 'string' ? value?.trim() : value
    
    // Transformaciones de número
    case 'round':
      return typeof value === 'number' ? Math?.round(value) : value
    
    case 'floor':
      return typeof value === 'number' ? Math?.floor(value) : value
    
    case 'ceil':
      return typeof value === 'number' ? Math?.ceil(value) : value
    
    case 'format':
      if (typeof value === 'number') {
        const format = typeof options?.format === 'string' ? options?.format : '0,0.00';
        return formatNumber(value, format);
      }
      return value;
    
    // Transformaciones de fecha
    case 'iso':
      if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        return formatDate(value, 'iso');
      }
      return value;
    
    case 'localized':
      if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        const format = typeof options?.format === 'string' ? options?.format : 'DD/MM/YYYY';
        return formatDate(value, format);
      }
      return value;
    
    case 'relative':
      if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        return formatRelativeDate(value);
      }
      return value;
    
    // Transformaciones de imagen
    case 'firstOnly':
      return Array?.isArray(value) && value?.length > 0 ? value[0] : value
    
    case 'resize':
      if (typeof value === 'string' || (Array?.isArray(value) && value?.every(item => typeof item === 'string'))) {
        return transformImageUrl(value, 
          typeof options?.width === 'number' ? options?.width : undefined, 
          typeof options?.height === 'number' ? options?.height : undefined
        );
      }
      return value;
    
    // Si no coincide con ninguna transformación conocida, devolver el valor original
    default:
      return value
  }
}

/**
 * Crea un slug a partir de un texto
 * @param text Texto original
 * @param separator Separador a usar (por defecto: guion)
 * @param lowercase Convertir a minúsculas (por defecto: true)
 * @returns Slug generado
 */
export function createSlug(text: string, separator = '-', lowercase = true): string {
  // Normalizar caracteres acentuados
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Convertir a minúsculas si se especifica
  const processedText = lowercase ? normalized?.toLowerCase() : normalized
  
  // Reemplazar caracteres no alfanuméricos por el separador y eliminar separadores duplicados
  return processedText
    .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, separator) // Reemplazar espacios por separador
    .replace(new RegExp(`${separator}+`, 'g'), separator) // Eliminar separadores duplicados
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '') // Eliminar separadores al inicio y final
}

/**
 * Formatea un número según el formato especificado
 * Implementación simple - en producción se recomendaría usar una biblioteca como Intl o Numeral?.js
 * @param num Número a formatear
 * @param format Formato a aplicar
 * @returns Número formateado como string
 */
export function formatNumber(num: number, format: string): string {
  // Implementación básica - en producción usar Intl?.NumberFormat o similar
  const hasComma = format.includes(',')
  const decimalPlaces = (format.split('.')[1] || '').length
  
  // Formatear con Intl?.NumberFormat
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: hasComma
  }).format(num)
}

/**
 * Formatea una fecha según el formato especificado
 * @param date Fecha a formatear (string, Date o timestamp)
 * @param format Formato a aplicar
 * @returns Fecha formateada como string
 */
export function formatDate(date: string | Date | number, format: string): string {
  // Convertir a objeto Date si no lo es
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Si la fecha es inválida, devolver string vacío
  if (isNaN(dateObj?.getTime())) {
    return ''
  }
  
  // Si el formato es ISO, usar toISOString
  if (format === 'iso') {
    return dateObj?.toISOString()
  }
  
  // Implementación básica - en producción usar date-fns, dayjs o similar
  const day = dateObj?.getDate().toString().padStart(2, '0')
  const month = (dateObj?.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj?.getFullYear()
  
  // Reemplazar tokens en el formato
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year?.toString())
}

/**
 * Formatea una fecha en formato relativo (ej: "hace 2 días")
 * @param date Fecha a formatear
 * @returns Texto con la fecha relativa
 */
export function formatRelativeDate(date: string | Date | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Si la fecha es inválida, devolver string vacío
  if (isNaN(dateObj?.getTime())) {
    return ''
  }
  
  const now = new Date()
  const diffMs = now?.getTime() - dateObj?.getTime()
  const diffSecs = Math?.floor(diffMs / 1000)
  const diffMins = Math?.floor(diffSecs / 60)
  const diffHours = Math?.floor(diffMins / 60)
  const diffDays = Math?.floor(diffHours / 24)
  
  // Formatear según la diferencia
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 30) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else {
    // Para fechas más antiguas, usar formato estándar
    return formatDate(dateObj, 'DD/MM/YYYY')
  }
}

/**
 * Transforma una URL de imagen para aplicar redimensionamiento
 * @param url URL de la imagen
 * @param width Ancho deseado
 * @param height Alto deseado
 * @returns URL transformada
 */
export function transformImageUrl(url: string | string[], width?: number, height?: number): string | string[] {
  // Si no hay dimensiones, devolver la URL original
  if (!width && !height) {
    return url
  }
  
  // Función para transformar una única URL
  const transformSingleUrl = (singleUrl: string): string => {
    // Si la URL es de Notion, usar su API de imágenes
    if (singleUrl?.includes('notion.so') || singleUrl?.includes('amazonaws?.com')) {
      const params = []
      if (width) params?.push(`width=${width}`)
      if (height) params?.push(`height=${height}`)
      
      // Añadir parámetros a la URL
      const separator = singleUrl?.includes('?') ? '&' : '?'
      return `${singleUrl}${separator}${params?.join('&')}`
    }
    
    // Para otras URLs, devolver sin cambios (en producción se podría usar un servicio de transformación de imágenes)
    return singleUrl
  }
  
  // Procesar URL única o array de URLs
  if (Array?.isArray(url)) {
    return url?.map(transformSingleUrl)
  } else {
    return transformSingleUrl(url)
  }
}

/**
 * Aplica todas las transformaciones a un objeto de datos completo
 * @param data Datos originales
 * @param mappings Configuraciones de mapeo con transformaciones
 * @returns Datos transformados
 */
export function transformData(data: Record<string, unknown>, mappings: FieldMapping[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  
  // Aplicar cada mapeo
  mappings?.forEach(mapping => {
    if (mapping?.notionField && mapping?.websiteField && data[mapping?.notionField] !== undefined) {
      // Obtener el valor original
      const originalValue = data[mapping?.notionField]
      
      // Aplicar transformación
      const transformedValue = applyTransformation(originalValue, mapping)
      
      // Guardar en el resultado
      result[mapping?.websiteField] = transformedValue
    }
  })
  
  return result
}

// Ejemplo de plantilla de transformación
const exampleTransformation: TransformationTemplate = {
  id: 'title-to-uppercase',
  name: 'Título a mayúsculas',
  description: 'Convierte un título a mayúsculas',
  sourceType: 'title',
  targetType: 'string',
  code: 'return value.toUpperCase();',
  category: 'format',
  compatibilityLevel: 'HIGH',
  isDefault: true,
  examples: [
    {
      input: 'Título de ejemplo',
      output: 'TÍTULO DE EJEMPLO',
      description: 'Convierte todas las letras a mayúsculas'
    }
  ],
  input: 'string',
  output: 'string'
};
