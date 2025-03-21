import { CaseStudy, MediaItem } from '@/types/case-study';
import type {
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  CreatePageParameters,
  UpdatePageParameters,
  DatePropertyItemObjectResponse,
  FilesPropertyItemObjectResponse,
  FormulaPropertyItemObjectResponse,
  RelationPropertyItemObjectResponse,
  StatusPropertyItemObjectResponse,
  CheckboxPropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  EmailPropertyItemObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  CreatedByPropertyItemObjectResponse,
  CreatedTimePropertyItemObjectResponse,
  LastEditedByPropertyItemObjectResponse,
  LastEditedTimePropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
  PropertyItemObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';

type NotionFileBase = {
  name: string;
  caption?: RichTextItemResponse[];
  type: 'file' | 'external';
};

type ExternalFileWithCaption = NotionFileBase & {
  type: 'external';
  external: { url: string };
};

type InternalFileWithCaption = NotionFileBase & {
  type: 'file';
  file: { url: string; expiry_time: string };
};

type NotionPage = PageObjectResponse;
type NotionProperty = PropertyItemObjectResponse;
type NotionPropertyItem = PageObjectResponse['properties'][string];

// Type guards
function isTitleProperty(property: NotionProperty): property is TitlePropertyItemObjectResponse {
  return property.type === 'title' && 'object' in property && property.object === 'property_item';
}

function isRichTextProperty(property: NotionProperty): property is RichTextPropertyItemObjectResponse {
  return property.type === 'rich_text' && 'object' in property && property.object === 'property_item';
}

function isSelectProperty(property: NotionProperty): property is SelectPropertyItemObjectResponse {
  return property.type === 'select' && 'object' in property && property.object === 'property_item';
}

function isMultiSelectProperty(property: NotionProperty): property is MultiSelectPropertyItemObjectResponse {
  return property.type === 'multi_select' && 'object' in property && property.object === 'property_item';
}

function isUrlProperty(property: NotionProperty): property is UrlPropertyItemObjectResponse {
  return property.type === 'url' && 'object' in property && property.object === 'property_item';
}

function isEmailProperty(property: NotionProperty): property is EmailPropertyItemObjectResponse {
  return property.type === 'email' && 'object' in property && property.object === 'property_item';
}

function isPhoneNumberProperty(property: NotionProperty): property is PhoneNumberPropertyItemObjectResponse {
  return property.type === 'phone_number' && 'object' in property && property.object === 'property_item';
}

function isCheckboxProperty(property: NotionProperty): property is CheckboxPropertyItemObjectResponse {
  return property.type === 'checkbox' && 'object' in property && property.object === 'property_item';
}

function isNumberProperty(property: NotionProperty): property is NumberPropertyItemObjectResponse {
  return property.type === 'number' && 'object' in property && property.object === 'property_item';
}

function isFilesProperty(property: NotionProperty): property is FilesPropertyItemObjectResponse {
  return property.type === 'files' && 'object' in property && property.object === 'property_item';
}

function isRelationProperty(property: NotionProperty): property is RelationPropertyItemObjectResponse {
  return property.type === 'relation' && 'object' in property && property.object === 'property_item';
}

function isStatusProperty(property: NotionProperty): property is StatusPropertyItemObjectResponse {
  return property.type === 'status' && 'object' in property && property.object === 'property_item';
}

function isDateProperty(property: NotionProperty): property is DatePropertyItemObjectResponse {
  return property.type === 'date' && 'object' in property && property.object === 'property_item';
}

type NotionText = RichTextItemResponse;
type NotionFile = ExternalFileWithCaption | InternalFileWithCaption;

// Funciones auxiliares para type guards adicionales
function isCreatedByProperty(property: NotionProperty): property is CreatedByPropertyItemObjectResponse {
  return property.type === 'created_by' && 'object' in property && property.object === 'property_item';
}

function isCreatedTimeProperty(property: NotionProperty): property is CreatedTimePropertyItemObjectResponse {
  return property.type === 'created_time' && 'object' in property && property.object === 'property_item';
}

function isLastEditedByProperty(property: NotionProperty): property is LastEditedByPropertyItemObjectResponse {
  return property.type === 'last_edited_by' && 'object' in property && property.object === 'property_item';
}

function isLastEditedTimeProperty(property: NotionProperty): property is LastEditedTimePropertyItemObjectResponse {
  return property.type === 'last_edited_time' && 'object' in property && property.object === 'property_item';
}

function isFormulaProperty(property: NotionProperty): property is FormulaPropertyItemObjectResponse {
  return property.type === 'formula' && 'object' in property && property.object === 'property_item';
}

/**
 * Extrae el texto plano de una propiedad de Notion que devuelve un único valor
 */
export function extractText(property: PropertyItemObjectResponse | undefined): string {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      if (isTitleProperty(property)) {
        if (!Array.isArray(property.title) || property.title.length === 0) return '';
        const title = property.title[0];
        return title?.plain_text || '';
      }
      return '';
    case 'rich_text':
      if (isRichTextProperty(property)) {
        if (Array.isArray(property.rich_text)) {
          return property.rich_text.map(text => text.plain_text).join('\n');
        }
        return '';
      }
      return '';
    case 'select':
      if (isSelectProperty(property)) {
        return property.select?.name || '';
      }
      return '';
    case 'url':
      if (isUrlProperty(property)) {
        return property.url || '';
      }
      return '';
    case 'email':
      if (isEmailProperty(property)) {
        return property.email || '';
      }
      return '';
    case 'phone_number':
      if (isPhoneNumberProperty(property)) {
        return property.phone_number || '';
      }
      return '';
    case 'checkbox':
      if (isCheckboxProperty(property)) {
        return property.checkbox.toString();
      }
      return 'false';
    case 'number':
      if (isNumberProperty(property)) {
        return property.number?.toString() || '0';
      }
      return '0';
    case 'status':
      if (isStatusProperty(property)) {
        return property.status?.name || '';
      }
      return '';
    case 'date':
      if (isDateProperty(property)) {
        if (!property.date) return '';
        return property.date.start + (property.date.end ? ` - ${property.date.end}` : '');
      }
      return '';
    case 'formula':
      if (isFormulaProperty(property)) {
        const { formula } = property;
        switch (formula.type) {
          case 'string':
            return formula.string || '';
          case 'number':
            return formula.number !== null ? formula.number.toString() : '0';
          case 'boolean':
            return formula.boolean !== null ? formula.boolean.toString() : 'false';
          case 'date':
            if (!formula.date) return '';
            return formula.date.start + (formula.date.end ? ` - ${formula.date.end}` : '');
          default:
            return '';
        }
      }
      return '';
    case 'created_time':
      if (isCreatedTimeProperty(property)) {
        return property.created_time;
      }
      return '';
    case 'last_edited_time':
      if (isLastEditedTimeProperty(property)) {
        return property.last_edited_time;
      }
      return '';
    case 'created_by':
      if (isCreatedByProperty(property)) {
        return property.created_by?.id || '';
      }
      return '';
    case 'last_edited_by':
      if (isLastEditedByProperty(property)) {
        return property.last_edited_by?.id || '';
      }
      return '';
    default:
      return '';
  }
}

