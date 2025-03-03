/**
 * Field Mapper V3 - Contenedor principal
 * 
 * Este componente implementa la versión 3 del Field Mapper con un enfoque
 * específico para landing pages de Case Studies, utilizando un store Zustand
 * para gestión de estado y un sistema de validación avanzado.
 */

'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  Info, 
  Loader2, 
  ArrowRightLeft,
  Save,
  Box as BoxIcon,
  File as FileIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  List as ListIcon,
  DownloadIcon,
  RotateCcwIcon,
  XCircle
} from 'lucide-react'
import { 
  ComponentField, 
  ComponentMapping, 
  NotionComponent, 
  PageComponent 
} from '@/lib/field-mapper/v3-types'
import { 
  ComponentCompatibilityLevel,
  validateFieldCompatibility
} from '@/lib/field-mapper/v3-validation'
import { useFieldMapperV3Store } from '@/lib/field-mapper/v3-store'
import { 
  hasTransformation
} from '@/lib/field-mapper/v3-transformations'
import { fetchNotionStructure, useNotionStructure, useSaveComponentMappings, useComponentMappings } from '@/lib/field-mapper/v3-api'
import FieldCompatibilityVisualizer from './FieldCompatibilityVisualizer'
import { Label } from '@/components/ui/label'

// Importamos los sistemas de depuración desde el barrel
import { 
  useFieldMapperDebugger, 
  useValidationDebugger, 
  analyzeFieldMapperState,
  DEBUG_CONFIG 
} from '@/lib/debug'

