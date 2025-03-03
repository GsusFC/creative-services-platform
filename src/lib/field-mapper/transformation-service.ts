/**
 * Field Mapper Transformation Service
 * 
 * Servicio para transformar valores entre tipos de Notion y el sitio web.
 * Proporciona funciones para aplicar transformaciones basadas en plantillas,
 * transformaciones personalizadas y transformaciones automáticas.
 */

import { 
  NotionFieldType, 
  WebsiteFieldType,
  TransformationTemplate,
  TransformationResult,
  TransformationContext,
  TransformationStrategy,
  Transformation
} from './types';
import { CompatibilityLevel, getCompatibilityLevel } from './validation';
import { measurePerformance } from './performance-service';

// Caché de transformaciones
const transformationCache = new Map<string, TransformationResult>();

// Plantillas de transformación predefinidas
const DEFAULT_TRANSFORMATIONS: TransformationTemplate[] = [
  {
    id: 'title-to-string',
    name: 'Título a String',
    description: 'Convierte un título de Notion a una cadena de texto',
    sourceType: 'title',
    targetType: 'string',
    code: 'return value.plain_text || value.title.[0]?.plain_text ?? "";',
    category: 'extract',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.PERFECT,
    examples: [
      {
        input: { title: [{ plain_text: 'Ejemplo de título' }] },
        output: 'Ejemplo de título',
        description: 'Extrae el texto plano del título'
      }
    ]
  },
  {
    id: 'rich_text-to-text',
    name: 'Texto enriquecido a Texto',
    description: 'Convierte texto enriquecido de Notion a texto plano',
    sourceType: 'richText',
    targetType: 'text',
    code: 'return value.map(block => block.plain_text).join("") || "";',
    category: 'extract',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.PERFECT
  },
  {
    id: 'rich_text-to-html',
    name: 'Texto enriquecido a HTML',
    description: 'Convierte texto enriquecido de Notion a HTML',
    sourceType: 'richText',
    targetType: 'html',
    code: `
      if (!value || !Array.isArray(value)) return '';
      return value.map(block => {
        let text = block.plain_text;
        if (block.annotations.bold) text = \`<strong>\${text}</strong>\`;
        if (block.annotations.italic) text = \`<em>\${text}</em>\`;
        if (block.annotations.strikethrough) text = \`<del>\${text}</del>\`;
        if (block.annotations.underline) text = \`<u>\${text}</u>\`;
        if (block.annotations.code) text = \`<code>\${text}</code>\`;
        if (block.href) text = \`<a href="\${block.href}">\${text}</a>\`;
        return text;
      }).join('');
    `,
    category: 'convert',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.HIGH
  },
  {
    id: 'number-to-number',
    name: 'Número a Número',
    description: 'Convierte un número de Notion a un número JavaScript',
    sourceType: 'number',
    targetType: 'number',
    code: 'return typeof value === "number" ? value : parseFloat(value);',
    category: 'convert',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.PERFECT
  },
  {
    id: 'checkbox-to-boolean',
    name: 'Checkbox a Boolean',
    description: 'Convierte un checkbox de Notion a un booleano',
    sourceType: 'checkbox',
    targetType: 'boolean',
    code: 'return !!value;',
    category: 'convert',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.PERFECT
  },
  {
    id: 'date-to-date',
    name: 'Fecha a Fecha',
    description: 'Convierte una fecha de Notion a un objeto Date',
    sourceType: 'date',
    targetType: 'date',
    code: 'return value.start ? new Date(value.start) : null;',
    category: 'convert',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.PERFECT
  },
  {
    id: 'multi_select-to-array',
    name: 'Multi-select a Array',
    description: 'Convierte un multi-select de Notion a un array de strings',
    sourceType: 'multi_select',
    targetType: 'array',
    code: 'return Array.isArray(value) ? value.map(item => item?.name) : [];',
    category: 'extract',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.HIGH
  },
  {
    id: 'files-to-gallery',
    name: 'Archivos a Galería',
    description: 'Convierte archivos de Notion a una galería de imágenes',
    sourceType: 'files',
    targetType: 'gallery',
    code: `
      if (!Array.isArray(value)) return [];
      return value.map(file => ({
        url: file.file.url || file.external.url ?? '',
        name: file.name ?? '',
        type: file.type ?? 'file'
      }));
    `,
    category: 'convert',
    isDefault: true,
    compatibilityLevel: CompatibilityLevel.HIGH
  }
];

