'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { CaseStudy, MediaItem } from '@/types/case-study'

// Definición de rutas para el nuevo sistema de almacenamiento
const DATA_DIR = path.join(process.cwd(), 'data')
const CASE_STUDIES_DIR = path.join(DATA_DIR, 'case-studies')
const INDEX_FILE = path.join(DATA_DIR, 'case-studies-index.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'case-studies')

// Archivo legacy para compatibilidad durante la migración
const LEGACY_CASE_STUDIES_FILE = path.join(DATA_DIR, 'case-studies.json')

// Interfaz para el índice de case studies
export interface CaseStudyIndex {
  // Campos de identificación
  id: string;
  slug: string;
  
  // Campos de visualización básicos
  title: string;
  client: string;
  tagline: string;
  description: string;
  
  // Campos para listados y filtros
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  featuredOrder: number;
  order: number;
  
  // Campos de metadatos
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  
  // Referencia a la imagen principal (para listados)
  coverImage?: string | undefined;
}

/**
 * Asegura que existan los directorios necesarios para el almacenamiento
 */
export async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(CASE_STUDIES_DIR, { recursive: true })
  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  
  // Crear índice si no existe
  try {
    await fs.access(INDEX_FILE)
  } catch {
    await fs.writeFile(INDEX_FILE, JSON.stringify([], null, 2))
  }
}

/**
 * Guarda un case study en su propio archivo JSON y actualiza el índice
 */
export async function saveCaseStudy(study: CaseStudy) {
  await ensureDirectories()
  
  // Crear directorio para archivos multimedia
  const studyDir = path.join(PUBLIC_DIR, study.slug)
  await fs.mkdir(studyDir, { recursive: true })

  // Guardar el case study en su propio archivo JSON
  const studyFile = path.join(CASE_STUDIES_DIR, `${study.id}.json`)
  await fs.writeFile(studyFile, JSON.stringify(study, null, 2))
  
  // Actualizar el índice
  await updateIndex(study)

  return study
}

/**
 * Actualiza la entrada del case study en el índice
 */
async function updateIndex(study: CaseStudy) {
  // Leer el índice actual
  let index: CaseStudyIndex[] = []
  try {
    const content = await fs.readFile(INDEX_FILE, 'utf-8')
    index = JSON.parse(content)
  } catch (error) {
    // Si el archivo no existe, empezamos con un array vacío
  }
  
  // Encontrar la imagen de portada para el listado
  let coverImage: string | undefined = undefined
  const coverItem = study.mediaItems.find(item => 
    item.type === 'image' && (item.role === 'cover' || item.role === 'hero')
  )
  if (coverItem) {
    coverImage = coverItem.url
  }
  
  // Crear entrada de índice con todos los datos necesarios para listados
  const indexEntry: CaseStudyIndex = {
    id: study.id,
    slug: study.slug,
    title: study.title,
    client: study.client,
    tagline: study.tagline,
    description: study.description,
    tags: study.tags,
    status: study.status,
    featured: study.featured,
    featuredOrder: study.featuredOrder,
    order: study.order,
    createdAt: study.createdAt,
    updatedAt: study.updatedAt,
    synced: study.synced || false,
    coverImage
  }
  
  // Actualizar o añadir al índice
  const existingIndex = index.findIndex(item => item.id === study.id)
  if (existingIndex !== -1) {
    index[existingIndex] = indexEntry
  } else {
    index.push(indexEntry)
  }
  
  // Guardar el índice actualizado
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2))
}

/**
 * Guarda un archivo multimedia y devuelve su URL pública
 */
export async function saveMediaFile(slug: string, filename: string, buffer: Buffer) {
  await ensureDirectories()
  
  const studyDir = path.join(PUBLIC_DIR, slug)
  await fs.mkdir(studyDir, { recursive: true })
  
  const filePath = path.join(studyDir, filename)
  await fs.writeFile(filePath, buffer)
  
  return `/case-studies/${slug}/${filename}`
}

/**
 * Obtiene el índice completo de case studies
 */
