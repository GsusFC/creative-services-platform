/**
 * Utilidades para mapeo de campos de Notion a Case Studies
 * 
 * Este archivo contiene funciones para transformar datos de campos
 * mapeados de Notion a la estructura requerida por las landing pages 
 * de case studies.
 */

import { FieldMapping } from '@/lib/field-mapper-v4/types';

interface NotionData {
  [key: string]: unknown;
}

// Nueva estructura alineada con el nuevo diseño
export interface CaseStudyDataV4 {
  // Metadatos y gestión
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  
  // Sección HERO
  hero_image: string;
  
  // Sección MAIN_INFO
  project_name: string;
  tagline?: string;
  description: string;
  services?: string[];
  client_name?: string;
  client_logo?: string;
  
  // Sección GALLERY
  gallery?: string[];
  
  // Categorización
  category?: string;
  tags?: string[];
  
  // Información adicional
  challenge?: string;
  solution?: string;
  results?: string[];
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

// Mantenemos la estructura anterior para compatibilidad
interface MappedCaseStudyData {
  heroSection: {
    projectName: string;
    tagline: string;
    description: string;
    services: string[];
    featuredMedia: string;
  };
  gallery: {
    mediaItems: string[];
    captions: string[];
  };
  contentSections: {
    sectionTitle: string;
    content: string;
    media?: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company?: string;
    avatar?: string;
  };
  statsSection: {
    title?: string;
    stats: {
      value: string;
      label: string;
    }[];
  };
  relatedProjects?: {
    id: string;
    name: string;
    thumbnail: string;
  }[];
}

/**
 * Transforma datos de Notion en estructura de Case Study
 * utilizando las asignaciones de campo definidas
 */
export function transformNotionToCaseStudy(
  notionData: NotionData,
  fieldMappings: FieldMapping[]
): MappedCaseStudyData {
  // Estructura base del Case Study
  const caseStudyData: MappedCaseStudyData = {
    heroSection: {
      projectName: '',
      tagline: '',
      description: '',
      services: [],
      featuredMedia: ''
    },
    gallery: {
      mediaItems: [],
      captions: []
    },
    contentSections: [],
    testimonial: {
      quote: '',
      author: '',
      position: '',
      company: '',
      avatar: ''
    },
    statsSection: {
      title: 'Resultados',
      stats: []
    },
    relatedProjects: []
  };

  // Procesar cada mapeo de campo
  fieldMappings.forEach(mapping => {
    // Extraer el valor de Notion según el mapping
    const notionValue = getNotionFieldValue(notionData, mapping.notionFieldId);
    if (notionValue === undefined || notionValue === null) return;

    // Aplicar transformaciones si existen
    const transformedValue = mapping.transformationId 
      ? applyTransformation(notionValue, mapping.transformationId)
      : notionValue;

    // Mapear al campo correspondiente en la estructura del Case Study
    mapValueToCaseStudyField(caseStudyData, mapping.caseStudyFieldId, transformedValue);
  });

  return caseStudyData;
}

/**
 * Obtiene el valor de un campo de Notion
 */
function getNotionFieldValue(notionData: NotionData, fieldId: string): unknown {
  // La estructura de notionData dependerá de la API de Notion
  // Esta es una implementación simplificada
  return notionData[fieldId];
}

/**
 * Aplica una transformación específica a un valor
 */
function applyTransformation(value: unknown, transformationId: string): unknown {
  console.log(`Aplicando transformación '${transformationId}' al valor:`, value);
  
  // Implementar diferentes transformaciones según el ID
  try {
    switch (transformationId) {
      // Transformaciones de texto
      case 'text-to-array':
        return typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : value;
      
      case 'text-to-url':
        if (typeof value === 'string') {
          // Si ya es una URL completa, la dejamos como está
          if (value.startsWith('http://') || value.startsWith('https://')) {
            return value;
          }
          // Si no, asumimos que es una ruta relativa
          return value.startsWith('/') ? value : `/${value}`;
        }
        return value;
      
      // Transformaciones de números
      case 'number-to-percentage':
        return typeof value === 'number' ? `${value}%` : value;
      
      case 'to-number':
        if (typeof value === 'string') {
          const num = parseFloat(value);
          return isNaN(num) ? value : num;
        }
        return value;
      
      // Transformaciones de arrays
      case 'array-to-first-item':
        return Array.isArray(value) && value.length > 0 ? value[0] : value;
      
      case 'to-array':
        if (value === null || value === undefined) return [];
        return Array.isArray(value) ? value : [value];
      
      // Transformaciones de JSON
      case 'json-parse':
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            console.warn('Error al parsear JSON:', e);
            return value;
          }
        }
        return value;
      
      // Transformaciones específicas para Notion
      case 'notion-files-to-urls':
        if (Array.isArray(value)) {
          return value
            .map(file => {
              if (typeof file === 'string') return file;
              if (file && typeof file === 'object') {
                // Definimos una interfaz para el objeto file
                interface NotionFile {
                  external?: { url: string };
                  url?: string;
                  name?: string;
                }
                
                // Convertimos file a NotionFile para acceder a sus propiedades de forma segura
                const notionFile = file as NotionFile;
                return notionFile.external?.url || notionFile.url || notionFile.name || '';
              }
              return '';
            })
            .filter(Boolean);
        }
        return value;
      
      case 'notion-rich-text-to-plain':
        if (Array.isArray(value)) {
          return value
            .map(text => {
              if (typeof text === 'string') return text;
              if (text && typeof text === 'object') {
                // Definimos una interfaz para el objeto text
                interface NotionText {
                  plain_text?: string;
                }
                
                // Convertimos text a NotionText para acceder a sus propiedades de forma segura
                const notionText = text as NotionText;
                return notionText.plain_text || '';
              }
              return '';
            })
            .join('');
        }
        return value;
        
      default:
        console.log(`Transformación '${transformationId}' no implementada, devolviendo valor original`);
        return value;
    }
  } catch (error) {
    console.error(`Error al aplicar transformación '${transformationId}':`, error);
    return value;
  }
}

