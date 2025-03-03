/**
 * Field Mapper V3 - Types for landing page structure
 * 
 * Este archivo define los tipos para el Field Mapper V3 con un enfoque
 * específico para landing pages de Case Studies, siguiendo la estructura
 * definida por el diseño y usando un enfoque de mapeo directo entre 
 * assets de Notion y la estructura de la landing.
 */

// Tipo para los campos de un componente
export type ComponentField = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
};

// Tipo para los componentes predefinidos de la página
export type PageComponent = {
  id: string;
  name: string;
  description: string;
  fields: ComponentField[];
  icon?: string;
};

// Tipo para los assets disponibles en Notion
export type NotionComponent = {
  id: string;
  name: string;
  type: string;
  fields: ComponentField[];
  icon?: string;
};

// Opciones para la transformación de campos
export type TransformationOptions = {
  format?: string;
  separator?: string;
  currency?: string;
  defaultValue?: any;
  locale?: string;
  [key: string]: any;
};

// Tipo para el mapeo entre componentes
export type ComponentMapping = {
  id: string;
  pageComponentId: string;
  notionComponentId: string;
  fieldMappings: {
    pageFieldId: string;
    notionFieldId: string;
    transformation?: string;
    transformationOptions?: TransformationOptions;
  }[];
  isValid?: boolean;
  validationMessage?: string;
};

// Componentes predefinidos para landing pages de Case Studies
export const CASE_STUDY_COMPONENTS: PageComponent[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    description: "Sección principal con imagen o video destacado y contenido de texto",
    fields: [
      { id: "featured-media", name: "Imagen o video", type: "image", required: true, description: "Imagen o video principal en formato 16:9" },
      { id: "project-name", name: "Nombre del proyecto", type: "text", required: true, description: "Título principal del proyecto" },
      { id: "tagline", name: "Tagline", type: "text", required: true, description: "Frase descriptiva corta" },
      { id: "description", name: "Descripción", type: "rich_text", required: true, description: "Breve descripción del proyecto" },
      { id: "services", name: "Servicios", type: "multi_select", required: true, description: "Lista de servicios prestados" }
    ],
    icon: "layout"
  },
  {
    id: "gallery",
    name: "Gallery",
    description: "Galería de imágenes o videos en formato 16:9",
    fields: [
      { id: "media-items", name: "Elementos multimedia", type: "files", required: true, description: "Colección de imágenes o videos en formato 16:9" },
      { id: "captions", name: "Textos descriptivos", type: "rich_text", required: false, description: "Descripciones para cada elemento multimedia" }
    ],
    icon: "image"
  },
  {
    id: "content-section",
    name: "Sección de contenido",
    description: "Sección de contenido con título y texto enriquecido",
    fields: [
      { id: "section-title", name: "Título de sección", type: "text", required: true, description: "Título de la sección" },
      { id: "content", name: "Contenido", type: "rich_text", required: true, description: "Contenido principal en formato enriquecido" },
      { id: "media", name: "Imagen o video", type: "files", required: false, description: "Elemento multimedia opcional" }
    ],
    icon: "info"
  },
  {
    id: "testimonial",
    name: "Testimonial",
    description: "Testimonio de cliente con cita, nombre y cargo",
    fields: [
      { id: "quote", name: "Cita", type: "rich_text", required: true, description: "Texto del testimonio" },
      { id: "author", name: "Autor", type: "text", required: true, description: "Nombre de la persona" },
      { id: "position", name: "Cargo", type: "text", required: true, description: "Cargo o posición" },
      { id: "company", name: "Empresa", type: "text", required: false, description: "Empresa u organización" },
      { id: "avatar", name: "Avatar", type: "image", required: false, description: "Foto de la persona" }
    ],
    icon: "flag"
  },
  {
    id: "stats-section",
    name: "Sección de estadísticas",
    description: "Sección con métricas y estadísticas clave",
    fields: [
      { id: "title", name: "Título", type: "text", required: false, description: "Título opcional de la sección" },
      { id: "stats", name: "Estadísticas", type: "list", required: true, description: "Lista de estadísticas clave" }
    ],
    icon: "chart"
  },
  {
    id: "related-projects",
    name: "Proyectos relacionados",
    description: "Carrusel de proyectos relacionados",
    fields: [
      { id: "title", name: "Título", type: "text", required: false, description: "Título de la sección" },
      { id: "projects", name: "Proyectos", type: "relation", required: true, description: "Relación a otros proyectos" },
      { id: "thumbnails", name: "Miniaturas", type: "files", required: false, description: "Imágenes para cada proyecto relacionado" }
    ],
    icon: "link"
  },
  {
    id: "cta-section",
    name: "Llamada a la acción",
    description: "Sección final con llamada a la acción",
    fields: [
      { id: "heading", name: "Encabezado", type: "text", required: true, description: "Título de la llamada a la acción" },
      { id: "description", name: "Descripción", type: "rich_text", required: false, description: "Texto descriptivo" },
      { id: "button-text", name: "Texto del botón", type: "text", required: true, description: "Texto para el botón CTA" },
      { id: "button-url", name: "URL del botón", type: "url", required: true, description: "Enlace para el botón CTA" }
    ],
    icon: "pointer"
  }
];
