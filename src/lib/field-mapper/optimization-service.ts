/**
 * Field Mapper Optimization Service
 * 
 * Servicio para optimizar el rendimiento del Field Mapper,
 * incluyendo estrategias de carga incremental, virtualización,
 * y gestión de recursos.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import type { FieldMapping, PerformanceMetrics, TransformationResult, FieldMapperConfig } from './types';

// Definición de OptimizationRecommendation que falta en types.ts
export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: 'performance' | 'validation' | 'api' | 'cache' | 'memory';
  implementationDetails?: string;
}

/**
 * Hook para medir el tiempo de renderizado de un componente
 * @returns Objeto con tiempo de renderizado y función para iniciar medición
 */
export function useRenderTime(): { renderTime: number; startMeasurement: () => void } {
  const startTimeRef = useRef<number | null>(null);
  const [renderTime, setRenderTime] = useState<number>(0);
  
  const startMeasurement = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);
  
  useEffect(() => {
    if (startTimeRef.current !== null) {
      const endTime = performance.now();
      const time = endTime - startTimeRef.current;
      setRenderTime(time);
      startTimeRef.current = null;
    }
  });
  
  return { renderTime, startMeasurement };
}

/**
 * Hook para medir el uso de memoria de un componente
 * @returns Uso actual de memoria en bytes
 */
export function useMemoryUsage(): { memoryUsage: number } {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  
  useEffect(() => {
    // Solo funciona en navegadores que soportan performance?.memory
    const updateMemoryUsage = () => {
      if (
        'performance' in window && 
        'memory' in (performance ) && 
        'usedJSHeapSize' in (performance ).memory
      ) {
        setMemoryUsage((performance).memory.usedJSHeapSize);
      }
    };
    
    updateMemoryUsage();
    
    // Actualizar cada 2 segundos
    const interval = setInterval(updateMemoryUsage, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return memoryUsage;
}

/**
 * Hook para implementar carga incremental de componentes
 * @param items Items a cargar
 * @param batchSize Tamaño de cada lote
 * @param intervalMs Intervalo entre lotes en ms
 * @returns Items cargados actualmente
 */
export function useIncrementalLoading<T>(
  items: T[],
  batchSize: number = 10,
  intervalMs: number = 50
) {
  const [loadedItems, setLoadedItems] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Reiniciar cuando cambian los items
    setLoadedItems([]);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const loadBatch = (startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, items.length);
      const newBatch = items.slice(0, endIndex);
      
      setLoadedItems(newBatch);
      
      if (endIndex < items.length) {
        timeoutRef.current = setTimeout(() => {
          loadBatch(endIndex);
        }, intervalMs);
      }
    };
    
    // Comenzar carga incremental
    loadBatch(0);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items, batchSize, intervalMs]);
  
  return loadedItems;
}

/**
 * Clase para gestionar un worker de validación
 */
export class ValidationWorkerManager {
  private worker: Worker | null = null;
  private callbacks: Map<string, (result: TransformationResult) => void> = new Map();
  private config: FieldMapperConfig;
  
  constructor(config: FieldMapperConfig) {
    this.config = config;
    this.initWorker();
  }
  
  private initWorker(): void {
    if (typeof window !== 'undefined' && this.config.workerEnabled) {
      try {
        this.worker = new Worker(
          new URL('./validation-worker.ts', import.meta.url),
          { type: 'module' }
        );
        
        this.worker.addEventListener('message', this.handleWorkerMessage);
      } catch (error) {
        console.error('Error initializing validation worker:', error);
        this.worker = null;
      }
    }
  }
  