/**
 * Encuentra una plantilla de transformación para un par de tipos
 * 
 * @param sourceType Tipo de origen
 * @param targetType Tipo de destino
 * @returns Plantilla de transformación o undefined si no se encuentra
 */
export function findTransformationTemplate(
  sourceType: NotionFieldType | WebsiteFieldType,
  targetType: NotionFieldType | WebsiteFieldType
): TransformationTemplate | undefined {
  return DEFAULT_TRANSFORMATIONS.find(template => 
    template.sourceType === sourceType && 
    template.targetType === targetType && 
    template.isDefault
  );
}

/**
 * Determina la mejor estrategia de transformación para un par de tipos
 * 
 * @param sourceType Tipo de origen
 * @param targetType Tipo de destino
 * @returns Estrategia de transformación recomendada
 */
export function determineTransformationStrategy(
  sourceType: NotionFieldType | WebsiteFieldType,
  targetType: NotionFieldType | WebsiteFieldType
): TransformationStrategy {
  const compatibilityLevel = getCompatibilityLevel(
    sourceType as NotionFieldType, 
    targetType as WebsiteFieldType
  );
  
  // Si hay una plantilla predefinida, usarla
  const template = findTransformationTemplate(sourceType, targetType);
  if (template) {
    return 'template';
  }
  
  // Determinar estrategia basada en nivel de compatibilidad
  switch (compatibilityLevel) {
    case CompatibilityLevel.PERFECT:
      return 'direct';
    case CompatibilityLevel.HIGH:
      return 'simple';
    case CompatibilityLevel.MEDIUM:
      return 'complex';
    case CompatibilityLevel.LOW:
      return 'custom';
    default:
      return 'fallback';
  }
}

/**
 * Aplica una transformación a un valor
 * 
 * @param value Valor a transformar
 * @param transformation Configuración de transformación
 * @param context Contexto de transformación
 * @returns Resultado de la transformación
 */
export async function applyTransformation(
  value: unknown,
  transformation: Transformation,
  context: TransformationContext
): Promise<TransformationResult> {
  return await measurePerformance('applyTransformation', async () => {
    // Generar clave de caché
    const cacheKey = JSON.stringify({
      value,
      transformation,
      sourceType: context.sourceType || context.sourceField.type,
      targetType: context.targetType || context.targetField.type
    });
    
    // Verificar caché
    const cachedResult = transformationCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    const startTime = performance.now();
    let result: TransformationResult;
    
    try {
      // Aplicar estrategia de transformación
      let transformedValue: unknown;
      
      if (transformation.templateId) {
        // Usar plantilla predefinida
        const template = DEFAULT_TRANSFORMATIONS.find(t => t.id === transformation.templateId);
        if (!template) {
          throw new Error(`Plantilla de transformación no encontrada: ${transformation.templateId}`);
        }
        
        transformedValue = await executeTransformationCode(
          template.code,
          value,
          context
        );
        
        result = {
          success: true,
          value: transformedValue,
          executionTime: performance.now() - startTime,
          inputType: context.sourceType || context.sourceField.type,
          outputType: context.targetType || context.targetField.type,
          transformationId: template.id
        };
      } else if (transformation.custom) {
        // Usar código personalizado
        transformedValue = await executeTransformationCode(
          transformation.custom,
          value,
          context
        );
        
        result = {
          success: true,
          value: transformedValue,
          executionTime: performance.now() - startTime,
          inputType: context.sourceType || context.sourceField.type,
          outputType: context.targetType || context.targetField.type,
          transformationId: 'custom'
        };
      } else if (transformation.type === 'direct') {
        // Pasar el valor directamente
        transformedValue = value;
        
        result = {
          success: true,
          value: transformedValue,
          executionTime: performance.now() - startTime,
          inputType: context.sourceType || context.sourceField.type,
          outputType: context.targetType || context.targetField.type,
          transformationId: 'direct'
        };
      } else {
        // Transformación automática basada en tipos
        const strategy = determineTransformationStrategy(
          (context.sourceType || context.sourceField.type) as NotionFieldType | WebsiteFieldType,
          (context.targetType || context.targetField.type) as NotionFieldType | WebsiteFieldType
        );
        
        switch (strategy) {
          case 'direct':
            transformedValue = value;
            break;
          case 'simple':
            transformedValue = applySimpleTransformation(
              value,
              context.sourceType || context.sourceField.type as NotionFieldType | WebsiteFieldType,
              context.targetType || context.targetField.type as NotionFieldType | WebsiteFieldType
            );
            break;
          case 'template': {
            const template = findTransformationTemplate(
              (context.sourceType || context.sourceField.type) as NotionFieldType | WebsiteFieldType,
              (context.targetType || context.targetField.type) as NotionFieldType | WebsiteFieldType
            );
            if (template) {
              transformedValue = await executeTransformationCode(
                template.code,
                value,
                context
              );
            } else {
              transformedValue = value;
            }
            break;
          }
          case 'fallback':
          default:
            transformedValue = transformation.fallback !== undefined 
              ? transformation.fallback 
              : null;
            break;
        }
        
        result = {
          success: true,
          value: transformedValue,
          executionTime: performance.now() - startTime,
          inputType: context.sourceType || context.sourceField.type,
          outputType: context.targetType || context.targetField.type,
          transformationId: strategy
        };
      }
    } catch (error) {
      result = {
        success: false,
        value: transformation.fallback !== undefined ? transformation.fallback : null,
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime,
        inputType: context.sourceType || context.sourceField.type,
        outputType: context.targetType || context.targetField.type,
        transformationId: 'error'
      };
    }
    
    // Guardar en caché
    transformationCache.set(cacheKey, result);
    
    return result;
  });
}