/**
 * Mapea un valor a un campo específico en la estructura del Case Study
 */
function mapValueToCaseStudyField(caseStudyData: MappedCaseStudyData, fieldId: string, value: unknown): void {
  // Estructura que relaciona IDs de campos con su ubicación en la estructura
  const fieldMappings: {[key: string]: (data: MappedCaseStudyData, value: unknown) => void} = {
    // Hero Section
    'project-name': (data, val) => data.heroSection.projectName = String(val),
    'tagline': (data, val) => data.heroSection.tagline = String(val),
    'description': (data, val) => data.heroSection.description = String(val),
    'services': (data, val) => data.heroSection.services = Array.isArray(val) ? val : [String(val)],
    'featured-media': (data, val) => data.heroSection.featuredMedia = String(val),
    
    // Gallery
    'media-items': (data, val) => data.gallery.mediaItems = Array.isArray(val) ? val : [String(val)],
    'captions': (data, val) => data.gallery.captions = Array.isArray(val) ? val : [String(val)],
    
    // Content Sections - Requiere lógica especial para manejar múltiples secciones
    'section-title': (data, val) => {
      if (!data.contentSections[0]) data.contentSections[0] = { sectionTitle: '', content: '' };
      data.contentSections[0].sectionTitle = String(val);
    },
    'content': (data, val) => {
      if (!data.contentSections[0]) data.contentSections[0] = { sectionTitle: '', content: '' };
      data.contentSections[0].content = String(val);
    },
    'media': (data, val) => {
      if (!data.contentSections[0]) data.contentSections[0] = { sectionTitle: '', content: '' };
      data.contentSections[0].media = String(val);
    },
    
    // Para manejar secciones adicionales (ejemplo)
    'section-title-2': (data, val) => {
      if (!data.contentSections[1]) data.contentSections[1] = { sectionTitle: '', content: '' };
      data.contentSections[1].sectionTitle = String(val);
    },
    'content-2': (data, val) => {
      if (!data.contentSections[1]) data.contentSections[1] = { sectionTitle: '', content: '' };
      data.contentSections[1].content = String(val);
    },
    'media-2': (data, val) => {
      if (!data.contentSections[1]) data.contentSections[1] = { sectionTitle: '', content: '' };
      data.contentSections[1].media = String(val);
    },
    
    // Testimonial
    'quote': (data, val) => data.testimonial.quote = String(val),
    'author': (data, val) => data.testimonial.author = String(val),
    'position': (data, val) => data.testimonial.position = String(val),
    'company': (data, val) => data.testimonial.company = String(val),
    'avatar': (data, val) => data.testimonial.avatar = String(val),
    
    // Stats Section
    'stats-title': (data, val) => data.statsSection.title = String(val),
    'stats': (data, val) => {
      if (Array.isArray(val)) {
        data.statsSection.stats = val.map(stat => {
          if (typeof stat === 'object' && stat.value && stat.label) {
            return { value: String(stat.value), label: String(stat.label) };
          }
          return { value: String(stat), label: '' };
        });
      }
    },
    
    // Related Projects - Asume un array de objetos con las propiedades necesarias
    'related-projects': (data, val) => {
      if (Array.isArray(val)) {
        data.relatedProjects = val.map(project => ({
          id: String(project.id || ''),
          name: String(project.name || ''),
          thumbnail: String(project.thumbnail || '')
        }));
      }
    }
  };

  // Ejecutar la función de mapeo si existe
  if (fieldMappings[fieldId]) {
    fieldMappings[fieldId](caseStudyData, value);
  }
}

/**
 * Genera la URL para un case study específico
 */
export function generateCaseStudyUrl(caseStudyId: string): string {
  return `/case-studies/${caseStudyId}`;
}

/**
 * Transforma datos de Notion en la nueva estructura de Case Study V4
 * 
 * @param notionData Datos originales de Notion
 * @param fieldMappings Mapeos de campos configurados en Field Mapper V4
 * @returns Datos estructurados para el nuevo diseño de Case Study
 */