  private handleWorkerMessage = (event: MessageEvent<any>): void => {
    const { type, id, result } = event.data;
    
    if (type === 'validationResult' && id && this.callbacks.has(id)) {
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(result);
        this.callbacks.delete(id);
      }
    }
  };
  
  /**
   * Valida la compatibilidad de tipos usando el worker
   * @param notionType Tipo de campo de Notion
   * @param websiteType Tipo de campo del sitio web
   * @returns Promesa con el resultado de la validación
   */
  public validateTypeCompatibility(
    notionType: string,
    websiteType: string
  ): Promise<{
    isValid: boolean;
    error?: string;
    suggestion?: string;
  }> {
    return new Promise<TransformationResult>((resolve) => {
      const id = Math?.random().toString(36).substring(2, 15);
      
      if (this.worker) {
        this.callbacks.set(id, resolve as (result: TransformationResult) => void);
        
        this.worker.postMessage({
          type: 'validateTypeCompatibility',
          id,
          notionType,
          websiteType
        });
      } else {
        // Fallback si el worker no está disponible
        import('./validation').then(({ validateTypeCompatibility, getSuggestedTransformation }) => {
          const isValid = validateTypeCompatibility(notionType, websiteType);
          
          if (isValid) {
            resolve({ isValid: true });
          } else {
            const suggestion = getSuggestedTransformation(notionType, websiteType);
            resolve({
              isValid: false,
              error: `El tipo "${notionType}" de Notion no es compatible con el tipo "${websiteType}" del sitio web`,
              suggestion: suggestion ?? undefined
            });
          }
        });
      }
    });
  }
  
  /**
   * Termina el worker
   */
  public terminate(): void {
    if (this.worker) {
      this.worker.removeEventListener('message', this.handleWorkerMessage);
      this.worker.terminate();
      this.worker = null;
    }
  }
}

/**
 * Hook para implementar virtualización de listas
 * @param itemCount Número total de items
 * @param itemHeight Altura de cada item en píxeles
 * @param overscan Número de items adicionales a renderizar fuera de la vista
 * @returns Propiedades para el contenedor y los items visibles
 */
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setContainerHeight(container.clientHeight);
      container.addEventListener('scroll', handleScroll);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);
  
  // Calcular items visibles
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, index) => startIndex + index
  );
  
  const totalHeight = itemCount * itemHeight;
  
  return {
    containerProps: {
      ref: containerRef,
      style: {
        height: '100%',
        overflow: 'auto',
        position: 'relative' as const
      }
    },
    innerProps: {
      style: {
        height: `${totalHeight}px`,
        position: 'relative' as const
      }
    },
    itemProps: (index: number) => ({
      style: {
        position: 'absolute' as const,
        top: `${index * itemHeight}px`,
        left: 0,
        width: '100%',
        height: `${itemHeight}px`
      }
    }),
    visibleItems
  };
}

/**
 * Hook para implementar lazy loading de componentes
 * @param shouldLoad Condición para cargar el componente
 * @param loader Función que carga el componente
 * @returns Componente cargado o null
 */
export function useLazyComponent<T extends ComponentType<any>>(
  shouldLoad: boolean,
  loader: () => Promise<{ default: T }>
): T | null {
  const [component, setComponent] = useState<T | null>(null);
  
  useEffect(() => {
    if (shouldLoad && !component) {
      loader().then(module => {
        setComponent(module.default);
      });
    }
  }, [shouldLoad, loader, component]);
  
  return component;
}

/**
 * Hook para detectar cuando un componente está visible en el viewport
 * @param options Opciones para el IntersectionObserver
 * @returns Ref para el elemento y booleano indicando si es visible
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [options]);
  
  return { ref, isVisible };
}

/**
 * Hook para implementar debounce en una función
 * @param fn Función a la que aplicar debounce
 * @param delay Tiempo de espera en ms
 * @returns Función con debounce aplicado
 */
export function useDebounce<T extends (...args: unknown[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
}

/**
 * Hook para implementar throttle en una función
 * @param fn Función a la que aplicar throttle
 * @param limit Tiempo mínimo entre ejecuciones en ms
 * @returns Función con throttle aplicado
 */
export function useThrottle<T extends (...args: unknown[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    argsRef.current = args;
    
    const now = Date.now();
    
    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      fn(...args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          lastRun.current = Date.now();
          fn(...argsRef.current);
        }
        timeoutRef.current = null;
      }, limit - (now - lastRun.current));
    }
  }, [fn, limit]);
}
