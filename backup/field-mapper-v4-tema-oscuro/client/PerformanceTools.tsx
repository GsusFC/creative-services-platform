'use client';

/**
 * Herramientas de Rendimiento
 * 
 * Componente que proporciona herramientas para analizar y mejorar
 * el rendimiento del Field Mapper V4
 */

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import CacheStats from './CacheStats';
import { useTransformations } from '@/lib/field-mapper-v4/hooks';
import { transformations, Transformation } from '@/lib/field-mapper-v4/transformations';

// Datos de performance simulados para las transformaciones
interface PerformanceData {
  id: string;
  name: string;
  averageTime: number;
  executionCount: number;
  impact: 'low' | 'medium' | 'high';
}

export default function PerformanceTools() {
  const { getCacheStats } = useTransformations();
  const [activeTab, setActiveTab] = useState<string>('cache');
  
  // Simulación de datos de rendimiento
  const performanceData: PerformanceData[] = transformations.map(t => ({
    id: t.id,
    name: t.name,
    averageTime: getAverageTimeForImpact(t.performanceImpact),
    executionCount: Math.floor(Math.random() * 100),
    impact: t.performanceImpact
  }));
  
  // Ordenar por tiempo de ejecución
  const sortedPerformanceData = [...performanceData].sort((a, b) => b.averageTime - a.averageTime);
  
  return (
    <div className="bg-white rounded-lg border shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Herramientas de Rendimiento</h2>
        <p className="text-sm text-gray-500 mt-1">
          Analiza y optimiza el rendimiento de las transformaciones
        </p>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="cache" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cache">Caché</TabsTrigger>
            <TabsTrigger value="transformations">Transformaciones</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cache" className="pt-2">
            <CacheStats refreshInterval={3000} />
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      Las transformaciones con mayor impacto de rendimiento se benefician más del sistema de caché.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      La caché es especialmente útil cuando se procesan grandes volúmenes de datos.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      Considera aumentar el tamaño de la caché si trabajas con conjuntos de datos muy diversos.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transformations" className="pt-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Impacto de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sortedPerformanceData.slice(0, 10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis label={{ value: 'Tiempo (ms)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="averageTime" 
                        name="Tiempo promedio (ms)" 
                        fill={(data) => getColorForImpact(data.impact)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">Bajo impacto</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-xs">Impacto medio</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-xs">Alto impacto</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 space-y-4">
              {sortedPerformanceData.slice(0, 5).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Tiempo promedio: {item.averageTime.toFixed(2)} ms
                        </p>
                      </div>
                      <Badge 
                        variant={
                          item.impact === 'low' ? 'outline' : 
                          item.impact === 'medium' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {item.impact === 'low' ? 'Bajo impacto' : 
                         item.impact === 'medium' ? 'Impacto medio' : 
                         'Alto impacto'}
                      </Badge>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${Math.min(100, item.averageTime / 5 * 100)}%`,
                          backgroundColor: getColorForImpact(item.impact)
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="pt-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Métricas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData.filter(d => d.executionCount > 0).sort((a, b) => b.executionCount - a.executionCount).slice(0, 10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis label={{ value: 'Número de ejecuciones', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="executionCount" 
                        name="Ejecuciones" 
                        fill="#4f46e5"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Las transformaciones más utilizadas son candidatas 
                    ideales para optimizaciones adicionales.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Resumen de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Transformaciones</div>
                    <div className="text-xl font-medium">{transformations.length}</div>
                    <div className="text-xs text-gray-400 mt-1">total</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Caché</div>
                    <div className="text-xl font-medium">
                      {getCacheStats().size}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">entradas</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Alto impacto</div>
                    <div className="text-xl font-medium">
                      {performanceData.filter(d => d.impact === 'high').length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">transformaciones</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-1">Ejecuciones</div>
                    <div className="text-xl font-medium">
                      {performanceData.reduce((acc, curr) => acc + curr.executionCount, 0)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Obtener tiempo promedio simulado basado en el impacto
function getAverageTimeForImpact(impact: 'low' | 'medium' | 'high'): number {
  switch (impact) {
    case 'low':
      return Math.random() * 3 + 0.5; // 0.5-3.5ms
    case 'medium':
      return Math.random() * 8 + 3; // 3-11ms
    case 'high':
      return Math.random() * 20 + 10; // 10-30ms
    default:
      return 1;
  }
}

// Obtener color basado en el impacto
function getColorForImpact(impact: 'low' | 'medium' | 'high'): string {
  switch (impact) {
    case 'low':
      return '#22c55e'; // green-500
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'high':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
}