/**
 * Extrae un array de textos de una propiedad de Notion que devuelve múltiples valores
 */
function extractMultipleValues(property: PropertyItemObjectResponse | undefined): string[] {
  if (!property) return [];

  switch (property.type) {
    case 'multi_select':
      if (isMultiSelectProperty(property)) {
        return property.multi_select.map(item => item.name);
      }
      return [];
    case 'files':
      if (isFilesProperty(property)) {
        if (Array.isArray(property.files)) {
          return property.files.map((file: NotionFile) => {
            if (file.type === 'external' && file.external) {
              return file.external.url;
            } else if (file.type === 'file' && file.file) {
              return file.file.url;
            }
            return '';
          }).filter(Boolean);
        }
        return [];
      }
      return [];
    case 'relation':
      if (isRelationProperty(property)) {
        if (Array.isArray(property.relation)) {
          return property.relation.map(rel => rel.id);
        }
        return [];
      }
      return [];
    default:
      return [];
  }
}

/**
 * Convierte los archivos de Notion a nuestro formato MediaItem
 */
function transformMediaItems(files: NotionFile[] = []): MediaItem[] {
  return files
    .map((file, index) => {
      let url = '';
      
      if (file.type === 'external' && file.external) {
        url = file.external.url;
      } else if (file.type === 'file' && file.file) {
        url = file.file.url;
      }
      
      if (!url) return null;

      const type = determineMediaType(url);
      let caption = '';
      if (Array.isArray(file.caption) && file.caption.length > 0 && file.caption[0] && typeof file.caption[0].plain_text === 'string') {
        caption = file.caption[0].plain_text;
      }
        
      const item: MediaItem = {
        type,
        url,
        alt: caption || file.name || '',
        width: 0,
        height: 0,
        order: index,
        displayMode: 'single'
      };

      if (type === 'video') {
        const videoType = determineVideoType(url);
        item.videoType = videoType;
        item.thumbnailUrl = '';
        
        // Procesar URL de Vimeo si es necesario
        if (videoType === 'vimeo') {
          item.url = processVimeoUrl(url);
        }
      }

      return item;
    })
    .filter((item): item is MediaItem => item !== null);
}

