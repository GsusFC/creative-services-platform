import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Play, RotateCw, Clock } from 'lucide-react';

interface TransformationVisualizerProps {
  availableTransformations?: string[];
  onRunTransformation?: (
    transformation: string, 
    input: string, 
    options: Record<string, any>
  ) => Promise<{
    result: any;
    timeTaken: number;
    cached: boolean;
  }>;
}

// Opciones de transformación simuladas
const MOCK_TRANSFORMATIONS = [
  'text-to-number',
  'number-to-text',
  'date-to-string',
  'string-to-date',
  'checkbox-to-text',
  'text-to-checkbox',
  'select-to-text',
  'text-to-select',
  'relation-to-text',
  'text-to-relation',
  'multi-select-to-array',
  'array-to-multi-select'
];

// Opciones de configuración para cada transformación
const TRANSFORMATION_OPTIONS: Record<string, Array<{
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  options?: string[];
  default: any;
}>> = {
  'text-to-number': [
    { name: 'decimalSeparator', type: 'select', options: ['.', ','], default: '.' },
    { name: 'allowNegative', type: 'checkbox', default: true }
  ],
  'date-to-string': [
    { name: 'format', type: 'text', default: 'YYYY-MM-DD' },
    { name: 'includeTime', type: 'checkbox', default: false }
  ],
  'string-to-date': [
    { name: 'format', type: 'text', default: 'YYYY-MM-DD' },
    { name: 'strictParsing', type: 'checkbox', default: false }
  ],
  'text-to-select': [
    { name: 'caseSensitive', type: 'checkbox', default: false },
    { name: 'defaultOption', type: 'text', default: '' }
  ],
  'text-to-relation': [
    { name: 'searchField', type: 'text', default: 'name' },
    { name: 'createIfNotExists', type: 'checkbox', default: false }
  ],
  'multi-select-to-array': [
    { name: 'delimiter', type: 'text', default: ',' }
  ]
};

// Ejemplos de entrada para cada transformación
const INPUT_EXAMPLES: Record<string, string> = {
  'text-to-number': '123.45',
  'number-to-text': '123.45',
  'date-to-string': '2023-06-18T14:22:33Z',
  'string-to-date': '2023-06-18',
  'checkbox-to-text': 'true',
  'text-to-checkbox': 'yes',
  'select-to-text': 'Option A',
  'text-to-select': 'Option A',
  'relation-to-text': '["rel-1", "rel-2"]',
  'text-to-relation': 'Project A',
  'multi-select-to-array': '["Option A", "Option B"]',
  'array-to-multi-select': '["Option A", "Option B"]'
};