/**
 * Ejecuta código de transformación de forma segura
 * 
 * @param code Código de transformación
 * @param value Valor a transformar
 * @param context Contexto de transformación
 * @returns Valor transformado
 */
async function executeTransformationCode(
  code: string,
  value: unknown,
  context: TransformationContext
): Promise<unknown> {
  try {
    // Crear función segura
    const fn = new Function('value', 'context', `
      try {
        ${code}
      } catch (error) {
        return { error: error.message };
      }
    `);
    
    // Ejecutar con timeout
    const result = await Promise.race([
      Promise.resolve(fn(value, context)),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout executing transformation')), 1000)
      )
    ]);
    
    // Verificar error
    if (result && typeof result === 'object' && 'error' in result) {
      throw new Error(result.error as string);
    }
    
    return result;
  } catch (error) {
    console.error('Error executing transformation code:', error);
    throw error;
  }
}

/**
 * Aplica una transformación simple basada en tipos
 * 
 * @param value Valor a transformar
 * @param sourceType Tipo de origen
 * @param targetType Tipo de destino
 * @returns Valor transformado
 */
function applySimpleTransformation(
  value: unknown,
  sourceType: string,
  targetType: string
): unknown {
  // String conversions
  if (targetType === 'string') {
    return String(value);
  }
  
  // Number conversions
  if (targetType === 'number' || targetType === 'float' || targetType === 'integer') {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return targetType === 'integer' ? Math.round(num) : num;
  }
  
  // Boolean conversions
  if (targetType === 'boolean') {
    return Boolean(value);
  }
  
  // Date conversions
  if (targetType === 'date' || targetType === 'datetime') {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      try {
        return new Date(value);
      } catch {
        return null;
      }
    }
    return null;
  }
  
  // Array conversions
  if (targetType === 'array' || targetType === 'tags' || targetType === 'categories') {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  }
  
  // Default: return as is
  return value;
}

/**
 * Obtiene todas las plantillas de transformación disponibles
 * 
 * @returns Array de plantillas de transformación
 */
export function getAllTransformationTemplates(): TransformationTemplate[] {
  return [...DEFAULT_TRANSFORMATIONS];
}

/**
 * Registra una nueva plantilla de transformación
 * 
 * @param template Plantilla de transformación
 */
export function registerTransformationTemplate(template: TransformationTemplate): void {
  // Verificar si ya existe
  const existingIndex = DEFAULT_TRANSFORMATIONS.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    // Actualizar existente
    DEFAULT_TRANSFORMATIONS[existingIndex] = template;
  } else {
    // Agregar nueva
    DEFAULT_TRANSFORMATIONS.push(template);
  }
  
  // Limpiar caché
  transformationCache.clear();
}

/**
 * Limpia la caché de transformaciones
 */
export function clearTransformationCache(): void {
  transformationCache.clear();
}
