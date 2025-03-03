import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { AlertCircle, Zap, RotateCw, Download } from 'lucide-react';
import CacheStats from './CacheStats';
import TransformationVisualizer from './TransformationVisualizer';

interface PerformanceToolsProps {
  cacheService?: any;
  transformationService?: any;
  onExportData?: () => void;
  onOptimize?: () => Promise<{ optimized: number; timeReduced: number }>;
}

// Datos simulados para el panel de rendimiento
const generateMockPerformanceData = () => {
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now - (23 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.push({
      time,
      transformationTime: Math.random() * 10 + 5,
      cacheHitRate: Math.min(100, Math.max(50, 70 + Math.sin(i / 3) * 20)),
      operations: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return data;
};

const mockPerformanceData = generateMockPerformanceData();

const mockTransformationPerformance = [
  { name: 'text-to-number', avgTime: 2.3, cached: 85, uncached: 12.1 },
  { name: 'date-to-string', avgTime: 3.8, cached: 1.2, uncached: 8.5 },
  { name: 'checkbox-to-text', avgTime: 1.1, cached: 0.8, uncached: 3.2 },
  { name: 'select-to-text', avgTime: 4.2, cached: 1.5, uncached: 9.8 },
  { name: 'relation-to-text', avgTime: 7.6, cached: 2.1, uncached: 15.3 }
];

const PerformanceTools: React.FC<PerformanceToolsProps> = ({
  cacheService,
  transformationService,
  onExportData,
  onOptimize
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{ optimized: number; timeReduced: number } | null>(null);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [cacheTTL, setCacheTTL] = useState(3600);
  const [maxCacheSize, setMaxCacheSize] = useState(500);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    try {
      if (onOptimize) {
        const result = await onOptimize();
        setOptimizationResult(result);
      } else {
        // Simulación para desarrollo
        await new Promise(resolve => setTimeout(resolve, 2000));
        setOptimizationResult({
          optimized: Math.floor(Math.random() * 20) + 5,
          timeReduced: Math.floor(Math.random() * 500) + 100
        });
      }
    } catch (error) {
      console.error('Error al optimizar:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExportData = () => {
    if (onExportData) {
      onExportData();
    } else {
      // Simulación para desarrollo
      const dataStr = JSON.stringify(mockPerformanceData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'performance-data.json');
      linkElement.click();
    }
  };

  const handleCacheConfigChange = (enabled: boolean, ttl: number, size: number) => {
    setCacheEnabled(enabled);
    setCacheTTL(ttl);
    setMaxCacheSize(size);
    
    // Aquí se implementaría la actualización real de la configuración
    console.log('Configuración de caché actualizada:', { enabled, ttl, size });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Panel Principal</TabsTrigger>
          <TabsTrigger value="cache">Caché</TabsTrigger>
          <TabsTrigger value="transformations">Transformaciones</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento en Tiempo Real</CardTitle>
                <CardDescription>Tiempos de transformación y tasa de aciertos de caché</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="transformationTime" 
                        name="Tiempo (ms)" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="cacheHitRate" 
                        name="Tasa de Aciertos (%)" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Transformación</CardTitle>
                <CardDescription>Comparación de tiempos con y sin caché</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTransformationPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cached" name="Con Caché (ms)" fill="#82ca9d" />
                      <Bar dataKey="uncached" name="Sin Caché (ms)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Optimizaciones</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportData}
                      aria-label="Exportar datos"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      aria-label="Optimizar rendimiento"
                    >
                      {isOptimizing ? (
                        <RotateCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Optimizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {optimizationResult ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="font-medium text-green-800 mb-2">Optimización Completada</h3>
                    <p className="text-green-700 mb-1">
                      Se optimizaron {optimizationResult.optimized} transformaciones
                    </p>
                    <p className="text-green-700">
                      Tiempo estimado reducido: {optimizationResult.timeReduced} ms
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Recomendaciones</h3>
                      <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
                        <li>Habilite la caché para transformaciones frecuentes</li>
                        <li>Aumente el TTL para transformaciones estables</li>
                        <li>Considere pre-calcular transformaciones costosas</li>
                        <li>Utilice el botón "Optimizar" para aplicar mejoras automáticas</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cache">
          <CacheStats cacheService={cacheService} />
        </TabsContent>
        
        <TabsContent value="transformations">
          <TransformationVisualizer transformationService={transformationService} />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Rendimiento</CardTitle>
              <CardDescription>Ajuste la configuración para optimizar el rendimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Configuración de Caché</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cache-enabled">Habilitar Caché</Label>
                    <p className="text-sm text-gray-500">
                      Almacena resultados de transformaciones frecuentes
                    </p>
                  </div>
                  <Switch
                    id="cache-enabled"
                    checked={cacheEnabled}
                    onCheckedChange={(checked) => {
                      handleCacheConfigChange(checked, cacheTTL, maxCacheSize);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cache-ttl">Tiempo de Vida (TTL)</Label>
                    <span className="text-sm text-gray-500">{cacheTTL} segundos</span>
                  </div>
                  <Slider
                    id="cache-ttl"
                    disabled={!cacheEnabled}
                    value={[cacheTTL]}
                    min={60}
                    max={86400}
                    step={60}
                    onValueChange={(value) => {
                      setCacheTTL(value[0]);
                    }}
                    onValueCommit={(value) => {
                      handleCacheConfigChange(cacheEnabled, value[0], maxCacheSize);
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 minuto</span>
                    <span>1 día</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cache-size">Tamaño Máximo de Caché</Label>
                    <span className="text-sm text-gray-500">{maxCacheSize} elementos</span>
                  </div>
                  <Slider
                    id="cache-size"
                    disabled={!cacheEnabled}
                    value={[maxCacheSize]}
                    min={100}
                    max={2000}
                    step={100}
                    onValueChange={(value) => {
                      setMaxCacheSize(value[0]);
                    }}
                    onValueCommit={(value) => {
                      handleCacheConfigChange(cacheEnabled, cacheTTL, value[0]);
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100</span>
                    <span>2000</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Estrategias de Optimización</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-optimize">Optimización Automática</Label>
                    <p className="text-sm text-gray-500">
                      Analiza y optimiza transformaciones periódicamente
                    </p>
                  </div>
                  <Switch id="auto-optimize" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="precompute">Pre-calcular Transformaciones</Label>
                    <p className="text-sm text-gray-500">
                      Calcula transformaciones comunes al cargar
                    </p>
                  </div>
                  <Switch id="precompute" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="batch-processing">Procesamiento por Lotes</Label>
                    <p className="text-sm text-gray-500">
                      Agrupa transformaciones similares para mayor eficiencia
                    </p>
                  </div>
                  <Switch id="batch-processing" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleOptimize} disabled={isOptimizing}>
                  {isOptimizing ? (
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Aplicar Optimizaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceTools;
