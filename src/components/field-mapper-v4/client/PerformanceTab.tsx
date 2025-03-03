'use client';

/**
 * Pestaña de Rendimiento
 * 
 * Componente contenedor que incluye todas las herramientas
 * relacionadas con el rendimiento y optimización del Field Mapper.
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';
import { OptimizationSummary, analyzeResults } from '@/lib/field-mapper-v4/optimization';
import { transformationCache } from '@/lib/field-mapper-v4/cache';
import BenchmarkTool from './BenchmarkTool';
import OptimizationPanel from './OptimizationPanel';
import PerformanceDashboard from './PerformanceDashboard';

interface PerformanceTabProps {
  className?: string;
}

export default function PerformanceTab({
  className = ''
}: PerformanceTabProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const [analysis, setAnalysis] = useState<OptimizationSummary | null>(null);
  
  // Manejar cambios en los resultados del benchmark
  const handleBenchmarkResultsChange = (results: BenchmarkResult[]) => {
    setBenchmarkResults(results);
    if (results.length > 0) {
      // Analizar resultados y generar recomendaciones
      const summary = analyzeResults(results, transformationCache.getStats());
      setAnalysis(summary);
    }
  };
  
  // Manejar cambios en la configuración de optimización
  const handleOptimizationSettingsChanged = () => {
    // Re-analizar con la nueva configuración
    if (benchmarkResults.length > 0) {
      const summary = analyzeResults(benchmarkResults, transformationCache.getStats());
      setAnalysis(summary);
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Rendimiento y Optimización</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => transformationCache.clear()}
            >
              Limpiar caché
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
              <TabsTrigger value="optimization">Optimización</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <PerformanceDashboard 
                benchmarkResults={benchmarkResults} 
              />
            </TabsContent>
            
            <TabsContent value="benchmark" className="space-y-4">
              <BenchmarkTool 
                onResultsChange={handleBenchmarkResultsChange} 
              />
            </TabsContent>
            
            <TabsContent value="optimization" className="space-y-4">
              <OptimizationPanel 
                benchmarkResults={benchmarkResults}
                onSettingsChanged={handleOptimizationSettingsChanged}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