// Componentes auxiliares
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Cargando componentes...</p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Componente para mostrar un componente de página
const PageComponentItem = ({ 
  component, 
  isSelected, 
  onSelect,
  validationIssues
}: { 
  component: PageComponent; 
  isSelected: boolean; 
  onSelect: () => void;
  validationIssues?: Array<{
    fieldId: string;
    level: ComponentCompatibilityLevel;
    message: string;
  }>;
}) => {
  // Mapeo de iconos
  const IconMap: Record<string, React.ReactNode> = {
    'layout': <Info className="h-4 w-4" />,
    'info': <Info className="h-4 w-4" />,
    'flag': <Info className="h-4 w-4" />,
    'code': <Info className="h-4 w-4" />,
    'chart': <Info className="h-4 w-4" />,
    'image': <Info className="h-4 w-4" />,
    'link': <Info className="h-4 w-4" />,
    'pointer': <Info className="h-4 w-4" />
  }

  const Icon = component.icon ? IconMap[component.icon] : <Info className="h-4 w-4" />
  
  // Contar errores y advertencias
  const errors = validationIssues?.filter(issue => issue.level === ComponentCompatibilityLevel.ERROR).length || 0;
  const warnings = validationIssues?.filter(issue => issue.level === ComponentCompatibilityLevel.WARNING).length || 0;

  return (
    <div 
      className={`p-3 border rounded-md mb-2 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'hover:bg-secondary/50'}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      tabIndex={0}
      aria-label={`Seleccionar componente ${component.name}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {Icon}
        <span className="font-medium">{component.name}</span>
        
        <div className="ml-auto flex items-center gap-1">
          {errors > 0 && (
            <Badge variant="destructive" className="h-5 flex items-center">
              <XCircle className="h-3 w-3 mr-1" /> {errors}
            </Badge>
          )}
          
          {warnings > 0 && (
            <Badge variant="warning" className="h-5 flex items-center bg-amber-100 text-amber-800">
              <AlertTriangle className="h-3 w-3 mr-1" /> {warnings}
            </Badge>
          )}
          
          {errors === 0 && warnings === 0 && validationIssues && (
            <Badge variant="outline" className="h-5 flex items-center bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{component.description}</p>
      <div className="mt-2">
        <span className="text-xs text-muted-foreground">{component.fields.length} campos</span>
      </div>
    </div>
  )
}

// Componente para mostrar un componente de Notion
const NotionComponentItem = ({ 
  component,
  isSelected,
  onSelect,
  usageCount = 0
}: { 
  component: NotionComponent;
  isSelected: boolean;
  onSelect: () => void;
  usageCount?: number;
}) => {
  // Icono basado en el tipo
  const getIcon = () => {
    switch (component.type.toLowerCase()) {
      case 'database':
        return <Info className="h-4 w-4" />;
      case 'page':
        return <Info className="h-4 w-4" />;
      case 'image':
      case 'files':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`p-3 border rounded-md mb-2 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'hover:bg-secondary/50'}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      tabIndex={0}
      aria-label={`Seleccionar origen ${component.name}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {getIcon()}
        <span className="font-medium">{component.name}</span>
        
        {usageCount > 0 && (
          <Badge variant="outline" className="ml-auto h-5 flex items-center bg-blue-100 text-blue-800">
            {usageCount}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="capitalize">{component.type}</span>
        <span>•</span>
        <span>{component.fields.length} campos</span>
      </div>
    </div>
  )
}

// Componente para crear y editar mappings
const MappingEditor = ({ 
  selectedPageComponent, 
  selectedNotionComponent,
  mapping,
  onUpdateMapping,
  validationIssues = []
}: { 
  selectedPageComponent: PageComponent | null; 
  selectedNotionComponent: NotionComponent | null;
  mapping: ComponentMapping | null;
  onUpdateMapping: (mapping: ComponentMapping) => void;
  validationIssues?: Array<{
    fieldId: string;
    level: ComponentCompatibilityLevel;
    message: string;
  }>;
}) => {
  // Si no hay componentes seleccionados, mostrar mensaje
  if (!selectedPageComponent || !selectedNotionComponent) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Selecciona un componente de página y un componente de Notion para comenzar el mapeo</p>
      </div>
    )
  }
  
  // Crear objeto de mapping si no existe
  const currentMapping = mapping || {
    id: `${selectedPageComponent.id}-${selectedNotionComponent.id}`,
    pageComponentId: selectedPageComponent.id,
    notionComponentId: selectedNotionComponent.id,
    fieldMappings: []
  }
  
  // Función para actualizar el mapping de un campo
  const handleFieldMapping = (pageFieldId: string, notionFieldId: string) => {
    const newMapping = { ...currentMapping }
    
    // Buscar si ya existe un mapping para este campo
    const existingFieldMappingIndex = newMapping.fieldMappings.findIndex(
      fm => fm.pageFieldId === pageFieldId
    )
    
    if (existingFieldMappingIndex >= 0) {
      // Si existe, actualizarlo
      if (notionFieldId) {
        newMapping.fieldMappings[existingFieldMappingIndex].notionFieldId = notionFieldId
      } else {
        // Si se selecciona la opción vacía, eliminar el mapping
        newMapping.fieldMappings.splice(existingFieldMappingIndex, 1)
      }
    } else if (notionFieldId) {
      // Si no existe y se seleccionó un campo, crearlo
      newMapping.fieldMappings.push({
        pageFieldId,
        notionFieldId
      })
    }
    
    onUpdateMapping(newMapping)
  }
  
  // Obtener problemas de validación para un campo específico
  const getValidationForField = (fieldId: string) => {
    return validationIssues.find(issue => issue.fieldId === fieldId)
  }
  
  // Renderizar cada campo del componente de página
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div>
          <h3 className="text-lg font-semibold">{selectedPageComponent.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedPageComponent.description}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Mapeado a:</span>
          <div className="font-medium">{selectedNotionComponent.name}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {selectedPageComponent.fields.map(pageField => {
          // Buscar el mapping para este campo
          const fieldMapping = currentMapping.fieldMappings.find(
            fm => fm.pageFieldId === pageField.id
          )
          
          // Obtener validación para este campo
          const fieldValidation = getValidationForField(pageField.id)
          
          // Comprobar si hay transformación disponible
          const notionField = fieldMapping?.notionFieldId ? 
            selectedNotionComponent.fields.find(f => f.id === fieldMapping.notionFieldId) : 
            null;
          
          const canTransform = notionField && 
            pageField.type !== notionField.type && 
            hasTransformation(notionField.type, pageField.type);
          
          return (
            <div 
              key={pageField.id} 
              className={`p-3 border rounded-md ${
                fieldValidation?.level === ComponentCompatibilityLevel.ERROR
                  ? 'border-destructive bg-destructive/10'
                  : fieldValidation?.level === ComponentCompatibilityLevel.WARNING
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{pageField.name}</h4>
                    {pageField.required && (
                      <Badge variant="outline" className="h-5">Requerido</Badge>
                    )}
                    <Badge>{pageField.type}</Badge>
                  </div>
                  {pageField.description && (
                    <p className="text-sm text-muted-foreground mt-1">{pageField.description}</p>
                  )}
                </div>
                
                {fieldValidation && (
                  <div className="flex items-center" title={fieldValidation.message}>
                    {fieldValidation.level === ComponentCompatibilityLevel.ERROR && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    {fieldValidation.level === ComponentCompatibilityLevel.WARNING && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {fieldValidation.level === ComponentCompatibilityLevel.INFO && (
                      <Info className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                )}
              </div>
                
              <div className="mt-2">
                <Label htmlFor={`field-${pageField.id}`} className="text-sm text-muted-foreground block mb-1">
                  Mapear a un campo de Notion:
                </Label>
                <Select 
                  onValueChange={(value) => handleFieldMapping(pageField.id, value)}
                  value={fieldMapping?.notionFieldId || ""}
                >
                  <SelectTrigger id={`field-${pageField.id}`}>
                    <SelectValue placeholder="Seleccionar campo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Seleccionar campo...</SelectItem>
                    {selectedNotionComponent.fields.map(notionField => {
                      const isTransformable = notionField.type !== pageField.type && 
                        hasTransformation(notionField.type, pageField.type);
                      
                      return (
                        <SelectItem key={notionField.id} value={notionField.id}>
                          <div className="flex items-center">
                            <span>{notionField.name} ({notionField.type})</span>
                            {isTransformable && (
                              <Badge variant="outline" className="ml-1 h-5 flex items-center bg-blue-100 text-blue-800">
                                <ArrowRightLeft className="h-3 w-3 mr-1" />
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                {/* Mostrar información de transformación si es aplicable */}
                {fieldMapping?.notionFieldId && notionField ? (
                  <div className="mt-3">
                    <FieldCompatibilityVisualizer 
                      sourceField={{
                        id: String(notionField.id || ''),
                        name: String(notionField.name || ''),
                        type: String(notionField.type || ''),
                        required: Boolean(notionField.required || false)
                      }}
                      targetField={{
                        id: String(pageField.id || ''),
                        name: String(pageField.name || ''),
                        type: String(pageField.type || ''),
                        required: Boolean(pageField.required || false)
                      }}
                      sourceName="Notion"
                      targetName="Landing Page"
                      showConnector={true}
                    />
                  </div>
                ) : (
                  <div className="mt-3 p-3 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm text-muted-foreground text-center">
                      Selecciona un campo de Notion para mostrar compatibilidad
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente principal del Field Mapper V3
export const FieldMapperV3 = () => {
  // Inicializar herramientas de depuración (deben ir al principio para evitar hooks condicionales)
  const debugInstance = useFieldMapperDebugger();
  const validationDebugger = useValidationDebugger();
  
  // Estado y store
  const [selectedPageSectionId, setSelectedPageSectionId] = useState<string | null>(null);
  const [selectedNotionAssetId, setSelectedNotionAssetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  // Query para cargar componentes de Notion
  const notionStructureQuery = useNotionStructure();
  const { mutate: saveMappings, status: saveStatus } = useSaveComponentMappings();
  const { data: loadedMappings, isLoading: isLoadingMappings } = useComponentMappings();
  
  // Store de Zustand para gestión de estado
  const {
    mappings,
    setMappings,
    updateMapping,
    notionAssets,
    setNotionAssets,
    pageStructure: LANDING_PAGE_STRUCTURE,
  } = useFieldMapperV3Store();

  // Extraer el estado completo para el análisis de depuración usando useMemo
  const stateForAnalysis = useMemo(() => ({
    notionAssets: notionStructureQuery.data || [],
    mappings,
    selectedNotionAssetId,
    selectedPageSectionId,
    pageStructure: LANDING_PAGE_STRUCTURE
  }), [notionStructureQuery.data, mappings, selectedNotionAssetId, selectedPageSectionId, LANDING_PAGE_STRUCTURE]);
  
  // Analizar el estado actual para depuración
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      analyzeFieldMapperState(stateForAnalysis);
    }
  }, [stateForAnalysis]);

  // Obtener datos de Notion
  const fetchStatus = notionStructureQuery.status;

  useEffect(() => {
    // Cargar datos de Notion automáticamente al iniciar
    const loadNotionData = async () => {
      if (fetchStatus === 'idle') {
        notionStructureQuery.refetch();
      }
    };
    
    loadNotionData();
  }, [
    notionStructureQuery.isSuccess, 
    notionStructureQuery.data, 
    notionAssets.length,
    fetchStatus,
    setNotionAssets, 
    LANDING_PAGE_STRUCTURE
  ]);

  // Obtener mappings guardados
  const componentMappingsQuery = useComponentMappings();

  useEffect(() => {
    // Cargar mappings guardados cuando estén disponibles
    if (componentMappingsQuery.isSuccess && componentMappingsQuery.data) {
      console.log('Mappings cargados:', componentMappingsQuery.data);
      setMappings(componentMappingsQuery.data);
    }
  }, [componentMappingsQuery.isSuccess, componentMappingsQuery.data, setMappings]);

  // Función para cargar datos reales de Notion
  const handleLoadNotionData = async () => {
    notionStructureQuery.refetch();
  };

  // Obtener el componente de página seleccionado
  const getSelectedPageComponent = () => {
    return selectedPageSectionId ? LANDING_PAGE_STRUCTURE.find(c => c.id === selectedPageSectionId) : null;
  };
  
  // Obtener el componente de Notion seleccionado
  const getSelectedNotionComponent = () => {
    return selectedNotionAssetId ? notionAssets.find(c => c.id === selectedNotionAssetId) : null;
  };
  
  // Obtener mapping actual si existe
  const getCurrentMapping = () => {
    return mappings.find(
      m => m.pageComponentId === selectedPageSectionId && m.notionComponentId === selectedNotionAssetId
    );
  };

  // Actualizar mapping existente
  const handleUpdateMappingInternal = (updatedMapping: ComponentMapping) => {
    updateMapping(updatedMapping);
  };

  // Obtener el componente de página seleccionado
  const selectedPageComponent = getSelectedPageComponent();
  
  // Obtener el componente de Notion seleccionado
  const selectedNotionComponent = getSelectedNotionComponent();
  
  // Obtener el mapping actual
  const currentMapping = getCurrentMapping();
  
  // Función para actualizar un mapping
  const handleUpdateMapping = (mapping: ComponentMapping) => {
    const existingIndex = mappings.findIndex(m => 
      m.pageComponentId === mapping.pageComponentId && 
      m.notionComponentId === mapping.notionComponentId
    );
    
    if (existingIndex >= 0) {
      // Actualizar el mapping existente
      updateMapping(mapping);
    } else {
      // Si el mapping no existe, lo creamos
      // Nota: esta función debería estar definida en el store, lo implementamos localmente
      const newMappings = [...mappings, mapping];
      setMappings(newMappings);
    }
  };

  // Obtener problemas de validación para un componente específico
  const getValidationIssuesForComponent = (componentId: string) => {
    if (!validationResults || !validationResults.errors || !Array.isArray(validationResults.errors)) {
      return [];
    }
    return validationResults.errors.filter(error => error.sectionId === componentId);
  }
  
  // Si está cargando, mostrar el componente de carga
  if (fetchStatus === 'loading') {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Field Mapper V3 - Case Studies</h1>
        <LoadingFallback />
      </div>
    );
  }
  
  // Si hay un error, mostrarlo
  if (fetchStatus === 'error') {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Field Mapper V3 - Case Studies</h1>
        <ErrorDisplay message="Error al cargar datos de Notion. Por favor, intenta de nuevo." />
        <Button 
          onClick={() => {
            notionStructureQuery.refetch();
          }}
          className="mt-4"
        >
          Reintentar
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 bg-gray-950 text-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-white">Field Mapper V3 - Case Studies</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Columna 1 (IZQUIERDA): Assets de Notion */}
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="py-3 border-b border-gray-800">
              <CardTitle className="text-sm text-white">Assets de Notion</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Selecciona un origen de datos de Notion
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-2">
                {notionAssets.map(component => {
                  // Contar cuántas veces se usa este componente en mappings
                  const usageCount = mappings.filter(m => m.notionComponentId === component.id).length;
                  return (
                    <div 
                      key={component.id} 
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-md cursor-pointer",
                        "bg-gray-900/50 border border-gray-800 hover:border-gray-700",
                        selectedNotionAssetId === component.id && "bg-gray-800/70 border-gray-700"
                      )}
                      onClick={() => setSelectedNotionAssetId(component.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileIcon className="h-4 w-4 text-blue-500" />
                        <span 
                          className="text-sm font-medium text-gray-300" 
                          style={{ fontFamily: 'var(--font-geist-mono)' }}
                        >
                          {component.name}
                        </span>
                      </div>
                      
                      {/* Mostrar badge de uso si este asset se utiliza */}
                      {usageCount > 0 && (
                        <Badge variant="outline" className="text-xs py-0 h-5 bg-green-950/60 border-green-800 text-green-300">
                          {usageCount}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Columna 2 (DERECHA): Estructura predefinida de landing pages */}
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="py-3 border-b border-gray-800">
              <CardTitle className="text-sm text-white">Estructura de Landing Page</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Estructura predefinida para Case Studies
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-4">
                {LANDING_PAGE_STRUCTURE.map(section => {
                  const validationIssues = getValidationIssuesForComponent(section.id);
                  return (
                    <div key={section.id} className="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-sm font-semibold mb-2 flex items-center justify-between text-white">
                        {section.name}
                        {validationIssues.length > 0 && (
                          <Badge variant={validationIssues.some(i => i.level === ComponentCompatibilityLevel.ERROR) 
                            ? "destructive" 
                            : "outline"} 
                            className="ml-2 text-xs"
                          >
                            {validationIssues.some(i => i.level === ComponentCompatibilityLevel.ERROR) 
                              ? "Error" 
                              : "Advertencia"}
                          </Badge>
                        )}
                      </h3>
                      <div className="space-y-3 mt-3">
                        {section.fields.map(field => {
                          // Encontrar mapping existente para este campo
                          const existingMapping = mappings.find(
                            m => m.pageComponentId === section.id && 
                                  m.fieldMappings.some(fm => fm.pageFieldId === field.id)
                          );
                          
                          // Encontrar componente de Notion mapeado
                          const mappedNotionComponent = existingMapping 
                            ? notionAssets.find(c => c.id === existingMapping.notionComponentId)
                            : null;
                          
                          // Encontrar campo de Notion mapeado
                          const mappedNotionField = mappedNotionComponent && existingMapping
                            ? mappedNotionComponent.fields.find(f => {
                                const fieldMapping = existingMapping.fieldMappings.find(
                                  fm => fm.pageFieldId === field.id
                                );
                                return fieldMapping && f.id === fieldMapping.notionFieldId;
                              })
                            : null;
                          
                          return (
                            <div key={field.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                              <div className="flex items-center gap-2">
                                {field.type === 'file' ? (
                                  <ImageIcon className="h-4 w-4 text-purple-500" />
                                ) : field.type === 'rich_text' ? (
                                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                                ) : field.type === 'text' ? (
                                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                                ) : field.type === 'multi_select' ? (
                                  <ListIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <BoxIcon className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="font-medium text-sm text-gray-300">{field.name}</span>
                                <Badge variant="outline" className="text-xs py-0 h-5 bg-gray-950/60 border-gray-800">{field.type}</Badge>
                                {field.required && (
                                  <Badge variant="secondary" className="ml-1 text-xs py-0 h-5 bg-gray-800 text-gray-300">Requerido</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center">
                                {mappedNotionField ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">
                                      {mappedNotionComponent?.name} / {mappedNotionField?.name}
                                    </span>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs text-gray-300"
                                      onClick={() => {
                                        setSelectedPageSectionId(section.id);
                                        setSelectedNotionAssetId(mappedNotionComponent?.id || null);
                                      }}
                                    >
                                      Editar
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs text-gray-300"
                                    onClick={() => {
                                      setSelectedPageSectionId(section.id);
                                    }}
                                  >
                                    Conectar
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Resumen de validación */}
      {(validationResults && !validationResults.isValid && mappings.length > 0) && (
        <div className="mt-6">
          <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Hay problemas con los mappings</AlertTitle>
            <AlertDescription>
              Hay {validationResults?.errors?.filter(e => e.level === ComponentCompatibilityLevel.ERROR).length || 0} errores que deben resolverse antes de guardar.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button 
          variant="outline"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
          onClick={handleLoadNotionData}
          disabled={fetchStatus === 'loading'}
        >
          {fetchStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando datos...
            </>
          ) : (
            <>
              <FileIcon className="mr-2 h-4 w-4" />
              Cargar datos de Notion
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
          onClick={() => {
            componentMappingsQuery.refetch();
          }}
          disabled={componentMappingsQuery.isLoading}
        >
          {componentMappingsQuery.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando mappings...
            </>
          ) : (
            <>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Cargar mappings guardados
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
          onClick={() => {
            setSelectedPageSectionId(null);
            setSelectedNotionAssetId(null);
          }}
        >
          <RotateCcwIcon className="mr-2 h-4 w-4" />
          Limpiar selección
        </Button>
        <Button 
          onClick={() => {
            if ((validationResults && !validationResults.isValid && mappings.length > 0) || saveStatus === 'loading') {
              alert('No se pueden guardar mappings inválidos. Por favor, corrige los errores antes de guardar.');
              return;
            }
            
            saveMappings(mappings).then(() => {
              alert('Mappings guardados correctamente');
            }).catch((err) => {
              console.error('Error al guardar mappings:', err);
              alert('Error al guardar mappings. Por favor, intenta de nuevo.');
            });
          }}
          disabled={(validationResults && !validationResults.isValid && mappings.length > 0) || saveStatus === 'loading'}
          className={(validationResults && !validationResults.isValid && mappings.length > 0) || saveStatus === 'loading'
            ? "bg-blue-900/50 text-blue-300 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white"}
        >
          {saveStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar mappings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Exportación por defecto para compatibilidad con importaciones dinámicas
export default FieldMapperV3;
