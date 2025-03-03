import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import Progress from '@/components/ui/progress';

interface CacheStatsProps {
  cacheService?: {
    getStats: () => CacheStats;
    clearCache: () => void;
  };
}

interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  avgAccessTime: number;
  oldestItem: string;
  newestItem: string;
  evictions: number;
  transformationStats: {
    [key: string]: {
      hits: number;
      misses: number;
      avgTime: number;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CacheStats: React.FC<CacheStatsProps> = ({ cacheService }) => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados para desarrollo
  const mockStats: CacheStats = {
    size: 128,
    maxSize: 500,
    hits: 1245,
    misses: 312,
    hitRate: 0.8,
    avgAccessTime: 0.23,
    oldestItem: '2023-06-15T10:30:00Z',
    newestItem: '2023-06-18T14:22:33Z',
    evictions: 42,
    transformationStats: {
      'text-to-number': { hits: 456, misses: 78, avgTime: 0.15 },
      'date-to-string': { hits: 321, misses: 45, avgTime: 0.18 },
      'checkbox-to-text': { hits: 234, misses: 56, avgTime: 0.12 },
      'select-to-text': { hits: 189, misses: 67, avgTime: 0.25 },
      'relation-to-text': { hits: 45, misses: 66, avgTime: 0.35 }
    }
  };

  useEffect(() => {
    const fetchStats = () => {
      if (cacheService) {
        try {
          const currentStats = cacheService.getStats();
          setStats(currentStats);
        } catch (error) {
          console.error('Error al obtener estadísticas de caché:', error);
          // Usar datos simulados en desarrollo
          setStats(mockStats);
        }
      } else {
        // Usar datos simulados en desarrollo
        setStats(mockStats);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [cacheService]);

  const handleClearCache = () => {
    if (cacheService) {
      cacheService.clearCache();
      // Actualizar estadísticas después de limpiar
      const updatedStats = cacheService.getStats();
      setStats(updatedStats);
    } else {
      // Simular limpieza en desarrollo
      setStats({
        ...mockStats,
        size: 0,
        hits: 0,
        misses: 0,
        evictions: 0,
        transformationStats: Object.fromEntries(
          Object.entries(mockStats.transformationStats).map(([key]) => [
            key,
            { hits: 0, misses: 0, avgTime: 0 }
          ])
        )
      });
    }
  };

  if (!stats) {
    return <div className="p-4">Cargando estadísticas de caché...</div>;
  }

  // Preparar datos para gráficos
  const hitMissData = [
    { name: 'Aciertos', value: stats.hits },
    { name: 'Fallos', value: stats.misses }
  ];

  const transformationData = Object.entries(stats.transformationStats).map(
    ([name, data]) => ({
      name,
      hits: data.hits,
      misses: data.misses,
      avgTime: data.avgTime
    })
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Estadísticas de Caché</CardTitle>
          <Button 
            variant="outline" 
            onClick={handleClearCache}
            aria-label="Limpiar caché"
          >
            Limpiar Caché
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="transformations">Transformaciones</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Uso de Caché</h3>
                <Progress value={(stats.size / stats.maxSize) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {stats.size} de {stats.maxSize} elementos ({Math.round((stats.size / stats.maxSize) * 100)}%)
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Tasa de Aciertos</h3>
                <Progress value={stats.hitRate * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(stats.hitRate * 100)}% ({stats.hits} aciertos, {stats.misses} fallos)
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-sm font-medium">Tiempo Promedio de Acceso</h3>
                <p className="text-lg font-semibold">{stats.avgAccessTime.toFixed(3)} ms</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Desalojos</h3>
                <p className="text-lg font-semibold">{stats.evictions}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Elemento más Antiguo</h3>
                <p className="text-sm">{formatDate(stats.oldestItem)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Elemento más Reciente</h3>
                <p className="text-sm">{formatDate(stats.newestItem)}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transformations">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1">Transformación</th>
                    <th className="text-right py-2 px-1">Aciertos</th>
                    <th className="text-right py-2 px-1">Fallos</th>
                    <th className="text-right py-2 px-1">Tasa</th>
                    <th className="text-right py-2 px-1">Tiempo Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.transformationStats).map(([name, data], index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-1">{name}</td>
                      <td className="text-right py-2 px-1">{data.hits}</td>
                      <td className="text-right py-2 px-1">{data.misses}</td>
                      <td className="text-right py-2 px-1">
                        {data.hits + data.misses > 0
                          ? `${Math.round((data.hits / (data.hits + data.misses)) * 100)}%`
                          : 'N/A'}
                      </td>
                      <td className="text-right py-2 px-1">{data.avgTime.toFixed(3)} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">Aciertos vs Fallos</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hitMissData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {hitMissData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">Rendimiento por Transformación</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transformationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hits" fill="#0088FE" name="Aciertos" />
                    <Bar dataKey="misses" fill="#FF8042" name="Fallos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CacheStats;
