'use client';

/**
 * Dashboard de Métricas de Rendimiento
 * 
 * Componente que muestra un panel completo con métricas
 * de rendimiento, estadísticas de caché y recomendaciones.
 */

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { transformationCache, CacheStats } from '@/lib/field-mapper-v4/cache';
import { BenchmarkResult } from '@/lib/field-mapper-v4/benchmark';
import { 
  OptimizationSummary, 
  analyzeResults,
  RecommendationImpact 
} from '@/lib/field-mapper-v4/optimization';
import { ExportData, loadResultsFromLocalStorage } from '@/lib/field-mapper-v4/export';
import BenchmarkHistory from './BenchmarkHistory';
import TransformationComparator from './TransformationComparator';

// Colores para los gráficos
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

interface PerformanceDashboardProps {
  benchmarkResults?: BenchmarkResult[];
  className?: string;
}

/**
 * Panel completo con métricas de rendimiento y estadísticas
 */
export default function PerformanceDashboard({
  benchmarkResults = [],
  className = ''
}: PerformanceDashboardProps) {
  // Estados para datos y análisis
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    capacity: 0,
    hitRate: 0
  });
  const [historicalData, setHistoricalData] = useState<ExportData[]>([]);
  const [analysis, setAnalysis] = useState<OptimizationSummary | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Cargar datos históricos desde localStorage
  useEffect(() => {
    const loadHistoricalData = () => {
      const items: ExportData[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('field-mapper-benchmark')) {
          const data = loadResultsFromLocalStorage(key);
          if (data) {
            items.push(data);
          }
        }
      }
      
      // Ordenar por fecha
      items.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      setHistoricalData(items);
    };
    
    // Obtener estadísticas de caché
    const getCacheStats = () => {
      const stats = transformationCache.getStats();
      setCacheStats(stats);
    };
    
    // Analizar resultados si están disponibles
    if (benchmarkResults.length > 0) {
      const summary = analyzeResults(benchmarkResults, cacheStats);
      setAnalysis(summary);
    }
    
    loadHistoricalData();
    getCacheStats();
    
    // Actualizar estadísticas periódicamente
    const interval = setInterval(() => {
      getCacheStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [benchmarkResults, cacheStats]);
  
  // Preparar datos para gráficos
  const prepareCacheStatsData = () => {
    return [
      { name: 'Aciertos', value: cacheStats.hits },
      { name: 'Fallos', value: cacheStats.misses }
    ];
  };
  
  const prepareHistoricalPerformanceData = () => {
    if (historicalData.length === 0) return [];
    
    // Extraer datos de rendimiento promedio por fecha
    return historicalData.map((data) => {
      // Calcular promedio de tiempos para todas las transformaciones
      const avgTime = data.benchmarkResults.reduce((sum, result) => 
        sum + result.averageTime, 0) / data.benchmarkResults.length;
      
      // Obtener fecha formateada
      const date = new Date(data.timestamp);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      
      return {
        name: formattedDate,
        avgTime: parseFloat(avgTime.toFixed(2)),
        hitRate: data.optimizationSummary?.cacheStats?.hitRate || 0
      };
    });
  };
  
  // Renderizar gráfico de estadísticas de caché
  const renderCacheStatsPieChart = () => {
    const data = prepareCacheStatsData();
    
    return (
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Cantidad']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  // Renderizar gráfico de rendimiento histórico
  const renderHistoricalPerformanceChart = () => {
    const data = prepareHistoricalPerformanceData();
    
    if (data.length < 2) {
      return (
        <div className="flex items-center justify-center h-[240px] text-gray-500">
          Se necesitan al menos 2 entradas para mostrar tendencias
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="avgTime" 
            name="Tiempo promedio (ms)" 
            stroke="#4f46e5" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="hitRate" 
            name="Tasa de aciertos (%)" 
            stroke="#10b981" 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  // Renderizar mejores transformaciones
  const renderTopTransformations = () => {
    if (!benchmarkResults || benchmarkResults.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          No hay datos de benchmark disponibles
        </div>
      );
    }
    
    // Obtener transformaciones ordenadas por rendimiento (tiempo menor = mejor)
    const sortedTransformations = [...benchmarkResults]
      .filter(result => result.withCache) // Solo considerar las versiones con caché
      .sort((a, b) => a.averageTime - b.averageTime)
      .slice(0, 5); // Top 5
    
    return (
      <div className="space-y-2">
        {sortedTransformations.map((result, index) => (
          <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
            <div className="font-medium">{result.transformationName}</div>
            <Badge variant="outline">{result.averageTime.toFixed(2)} ms</Badge>
          </div>
        ))}
      </div>
    );
  };
  
  // Renderizar resumen de optimización
  const renderOptimizationSummary = () => {
    if (!analysis) {
      return (
        <div className="text-center text-gray-500 py-4">
          No hay análisis de optimización disponible
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Tasa de aciertos</div>
            <div className="text-2xl font-bold">
              {(analysis.cacheStats.hitRate * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Uso de caché</div>
            <div className="text-2xl font-bold">
              {Math.floor((analysis.cacheStats.size / analysis.cacheStats.capacity) * 100)}%
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Recomendaciones</div>
            <div className="text-2xl font-bold">
              {analysis.recommendations.length}
            </div>
          </div>
        </div>
        
        {analysis.recommendations.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Principales recomendaciones</h3>
            {analysis.recommendations
              .slice(0, 3)
              .map((rec, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded border"
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{rec.description}</div>
                    <Badge 
                      variant={
                        rec.impact === RecommendationImpact.HIGH 
                          ? "default" 
                          : rec.impact === RecommendationImpact.MEDIUM 
                          ? "secondary" 
                          : "outline"
                      }
                    >
                      {rec.impact}
                    </Badge>
                  </div>
                  {rec.currentValue !== undefined && rec.suggestedValue !== undefined && (
                    <div className="mt-1 text-sm text-gray-500">
                      {rec.currentValue} → {rec.suggestedValue}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Rendimiento</h2>
        {benchmarkResults.length > 0 && (
          <div className="text-gray-500">Resultados de Benchmark</div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="comparator">Comparador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Resumen general con KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Tasa de Aciertos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((cacheStats.hits / (cacheStats.hits + cacheStats.misses || 1)) * 100).toFixed(0)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Uso de Caché</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {cacheStats.size}/{cacheStats.capacity}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Transformaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {benchmarkResults.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysis?.recommendations.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Estadísticas de caché */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Estadísticas de Caché</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCacheStatsPieChart()}
              </CardContent>
            </Card>
            
            {/* Transformaciones más rápidas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Transformaciones más rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTopTransformations()}
              </CardContent>
            </Card>
          </div>
          
          {/* Rendimiento histórico */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Rendimiento Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              {renderHistoricalPerformanceChart()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <BenchmarkHistory />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Resumen de Optimización</CardTitle>
            </CardHeader>
            <CardContent>
              {renderOptimizationSummary()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparator" className="space-y-4">
          <TransformationComparator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
