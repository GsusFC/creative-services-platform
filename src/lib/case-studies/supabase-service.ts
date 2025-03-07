import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase';
import { CaseStudy, MediaItem, FeaturedCaseUpdate } from '@/types/case-study';

/**
 * Obtener todos los case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      mediaItems: media_items(*)
    `)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error al obtener los case studies:', error);
    throw error;
  }

  // Transformar los datos para que coincidan con nuestro tipo CaseStudy
  return data.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    client: item.client,
    description: item.description,
    description2: item.description2 || '',
    mediaItems: convertMediaItems(item.mediaItems || []),
    tags: item.tags ? item.tags.split(',') : [],
    order: item.order,
    status: item.status as 'draft' | 'published',
    featured: item.featured,
    featuredOrder: item.featured_order,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
}

/**
 * Obtener un case study por su slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      mediaItems: media_items(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Error cuando no encuentra registro
      return null;
    }
    console.error('Error al obtener el case study:', error);
    throw error;
  }

  if (!data) return null;

  // Transformar el resultado a nuestro tipo CaseStudy
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    client: data.client,
    description: data.description,
    description2: data.description2 || '',
    mediaItems: convertMediaItems(data.mediaItems || []),
    tags: data.tags ? data.tags.split(',') : [],
    order: data.order,
    status: data.status as 'draft' | 'published',
    featured: data.featured,
    featuredOrder: data.featured_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Crear un nuevo case study
 */
export async function createCaseStudy(caseStudyData: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
  // Preparar los datos para Supabase
  const supabaseData = {
    title: caseStudyData.title,
    slug: caseStudyData.slug || `case-study-${uuidv4().substring(0, 8)}`,
    client: caseStudyData.client,
    description: caseStudyData.description,
    description2: caseStudyData.description2 || '',
    tags: Array.isArray(caseStudyData.tags) ? caseStudyData.tags.join(',') : '',
    order: caseStudyData.order || 0,
    status: caseStudyData.status || 'draft',
    featured: caseStudyData.featured || false,
    featured_order: caseStudyData.featuredOrder || 999,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Insertar en Supabase
  const { data, error } = await supabase
    .from('case_studies')
    .insert(supabaseData)
    .select()
    .single();

  if (error) {
    console.error('Error al crear el case study:', error);
    throw error;
  }

  // Manejar media items si existen
  const mediaItems = caseStudyData.mediaItems || [];
  if (mediaItems.length > 0) {
    await insertMediaItems(mediaItems, data.id);
  }

  // Obtener el registro completo con media items
  return getCaseStudyBySlug(data.slug) as Promise<CaseStudy>;
}

/**
 * Actualizar un case study existente
 */
export async function updateCaseStudy(id: string, caseStudyData: Partial<CaseStudy>): Promise<CaseStudy> {
  // Preparar los datos para Supabase
  const supabaseData: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  // Incluir solo los campos que están siendo actualizados
  if (caseStudyData.title !== undefined) supabaseData.title = caseStudyData.title;
  if (caseStudyData.slug !== undefined) supabaseData.slug = caseStudyData.slug;
  if (caseStudyData.client !== undefined) supabaseData.client = caseStudyData.client;
  if (caseStudyData.description !== undefined) supabaseData.description = caseStudyData.description;
  if (caseStudyData.description2 !== undefined) supabaseData.description2 = caseStudyData.description2;
  if (caseStudyData.tags !== undefined) {
    supabaseData.tags = Array.isArray(caseStudyData.tags) ? caseStudyData.tags.join(',') : '';
  }
  if (caseStudyData.order !== undefined) supabaseData.order = caseStudyData.order;
  if (caseStudyData.status !== undefined) supabaseData.status = caseStudyData.status;
  if (caseStudyData.featured !== undefined) supabaseData.featured = caseStudyData.featured;
  if (caseStudyData.featuredOrder !== undefined) supabaseData.featured_order = caseStudyData.featuredOrder;

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('case_studies')
    .update(supabaseData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar el case study:', error);
    throw error;
  }

  // Si se proporcionaron media items, actualizar también
  if (caseStudyData.mediaItems) {
    await updateMediaItems(caseStudyData.mediaItems, id);
  }

  // Obtener el registro actualizado con media items
  return getCaseStudyBySlug(data.slug) as Promise<CaseStudy>;
}

/**
 * Eliminar un case study
 */
export async function deleteCaseStudy(id: string): Promise<void> {
  // Primero eliminar los media items asociados
  const { error: mediaError } = await supabase
    .from('media_items')
    .delete()
    .eq('case_study_id', id);

  if (mediaError) {
    console.error('Error al eliminar los media items:', mediaError);
    throw mediaError;
  }

  // Luego eliminar el case study
  const { error } = await supabase
    .from('case_studies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar el case study:', error);
    throw error;
  }
}

