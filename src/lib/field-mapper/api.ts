/**
 * Field Mapper API
 * 
 * This module provides optimized API functions for the Field Mapper with:
 * - Proper error handling
 * - Timeouts for all API calls
 * - React Query integration for caching and retry
 */

import { FieldMapping } from './store';
import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';

// Type definitions
export interface NotionField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export interface WebsiteField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

// Default timeout value in milliseconds
const DEFAULT_TIMEOUT = 15000;

/**
 * Generic fetch function with timeout
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch Notion database structure
 */
export async function fetchNotionDatabaseStructure() {
  try {
    console.log('Fetching Notion database structure...');
    const data = await fetchWithTimeout('/api/notion/database/structure');
    console.log(`Fetched ${data.properties?.length || 0} Notion properties`);
    return data.properties as NotionField[];
  } catch (error) {
    console.error('Error fetching Notion database structure:', error);
    throw new Error(`Failed to fetch Notion fields: ${(error as Error).message}`);
  }
}

/**
 * Fetch saved mappings
 */
export async function fetchMappings() {
  try {
    console.log('Fetching saved mappings...');
    const data = await fetchWithTimeout('/api/notion/mappings');
    console.log(`Fetched ${data.length || 0} saved mappings`);
    return data as FieldMapping[];
  } catch (error) {
    console.error('Error fetching mappings:', error);
    throw new Error(`Failed to fetch mappings: ${(error as Error).message}`);
  }
}

/**
 * Save mappings
 */
export async function saveMappings(mappings: FieldMapping[]) {
  try {
    console.log(`Saving ${mappings.length} mappings...`);
    const response = await fetchWithTimeout('/api/notion/mappings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mappings),
    });
    console.log('Mappings saved successfully');
    return response;
  } catch (error) {
    console.error('Error saving mappings:', error);
    throw new Error(`Failed to save mappings: ${(error as Error).message}`);
  }
}

/**
 * Test mappings with a sample Notion page
 */
export async function testMappings(mappings: FieldMapping[]) {
  try {
    console.log(`Testing ${mappings.length} mappings...`);
    const response = await fetchWithTimeout('/api/notion/test-mapping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mappings),
    }, 20000); // Longer timeout for testing
    
    console.log('Mapping test completed');
    return response;
  } catch (error) {
    console.error('Error testing mappings:', error);
    throw new Error(`Failed to test mappings: ${(error as Error).message}`);
  }
}

/**
 * React Query hooks
 */

// Hook for fetching Notion database structure
export function useNotionFields(options?: UseQueryOptions<NotionField[], Error>) {
  return useQuery({
    queryKey: ['notionFields'],
    queryFn: fetchNotionDatabaseStructure,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options
  });
}

// Hook for fetching saved mappings
export function useMappings(options?: UseQueryOptions<FieldMapping[], Error>) {
  return useQuery({
    queryKey: ['mappings'],
    queryFn: fetchMappings,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    ...options
  });
}

// Hook for saving mappings
export function useSaveMappings() {
  return useMutation({
    mutationFn: saveMappings,
    onError: (error) => {
      console.error('Error saving mappings:', error);
    }
  });
}

// Hook for testing mappings
export function useTestMappings() {
  return useMutation({
    mutationFn: testMappings,
    onError: (error) => {
      console.error('Error testing mappings:', error);
    }
  });
}

// Default website fields (hardcoded for now)
export const DEFAULT_WEBSITE_FIELDS: WebsiteField[] = [
  { id: 'title', name: 'Título', type: 'text', required: true },
  { id: 'description', name: 'Descripción', type: 'rich_text', required: true },
  { id: 'date', name: 'Fecha', type: 'date', required: true },
  { id: 'client', name: 'Cliente', type: 'text', required: true },
  { id: 'tags', name: 'Etiquetas', type: 'array', required: false },
  { id: 'image', name: 'Imagen', type: 'image', required: false },
  { id: 'slug', name: 'URL', type: 'text', required: true },
];
