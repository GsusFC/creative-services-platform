/**
 * Sistema de transformaciones para Field Mapper V3
 * 
 * Este módulo proporciona funciones para transformar campos de un tipo a otro,
 * permitiendo compatibilidad entre diferentes tipos de datos de Notion y
 * los componentes de la landing page.
 */

import { transformationCache } from './cache-service';

// Tipos para las transformaciones
export interface FieldTransformation<S = unknown, T = unknown> {
  sourceType: string;
  targetType: string;
  transform: (value: S, options?: TransformationOptions) => T;
  description: string;
}

export interface TransformationOptions {
  format?: string;
  separator?: string;
  defaultValue?: unknown;
  maxItems?: number;
  locale?: string;
  [key: string]: unknown;
}

// Tipos específicos para datos en Notion
export interface RichTextItem {
  text?: { content?: string };
  plain_text?: string;
  content?: string;
  [key: string]: unknown;
}

export type RichText = string | RichTextItem | RichTextItem[];

export interface MultiSelectItem {
  id?: string;
  name: string;
  color?: string;
}

export type MultiSelect = MultiSelectItem[];

export interface FileItem {
  url: string;
  type?: string;
  name?: string;
}

export type Files = FileItem[];

export interface DateValue {
  start: string;
  end?: string;
  time_zone?: string;
}

export type RelationItem = { id: string; name?: string; [key: string]: unknown };
export type Relation = RelationItem[];