/**
 * Actualizar el estado de destacado de los case studies
 */
export async function updateFeaturedCaseStudies(updates: FeaturedCaseUpdate[]): Promise<void> {
  // Usamos una transacción para actualizar todos los registros
  for (const update of updates) {
    const { error } = await supabase
      .from('case_studies')
      .update({
        featured: update.featured,
        featured_order: update.featuredOrder,
        updated_at: new Date().toISOString()
      })
      .eq('id', update.id);

    if (error) {
      console.error(`Error al actualizar el estado destacado del case study ${update.id}:`, error);
      throw error;
    }
  }
}

/**
 * Obtener los case studies destacados
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      mediaItems: media_items(*)
    `)
    .eq('featured', true)
    .eq('status', 'published')
    .order('featured_order', { ascending: true });

  if (error) {
    console.error('Error al obtener los case studies destacados:', error);
    throw error;
  }

  // Transformar los datos
  return data.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    client: item.client,
    description: item.description,
    description2: item.description2 || '',
    mediaItems: convertMediaItems(item.mediaItems || []),
    tags: item.tags ? item.tags.split(',') : [],
    order: item.order,
    status: item.status as 'draft' | 'published',
    featured: item.featured,
    featuredOrder: item.featured_order,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
}

/**
 * Convierte los media items de Supabase al formato de MediaItem
 */
// Definimos la estructura que tienen los media items en Supabase
interface SupabaseMediaItem {
  id: string;
  type: string;
  url: string;
  video_type: string | null;
  thumbnail_url: string | null;
  alt: string;
  width: number;
  height: number;
  order: number;
  display_mode: string | null;
  case_study_id: string;
  created_at: string;
  updated_at: string;
}

function convertMediaItems(items: SupabaseMediaItem[]): MediaItem[] {
  return items.map(item => ({
    // Aseguramos que type sea 'image' o 'video'
    type: item.type === 'video' ? 'video' : 'image',
    url: item.url,
    // Convertimos videoType al tipo esperado
    videoType: item.video_type === 'vimeo' || item.video_type === 'local' 
      ? item.video_type as 'vimeo' | 'local'
      : undefined,
    thumbnailUrl: item.thumbnail_url || undefined,
    alt: item.alt || '',
    width: item.width,
    height: item.height,
    order: item.order,
    // Convertimos displayMode al tipo esperado
    displayMode: item.display_mode && ['single', 'dual', 'dual_left', 'dual_right'].includes(item.display_mode)
      ? item.display_mode as 'single' | 'dual' | 'dual_left' | 'dual_right'
      : 'single'
  }));
}

// Funciones auxiliares para manejar media items

/**
 * Insertar media items para un case study
 */
async function insertMediaItems(mediaItems: MediaItem[], caseStudyId: string): Promise<void> {
  const formattedItems = mediaItems.map((item, index) => ({
    type: item.type,
    url: item.url,
    video_type: item.videoType || null,
    thumbnail_url: item.thumbnailUrl || null,
    alt: item.alt || '',
    width: item.width || 1200,
    height: item.height || 800,
    order: item.order !== undefined ? item.order : index,
    display_mode: item.displayMode || 'single',
    case_study_id: caseStudyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('media_items')
    .insert(formattedItems);

  if (error) {
    console.error('Error al insertar media items:', error);
    throw error;
  }
}

/**
 * Actualizar media items de un case study
 */
async function updateMediaItems(mediaItems: MediaItem[], caseStudyId: string): Promise<void> {
  // Primero eliminamos todos los media items existentes
  const { error: deleteError } = await supabase
    .from('media_items')
    .delete()
    .eq('case_study_id', caseStudyId);

  if (deleteError) {
    console.error('Error al eliminar media items antiguos:', deleteError);
    throw deleteError;
  }

  // Luego insertamos los nuevos
  if (mediaItems.length > 0) {
    await insertMediaItems(mediaItems, caseStudyId);
  }
}
