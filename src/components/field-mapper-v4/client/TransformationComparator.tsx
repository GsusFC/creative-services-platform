'use client';

/**
 * Comparador de Transformaciones
 * 
 * Componente que permite comparar el rendimiento de
 * múltiples transformaciones simultáneamente.
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { transformations } from '@/lib/field-mapper-v4/transformations';
import { 
  BenchmarkResult, 
  runBenchmark, 
  runComparativeBenchmark, 
  calculateImprovement 
} from '@/lib/field-mapper-v4/benchmark';
import { 
  BarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2 } from 'lucide-react';
import ExportResultsButton from './ExportResultsButton';

// Colores para los gráficos
const BAR_COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
];

interface TransformationComparatorProps {
  className?: string;
}

export default function TransformationComparator({
  className = ''
}: TransformationComparatorProps) {
  // Transformaciones disponibles para comparar
  const [availableTransformations, setAvailableTransformations] = useState<
    Array<{id: string, name: string, selected: boolean}>
  >([]);
  
  // Configuración de benchmark
  const [iterations, setIterations] = useState<number>(5);
  const [samplesCount, setSamplesCount] = useState<number>(50);
  const [withCache, setWithCache] = useState<boolean>(true);
  
  // Estados para resultados y progreso
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  
  // Inicializar transformaciones disponibles
  useEffect(() => {
    const transformationsList = Object.entries(transformations)
      .filter(([_, transformation]) => transformation.benchmarkable !== false)
      .map(([id, transformation]) => ({
        id,
        name: transformation.name,
        selected: false
      }));
    
    setAvailableTransformations(transformationsList);
  }, []);
  
  // Manejar selección de transformaciones
  const handleToggleTransformation = (id: string) => {
    setAvailableTransformations(current => 
      current.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  
  // Seleccionar todas las transformaciones
  const handleSelectAll = () => {
    setAvailableTransformations(current => 
      current.map(item => ({ ...item, selected: true }))
    );
  };
  
  // Deseleccionar todas las transformaciones
  const handleDeselectAll = () => {
    setAvailableTransformations(current => 
      current.map(item => ({ ...item, selected: false }))
    );
  };
  
  // Ejecutar benchmarks para todas las transformaciones seleccionadas
  const handleRunComparison = async () => {
    const selectedTransformations = availableTransformations
      .filter(item => item.selected)
      .map(item => item.id);
    
    if (selectedTransformations.length === 0) {
      alert('Por favor, selecciona al menos una transformación para comparar');
      return;
    }
    
    setIsRunning(true);
    setProgress({current: 0, total: selectedTransformations.length});
    setResults([]);
    
    const allResults: BenchmarkResult[] = [];
    
    // Ejecutar benchmarks secuencialmente para cada transformación
    for (let i = 0; i < selectedTransformations.length; i++) {
      const transformationId = selectedTransformations[i];
      setProgress({current: i + 1, total: selectedTransformations.length});
      
      try {
        const result = await runBenchmark({
          transformationId,
          iterations,
          samplesCount,
          withCache
        });
        
        allResults.push(result);
        setResults([...allResults]);
      } catch (error) {
        console.error(`Error al ejecutar benchmark para ${transformationId}:`, error);
      }
    }
    
    setIsRunning(false);
  };
  
  // Preparar datos para el gráfico comparativo
  const prepareChartData = () => {
    if (results.length === 0) return [];
    
    // Ordenar resultados por tiempo (menor a mayor)
    return [...results]
      .sort((a, b) => a.averageTime - b.averageTime)
      .map(result => ({
        name: result.transformationName,
        averageTime: parseFloat(result.averageTime.toFixed(2)),
        totalTime: parseFloat(result.totalTime.toFixed(2))
      }));
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Comparador de Transformaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Selección de transformaciones */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Transformaciones</h3>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Seleccionar todas
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Deseleccionar todas
                  </Button>
                </div>
              </div>
              
              <div className="h-[300px] overflow-y-auto border rounded p-3">
                <div className="space-y-2">
                  {availableTransformations.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`transform-${item.id}`}
                        checked={item.selected}
                        onCheckedChange={() => handleToggleTransformation(item.id)}
                      />
                      <Label htmlFor={`transform-${item.id}`}>{item.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Configuración de benchmark */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Configuración</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iterations">Iteraciones</Label>
                    <select 
                      id="iterations"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={iterations}
                      onChange={(e) => setIterations(Number(e.target.value))}
                    >
                      {[1, 2, 5, 10, 20].map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="samples">Muestras</Label>
                    <select 
                      id="samples"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={samplesCount}
                      onChange={(e) => setSamplesCount(Number(e.target.value))}
                    >
                      {[10, 25, 50, 100, 200, 500].map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="withCache"
                    checked={withCache}
                    onCheckedChange={(checked) => setWithCache(!!checked)}
                  />
                  <Label htmlFor="withCache">Utilizar caché</Label>
                </div>
                
                <Button 
                  onClick={handleRunComparison}
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando ({progress.current}/{progress.total})
                    </>
                  ) : (
                    'Comparar transformaciones'
                  )}
                </Button>
              </div>
            </div>
            
            {/* Resultados */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Resultados</h3>
                {results.length > 0 && (
                  <ExportResultsButton 
                    results={results}
                    analysis={null}
                  />
                )}
              </div>
              
              {results.length > 0 ? (
                <div className="space-y-4">
                  {/* Gráfico comparativo */}
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareChartData()}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={100}
                        />
                        <Tooltip formatter={(value) => [`${value} ms`, 'Tiempo']} />
                        <Legend />
                        <Bar 
                          dataKey="averageTime" 
                          name="Tiempo promedio (ms)" 
                          fill={BAR_COLORS[0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Tabla detallada */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transformación</TableHead>
                        <TableHead className="text-right">Tiempo Prom.</TableHead>
                        <TableHead className="text-right">Tiempo Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results
                        .sort((a, b) => a.averageTime - b.averageTime)
                        .map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {result.transformationName}
                            </TableCell>
                            <TableCell className="text-right">
                              {result.averageTime.toFixed(2)} ms
                            </TableCell>
                            <TableCell className="text-right">
                              {result.totalTime.toFixed(2)} ms
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                  <p>Selecciona transformaciones y ejecuta la comparación</p>
                  <p className="text-sm mt-2">Los resultados aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