// Registro de transformaciones disponibles
const transformations: Record<string, Record<string, FieldTransformation>> = {
  // Transformaciones para texto
  "text": {
    "rich_text": {
      sourceType: "rich_text",
      targetType: "text",
      transform: (value: unknown) => {
        if (!value) return "";
        // Extraer el texto plano de rich_text eliminando marcado
        if (typeof value === 'string') {
          return value.replace(/<[^>]*>/g, '');
        }
        // Si es un objeto con propiedad text o content
        if (typeof value === 'object') {
          if ('text' in value) return value.text;
          if ('content' in value) return value.content;
          if ('plain_text' in value) return value.plain_text;
        }
        return String(value);
      },
      description: "Extrae texto plano de contenido enriquecido"
    },
    "multi_select": {
      sourceType: "multi_select",
      targetType: "text",
      transform: (value: unknown, options = {}) => {
        if (!value || !Array.isArray(value)) return "";
        const separator = options.separator || ", ";
        // Extraer nombres o valores y unirlos con el separador
        return (value as MultiSelect).map(item => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && 'name' in item) return item.name;
          return String(item);
        }).join(separator);
      },
      description: "Convierte una lista de opciones en texto concatenado"
    },
    "number": {
      sourceType: "number",
      targetType: "text",
      transform: (value: unknown, options = {}) => {
        if (value === null || value === undefined) return "";
        const locale = options.locale || 'es-ES';
        const format = options.format;
        
        // Asegurarse de que value sea un número
        const numValue = typeof value === 'number' ? value : 
                       typeof value === 'string' ? parseFloat(value) : 0;
        
        if (format === 'currency') {
          const currency = typeof options.currency === 'string' ? options.currency : 'EUR';
          return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(numValue);
        }
        
        if (format === 'percent') {
          return new Intl.NumberFormat(locale, { style: 'percent' }).format(numValue / 100);
        }
        
        return String(numValue);
      },
      description: "Convierte un número a texto, opcionalmente con formato"
    },
    "date": {
      sourceType: "date",
      targetType: "text",
      transform: (value: unknown, options = {}) => {
        if (!value) return "";
        
        let date: Date;
        
        // Verificar tipo y construir Date de forma segura
        if (typeof value === 'string') {
          date = new Date(value);
        } else if (value instanceof Date) {
          date = value;
        } else if (typeof value === 'object' && value !== null && 'start' in value && typeof value.start === 'string') {
          date = new Date((value as DateValue).start);
        } else {
          // Valor por defecto si no se puede convertir
          date = new Date();
        }
        
        if (isNaN(date.getTime())) return "";
        
        const locale = options.locale || 'es-ES';
        const format = options.format || 'medium';
        
        const formatOptions: Intl.DateTimeFormatOptions = {};
        
        switch (format) {
          case 'short':
            formatOptions.day = 'numeric';
            formatOptions.month = 'numeric';
            formatOptions.year = 'numeric';
            break;
          case 'medium':
            formatOptions.day = 'numeric';
            formatOptions.month = 'long';
            formatOptions.year = 'numeric';
            break;
          case 'long':
            formatOptions.weekday = 'long';
            formatOptions.day = 'numeric';
            formatOptions.month = 'long';
            formatOptions.year = 'numeric';
            break;
          case 'time':
            formatOptions.hour = 'numeric';
            formatOptions.minute = 'numeric';
            break;
          case 'datetime':
            formatOptions.day = 'numeric';
            formatOptions.month = 'long';
            formatOptions.year = 'numeric';
            formatOptions.hour = 'numeric';
            formatOptions.minute = 'numeric';
            break;
        }
        
        return new Intl.DateTimeFormat(locale, formatOptions).format(date);
      },
      description: "Convierte una fecha a texto con formato"
    }
  },
  
  // Transformaciones para rich_text
  "rich_text": {
    "text": {
      sourceType: "text",
      targetType: "rich_text",
      transform: (value: unknown) => {
        if (!value) return "";
        return String(value); // El texto plano es válido como rich_text
      },
      description: "Utiliza texto plano como contenido enriquecido"
    },
    "multi_select": {
      sourceType: "multi_select",
      targetType: "rich_text",
      transform: (value: unknown) => {
        if (!value || !Array.isArray(value)) return "";
        
        // Convertir a lista HTML
        const listItems = (value as MultiSelect).map(item => {
          const text = typeof item === 'string' ? item : 
                      typeof item === 'object' && 'name' in item ? item.name : 
                      String(item);
          return `<li>${text}</li>`;
        }).join('');
        
        return `<ul>${listItems}</ul>`;
      },
      description: "Convierte opciones múltiples en una lista HTML"
    }
  },
  
  // Transformaciones para multi_select
  "multi_select": {
    "relation": {
      sourceType: "relation",
      targetType: "multi_select",
      transform: (value: unknown) => {
        if (!value) return [];
        
        // Convertir relaciones a formato multi_select
        if (Array.isArray(value)) {
          return (value as Relation).map(item => {
            if (typeof item === 'string') return { name: item };
            if (typeof item === 'object' && 'title' in item) return { name: item.title };
            if (typeof item === 'object' && 'name' in item) return item;
            return { name: String(item) };
          });
        }
        
        return [];
      },
      description: "Convierte relaciones en opciones múltiples"
    }
  },
  
  // Transformaciones para image (URL de imagen)
  "image": {
    "url": {
      sourceType: "url",
      targetType: "image",
      transform: (value: unknown) => {
        if (!value) return "";
        return String(value); // Usar la URL directamente
      },
      description: "Utiliza una URL como fuente de imagen"
    },
    "files": {
      sourceType: "files",
      targetType: "image",
      transform: (value: unknown) => {
        if (!value) return "";
        
        // Si es array, tomar la primera imagen
        if (Array.isArray(value)) {
          if (value.length === 0) return "";
          
          // Procesar el primer elemento si existe
          const firstFile = value[0];
          
          if (typeof firstFile === 'string') {
            return firstFile;
          } else if (firstFile && typeof firstFile === 'object') {
            // Diferentes formatos posibles en la API de Notion
            if ('url' in firstFile && typeof firstFile.url === 'string') {
              return firstFile.url;
            } else if ('file' in firstFile && typeof firstFile.file === 'object' && firstFile.file !== null) {
              const file = firstFile.file;
              if (typeof file === 'string') return file;
              if (typeof file === 'object' && 'url' in file && typeof file.url === 'string') return file.url;
            }
          }
          return "";
        }
        
        // Si es un objeto individual, tratar como un único archivo
        if (value && typeof value === 'object') {
          if ('url' in value && typeof value.url === 'string') {
            return value.url;
          } else if ('file' in value && typeof value.file === 'object' && value.file !== null) {
            const file = value.file;
            if (typeof file === 'string') return file;
            if (typeof file === 'object' && 'url' in file && typeof file.url === 'string') return file.url;
          }
        }
        
        // Si es string, usarlo directamente como URL
        if (typeof value === 'string') {
          return value;
        }
        
        return "";
      },
      description: "Extrae la URL de la primera imagen de una colección"
    }
  },
  
  // Transformaciones para files (colección de archivos)
  "files": {
    "files": {
      sourceType: "files",
      targetType: "files",
      transform: (value: unknown) => {
        // Pasar directamente, esta transformación es para normalizar
        // Diferentes estructuras de campos de files en Notion
        if (!value) return [];
        
        if (Array.isArray(value)) {
          return (value as Files).map(file => {
            if (typeof file === 'string') return { url: file, type: 'external' };
            if (typeof file === 'object') {
              if ('url' in file && typeof file.url === 'string') return { ...file, type: file.type || 'external' };
              if ('file' in file && 
                  typeof file.file === 'object' && 
                  file.file !== null && 
                  'url' in file.file && 
                  typeof file.file.url === 'string') {
                return { url: file.file.url, type: 'file', name: file.name || '' };
              }
            }
            return file;
          });
        }
        
        return Array.isArray(value) ? value : [value];
      },
      description: "Normaliza formatos de archivos"
    }
  },
  
  // Transformaciones para listas
  "list": {
    "multi_select": {
      sourceType: "multi_select",
      targetType: "list",
      transform: (value: unknown) => {
        if (!value) return [];
        
        if (Array.isArray(value)) {
          return (value as MultiSelect).map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && 'name' in item) return item.name;
            return String(item);
          });
        }
        
        return [];
      },
      description: "Convierte opciones múltiples en una lista de items"
    },
    "relation": {
      sourceType: "relation",
      targetType: "list",
      transform: (value: unknown) => {
        if (!value) return [];
        
        if (Array.isArray(value)) {
          return (value as Relation).map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && 'title' in item) return item.title;
            if (typeof item === 'object' && 'name' in item) return item.name;
            return String(item);
          });
        }
        
        return [];
      },
      description: "Convierte relaciones en una lista de items"
    }
  }
};

