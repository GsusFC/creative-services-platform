/**
 * API para Field Mapper V3
 * 
 * Este archivo proporciona funciones para cargar y guardar la estructura
 * de componentes de Notion y los mappings de la versión 3 del Field Mapper.
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import { NotionComponent, ComponentMapping } from './v3-types'

// Función para cargar la estructura de componentes de Notion
export async function fetchNotionStructure(): Promise<NotionComponent[]> {
  const response = await fetch('/api/notion/component-structure')
  
  if (!response.ok) {
    throw new Error('Error al cargar la estructura de componentes de Notion')
  }
  
  return response.json()
}

// Función para cargar los mappings guardados
export async function fetchComponentMappings(): Promise<ComponentMapping[]> {
  const response = await fetch('/api/notion/component-mappings')
  
  if (!response.ok) {
    throw new Error('Error al cargar los mappings de componentes')
  }
  
  return response.json()
}

// Función para guardar los mappings
export async function saveComponentMappings(mappings: ComponentMapping[]): Promise<void> {
  const response = await fetch('/api/notion/component-mappings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mappings),
  })
  
  if (!response.ok) {
    throw new Error('Error al guardar los mappings de componentes')
  }
}

// Hook para cargar la estructura de componentes de Notion
export function useNotionStructure() {
  return useQuery({
    queryKey: ['notionComponentStructure'],
    queryFn: fetchNotionStructure,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para cargar los mappings guardados
export function useComponentMappings() {
  return useQuery({
    queryKey: ['componentMappings'],
    queryFn: fetchComponentMappings,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para guardar los mappings
export function useSaveComponentMappings() {
  return useMutation({
    mutationFn: saveComponentMappings,
  })
}
