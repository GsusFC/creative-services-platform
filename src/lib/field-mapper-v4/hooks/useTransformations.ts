'use client';

/**
 * Hook para gestionar transformaciones
 * 
 * Proporciona funcionalidad para trabajar con transformaciones entre campos
 * y gestionar su estado de forma eficiente
 */

import { useState, useCallback, useMemo } from 'react';
import { FieldType, FieldMapping } from '../types';
import { Transformation, transformations, getTransformation, applyTransformation } from '../transformations';
import { getAvailableTransformations } from '../compatibility';
import { transformationCache, CacheStats } from '../cache';

export interface UseTransformationsResult {
  // Transformaciones
  getAvailableTransformationsForMapping: (sourceType: FieldType, targetType: FieldType) => Transformation[];
  getActiveTransformation: (mapping: FieldMapping | null) => Transformation | null;
  applyTransformationToValue: (value: any, mapping: FieldMapping) => any;
  tryTransformation: (sourceType: FieldType, targetType: FieldType, transformationId: string, value: any) => any;
  
  // Utilidades
  generateSampleValue: (type: FieldType) => any;
  formatTransformedValue: (value: any) => string;
  
  // Cache
  getCacheStats: () => CacheStats;
  clearCache: () => void;
}

export function useTransformations(): UseTransformationsResult {
  // Obtener transformaciones disponibles para un mapeo
  const getAvailableTransformationsForMapping = useCallback((sourceType: FieldType, targetType: FieldType): Transformation[] => {
    return getAvailableTransformations(sourceType, targetType);
  }, []);

  // Obtener transformación activa para un mapeo
  const getActiveTransformation = useCallback((mapping: FieldMapping | null): Transformation | null => {
    if (!mapping || !mapping.transformationId) return null;
    return getTransformation(mapping.transformationId);
  }, []);

  // Aplicar transformación a un valor
  const applyTransformationToValue = useCallback((value: any, mapping: FieldMapping): any => {
    if (!mapping.transformationId) return value;
    
    const transformation = getTransformation(mapping.transformationId);
    if (!transformation) return value;
    
    try {
      return transformation.transform(value, mapping.transformationOptions);
    } catch (error) {
      console.error('Error al aplicar transformación:', error);
      return value;
    }
  }, []);

  // Probar una transformación con un valor específico
  const tryTransformation = useCallback((
    sourceType: FieldType, 
    targetType: FieldType, 
    transformationId: string, 
    value: any
  ): any => {
    const transformation = getTransformation(transformationId);
    if (!transformation) return value;
    
    try {
      return transformation.transform(value);
    } catch (error) {
      console.error('Error al probar transformación:', error);
      return value;
    }
  }, []);

  // Generar valor de ejemplo según el tipo
  const generateSampleValue = useCallback((type: FieldType): any => {
    switch (type) {
      case FieldType.TEXT:
      case FieldType.TITLE:
        return 'Texto de ejemplo';
      case FieldType.RICH_TEXT:
        return [{ text: { content: 'Texto con **formato**' } }];
      case FieldType.NUMBER:
        return 1234.56;
      case FieldType.DATE:
        return { start: '2023-05-15' };
      case FieldType.SELECT:
        return { name: 'Opción seleccionada' };
      case FieldType.MULTI_SELECT:
        return [{ name: 'Opción 1' }, { name: 'Opción 2' }];
      case FieldType.URL:
        return 'https://example.com';
      case FieldType.EMAIL:
        return 'usuario@example.com';
      case FieldType.CHECKBOX:
        return true;
      case FieldType.FILES:
        return [
          { name: 'documento.pdf', url: 'https://example.com/documento.pdf' },
          { name: 'imagen.jpg', url: 'https://example.com/imagen.jpg' }
        ];
      case FieldType.IMAGE:
        return { url: 'https://example.com/imagen.jpg' };
      default:
        return 'Valor de ejemplo';
    }
  }, []);

  // Formatear valor transformado para mostrar en la interfaz
  const formatTransformedValue = useCallback((value: any): string => {
    if (value === null || value === undefined) return '—';
    
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '—';
      
      // Manejar arrays de objetos (como multi_select)
      if (typeof value[0] === 'object' && value[0] !== null) {
        if ('name' in value[0]) {
          return value.map((item: any) => item.name).join(', ');
        }
        if ('text' in value[0] && 'content' in value[0].text) {
          return value.map((item: any) => item.text.content).join('');
        }
        if ('url' in value[0]) {
          return `${value.length} archivo(s)`;
        }
      }
      
      return value.join(', ');
    }
    
    if (typeof value === 'object' && value !== null) {
      if ('start' in value) {
        return value.start;
      }
      if ('name' in value) {
        return value.name;
      }
      if ('url' in value) {
        return value.url;
      }
      
      return JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
    }
    
    return String(value);
  }, []);

  // Obtener estadísticas de caché
  const getCacheStats = useCallback((): CacheStats => {
    return transformationCache.getStats();
  }, []);
  
  // Limpiar caché
  const clearCache = useCallback((): void => {
    transformationCache.clear();
  }, []);

  return {
    getAvailableTransformationsForMapping,
    getActiveTransformation,
    applyTransformationToValue,
    tryTransformation,
    generateSampleValue,
    formatTransformedValue,
    getCacheStats,
    clearCache,
  };
}