// Exportamos el objeto transformations como KNOWN_TRANSFORMATIONS para compatibilidad
export const KNOWN_TRANSFORMATIONS = transformations;

/**
 * Verifica si existe una transformación disponible entre dos tipos
 */
export function hasTransformation(sourceType: string, targetType: string): boolean {
  if (!sourceType || !targetType) return false;
  return Boolean(transformations[targetType]?.[sourceType]);
}

/**
 * Obtiene una descripción de cómo se realizará la transformación
 */
export function getTransformationDescription(sourceType: string, targetType: string): string {
  if (!sourceType || !targetType) {
    return "No se ha especificado un tipo de origen o destino.";
  }
  
  if (sourceType === targetType) {
    return "No se requiere transformación, los tipos son iguales.";
  }
  
  const transformation = transformations[targetType]?.[sourceType];
  
  if (!transformation) {
    return `No hay transformación disponible de ${sourceType} a ${targetType}.`;
  }
  
  return transformation.description;
}

/**
 * Obtiene un ejemplo de cómo funcionaría la transformación
 */
export function getTransformationExample(sourceType: string, targetType: string): { 
  before: string; 
  after: string;
  performanceImpact: 'bajo' | 'medio' | 'alto';
  conservaValores?: boolean;
} {
  // Ejemplos predeterminados para mostrar
  const defaultExample = {
    before: "Sin ejemplo disponible",
    after: "Sin ejemplo disponible",
    performanceImpact: 'bajo' as const
  };
  
  if (sourceType === targetType) {
    return {
      before: `Ejemplo de ${sourceType}`,
      after: `El mismo valor (sin cambios)`,
      performanceImpact: 'bajo',
      conservaValores: true
    };
  }
  
  if (!transformations[targetType]?.[sourceType]) {
    return defaultExample;
  }
  
  // Ejemplos específicos para cada combinación
  type TransformationExample = {
    before: string;
    after: string;
    performanceImpact: 'bajo' | 'medio' | 'alto';
    conservaValores?: boolean;
  };
  
  const examples: Record<string, Record<string, TransformationExample>> = {
    "text": {
      "rich_text": {
        before: `{ "plain_text": "Texto con formato" }`,
        after: `"Texto con formato"`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "multi_select": {
        before: `[{ "name": "Opción 1" }, { "name": "Opción 2" }]`,
        after: `"Opción 1, Opción 2"`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "number": {
        before: "1234.56",
        after: `"1.234,56"`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "date": {
        before: `{ "start": "2023-01-15" }`,
        after: `"15 de enero de 2023"`,
        performanceImpact: 'medio',
        conservaValores: true
      }
    },
    "rich_text": {
      "text": {
        before: `"Texto simple"`,
        after: `"Texto simple"`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "multi_select": {
        before: `[{ "name": "Tag 1" }, { "name": "Tag 2" }]`,
        after: `"<ul><li>Tag 1</li><li>Tag 2</li></ul>"`,
        performanceImpact: 'bajo',
        conservaValores: true
      }
    },
    "multi_select": {
      "relation": {
        before: `[{ "id": "abc123", "name": "Elemento relacionado" }]`,
        after: `[{ "name": "Elemento relacionado" }]`,
        performanceImpact: 'medio',
        conservaValores: false
      }
    },
    "image": {
      "url": {
        before: `"https://ejemplo.com/imagen.jpg"`,
        after: `"https://ejemplo.com/imagen.jpg"`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "files": {
        before: `[{ "url": "https://ejemplo.com/imagen.jpg" }]`,
        after: `"https://ejemplo.com/imagen.jpg"`,
        performanceImpact: 'bajo',
        conservaValores: false
      }
    },
    "list": {
      "multi_select": {
        before: `[{ "name": "Item 1" }, { "name": "Item 2" }]`,
        after: `["Item 1", "Item 2"]`,
        performanceImpact: 'bajo',
        conservaValores: true
      },
      "relation": {
        before: `[{ "id": "abc123", "name": "Relacionado" }]`,
        after: `["Relacionado"]`,
        performanceImpact: 'medio',
        conservaValores: false
      }
    }
  };
  
  // Devolver ejemplo específico o uno genérico
  return examples[targetType]?.[sourceType] || {
    before: `Ejemplo de ${sourceType}`,
    after: `Transformado a ${targetType}`,
    performanceImpact: estimatePerformanceImpact(sourceType, targetType)
  };
}

// Estimar el impacto en rendimiento basado en la complejidad de la transformación
function estimatePerformanceImpact(sourceType: string, targetType: string): 'bajo' | 'medio' | 'alto' {
  // Transformaciones conocidas por ser costosas
  const highImpactTransformations = [
    'date_rich_text',
    'files_list',
    'relation_list'
  ];
  
  // Transformaciones de complejidad media
  const mediumImpactTransformations = [
    'rich_text_multi_select',
    'multi_select_rich_text',
    'date_text'
  ];
  
  const key = `${sourceType}_${targetType}`;
  
  if (highImpactTransformations.includes(key)) {
    return 'alto';
  }
  
  if (mediumImpactTransformations.includes(key)) {
    return 'medio';
  }
  
  return 'bajo';
}

/**
 * Obtiene todas las transformaciones disponibles para un tipo destino
 */
export function getAvailableTransformations(targetType: string): FieldTransformation[] {
  if (!transformations[targetType]) {
    return [];
  }
  
  return Object.values(transformations[targetType]);
}

/**
 * Transforma un valor de un tipo a otro
 * 
 * @typeparam S - Tipo de origen
 * @typeparam T - Tipo de destino
 * @param value - Valor a transformar
 * @param sourceType - Tipo de origen
 * @param targetType - Tipo de destino
 * @param options - Opciones adicionales para la transformación
 * @returns El valor transformado o null si no es posible la transformación
 */
export function transformValue<S, T>(
  value: S, 
  sourceType: string, 
  targetType: string,
  options: TransformationOptions = {}
): T | null {
  try {
    // Si los tipos son iguales, no hay necesidad de transformar
    if (sourceType === targetType) {
      return value as unknown as T;
    }
    
    // Verificar si existe una transformación para estos tipos
    if (transformations[targetType]?.[sourceType]) {
      // Usar caché para optimizar
      // Creamos una clave segura para evitar problemas con valores complejos
      const simplifiedValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : String(value);
      
      const cacheKey = `transform_${sourceType}_${targetType}_${simplifiedValue.substring(0, 100)}_${JSON.stringify(options).substring(0, 50)}`;
      
      // Comprobar si ya tenemos este resultado en caché
      const cachedResult = transformationCache.get(cacheKey);
      if (cachedResult !== undefined) {
        return cachedResult as T;
      }
      
      // Medir el rendimiento de la transformación
      const startTime = performance.now();
      
      // Aplicar la transformación con mejor manejo de tipos
      const transformation = transformations[targetType][sourceType] as FieldTransformation<S, T>;
      const result = transformation.transform(value, options);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Almacenar en caché
      transformationCache.set(cacheKey, result);
      
      // Registrar métricas de rendimiento si tarda demasiado
      if (duration > 50) {
        console.warn(
          `Transformación lenta ${sourceType} -> ${targetType}: ${duration.toFixed(2)}ms`,
          `Tipo de valor: ${typeof value}`,
          `Tamaño de datos aproximado: ${simplifiedValue.length} caracteres`
        );
      }
      
      return result;
    }
    
    // Intentar encontrar una transformación de dos pasos
    // Por ejemplo: relation -> multi_select -> text
    for (const intermediateType in transformations) {
      if (transformations[intermediateType]?.[sourceType] && 
          transformations[targetType]?.[intermediateType]) {
        // Transformación en dos pasos
        const step1 = transformValue(value, sourceType, intermediateType, options);
        if (step1 !== null) {
          return transformValue(step1, intermediateType, targetType, options);
        }
      }
    }
    
    // No se encontró una transformación directa o indirecta
    console.info(`No se encontró transformación de ${sourceType} a ${targetType}`);
    return null;
  } catch (error) {
    console.error(
      `Error al transformar de ${sourceType} a ${targetType}:`, 
      error,
      `Valor: ${JSON.stringify(value).substring(0, 200)}`,
      `Opciones: ${JSON.stringify(options)}`
    );
    return null;
  }
}
