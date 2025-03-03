'use client';

import React, { useState, memo, useCallback, useEffect } from 'react';
import { FieldMapping } from '@/lib/field-mapper/store';
import { Button } from '@/components/ui/button';
import { 
  XIcon, 
  AlertCircleIcon, 
  ChevronDownIcon, 
  InfoIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  WandIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useValidationWorker } from '@/lib/field-mapper/use-validation-worker';
import TransformationConfig from './TransformationConfig';

interface OptimizedMappingProps {
  mapping: FieldMapping;
  index: number;
  notionFields: { id: string; name: string; type: string }[];
  websiteFields: { id: string; name: string; type: string }[];
  onUpdateMapping: (index: number, mapping: FieldMapping) => void;
  onRemoveMapping: (index: number) => void;
}

/**
 * Optimized Mapping Component
 * 
 * A performance-optimized version of the Mapping component that:
 * - Uses a web worker for type validation
 * - Implements memoization to prevent unnecessary re-renders
 * - Uses optimized state management
 */
const OptimizedMapping: React.FC<OptimizedMappingProps> = ({
  mapping,
  index,
  notionFields,
  websiteFields,
  onUpdateMapping,
  onRemoveMapping
}) => {
  // State for dropdowns
  const [showNotionFieldDropdown, setShowNotionFieldDropdown] = useState(false);
  const [showWebsiteFieldDropdown, setShowWebsiteFieldDropdown] = useState(false);
  const [showTypeDetails, setShowTypeDetails] = useState(false);
  const [showTransformation, setShowTransformation] = useState(false);

  // Get validation worker hooks
  const { 
    validateTypeCompatibility, 
    getValidationResult, 
    clearValidationResult 
  } = useValidationWorker();

  // Find notion field details
  const notionField = Array.isArray(notionFields) 
    ? notionFields.find(f => (f.id) === mapping.notionField)
    : undefined;
    
  const notionFieldName = notionField?.name || 'Seleccionar campo de Notion';
  const notionFieldType = notionField?.type || '';

  // Find website field details
  const websiteField = Array.isArray(websiteFields)
    ? websiteFields.find(f => (f.id) === mapping.websiteField)
    : undefined;
    
  const websiteFieldName = websiteField?.name || 'Seleccionar campo del sitio web';
  const websiteFieldType = websiteField?.type || '';

  // Validate type compatibility using worker
  const [validationKey, setValidationKey] = useState<string | null>(null);
  
  useEffect(() => {
    // Only validate if both fields are selected
    if (notionFieldType && websiteFieldType) {
      const key = validateTypeCompatibility(notionFieldType, websiteFieldType);
      setValidationKey(key);
    } else {
      setValidationKey(null);
    }
    
    // Clean up validation result when component unmounts
    return () => {
      if (validationKey) {
        clearValidationResult(validationKey);
      }
    };
  }, [notionFieldType, websiteFieldType, validateTypeCompatibility, clearValidationResult]);
  
  // Get validation result
  const { result: validation, loading: validationLoading } = validationKey 
    ? getValidationResult(validationKey) 
    : { result: null, loading: false };
  
  // Determine if the mapping is complete and valid
  const isComplete = Boolean(mapping.notionField && mapping.websiteField);
  const isValid = validation?.isValid ?? false;
  const isValidating = validationLoading;

  // Handlers
  const handleNotionFieldChange = useCallback((fieldId: string) => {
    onUpdateMapping(index, {
      ...mapping,
      notionField: fieldId,
    });
    setShowNotionFieldDropdown(false);
  }, [index, mapping, onUpdateMapping]);

  const handleWebsiteFieldChange = useCallback((fieldId: string) => {
    onUpdateMapping(index, {
      ...mapping,
      websiteField: fieldId,
    });
    setShowWebsiteFieldDropdown(false);
  }, [index, mapping, onUpdateMapping]);

  const handleRemoveMapping = useCallback(() => {
    onRemoveMapping(index);
  }, [index, onRemoveMapping]);
  
  const handleTransformationChange = useCallback((transformation: string) => {
    onUpdateMapping(index, {
      ...mapping,
      transformation,
    });
  }, [index, mapping, onUpdateMapping]);

  return (
    <div
      className={`
        p-3 rounded-md border 
        ${isComplete && isValid 
          ? 'border-green-900/30 bg-green-950/20' 
          : !isComplete 
            ? 'border-gray-800 bg-gray-900/50' 
            : 'border-red-900/30 bg-red-950/20'
        }
        transition-colors
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-2">        
        <div className="flex-grow flex items-center gap-2">
          {isComplete && isValid && (
            <Badge variant="success" className="text-[10px]">
              <CheckIcon className="h-3 w-3 mr-1" />
              Válido
            </Badge>
          )}
          
          {isComplete && !isValid && !isValidating && (
            <Badge variant="warning" className="text-[10px]">
              <AlertCircleIcon className="h-3 w-3 mr-1" />
              Incompatible
            </Badge>
          )}
          
          {isValidating && (
            <Badge variant="outline" className="text-[10px]">
              <span className="h-3 w-3 mr-1 animate-spin">⟳</span>
              Validando
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
          onClick={handleRemoveMapping}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-3">
        {/* Notion field selector */}
        <div className="relative">
          <div
            className="p-2 border border-gray-800 rounded-md cursor-pointer hover:border-gray-700 flex items-center justify-between"
            onClick={() => setShowNotionFieldDropdown(!showNotionFieldDropdown)}
          >
            <span className="truncate text-sm">{notionFieldName}</span>
            <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
          </div>
          
          {showNotionFieldDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-950 border border-gray-800 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {Array.isArray(notionFields) && notionFields.map(field => (
                <div
                  key={field?.id}
                  className="p-2 hover:bg-gray-900 cursor-pointer text-sm flex items-center justify-between"
                  onClick={() => handleNotionFieldChange(field?.id)}
                >
                  <span className="truncate">{field?.name}</span>
                  <Badge variant="outline" className="text-[10px]">{field?.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRightIcon className="h-4 w-4 text-gray-500" />
        </div>
        
        {/* Website field selector */}
        <div className="relative">
          <div
            className="p-2 border border-gray-800 rounded-md cursor-pointer hover:border-gray-700 flex items-center justify-between"
            onClick={() => setShowWebsiteFieldDropdown(!showWebsiteFieldDropdown)}
          >
            <span className="truncate text-sm">{websiteFieldName}</span>
            <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
          </div>
          
          {showWebsiteFieldDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-950 border border-gray-800 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {Array.isArray(websiteFields) && websiteFields.map(field => (
                <div
                  key={field?.id}
                  className="p-2 hover:bg-gray-900 cursor-pointer text-sm flex items-center justify-between"
                  onClick={() => handleWebsiteFieldChange(field?.id)}
                >
                  <span className="truncate">{field?.name}</span>
                  <Badge variant="outline" className="text-[10px]">{field?.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Type compatibility details */}
      {isComplete && !isValid && validation && (
        <div className="mb-3">
          <div 
            className="flex items-center text-xs text-amber-400 cursor-pointer"
            onClick={() => setShowTypeDetails(!showTypeDetails)}
          >
            <InfoIcon className="h-3 w-3 mr-1" />
            <span>{validation?.error}</span>
            <ChevronDownIcon className={`h-3 w-3 ml-1 transition-transform ${showTypeDetails ? 'rotate-180' : ''}`} />
          </div>
          
          {showTypeDetails && validation?.details && (
            <div className="mt-2 p-2 bg-gray-900 rounded-md text-xs">
              <p className="mb-1">Tipos compatibles con <strong>{websiteFieldType}</strong>:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {Array.isArray(validation?.compatibleNotionTypes) && 
                  validation?.compatibleNotionTypes.map((type: string) => (
                    <Badge key={type} variant="outline" className="text-[10px]">{type}</Badge>
                  ))
                }
              </div>
              
              {validation?.suggestion && (
                <div className="mt-2 text-green-400">
                  <p className="font-semibold">Sugerencia:</p>
                  <p>{validation?.suggestion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Transformation config */}
      {isComplete && (
        <div>
          <div 
            className="flex items-center text-xs text-blue-400 cursor-pointer"
            onClick={() => setShowTransformation(!showTransformation)}
          >
            <WandIcon className="h-3 w-3 mr-1" />
            <span>
              {mapping.transformation 
                ? 'Transformación configurada' 
                : 'Añadir transformación (opcional)'
              }
            </span>
            <ChevronDownIcon className={`h-3 w-3 ml-1 transition-transform ${showTransformation ? 'rotate-180' : ''}`} />
          </div>
          
          {showTransformation && (
            <div className="mt-2">
              <TransformationConfig
                notionFieldType={notionFieldType}
                websiteFieldType={websiteFieldType}
                currentTransformation={mapping.transformation ?? ''}
                onTransformationChange={handleTransformationChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedMapping);
