/**
 * Field Mapper Performance History
 * 
 * Componente que muestra el historial de rendimiento del Field Mapper,
 * incluyendo tiempos de validación, renderizado y operaciones de caché.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { 
  ActivityIcon,
  ClockIcon,
  ServerIcon,
  CpuIcon,
  BarChart2Icon
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Tipo para los datos de rendimiento
type PerformanceDataPoint = {
  timestamp: number
  validationTime: number
  renderTime: number
  apiResponseTime: number
  cacheHitRate: number
  memoryUsage: number
}

// Simulación de datos de rendimiento (en una aplicación real, estos vendrían de un servicio)
const generateMockData = (): PerformanceDataPoint[] => {
  const now = Date.now()
  const data: PerformanceDataPoint[] = []
  
  // Generar datos para las últimas 24 horas, cada hora
  for (let i = 24; i >= 0; i--) {
    data?.push({
      timestamp: now - i * 60 * 60 * 1000,
      validationTime: Math.random() * 100 + 50, // 50-150ms
      renderTime: Math.random() * 30 + 10, // 10-40ms
      apiResponseTime: Math.random() * 300 + 200, // 200-500ms
      cacheHitRate: Math.random() * 0.5 + 0.4, // 40-90%
      memoryUsage: Math.random() * 20 + 10 // 10-30MB
    })
  }
  
  return data
}

export default function PerformanceHistory() {
  // Estado para los datos de rendimiento
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([])
  const [timeRange, setTimeRange] = useState<string>('24h')
  
  // Cargar datos de rendimiento
  useEffect(() => {
    // En una aplicación real, aquí se cargarían los datos desde un servicio
    // Por ahora, usamos datos simulados
    setPerformanceData(generateMockData())
  }, [])
  
  // Filtrar datos según el rango de tiempo seleccionado
  const filteredData = React.useMemo(() => {
    const now = Date.now()
    let timeFilter: number
    
    switch (timeRange) {
      case '1h':
        timeFilter = now - 60 * 60 * 1000 // 1 hora
        break
      case '6h':
        timeFilter = now - 6 * 60 * 60 * 1000 // 6 horas
        break
      case '24h':
      default:
        timeFilter = now - 24 * 60 * 60 * 1000 // 24 horas
        break
    }
    
    return performanceData?.filter(point => point.timestamp >= timeFilter)
  }, [performanceData, timeRange])
  
  // Formatear timestamp para el eje X
  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Formatear valores para el tooltip
  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'validationTime':
      case 'renderTime':
      case 'apiResponseTime':
        return `${value?.toFixed(1)} ms`
      case 'cacheHitRate':
        return `${(value * 100).toFixed(1)}%`
      case 'memoryUsage':
        return `${value?.toFixed(1)} MB`
      default:
        return value
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <ActivityIcon className="h-4 w-4" />
              Historial de Rendimiento
            </CardTitle>
            <CardDescription className="text-xs">
              Métricas de rendimiento del Field Mapper
            </CardDescription>
          </div>
          
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue placeholder="Rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Última hora</SelectItem>
              <SelectItem value="6h">6 horas</SelectItem>
              <SelectItem value="24h">24 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="times">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="times" className="text-xs">
              <ClockIcon className="h-3 w-3 mr-1" />
              Tiempos
            </TabsTrigger>
            <TabsTrigger value="cache" className="text-xs">
              <ServerIcon className="h-3 w-3 mr-1" />
              Caché
            </TabsTrigger>
            <TabsTrigger value="memory" className="text-xs">
              <CpuIcon className="h-3 w-3 mr-1" />
              Memoria
            </TabsTrigger>
            <TabsTrigger value="combined" className="text-xs">
              <BarChart2Icon className="h-3 w-3 mr-1" />
              Combinado
            </TabsTrigger>
          </TabsList>
          
          {/* Gráfico de tiempos */}
          <TabsContent value="times">
            <div className="h-[200px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="validationTime" 
                    name="Tiempo de validación" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="renderTime" 
                    name="Tiempo de renderizado" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="apiResponseTime" 
                    name="Tiempo de respuesta API" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Gráfico de caché */}
          <TabsContent value="cache">
            <div className="h-[200px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cacheHitRate" 
                    name="Tasa de aciertos de caché" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Gráfico de memoria */}
          <TabsContent value="memory">
            <div className="h-[200px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value} MB`}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="memoryUsage" 
                    name="Uso de memoria" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Gráfico combinado */}
          <TabsContent value="combined">
            <div className="h-[200px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="validationTime" 
                    name="Tiempo de validación" 
                    stroke="#8b5cf6" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="apiResponseTime" 
                    name="Tiempo de respuesta API" 
                    stroke="#3b82f6" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cacheHitRate" 
                    name="Tasa de aciertos de caché" 
                    stroke="#f97316" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
