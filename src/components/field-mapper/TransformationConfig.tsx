'use client';

import React, { useCallback, useState, useEffect } from 'react'
import { useFieldMapperStore } from '@/lib/field-mapper/store'
import { 
  FieldMapping, 
  Transformation,
  TransformationTemplate,
  TransformationStrategy,
  NotionFieldType,
  WebsiteFieldType,
  ValidationResultExtended
} from '@/lib/field-mapper/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  WandIcon, 
  ArrowRightIcon, 
  InfoIcon, 
  CodeIcon, 
  ZapIcon, 
  RefreshCwIcon,
  CheckIcon,
  AlertTriangleIcon
} from 'lucide-react'
import { 
  getAllTransformationTemplates,
  determineTransformationStrategy,
  findTransformationTemplate
} from '@/lib/field-mapper/transformation-service'
import { getCompatibilityLevel, CompatibilityLevel } from '@/lib/field-mapper/validation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Import or create Select components
const Select = ({ children, value, onValueChange }: { 
  children: React.ReactNode; 
  value: string; 
  onValueChange: (value: string) => void 
}) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e: React.ChangeEvent<HTMLSelectElement>)=> onValueChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </select>
  </div>
);

const SelectTrigger = ({ children, id, className }: { 
  children: React.ReactNode; 
  id?: string; 
  className?: string 
}) => <div id={id} className={className}>{children}</div>;

const SelectValue = ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>;

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
    {children}
  </div>
);

const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <option value={value} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1?.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
    {children}
  </option>
);

// Available transformation types
const TRANSFORMATION_STRATEGIES: Array<{
  id: TransformationStrategy;
  name: string;
  description: string;
  icon: React.ReactNode;
}> = [
  { 
    id: 'direct', 
    name: 'Mapeo directo', 
    description: 'Sin transformación, usar valor tal cual',
    icon: <ArrowRightIcon className="h-4 w-4" />
  },
  { 
    id: 'simple', 
    name: 'Transformación simple', 
    description: 'Conversión básica entre tipos (ej. string a number)',
    icon: <RefreshCwIcon className="h-4 w-4" />
  },
  { 
    id: 'template', 
    name: 'Plantilla predefinida', 
    description: 'Usar una transformación predefinida para estos tipos',
    icon: <WandIcon className="h-4 w-4" />
  },
  { 
    id: 'complex', 
    name: 'Transformación compleja', 
    description: 'Transformación con múltiples pasos o lógica avanzada',
    icon: <ZapIcon className="h-4 w-4" />
  },
  { 
    id: 'custom', 
    name: 'Código personalizado', 
    description: 'Escribir código JavaScript personalizado para la transformación',
    icon: <CodeIcon className="h-4 w-4" />
  },
  { 
    id: 'fallback', 
    name: 'Valor predeterminado', 
    description: 'Usar un valor fijo cuando no hay compatibilidad',
    icon: <AlertTriangleIcon className="h-4 w-4" />
  }
];

interface TransformationConfigProps {
  mapping: FieldMapping;
  index: number;
  onUpdateMapping: (index: number, mapping: FieldMapping) => void;
}

