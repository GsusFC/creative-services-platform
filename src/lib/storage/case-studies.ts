'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { CaseStudy } from '@/types/case-study'

const DATA_DIR = path.join(process.cwd(), 'data')
const CASE_STUDIES_FILE = path.join(DATA_DIR, 'case-studies.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'case-studies')

export async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(PUBLIC_DIR, { recursive: true })
}

export async function saveCaseStudy(study: CaseStudy) {
  await ensureDirectories()
  
  // Crear directorio para el case study
  const studyDir = path.join(PUBLIC_DIR, study.slug)
  await fs.mkdir(studyDir, { recursive: true })

  // Guardar o actualizar en el JSON
  let studies: CaseStudy[] = []
  try {
    const content = await fs.readFile(CASE_STUDIES_FILE, 'utf-8')
    studies = JSON.parse(content)
  } catch (error) {
    // Si el archivo no existe, empezamos con un array vacío
  }

  // Actualizar o añadir el estudio
  const index = studies.findIndex(s => s.id === study.id)
  if (index !== -1) {
    studies[index] = study
  } else {
    studies.push(study)
  }

  // Guardar el JSON actualizado
  await fs.writeFile(CASE_STUDIES_FILE, JSON.stringify(studies, null, 2))

  return study
}

export async function saveMediaFile(slug: string, filename: string, buffer: Buffer) {
  await ensureDirectories()
  
  const studyDir = path.join(PUBLIC_DIR, slug)
  await fs.mkdir(studyDir, { recursive: true })
  
  const filePath = path.join(studyDir, filename)
  await fs.writeFile(filePath, buffer)
  
  return `/case-studies/${slug}/${filename}`
}

export async function getAllLocalStudies(): Promise<CaseStudy[]> {
  try {
    const content = await fs.readFile(CASE_STUDIES_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return []
  }
}

export async function getLocalStudy(id: string): Promise<CaseStudy | null> {
  const studies = await getAllLocalStudies()
  return studies.find(study => study.id === id) || null
}
