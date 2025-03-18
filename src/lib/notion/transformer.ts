import { CaseStudy, MediaItem } from '@/types/case-study';
import type {
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
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
 * Extrae el texto plano de una propiedad rich_text o title de Notion
 */
function extractText(property: PropertyItemObjectResponse | undefined): string | string[] {
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
    case 'multi_select':
      if (isMultiSelectProperty(property)) {
        return property.multi_select.map((item: { name: string }) => item.name);
      }
      return [];
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
          }).filter(Boolean).join(', ');
        }
        return '';
      }
      return '';
    case 'relation':
      if (isRelationProperty(property)) {
        if (Array.isArray(property.relation)) {
          return property.relation.map(rel => rel.id);
        }
        return [];
      }
      return [];
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
        item.videoType = determineVideoType(url) || 'vimeo';
        item.thumbnailUrl = '';
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
function determineVideoType(url: string): 'vimeo' | 'local' | undefined {
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return undefined;
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
  const nameProperty = getPropertyItem('Name');
  const clientProperty = getPropertyItem('Client');
  const title = extractText(nameProperty);
  const client = extractText(clientProperty);
  
  if (!title || !client) {
    throw new Error('Título y cliente son requeridos');
  }
  
  // Validar y convertir tipos para las propiedades necesarias
  let mediaItems: MediaItem[] = [];
  const mediaItemsProperty = getPropertyItem('Media Items');
  if (mediaItemsProperty && isFilesProperty(mediaItemsProperty)) {
    mediaItems = transformMediaItems(mediaItemsProperty.files as NotionFile[]);
  }
  
  const descriptionProperty = getPropertyItem('Description');
  const fullDescriptionProperty = getPropertyItem('Full Description');
  const tagsProperty = getPropertyItem('Tags');
  const orderProperty = getPropertyItem('Order');
  const slugProperty = getPropertyItem('Slug');
  const statusProperty = getPropertyItem('Status');
  const featuredProperty = getPropertyItem('Featured');
  const featuredOrderProperty = getPropertyItem('Featured Order');
  const nextProjectProperty = getPropertyItem('Next Project');
  
  const caseStudy: CaseStudy = {
    id: page.id,
    title: title as string,
    client: client as string,
    description: descriptionProperty ? (extractText(descriptionProperty) as string) || '' : '',
    description2: fullDescriptionProperty ? (extractText(fullDescriptionProperty) as string) || '' : '',
    mediaItems,
    tags: tagsProperty && Array.isArray(extractText(tagsProperty)) 
      ? extractText(tagsProperty) as string[]
      : [],
    order: orderProperty ? Number(extractText(orderProperty)) || 0 : 0,
    slug: slugProperty ? (extractText(slugProperty) as string) || generateSlug(title as string) : generateSlug(title as string),
    status: statusProperty ? ((extractText(statusProperty) as string) || 'draft') as 'draft' | 'published' : 'draft',
    featured: featuredProperty && isCheckboxProperty(featuredProperty) ? featuredProperty.checkbox : false,
    featuredOrder: featuredOrderProperty && isNumberProperty(featuredOrderProperty) ? featuredOrderProperty.number || 0 : 0,
    createdAt: page.created_time || new Date().toISOString(),
    updatedAt: page.last_edited_time || new Date().toISOString(),
  };
  
  if (nextProjectProperty && isRelationProperty(nextProjectProperty) && Array.isArray(nextProjectProperty.relation) && nextProjectProperty.relation.length > 0) {
    caseStudy.nextProject = { slug: nextProjectProperty.relation[0].id };
  }
  
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

export function transformCaseStudyToNotion(caseStudy: Partial<CaseStudy>) {
  return {
    Name: {
      title: [{ text: { content: caseStudy.title || '' } }]
    },
    Client: createRichText(caseStudy.client),
    Description: createRichText(caseStudy.description),
    'Full Description': createRichText(caseStudy.description2),
    Slug: createRichText(caseStudy.slug),
    Status: {
      select: { name: caseStudy.status || 'draft' }
    },
    Tags: {
      multi_select: (caseStudy.tags || []).map(tag => ({ name: tag }))
    },
    Order: {
      number: caseStudy.order || 0
    },
    Featured: {
      checkbox: caseStudy.featured || false
    },
    'Featured Order': {
      number: caseStudy.featuredOrder || 0
    }
  };
}