export function transformNotionToCaseStudyV4(
  notionData: NotionData,
  fieldMappings: FieldMapping[]
): CaseStudyDataV4 {
  console.log('Iniciando transformación con Field Mapper V4');
  console.log('Datos de Notion disponibles:', Object.keys(notionData));
  console.log('Mapeos configurados:', fieldMappings);
  
  // Inicializamos la estructura con valores por defecto
  const caseStudyData: CaseStudyDataV4 = {
    id: '',
    slug: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published: false,
    hero_image: '',
    project_name: '',
    description: '',
    gallery: []
  };
  
  // Iteramos sobre todos los mapeos de campos
  fieldMappings.forEach(mapping => {
    // Adaptamos los nombres de campos para compatibilidad con la API
    const sourceField = mapping.notionFieldId;
    const targetField = mapping.caseStudyFieldId;
    
    if (!sourceField || !targetField) {
      console.log('Mapeo incompleto, falta campo origen o destino:', mapping);
      return;
    }
    
    console.log(`Procesando mapeo: ${sourceField} -> ${targetField}`);
    
    // Obtenemos el valor del campo de Notion
    const value = notionData[sourceField];
    console.log(`Valor original para ${sourceField}:`, value);
    
    // Si hay una transformación definida, la aplicamos
    const transformationId = mapping.transformationId;
    let transformedValue = value;
    
    if (transformationId) {
      console.log(`Aplicando transformación: ${transformationId}`);
      transformedValue = applyTransformation(value, transformationId);
      console.log('Valor transformado:', transformedValue);
    }
    
    // Mapeamos el valor al campo correspondiente
    mapValueToCaseStudyFieldV4(caseStudyData, targetField, transformedValue);
  });
  
  // Aplicar valores por defecto para campos obligatorios que podrían estar vacíos
  if (!caseStudyData.hero_image) {
    console.log('Aplicando imagen hero por defecto');
    caseStudyData.hero_image = '/placeholder-hero.jpg';
  }
  
  if (!caseStudyData.project_name) {
    console.log('Aplicando nombre de proyecto por defecto');
    // Intentar extraer el nombre del proyecto directamente si está disponible
    const titleField = Object.entries(notionData).find(([_, value]) => 
      typeof value === 'string' && value.length > 0 && value.length < 100
    );
    caseStudyData.project_name = titleField ? String(titleField[1]) : 'Proyecto sin nombre';
  }
  
  if (!caseStudyData.description) {
    console.log('Aplicando descripción por defecto');
    caseStudyData.description = 'Descripción no disponible para este proyecto.';
  }
  
  if (!caseStudyData.services || caseStudyData.services.length === 0) {
    console.log('Aplicando servicios por defecto');
    caseStudyData.services = ['Diseño', 'Desarrollo'];
  }
  
  console.log('Transformación completada:', caseStudyData);
  return caseStudyData;
}

/**
 * Mapea un valor a un campo específico en la nueva estructura V4 del Case Study
 * 
 * @param caseStudyData Datos estructurados del Case Study
 * @param fieldId Identificador del campo destino
 * @param value Valor a asignar
 */
function mapValueToCaseStudyFieldV4(
  caseStudyData: CaseStudyDataV4,
  fieldId: string,
  value: unknown
): void {
  // Si el valor es undefined o null, no hacemos nada
  if (value === undefined || value === null) {
    console.log(`Valor nulo o indefinido para campo ${fieldId}`);
    return;
  }
  
  console.log(`Mapeando valor para campo ${fieldId}:`, value);
  
  // Función auxiliar para convertir a string de forma segura
  const safeString = (val: unknown): string => {
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };
  
  // Función auxiliar para convertir a array de strings
  const safeStringArray = (val: unknown): string[] => {
    if (Array.isArray(val)) {
      return val.map(item => safeString(item)).filter(Boolean);
    }
    if (typeof val === 'string') {
      return val.split(',').map(item => item.trim()).filter(Boolean);
    }
    if (val) return [safeString(val)];
    return [];
  };
  
  // Mapeamos según el campo destino
  switch (fieldId) {
    // HERO section
    case 'hero_image':
      caseStudyData.hero_image = safeString(value);
      break;
    
    // MAIN_INFO section
    case 'project_name':
      caseStudyData.project_name = safeString(value);
      break;
    case 'tagline':
      caseStudyData.tagline = safeString(value);
      break;
    case 'description':
      caseStudyData.description = safeString(value);
      break;
    case 'services':
      // Aseguramos que services sea siempre un array de strings
      caseStudyData.services = safeStringArray(value);
      break;
    
    // GALLERY section
    case 'gallery':
      // Aseguramos que gallery sea siempre un array de strings
      caseStudyData.gallery = safeStringArray(value);
      break;
      
    default:
      console.warn(`Campo destino no reconocido: ${fieldId}`);
      break;
  }
  
  console.log(`Campo ${fieldId} actualizado con éxito:`, 
    fieldId === 'gallery' || fieldId === 'services' 
      ? `[${Array.isArray(caseStudyData[fieldId as keyof CaseStudyDataV4]) ? (caseStudyData[fieldId as keyof CaseStudyDataV4] as string[]).length : 0} elementos]` 
      : caseStudyData[fieldId as keyof CaseStudyDataV4]);
}