export async function getCaseStudyIndex(): Promise<CaseStudyIndex[]> {
  await ensureDirectories()
  
  try {
    const content = await fs.readFile(INDEX_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return []
  }
}

/**
 * Obtiene todos los case studies (versión completa)
 */
export async function getAllLocalStudies(): Promise<CaseStudy[]> {
  try {
    // Leer el índice
    const index = await getCaseStudyIndex()
    
    // Leer todos los archivos en paralelo para mejor rendimiento
    const studiesPromises = index.map(entry => getLocalStudy(entry.id))
    const studies = await Promise.all(studiesPromises)
    
    // Filtrar posibles nulls y ordenar
    return studies
      .filter((study): study is CaseStudy => study !== null)
      .sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error al obtener todos los case studies:', error)
    return []
  }
}

/**
 * Obtiene todos los case studies (versión ligera para listados)
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return getAllLocalStudies();
}

export async function getAllCaseStudiesLight(): Promise<CaseStudyIndex[]> {
  const index = await getCaseStudyIndex()
  return index.sort((a, b) => a.order - b.order)
}

/**
 * Obtiene un case study por su ID
 */
export async function getLocalStudy(id: string): Promise<CaseStudy | null> {
  try {
    const studyFile = path.join(CASE_STUDIES_DIR, `${id}.json`)
    const content = await fs.readFile(studyFile, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    // Intentar buscar en el archivo legacy si existe
    try {
      const legacyStudies = await getLegacyStudies()
      return legacyStudies.find(study => study.id === id) || null
    } catch {
      return null
    }
  }
}

/**
 * Obtiene un case study por su slug
 */
export async function getLocalStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    console.log('getLocalStudyBySlug - Buscando slug:', slug)
    // Leer el índice para encontrar el ID correspondiente al slug
    const index = await getCaseStudyIndex()
    console.log('getLocalStudyBySlug - Índice cargado, entradas:', index.length)
    const entry = index.find(item => item.slug === slug)
    console.log('getLocalStudyBySlug - Entrada encontrada en índice:', entry?.id)
    
    if (entry) {
      // Obtener el case study completo usando el ID
      return getLocalStudy(entry.id)
    }
    
    // Si no se encuentra en el índice, intentar en el archivo legacy
    console.log('getLocalStudyBySlug - Buscando en archivo legacy')
    const legacyStudies = await getLegacyStudies()
    const legacyStudy = legacyStudies.find(study => study.slug === slug)
    console.log('getLocalStudyBySlug - Estudio encontrado en legacy:', {
      found: !!legacyStudy,
      title: legacyStudy?.title,
      tagline: legacyStudy?.tagline
    })
    return legacyStudy || null
  } catch (error) {
    console.error(`Error al buscar case study con slug ${slug}:`, error)
    return null
  }
}

/**
 * Obtiene los case studies destacados (versión completa)
 */
export async function getFeaturedLocalStudies(): Promise<CaseStudy[]> {
  try {
    // Usar el índice para filtrar solo los featured
    const index = await getCaseStudyIndex()
    const featuredEntries = index
      .filter(entry => entry.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
    
    // Cargar solo los case studies destacados
    const studiesPromises = featuredEntries.map(entry => getLocalStudy(entry.id))
    const studies = await Promise.all(studiesPromises)
    
    return studies.filter((study): study is CaseStudy => study !== null)
  } catch (error) {
    console.error('Error al obtener case studies destacados:', error)
    return []
  }
}

/**
 * Obtiene los case studies destacados (versión ligera para listados)
 */
export async function getFeaturedCaseStudiesLight(): Promise<CaseStudyIndex[]> {
  const index = await getCaseStudyIndex()
  return index
    .filter(entry => entry.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
}

/**
 * Busca case studies por tag (versión ligera)
 */
export async function getCaseStudiesByTag(tag: string): Promise<CaseStudyIndex[]> {
  const index = await getCaseStudyIndex()
  return index
    .filter(entry => entry.tags.includes(tag) && entry.status === 'published')
    .sort((a, b) => a.order - b.order)
}

/**
 * Función auxiliar para obtener los case studies del archivo legacy
 * Solo se usa durante la migración
 */
async function getLegacyStudies(): Promise<CaseStudy[]> {
  try {
    console.log('getLegacyStudies - Intentando leer archivo:', LEGACY_CASE_STUDIES_FILE)
    const content = await fs.readFile(LEGACY_CASE_STUDIES_FILE, 'utf-8')
    const studies = JSON.parse(content)
    console.log('getLegacyStudies - Estudios encontrados:', studies.length)
    const buildStudy = studies.find((s: CaseStudy) => s.slug === 'build')
    console.log('getLegacyStudies - Build study:', buildStudy ? {
      title: buildStudy.title,
      tagline: buildStudy.tagline,
      status: buildStudy.status
    } : 'No encontrado')
    return studies
  } catch (error) {
    return []
  }
}

/**
 * Migra los case studies del formato antiguo (un solo JSON) al nuevo formato (JSON individuales + índice)
 */
export async function migrateToIndividualFiles(): Promise<boolean> {
  // Asegurar que existen los directorios necesarios
  await ensureDirectories()
  
  try {
    // Leer el JSON actual con todos los case studies
    const oldFilePath = LEGACY_CASE_STUDIES_FILE
    const content = await fs.readFile(oldFilePath, 'utf-8')
    const allStudies: CaseStudy[] = JSON.parse(content)
    
    console.log(`Migrando ${allStudies.length} case studies a archivos individuales...`)
    
    // Crear el índice
    const index: CaseStudyIndex[] = []
    
    // Guardar cada case study en su propio archivo
    for (const study of allStudies) {
      const studyFile = path.join(CASE_STUDIES_DIR, `${study.id}.json`)
      await fs.writeFile(studyFile, JSON.stringify(study, null, 2))
      
      // Actualizar el índice
      await updateIndex(study)
      
      console.log(`Migrado: ${study.title} (${study.id})`)
    }
    
    // Crear un backup del archivo original
    const backupPath = path.join(DATA_DIR, 'case-studies.json.bak')
    await fs.copyFile(oldFilePath, backupPath)
    
    console.log(`Migración completada. Backup guardado en ${backupPath}`)
    return true
  } catch (error) {
    console.error('Error durante la migración:', error)
    return false
  }
}
