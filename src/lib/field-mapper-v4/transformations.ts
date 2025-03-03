/**
 * Transformaciones entre tipos de campos
 * 
 * Define las transformaciones posibles entre diferentes tipos de campos
 * y proporciona funciones para aplicarlas.
 */

import { FieldType } from './types';
import { withCache } from './cache';

// Estructura para definir una transformación
export interface Transformation {
  id: string;
  sourceType: FieldType;
  targetType: FieldType;
  name: string;
  description: string;
  performanceImpact: 'low' | 'medium' | 'high';
  // Determina si esta transformación puede o no ser sometida a benchmark
  benchmarkable?: boolean;
  // Función de transformación (se ejecuta en tiempo de ejecución)
  transform: (value: any, options?: any) => any;
  // Ejemplo para mostrar en la interfaz
  example?: {
    source: any;
    target: any;
  };
}

// Definición de las transformaciones disponibles
export const transformations: Transformation[] = [
  // Rich Text a Text
  {
    id: 'rich_text_to_text',
    sourceType: FieldType.RICH_TEXT,
    targetType: FieldType.TEXT,
    name: 'Rich Text a Texto',
    description: 'Convierte texto con formato a texto plano',
    performanceImpact: 'low',
    transform: (value) => {
      // Si es un array de bloques de rich text (formato Notion)
      if (Array.isArray(value)) {
        return value.map(block => block.plain_text || block.text?.content || '').join(' ');
      }
      
      // Si es un string con HTML
      if (typeof value === 'string' && value.includes('<')) {
        return value.replace(/<[^>]*>/g, '');
      }
      
      // Si es otro tipo de objeto
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      return String(value);
    },
    example: {
      source: [{ "text": { "content": "Texto con **formato**" } }],
      target: "Texto con formato"
    }
  },
  
  // Text a Rich Text
  {
    id: 'text_to_rich_text',
    sourceType: FieldType.TEXT,
    targetType: FieldType.RICH_TEXT,
    name: 'Texto a Rich Text',
    description: 'Convierte texto plano a formato rich text',
    performanceImpact: 'low',
    transform: (value) => {
      const text = String(value);
      // Convertimos a formato Rich Text de Notion
      return [
        {
          type: 'text',
          text: { content: text },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }
      ];
    },
    example: {
      source: "Texto simple",
      target: [{ "text": { "content": "Texto simple" } }]
    }
  },
  
  // Multi-select a Text
  {
    id: 'multi_select_to_text',
    sourceType: FieldType.MULTI_SELECT,
    targetType: FieldType.TEXT,
    name: 'Multi-selección a Texto',
    description: 'Convierte opciones multi-seleccionadas a texto separado por comas',
    performanceImpact: 'low',
    transform: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => item.name || item).join(', ');
      }
      return String(value);
    },
    example: {
      source: [{ "name": "Diseño" }, { "name": "Web" }],
      target: "Diseño, Web"
    }
  },
  
  // Select a Text
  {
    id: 'select_to_text',
    sourceType: FieldType.SELECT,
    targetType: FieldType.TEXT,
    name: 'Selección a Texto',
    description: 'Convierte una opción seleccionada a texto',
    performanceImpact: 'low',
    transform: (value) => {
      if (value && typeof value === 'object') {
        return value.name || JSON.stringify(value);
      }
      return String(value);
    },
    example: {
      source: { "name": "Diseño" },
      target: "Diseño"
    }
  },
  
  // Date a Text
  {
    id: 'date_to_text',
    sourceType: FieldType.DATE,
    targetType: FieldType.TEXT,
    name: 'Fecha a Texto',
    description: 'Convierte una fecha a texto formateado',
    performanceImpact: 'low',
    transform: (value, options = { format: 'DD/MM/YYYY' }) => {
      if (!value) return '';
      
      // Si es un objeto de fecha de Notion
      if (typeof value === 'object' && value.start) {
        const date = new Date(value.start);
        return date.toLocaleDateString('es-ES');
      }
      
      // Si es una string de fecha o un timestamp
      try {
        const date = new Date(value);
        return date.toLocaleDateString('es-ES');
      } catch (e) {
        return String(value);
      }
    },
    example: {
      source: { "start": "2023-05-15" },
      target: "15/05/2023"
    }
  },
  
  // Number a Text
  {
    id: 'number_to_text',
    sourceType: FieldType.NUMBER,
    targetType: FieldType.TEXT,
    name: 'Número a Texto',
    description: 'Convierte un número a su representación en texto',
    performanceImpact: 'low',
    transform: (value) => {
      return String(value);
    },
    example: {
      source: 42,
      target: "42"
    }
  },
  
  // Checkbox a Text
  {
    id: 'checkbox_to_text',
    sourceType: FieldType.CHECKBOX,
    targetType: FieldType.TEXT,
    name: 'Checkbox a Texto',
    description: 'Convierte un valor booleano a "Sí" o "No"',
    performanceImpact: 'low',
    transform: (value) => {
      return value ? 'Sí' : 'No';
    },
    example: {
      source: true,
      target: "Sí"
    }
  },
  
  // Files a File (primer elemento)
  {
    id: 'files_to_file',
    sourceType: FieldType.FILES,
    targetType: FieldType.FILES,
    name: 'Colección a Archivo único',
    description: 'Toma el primer archivo de una colección',
    performanceImpact: 'low',
    transform: (value) => {
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      }
      return null;
    },
    example: {
      source: [
        { "name": "imagen1.jpg", "url": "https://example.com/imagen1.jpg" },
        { "name": "imagen2.jpg", "url": "https://example.com/imagen2.jpg" }
      ],
      target: { "name": "imagen1.jpg", "url": "https://example.com/imagen1.jpg" }
    }
  },
  
  // Files a Text (concatenando urls)
  {
    id: 'files_to_text',
    sourceType: FieldType.FILES,
    targetType: FieldType.TEXT,
    name: 'Archivos a Texto',
    description: 'Convierte una lista de archivos a texto con sus urls separadas por comas',
    performanceImpact: 'low',
    transform: (value, options = { includeNames: true }) => {
      if (!Array.isArray(value)) return '';
      
      if (options.includeNames) {
        return value.map(file => `${file.name} (${file.url})`).join(', ');
      } else {
        return value.map(file => file.url).join(', ');
      }
    },
    example: {
      source: [
        { "name": "documento.pdf", "url": "https://example.com/documento.pdf" },
        { "name": "presentacion.ppt", "url": "https://example.com/presentacion.ppt" }
      ],
      target: "documento.pdf (https://example.com/documento.pdf), presentacion.ppt (https://example.com/presentacion.ppt)"
    }
  },
  
  // Files a Image (primer elemento, específico para imágenes)
  {
    id: 'files_to_image',
    sourceType: FieldType.FILES,
    targetType: FieldType.IMAGE,
    name: 'Archivos a Imagen',
    description: 'Extrae la primera imagen de una lista de archivos',
    performanceImpact: 'low',
    transform: (value, options = { index: 0 }) => {
      if (!Array.isArray(value) || value.length === 0) return null;
      
      const index = options.index || 0;
      const file = value[Math.min(index, value.length - 1)];
      
      if (!file || !file.url) return null;
      
      // Verificar si el archivo es una imagen por su extensión
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      const isImage = imageExtensions.some(ext => 
        file.name?.toLowerCase().endsWith(ext) || file.url?.toLowerCase().includes(ext)
      );
      
      return isImage ? { url: file.url, name: file.name } : null;
    },
    example: {
      source: [
        { "name": "imagen.jpg", "url": "https://example.com/imagen.jpg" },
        { "name": "documento.pdf", "url": "https://example.com/documento.pdf" }
      ],
      target: { "url": "https://example.com/imagen.jpg", "name": "imagen.jpg" }
    }
  },
  
  // Text a Number
  {
    id: 'text_to_number',
    sourceType: FieldType.TEXT,
    targetType: FieldType.NUMBER,
    name: 'Texto a Número',
    description: 'Convierte texto a número, removiendo caracteres no numéricos si es necesario',
    performanceImpact: 'low',
    transform: (value, options = { parseMode: 'float', fallback: 0 }) => {
      if (value === null || value === undefined) return options.fallback;
      
      const text = String(value).trim();
      
      // Remover caracteres de moneda y separadores de miles
      const cleanText = text.replace(/[$€£¥,.]/g, '');
      
      if (options.parseMode === 'integer') {
        const result = parseInt(cleanText, 10);
        return isNaN(result) ? options.fallback : result;
      } else {
        const result = parseFloat(cleanText);
        return isNaN(result) ? options.fallback : result;
      }
    },
    example: {
      source: "$1,234.56",
      target: 1234.56
    }
  },
  
  // Text a Date
  {
    id: 'text_to_date',
    sourceType: FieldType.TEXT,
    targetType: FieldType.DATE,
    name: 'Texto a Fecha',
    description: 'Convierte texto a un objeto de fecha compatible con Notion',
    performanceImpact: 'medium',
    transform: (value) => {
      if (!value) return null;
      
      // Intentamos parsear la fecha
      const date = new Date(String(value));
      
      if (isNaN(date.getTime())) {
        // Si el parseo directo falla, intentamos con formatos comunes
        const formats = [
          // DD/MM/YYYY
          (text: string) => {
            const parts = text.split('/');
            if (parts.length === 3) {
              return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            return null;
          },
          // DD-MM-YYYY
          (text: string) => {
            const parts = text.split('-');
            if (parts.length === 3) {
              return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            return null;
          }
        ];
        
        for (const formatFn of formats) {
          const parsedDate = formatFn(String(value));
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            // Formato Notion para fechas
            return { 
              start: parsedDate.toISOString().split('T')[0]
            };
          }
        }
        
        return null;
      }
      
      // Formato Notion para fechas
      return { 
        start: date.toISOString().split('T')[0]
      };
    },
    example: {
      source: "15/05/2023",
      target: { "start": "2023-05-15" }
    }
  },
  
  // Text a Multi Select
  {
    id: 'text_to_multi_select',
    sourceType: FieldType.TEXT,
    targetType: FieldType.MULTI_SELECT,
    name: 'Texto a Multi-selección',
    description: 'Convierte texto separado por comas a opciones multi-seleccionadas',
    performanceImpact: 'low',
    transform: (value, options = { separator: ',' }) => {
      if (!value) return [];
      
      const text = String(value);
      const separator = options.separator || ',';
      
      return text
        .split(separator)
        .map(item => item.trim())
        .filter(Boolean)
        .map(name => ({ name }));
    },
    example: {
      source: "Diseño, Web, UI/UX",
      target: [{ "name": "Diseño" }, { "name": "Web" }, { "name": "UI/UX" }]
    }
  },
  
  // Text a Select
  {
    id: 'text_to_select',
    sourceType: FieldType.TEXT,
    targetType: FieldType.SELECT,
    name: 'Texto a Selección',
    description: 'Convierte texto a una opción seleccionada',
    performanceImpact: 'low',
    transform: (value) => {
      if (!value) return null;
      
      const text = String(value).trim();
      if (!text) return null;
      
      return { name: text };
    },
    example: {
      source: "Diseño",
      target: { "name": "Diseño" }
    }
  },
  
  // Rich Text a Multi Select
  {
    id: 'rich_text_to_multi_select',
    sourceType: FieldType.RICH_TEXT,
    targetType: FieldType.MULTI_SELECT,
    name: 'Rich Text a Multi-selección',
    description: 'Convierte texto con formato a opciones multi-seleccionadas usando separador',
    performanceImpact: 'medium',
    transform: (value, options = { separator: ',' }) => {
      // Primero convertimos a texto plano
      let plainText = '';
      
      if (Array.isArray(value)) {
        plainText = value.map(block => block.plain_text || block.text?.content || '').join(' ');
      } else if (typeof value === 'string') {
        plainText = value.replace(/<[^>]*>/g, '');
      } else {
        plainText = String(value);
      }
      
      // Luego aplicamos la transformación de texto a multi-select
      const separator = options.separator || ',';
      
      return plainText
        .split(separator)
        .map(item => item.trim())
        .filter(Boolean)
        .map(name => ({ name }));
    },
    example: {
      source: [{ "text": { "content": "Diseño, Web, UI/UX" } }],
      target: [{ "name": "Diseño" }, { "name": "Web" }, { "name": "UI/UX" }]
    }
  },
  
  // Number a Checkbox (0 = false, otros valores = true)
  {
    id: 'number_to_checkbox',
    sourceType: FieldType.NUMBER,
    targetType: FieldType.CHECKBOX,
    name: 'Número a Checkbox',
    description: 'Convierte un número a valor booleano (0 = falso, otros valores = verdadero)',
    performanceImpact: 'low',
    transform: (value) => {
      if (value === null || value === undefined) return false;
      return value !== 0;
    },
    example: {
      source: 1,
      target: true
    }
  },
  
  // Text a Checkbox
  {
    id: 'text_to_checkbox',
    sourceType: FieldType.TEXT,
    targetType: FieldType.CHECKBOX,
    name: 'Texto a Checkbox',
    description: 'Convierte texto a valor booleano (sí/true/1 = verdadero, no/false/0 = falso)',
    performanceImpact: 'low',
    transform: (value) => {
      if (!value) return false;
      
      const text = String(value).toLowerCase().trim();
      const trueValues = ['true', 'yes', 'sí', 'si', '1', 'verdadero', 'cierto'];
      
      return trueValues.includes(text);
    },
    example: {
      source: "Sí",
      target: true
    }
  },
  
  // Text a URL
  {
    id: 'text_to_url',
    sourceType: FieldType.TEXT,
    targetType: FieldType.URL,
    name: 'Texto a URL',
    description: 'Convierte texto a URL, validando si tiene formato correcto',
    performanceImpact: 'low',
    transform: (value, options = { addHttps: true }) => {
      if (!value) return null;
      
      let url = String(value).trim();
      
      // Si no tiene protocolo y addHttps está activado, agregar https://
      if (options.addHttps && !url.match(/^[a-zA-Z]+:\/\//)) {
        url = 'https://' + url;
      }
      
      // Verificar si la URL es válida
      try {
        new URL(url);
        return url;
      } catch (e) {
        // Si no es válida, retornar null o el valor original según la opción
        return options.returnOriginal ? value : null;
      }
    },
    example: {
      source: "example.com",
      target: "https://example.com"
    }
  },
  
  // URL a Text
  {
    id: 'url_to_text',
    sourceType: FieldType.URL,
    targetType: FieldType.TEXT,
    name: 'URL a Texto',
    description: 'Convierte URL a texto plano',
    performanceImpact: 'low',
    transform: (value) => {
      if (!value) return '';
      return String(value);
    },
    example: {
      source: "https://example.com",
      target: "https://example.com"
    }
  },
  
  // Files a URL (primer elemento)
  {
    id: 'files_to_url',
    sourceType: FieldType.FILES,
    targetType: FieldType.URL,
    name: 'Archivos a URL',
    description: 'Extrae la URL del primer archivo',
    performanceImpact: 'low',
    transform: (value, options = { index: 0 }) => {
      if (!Array.isArray(value) || value.length === 0) return null;
      
      const index = options.index || 0;
      const file = value[Math.min(index, value.length - 1)];
      
      return file?.url || null;
    },
    example: {
      source: [
        { "name": "documento.pdf", "url": "https://example.com/documento.pdf" },
        { "name": "imagen.jpg", "url": "https://example.com/imagen.jpg" }
      ],
      target: "https://example.com/documento.pdf"
    }
  },
];

// Mapa para búsqueda rápida de transformaciones
const transformationMap: Record<string, Transformation> = {};
transformations.forEach(transformation => {
  transformationMap[transformation.id] = transformation;
  // También indexamos por sourceType_targetType
  transformationMap[`${transformation.sourceType}_to_${transformation.targetType}`] = transformation;
});

/**
 * Obtiene una transformación por su ID
 */
export function getTransformation(id: string): Transformation | null {
  return transformationMap[id] || null;
}

/**
 * Busca una transformación basada en los tipos de origen y destino
 */
export function findTransformation(sourceType: FieldType, targetType: FieldType): Transformation | null {
  const key = `${sourceType}_to_${targetType}`;
  return transformationMap[key] || null;
}

/**
 * Aplica una transformación a un valor
 */
export function applyTransformation(
  sourceType: FieldType,
  targetType: FieldType,
  value: any,
  options?: any
): any {
  // Si los tipos son iguales, no se necesita transformación
  if (sourceType === targetType) {
    return value;
  }

  // Buscar una transformación adecuada
  const transformation = findTransformation(sourceType, targetType);
  if (!transformation) {
    console.warn(`No se encontró transformación de ${sourceType} a ${targetType}`);
    return value;
  }

  try {
    // Aplicar transformación con caché
    return withCache(transformation.id, transformation.transform)(value, options);
  } catch (error) {
    console.error(`Error al aplicar transformación de ${sourceType} a ${targetType}:`, error);
    return value;
  }
}