const TransformationVisualizer: React.FC<TransformationVisualizerProps> = ({ 
  availableTransformations = MOCK_TRANSFORMATIONS,
  onRunTransformation
}) => {
  const [selectedTransformation, setSelectedTransformation] = useState(availableTransformations[0] || '');
  const [inputValue, setInputValue] = useState(INPUT_EXAMPLES[selectedTransformation] || '');
  const [options, setOptions] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  // Obtener opciones para la transformación seleccionada
  const transformationOptions = TRANSFORMATION_OPTIONS[selectedTransformation] || [];

  // Inicializar opciones por defecto al cambiar de transformación
  React.useEffect(() => {
    if (selectedTransformation) {
      const defaultOptions = (TRANSFORMATION_OPTIONS[selectedTransformation] || []).reduce(
        (acc, option) => ({ ...acc, [option.name]: option.default }),
        {}
      );
      setOptions(defaultOptions);
      setInputValue(INPUT_EXAMPLES[selectedTransformation] || '');
      setResult(null);
      setTimeTaken(null);
      setIsCached(false);
    }
  }, [selectedTransformation]);

  // Actualizar una opción específica
  const handleOptionChange = (name: string, value: any) => {
    setOptions(prev => ({ ...prev, [name]: value }));
  };

  // Ejecutar la transformación
  const handleRunTransformation = async () => {
    if (!selectedTransformation || !inputValue) return;

    setIsLoading(true);
    setActiveTab('result');

    try {
      if (onRunTransformation) {
        // Usar la función proporcionada
        const response = await onRunTransformation(
          selectedTransformation,
          inputValue,
          options
        );
        
        setResult(response.result);
        setTimeTaken(response.timeTaken);
        setIsCached(response.cached);
      } else {
        // Simulación para desarrollo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simular resultados basados en la transformación
        let mockResult;
        switch (selectedTransformation) {
          case 'text-to-number':
            mockResult = parseFloat(inputValue);
            break;
          case 'number-to-text':
            mockResult = inputValue.toString();
            break;
          case 'date-to-string':
            mockResult = new Date(inputValue).toLocaleDateString();
            break;
          case 'string-to-date':
            mockResult = new Date(inputValue).toISOString();
            break;
          case 'checkbox-to-text':
            mockResult = inputValue === 'true' ? 'Sí' : 'No';
            break;
          case 'text-to-checkbox':
            mockResult = ['yes', 'true', 'si', 'sí'].includes(inputValue.toLowerCase());
            break;
          default:
            mockResult = `Transformed: ${inputValue}`;
        }
        
        setResult(mockResult);
        setTimeTaken(Math.random() * 10);
        setIsCached(Math.random() > 0.7);
      }
    } catch (error) {
      console.error('Error al ejecutar transformación:', error);
      setResult(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualizador de Transformaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="transformation" className="block text-sm font-medium mb-1">
              Transformación
            </label>
            <Select
              value={selectedTransformation}
              onValueChange={setSelectedTransformation}
            >
              <SelectTrigger id="transformation" className="w-full">
                <SelectValue placeholder="Seleccionar transformación" />
              </SelectTrigger>
              <SelectContent>
                {availableTransformations.map((transformation) => (
                  <SelectItem key={transformation} value={transformation}>
                    {transformation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="input">Entrada</TabsTrigger>
              <TabsTrigger value="options">Opciones</TabsTrigger>
              <TabsTrigger value="result">Resultado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4">
              <div>
                <label htmlFor="input-value" className="block text-sm font-medium mb-1">
                  Valor de Entrada
                </label>
                <div className="flex gap-2">
                  <Input
                    id="input-value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ingrese un valor para transformar"
                  />
                  <Button 
                    onClick={handleRunTransformation} 
                    disabled={isLoading || !inputValue}
                    aria-label="Ejecutar transformación"
                  >
                    {isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center py-4">
                <div className="text-gray-500 text-sm flex items-center gap-2">
                  <span>{selectedTransformation}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="options" className="space-y-4">
              {transformationOptions.length > 0 ? (
                transformationOptions.map((option) => (
                  <div key={option.name}>
                    <label htmlFor={option.name} className="block text-sm font-medium mb-1">
                      {option.name}
                    </label>
                    
                    {option.type === 'text' && (
                      <Input
                        id={option.name}
                        value={options[option.name] || ''}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                      />
                    )}
                    
                    {option.type === 'number' && (
                      <Input
                        id={option.name}
                        type="number"
                        value={options[option.name] || 0}
                        onChange={(e) => handleOptionChange(option.name, parseFloat(e.target.value))}
                      />
                    )}
                    
                    {option.type === 'checkbox' && (
                      <div className="flex items-center">
                        <input
                          id={option.name}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={options[option.name] || false}
                          onChange={(e) => handleOptionChange(option.name, e.target.checked)}
                        />
                        <label htmlFor={option.name} className="ml-2 text-sm text-gray-500">
                          {options[option.name] ? 'Activado' : 'Desactivado'}
                        </label>
                      </div>
                    )}
                    
                    {option.type === 'select' && option.options && (
                      <Select
                        value={options[option.name] || option.default}
                        onValueChange={(value) => handleOptionChange(option.name, value)}
                      >
                        <SelectTrigger id={option.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {option.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No hay opciones disponibles para esta transformación
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleRunTransformation} 
                  disabled={isLoading || !inputValue}
                  aria-label="Ejecutar transformación"
                >
                  {isLoading ? <RotateCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Ejecutar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="result" className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Resultado</label>
                  {timeTaken !== null && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{timeTaken.toFixed(2)} ms</span>
                      {isCached && (
                        <Badge variant="outline" className="ml-2 text-xs bg-blue-50">
                          Caché
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-3 min-h-[100px] bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <RotateCw className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : result !== null ? (
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {typeof result === 'object' 
                        ? JSON.stringify(result, null, 2) 
                        : String(result)
                      }
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Ejecute una transformación para ver el resultado
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('input')}
                  className="mr-2"
                  aria-label="Volver a entrada"
                >
                  Editar Entrada
                </Button>
                <Button 
                  onClick={handleRunTransformation} 
                  disabled={isLoading || !inputValue}
                  aria-label="Ejecutar de nuevo"
                >
                  {isLoading ? <RotateCw className="h-4 w-4 animate-spin mr-2" /> : <RotateCw className="h-4 w-4 mr-2" />}
                  Ejecutar de Nuevo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformationVisualizer;