/**
 * Determina el tipo de medio basado en la URL
 */
function determineMediaType(url: string): 'image' | 'video' {
  const extension = url.split('.').pop()?.toLowerCase();
  if (extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return 'image';
  }
  if (url.includes('vimeo.com')) {
    return 'video';
  }
  return 'image'; // Por defecto
}

/**
 * Determina el tipo de video
 */
function determineVideoType(url: string): 'vimeo' | 'local' {
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'local';
}

function processVimeoUrl(url: string): string {
  // Si ya es un embed, devolverlo tal cual
  if (url.includes('player.vimeo.com')) {
    return url;
  }
  
  // Convertir URL normal de Vimeo a URL de embed
  const vimeoId = url.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoId && vimeoId[1]) {
    return `https://player.vimeo.com/video/${vimeoId[1]}`;
  }
  
  return url;
}

/**
 * Transforma una página de Notion en nuestro formato CaseStudy
 */
export function transformNotionToCaseStudy(page: NotionPage): CaseStudy {
  const props = page.properties;
  
  // Función para convertir cualquier propiedad a PropertyItemObjectResponse
  const getPropertyItem = (propertyName: string): PropertyItemObjectResponse | undefined => {
    const prop = props[propertyName];
    if (!prop) return undefined;
    
    // Si ya tiene la estructura correcta, usarlo directamente
    if ('object' in prop && prop.object === 'property_item') {
      return prop as PropertyItemObjectResponse;
    }
    
    // Agregar la propiedad 'object' si falta
    return {
      ...prop,
      object: 'property_item'
    } as PropertyItemObjectResponse;
  };
  
  // Obtener las propiedades principales
  const brandNameProperty = getPropertyItem('Brand Name');
  const client = extractText(brandNameProperty) || '';
  
  if (!client) {
    throw new Error('El nombre de la marca es requerido');
  }
  
  // Obtener las propiedades de archivos
  let mediaItems: MediaItem[] = [];
  const imageProperties = [
    'Cover',
    'Avatar',
    'Hero Image',
    'Image [1]',
    'Image [2]',
    'Image [3]',
    'Image [4]',
    'Image [5]',
    'Image [6] ',
    'Image [7.1] square image',
    'Image [7.2] square image',
    'Image [8]',
    'Image [9]',
    'Image [10]',
    'Image [11]',
    'Image [12]'
  ];

  // Procesar todas las imágenes
  for (const propertyName of imageProperties) {
    const property = getPropertyItem(propertyName);
    if (property && isFilesProperty(property)) {
      const items = transformMediaItems(property.files as NotionFile[]);
      // Añadir el nombre de la propiedad como alt para identificar el tipo de imagen
      items.forEach(item => {
        item.alt = propertyName;
        // Marcar las imágenes de avatar
        if (propertyName === 'Avatar') {
          item.type = 'avatar';
        }
      });
      mediaItems.push(...items);
    }
  }
  
  // Obtener las URLs de videos
  const video1Property = getPropertyItem('Video 1');
  const video2Property = getPropertyItem('Video 2');
  
  if (video1Property && isUrlProperty(video1Property) && video1Property.url) {
    mediaItems.push({
      type: 'video',
      url: video1Property.url,
      videoType: determineVideoType(video1Property.url),
      alt: 'Video principal',
      width: 0,
      height: 0,
      order: mediaItems.length
    });
  }
  
  if (video2Property && isUrlProperty(video2Property) && video2Property.url) {
    mediaItems.push({
      type: 'video',
      url: video2Property.url,
      videoType: determineVideoType(video2Property.url),
      alt: 'Video secundario',
      width: 0,
      height: 0,
      order: mediaItems.length
    });
  }
  
  // Obtener propiedades de texto
  const descriptionProperty = getPropertyItem('Description');
  const taglineProperty = getPropertyItem('Tagline');
  const closingClaimProperty = getPropertyItem('Closing Claim');
  const servicesProperty = getPropertyItem('Services');
  const slugProperty = getPropertyItem('Slug');
  const websiteProperty = getPropertyItem('Website');
  
  // Obtener el estado desde Notion
  const statusProperty = getPropertyItem('Status');
  const notionStatus = statusProperty && isSelectProperty(statusProperty) && statusProperty.select
    ? statusProperty.select.name
    : 'Sin empezar';
  
  // Solo publicar los que no estén "Sin empezar"
  const status = notionStatus === 'Sin empezar' ? 'draft' : 'published';
  // Solo marcar como sincronizado si está publicado
  const synced = status === 'published';

  // Obtener si está destacado
  const highlightedProperty = getPropertyItem('Highlighted');
  const featured = highlightedProperty && isCheckboxProperty(highlightedProperty)
    ? highlightedProperty.checkbox
    : false;

  const caseStudy: CaseStudy = {
    id: page.id,
    title: client,
    client,
    description: extractText(descriptionProperty) || '',
    tagline: extractText(taglineProperty) || '',
    closingClaim: extractText(closingClaimProperty) || '',
    mediaItems,
    tags: extractMultipleValues(servicesProperty),
    order: 0,
    slug: extractText(slugProperty) || generateSlug(client),
    website: websiteProperty && isUrlProperty(websiteProperty) ? websiteProperty.url || undefined : undefined,
    status,
    featured,
    featuredOrder: 0,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    synced
  };
  
  return caseStudy;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Transforma nuestro formato CaseStudy a propiedades de Notion
 */
const createRichText = (content: string = '') => ({
  rich_text: [{ text: { content } }]
});

export function transformCaseStudyToNotion(caseStudy: Partial<CaseStudy>): NonNullable<UpdatePageParameters['properties']> {
  const properties: UpdatePageParameters['properties'] = {
    'Brand Name': {
      type: 'title',
      title: [{ text: { content: caseStudy.title || '' } }]
    }
  };

  if (caseStudy.description) {
    properties['Description'] = {
      type: 'rich_text',
      rich_text: [{ text: { content: caseStudy.description } }]
    };
  }

  if (caseStudy.tagline) {
    properties['Tagline'] = {
      type: 'rich_text',
      rich_text: [{ text: { content: caseStudy.tagline } }]
    };
  }

  if (caseStudy.closingClaim) {
    properties['Closing Claim'] = {
      type: 'rich_text',
      rich_text: [{ text: { content: caseStudy.closingClaim } }]
    };
  }

  if (caseStudy.tags) {
    properties['Services'] = {
      type: 'multi_select',
      multi_select: caseStudy.tags.map(service => ({ name: service }))
    };
  }

  if (caseStudy.slug) {
    properties['Slug'] = {
      type: 'rich_text',
      rich_text: [{ text: { content: caseStudy.slug } }]
    };
  }

  if (caseStudy.website) {
    properties['Website'] = {
      type: 'url',
      url: caseStudy.website
    };
  }

  // Convertir el estado de la aplicación al estado de Notion
  const notionStatus = caseStudy.status === 'published' ? 'En progreso' : 'Sin empezar';
  properties['Status'] = {
    type: 'select',
    select: {
      name: notionStatus
    }
  };

  return properties;
}
