import { useState, useEffect, useRef, useCallback } from 'react';

// Define validation result type
// Tipo movido a types?.ts
import { ValidationResult } from './types';

/**
 * Custom hook for using the validation worker
 * 
 * This hook provides an interface to the validation worker that runs
 * validation operations in a separate thread to prevent UI blocking.
 */
export function useValidationWorker() {
  // Worker reference
  const workerRef = useRef<Worker | null>(null);
  
  // State for validation results
  const [results, setResults] = useState<Record<string, ValidationResult>>({});
  
  // State for loading status
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  // Initialize worker
  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window !== 'undefined') {
      if (workerRef && workerRef.current) {
        workerRef.current = new Worker(
          new URL('./validation-worker.ts', import.meta.url)
        );
        
        // Set up message handler
        if (workerRef.current) {
          workerRef.current.onmessage = (event) => {
            const { type, result, key } = event.data;
            
            if (type === 'validationResult' && key) {
              setResults(prev => ({
                ...prev,
                [key]: result
              }));
              
              setLoading(prev => ({
                ...prev,
                [key]: false
              }));
            }
          };
        }
      }
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerRef && workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  // Function to validate type compatibility
  const validateTypeCompatibility = useCallback((
    notionType: string,
    websiteType: string
  ): string => {
    // Generate a unique key for this validation
    const key = `${notionType}:${websiteType}`;
    
    // If already loading or have result, don't revalidate
    if (loading[key] || results[key]) {
      return key;
    }
    
    // Set loading state
    setLoading(prev => ({
      ...prev,
      [key]: true
    }));
    
    // Send message to worker
    if (workerRef && workerRef.current) {
      workerRef.current.postMessage({
        type: 'validateTypeCompatibility',
        notionType,
        websiteType,
        key
      });
    }
    
    return key;
  }, [loading, results]);
  
  // Function to get validation result
  const getValidationResult = useCallback((
    key: string
  ): { result: ValidationResult | null; loading: boolean } => {
    return {
      result: results[key] || null,
      loading: loading[key] || false
    };
  }, [results, loading]);
  
  // Function to clear a specific validation result
  const clearValidationResult = useCallback((key: string) => {
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[key];
      return newResults;
    });
    
    setLoading(prev => {
      const newLoading = { ...prev };
      delete newLoading[key];
      return newLoading;
    });
  }, []);
  
  // Function to clear all validation results
  const clearAllValidationResults = useCallback(() => {
    setResults({});
    setLoading({});
  }, []);
  
  return {
    validateTypeCompatibility,
    getValidationResult,
    clearValidationResult,
    clearAllValidationResults
  };
}