export default function TransformationConfig({ mapping, index, onUpdateMapping }: TransformationConfigProps) {
  const [activeTab, setActiveTab] = useState<string>('strategy');
  const [customCode, setCustomCode] = useState<string>(
    mapping.transformation?.custom ?? 'return value;'
  );
  const [fallbackValue, setFallbackValue] = useState<string>(
    mapping.transformation?.fallback?.toString() || ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    mapping.transformation?.templateId ?? ''
  );
  const [selectedStrategy, setSelectedStrategy] = useState<TransformationStrategy>(
    mapping.transformation?.type as TransformationStrategy ?? 'direct'
  );
  
  // Obtener campos de Notion y sitio web
  const notionFields = useFieldMapperStore(state => state.notionFields);
  const websiteFields = useFieldMapperStore(state => state.websiteFields);
  
  // Encontrar los campos específicos para este mapeo
  const notionField = notionFields?.find(f => f.id === mapping.notionField);
  const websiteField = websiteFields?.find(f => f.id === mapping.websiteField);
  
  // Obtener plantillas de transformación disponibles
  const [availableTemplates, setAvailableTemplates] = useState<TransformationTemplate[]>([]);
  
  // Obtener nivel de compatibilidad
  const compatibilityLevel = mapping.validation && 
    (mapping.validation as ValidationResultExtended).compatibilityLevel !== undefined
      ? (mapping.validation as ValidationResultExtended).compatibilityLevel
      : notionField && websiteField
        ? getCompatibilityLevel(
            notionField?.type as NotionFieldType, 
            websiteField?.type as WebsiteFieldType
          )
        : CompatibilityLevel.NONE;
  
  // Determinar estrategia recomendada
  const recommendedStrategy = notionField && websiteField
    ? determineTransformationStrategy(
        notionField?.type as NotionFieldType,
        websiteField?.type as WebsiteFieldType
      )
    : 'fallback';
  
  // Cargar plantillas disponibles
  useEffect(() => {
    if (notionField && websiteField) {
      // Obtener todas las plantillas
      const allTemplates = getAllTransformationTemplates();
      
      // Filtrar por tipos compatibles
      const matchingTemplates = allTemplates?.filter(template => template.sourceType === notionField?.type && 
        template?.targetType === websiteField?.type
      );
      
      setAvailableTemplates(matchingTemplates);
      
      // Si hay una plantilla predeterminada y no hay una transformación configurada
      if (!mapping.transformation && matchingTemplates?.length > 0) {
        const defaultTemplate = matchingTemplates?.find(t => t.isDefault) || matchingTemplates[0];
        setSelectedTemplateId(defaultTemplate?.id);
        
        // Sugerir la estrategia recomendada
        setSelectedStrategy(recommendedStrategy);
      }
    }
  }, [notionField, websiteField, mapping.transformation, recommendedStrategy]);
  
  // Actualizar la transformación
  const updateTransformation = useCallback((transformation: Transformation) => {
    onUpdateMapping(index, {
      ...mapping,
      transformation
    });
  }, [index, mapping, onUpdateMapping]);
  
  // Manejar cambio de estrategia
  const handleStrategyChange = useCallback((strategy: TransformationStrategy) => {
    setSelectedStrategy(strategy);
    
    // Actualizar transformación según la estrategia
    let newTransformation: Transformation = { type: strategy };
    
    switch (strategy) {
      case 'template':
        if (selectedTemplateId && newTransformation) {
          newTransformation.templateId = selectedTemplateId;
        }
        break;
      case 'custom':
        if (newTransformation) {
          newTransformation.custom = customCode;
        }
        break;
      case 'fallback':
        if (newTransformation) {
          newTransformation.fallback = fallbackValue;
        }
        break;
    }
    
    updateTransformation(newTransformation);
  }, [selectedTemplateId, customCode, fallbackValue, updateTransformation]);
  
  // Manejar cambio de plantilla
  const handleTemplateChange = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    
    if (selectedStrategy === 'template') {
      updateTransformation({
        type: 'template',
        templateId
      });
    }
  }, [selectedStrategy, updateTransformation]);
  
  // Manejar cambio de código personalizado
  const handleCustomCodeChange = useCallback((code: string) => {
    setCustomCode(code);
    
    if (selectedStrategy === 'custom') {
      updateTransformation({
        type: 'custom',
        custom: code
      });
    }
  }, [selectedStrategy, updateTransformation]);
  
  // Manejar cambio de valor predeterminado
  const handleFallbackValueChange = useCallback((value: string) => {
    setFallbackValue(value);
    
    if (selectedStrategy === 'fallback') {
      updateTransformation({
        type: 'fallback',
        fallback: value
      });
    }
  }, [selectedStrategy, updateTransformation]);
  
  // Aplicar transformación
  const applyTransformation = useCallback(() => {
    let transformation: Transformation = { type: selectedStrategy };
    
    switch (selectedStrategy) {
      case 'template':
        if (selectedTemplateId && transformation) {
          transformation.templateId = selectedTemplateId;
        }
        break;
      case 'custom':
        if (transformation) {
          transformation.custom = customCode;
        }
        break;
      case 'fallback':
        if (transformation) {
          transformation.fallback = fallbackValue;
        }
        break;
    }
    
    updateTransformation(transformation);
  }, [selectedStrategy, selectedTemplateId, customCode, fallbackValue, updateTransformation]);
  
  return (
    <Card className="w-full border-gray-800 bg-gray-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <WandIcon className="h-4 w-4 mr-2" />
          Transformación
          {compatibilityLevel < CompatibilityLevel.HIGH && (
            <Badge variant="outline" className="ml-2 text-[10px] bg-yellow-900/20 text-yellow-300 border-yellow-800">
              Recomendada
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Configura cómo transformar datos entre Notion y el sitio web
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="strategy" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="strategy">Estrategia</TabsTrigger>
            <TabsTrigger value="template" disabled={selectedStrategy !== 'template'}>Plantilla</TabsTrigger>
            <TabsTrigger value="custom" disabled={selectedStrategy !== 'custom'}>Código</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategy">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="strategy">Estrategia de transformación</Label>
                <div className="grid grid-cols-1 gap-2">
                  {TRANSFORMATION_STRATEGIES?.map(strategy => (
                    <Button
                      key={strategy?.id}
                      variant={selectedStrategy === strategy?.id ? "default" : "outline"}
                      className={`justify-start ${
                        recommendedStrategy === strategy?.id 
                          ? 'border-yellow-600/50 bg-yellow-950/20' 
                          : ''
                      }`}
                      onClick={() => handleStrategyChange(strategy?.id)}
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          {strategy?.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium flex items-center">
                            {strategy?.name}
                            {recommendedStrategy === strategy?.id && (
                              <span className="ml-2 text-xs text-yellow-400">(Recomendada)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{strategy?.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedStrategy === 'fallback' && (
                <div className="grid gap-2">
                  <Label htmlFor="fallback">Valor predeterminado</Label>
                  <Input
                    id="fallback"
                    value={fallbackValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=> handleFallbackValueChange(e?.value)}
                    placeholder="Valor a usar cuando no hay compatibilidad"
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="template">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="template">Plantilla de transformación</Label>
                {availableTemplates?.length > 0 ? (
                  <Select 
                    value={selectedTemplateId} 
                    onValueChange={handleTemplateChange}
                  >
                    {availableTemplates?.map(template => (
                      <SelectItem key={template?.id} value={template?.id}>
                        {template?.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div className="text-sm text-gray-400 p-2 border border-gray-800 rounded">
                    No hay plantillas disponibles para estos tipos de campos
                  </div>
                )}
              </div>
              
              {selectedTemplateId && availableTemplates?.length > 0 && (
                <div className="mt-4 p-3 border border-gray-800 rounded-md bg-gray-900/50">
                  <h4 className="text-sm font-medium mb-1">
                    {availableTemplates?.find(t => t.id === selectedTemplateId)?.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    {availableTemplates?.find(t => t.id === selectedTemplateId)?.description}
                  </p>
                  <div className="bg-gray-950 p-2 rounded text-xs font-mono overflow-x-auto">
                    {availableTemplates?.find(t => t.id === selectedTemplateId)?.code}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="custom-code">Código personalizado</Label>
                <textarea
                  id="custom-code"
                  value={customCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>)=> handleCustomCodeChange(e?.value)}
                  className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="// Escribe código JavaScript para transformar el valor
// 'value' contiene el valor de origen
// 'context' contiene información adicional
// Debes retornar el valor transformado

return value;"
                />
              </div>
              
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-md p-3">
                <h4 className="text-sm font-medium text-blue-400 mb-1 flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  Ayuda
                </h4>
                <p className="text-xs text-gray-300">
                  Escribe código JavaScript para transformar el valor. Tienes acceso a:
                </p>
                <ul className="text-xs text-gray-400 list-disc pl-4 mt-1">
                  <li><code>value</code>: El valor de origen desde Notion</li>
                  <li><code>context</code>: Objeto con información adicional</li>
                  <li>Debes usar <code>return</code> para devolver el valor transformado</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button onClick={applyTransformation}>
            <CheckIcon className="h-4 w-4 mr-2" />
            Aplicar transformación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
