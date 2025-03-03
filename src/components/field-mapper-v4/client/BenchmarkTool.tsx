'use client';

/**
 * Herramienta de Benchmarking
 * 
 * Componente que permite ejecutar pruebas de rendimiento
 * sobre las transformaciones y analizar los resultados.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { transformations } from '@/lib/field-mapper-v4/transformations';
import { BenchmarkResult, runBenchmark, runComparativeBenchmark, calculateImprovement } from '@/lib/field-mapper-v4/benchmark';
import { ExportData } from '@/lib/field-mapper-v4/export';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ExportResultsButton from './ExportResultsButton';
import BenchmarkHistory from './BenchmarkHistory';

interface BenchmarkToolProps {
  className?: string;
  onResultsChange?: (results: BenchmarkResult[]) => void;
}

export default function BenchmarkTool({ 
  className = '',
  onResultsChange
}: BenchmarkToolProps) {
  // Estados para la configuración del benchmark
  const [selectedTransformationId, setSelectedTransformationId] = useState<string>('');
  const [iterations, setIterations] = useState<number>(10);
  const [samplesCount, setSamplesCount] = useState<number>(100);
  const [compareWithCache, setCompareWithCache] = useState<boolean>(true);
  
  // Estados para los resultados
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [improvement, setImprovement] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Establecer transformación predeterminada al cargar
  useEffect(() => {
    if (transformations.length > 0 && !selectedTransformationId) {
      setSelectedTransformationId(transformations[0].id);
    }
  }, []);
  
  // Ejecutar benchmark
  const handleRunBenchmark = async () => {
    if (!selectedTransformationId) return;
    
    setIsRunning(true);
    setResults([]);
    setImprovement(null);
    
    try {
      // Ejecutar benchmark comparativo o simple según la configuración
      const newResults = compareWithCache
        ? await runComparativeBenchmark(selectedTransformationId, iterations, samplesCount)
        : [await runBenchmark({
            transformationId: selectedTransformationId,
            iterations,
            samplesCount,
            withCache: true
          })];
      
      setResults(newResults);
      
      // Compartir resultados con componente padre si existe callback
      if (onResultsChange) {
        onResultsChange(newResults);
      }
      
      // Calcular mejora de rendimiento si hay resultados comparativos
      if (newResults.length === 2) {
        const withoutCache = newResults.find(r => !r.withCache);
        const withCache = newResults.find(r => r.withCache);
        
        if (withoutCache && withCache) {
          setImprovement(calculateImprovement(withoutCache, withCache));
        }
      }
    } catch (error) {
      console.error('Error al ejecutar benchmark:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Obtener el nombre de la transformación seleccionada
  const getSelectedTransformationName = (): string => {
    const transformation = transformations.find(t => t.id === selectedTransformationId);
    return transformation ? transformation.name : 'Ninguna seleccionada';
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Panel de configuración */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Herramienta de Benchmark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selección de transformación */}
          <div className="space-y-2">
            <Label htmlFor="transformation">Transformación:</Label>
            <Select 
              value={selectedTransformationId} 
              onValueChange={setSelectedTransformationId}
            >
              <SelectTrigger id="transformation">
                <SelectValue placeholder="Selecciona una transformación" />
              </SelectTrigger>
              <SelectContent>
                {transformations.map(transformation => (
                  <SelectItem key={transformation.id} value={transformation.id}>
                    {transformation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Número de iteraciones */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="iterations">Iteraciones: {iterations}</Label>
            </div>
            <Slider
              id="iterations"
              value={[iterations]}
              onValueChange={(values) => setIterations(values[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>
          
          {/* Número de muestras */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="samples">Muestras por iteración: {samplesCount}</Label>
            </div>
            <Slider
              id="samples"
              value={[samplesCount]}
              onValueChange={(values) => setSamplesCount(values[0])}
              min={10}
              max={500}
              step={10}
            />
          </div>
          
          {/* Comparar con/sin caché */}
          <div className="flex items-center space-x-2">
            <Switch
              id="compare"
              checked={compareWithCache}
              onCheckedChange={setCompareWithCache}
            />
            <Label htmlFor="compare">Comparar rendimiento con/sin caché</Label>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleRunBenchmark}
              disabled={isRunning || !selectedTransformationId}
              variant="default"
              className="flex-1"
            >
              {isRunning ? 'Ejecutando benchmark...' : 'Ejecutar benchmark'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              disabled={isRunning}
              className="flex-1"
            >
              Ver historial
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Contenido condicional: resultados o historial */}
      {results.length > 0 && !showHistory ? (
        <div className="mt-6 space-y-6">
          {/* Encabezado con botón de exportación */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Resultados del Benchmark</h3>
            <ExportResultsButton 
              results={results} 
              analysis={null}
              className="ml-auto" 
            />
          </div>
          
          {/* Resumen */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Transformación:</span>
                  <span className="ml-2 font-medium">{getSelectedTransformationName()}</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Configuración:</span>
                  <span className="ml-2">{iterations} iteraciones, {samplesCount} muestras por iteración</span>
                </div>
                
                {improvement !== null && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500">Mejora con caché:</span>
                    <Badge 
                      variant={improvement > 50 ? 'default' : improvement > 20 ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {improvement.toFixed(2)}% más rápido
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Gráfico de resultados */}
          {compareWithCache && results.length > 1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Comparativa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={results}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="withCache" 
                        tickFormatter={(value) => value ? 'Con caché' : 'Sin caché'}
                      />
                      <YAxis label={{ value: 'Tiempo (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toFixed(2)} ms`, 'Tiempo']}
                        labelFormatter={(value: any) => value ? 'Con caché' : 'Sin caché'}
                      />
                      <Legend />
                      <Bar 
                        dataKey="averageTime" 
                        name="Tiempo promedio (ms)" 
                        fill="#4f46e5"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Detalles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Detalles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-1">Configuración</th>
                      <th className="text-right py-2 px-1">Iteraciones</th>
                      <th className="text-right py-2 px-1">Muestras</th>
                      <th className="text-right py-2 px-1">Tiempo total (ms)</th>
                      <th className="text-right py-2 px-1">Tiempo promedio (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-1">
                          {result.withCache ? 'Con caché' : 'Sin caché'}
                        </td>
                        <td className="text-right py-2 px-1">{result.iterations}</td>
                        <td className="text-right py-2 px-1">{result.samplesCount}</td>
                        <td className="text-right py-2 px-1">{result.totalTime.toFixed(2)}</td>
                        <td className="text-right py-2 px-1">{result.averageTime.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : showHistory ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Historial de Benchmarks</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(false)}
            >
              Volver
            </Button>
          </div>
          
          <BenchmarkHistory 
            onSelectResults={handleLoadSavedResults}
          />
        </div>
      ) : null}
    </div>
  );
}
