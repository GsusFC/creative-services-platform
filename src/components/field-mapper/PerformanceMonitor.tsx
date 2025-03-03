/**
 * Field Mapper Performance Monitor
 * 
 * Este componente proporciona métricas de rendimiento para el Field Mapper,
 * ayudando a identificar cuellos de botella y optimizar el rendimiento.
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Progress from '@/components/ui/progress';
import { validationCache } from '@/lib/field-mapper/cache-service'
import { useFieldMapperStore } from '@/lib/field-mapper/store'
import { 
  BarChart3Icon, 
  RefreshCwIcon, 
  ClockIcon, 
  DatabaseIcon, 
  CpuIcon,
  MemoryStickIcon,
  ZapIcon,
  LayoutGridIcon
} from 'lucide-react'

// Interfaz para las métricas de rendimiento
interface PerformanceMetrics {
  renderTime: number
  validationTime: number
  apiResponseTime: number
  memoryUsage: number
  cacheStats: {
    size: number
    maxSize: number
    hitRate: number
    oldestEntry: number
    newestEntry: number
  }
  renderCount: number
  lastUpdated: number
}

export default function PerformanceMonitor() {
  // Estado para las métricas
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    validationTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    cacheStats: {
      size: 0,
      maxSize: 0,
      hitRate: 0,
      oldestEntry: 0,
      newestEntry: 0
    },
    renderCount: 0,
    lastUpdated: Date.now()
  })
  
  // Referencias para medir tiempos
  const renderStartTime = useRef(0)
  const renderCount = useRef(0)
  
  // Obtener datos del store
  const mappings = useFieldMapperStore(state => state?.mappings)
  const lastValidated = useFieldMapperStore(state => state?.lastValidated)
  const lastUpdated = useFieldMapperStore(state => state?.lastUpdated)
  
  // Actualizar métricas cuando cambian los mappings
  useEffect(() => {
    // Incrementar contador de renderizados
    renderCount.current += 1
    
    // Obtener estadísticas del caché
    const cacheStats = validationCache?.getStats()
    
    // Estimar uso de memoria
    const estimatedMemoryUsage = 
      JSON?.stringify(mappings).length * 2 + // Mappings
      (cacheStats?.size * 200) // Caché (estimación aproximada)
    
    // Calcular tiempo de renderizado
    const currentRenderTime = renderStartTime?.current > 0
      ? performance?.now() - renderStartTime?.current
      : 0
    
    // Actualizar métricas
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.max(prev.renderTime, currentRenderTime),
      memoryUsage: estimatedMemoryUsage,
      cacheStats,
      renderCount: renderCount.current,
      lastUpdated: Date.now()
    }))
    
    // Resetear tiempo de inicio para el próximo renderizado
    if (renderStartTime && renderStartTime.current) {
      renderStartTime.current = performance?.now() || 0;
    }
  }, [mappings])
  
  // Actualizar métricas cuando cambia lastValidated
  useEffect(() => {
    if (lastValidated) {
      setMetrics(prev => ({
        ...prev,
        validationTime: lastValidated?.validationTime ?? 0,
        lastUpdated: Date.now()
      }))
    }
  }, [lastValidated])
  
  // Actualizar métricas cuando cambia lastUpdated
  useEffect(() => {
    if (lastUpdated) {
      setMetrics(prev => ({
        ...prev,
        apiResponseTime: lastUpdated?.apiResponseTime ?? 0,
        lastUpdated: Date.now()
      }))
    }
  }, [lastUpdated])
  
  // Función para actualizar métricas manualmente
  const refreshMetrics = () => {
    // Obtener estadísticas del caché
    const cacheStats = validationCache?.getStats()
    
    // Estimar uso de memoria
    const estimatedMemoryUsage = 
      JSON?.stringify(mappings).length * 2 + // Mappings
      (cacheStats?.size * 200) // Caché (estimación aproximada)
    
    // Actualizar métricas
    setMetrics(prev => ({
      ...prev,
      memoryUsage: estimatedMemoryUsage,
      cacheStats,
      lastUpdated: Date.now()
    }))
  }
  
  // Formatear bytes para mostrar
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  
  // Formatear milisegundos para mostrar
  const formatMs = (ms: number) => {
    if (ms < 1) return '<1 ms'
    if (ms < 1000) return `${ms.toFixed(2)} ms`
    return `${(ms / 1000).toFixed(2)} s`
  }
  
  // Formatear porcentaje para mostrar
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }
  
  // Formatear fecha para mostrar
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }
  
  // Calcular nivel de rendimiento
  const getPerformanceLevel = (metric: 'renderTime' | 'validationTime' | 'apiResponseTime') => {
    const value = metrics[metric]
    
    if (metric === 'renderTime') {
      if (value < 16) return 'good' // 60 FPS
      if (value < 33) return 'medium' // 30 FPS
      return 'poor'
    }
    
    if (metric === 'validationTime') {
      if (value < 50) return 'good'
      if (value < 200) return 'medium'
      return 'poor'
    }
    
    if (metric === 'apiResponseTime') {
      if (value < 300) return 'good'
      if (value < 1000) return 'medium'
      return 'poor'
    }
    
    return 'medium'
  }
  
  const performanceMetrics: PerformanceMetrics = {
    renderTime: metrics.renderTime,
    validationTime: metrics.validationTime,
    apiResponseTime: metrics.apiResponseTime,
    memoryUsage: metrics.memoryUsage,
    cacheStats: metrics.cacheStats,
    renderCount: metrics.renderCount,
    lastUpdated: metrics.lastUpdated
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              Monitor de Rendimiento
            </CardTitle>
            <CardDescription className="text-xs">
              Última actualización: {formatDate(metrics.lastUpdated)}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2"
            onClick={refreshMetrics}
          >
            <RefreshCwIcon className="h-3 w-3 mr-1" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="performance">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="performance" className="text-xs">Rendimiento</TabsTrigger>
            <TabsTrigger value="memory" className="text-xs">Memoria</TabsTrigger>
            <TabsTrigger value="cache" className="text-xs">Caché</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-3 pt-2">
            {/* Tiempo de renderizado */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Tiempo de renderizado
                </div>
                <div className={`
                  text-xs font-mono
                  ${getPerformanceLevel('renderTime') === 'good' ? 'text-green-400' : ''}
                  ${getPerformanceLevel('renderTime') === 'medium' ? 'text-amber-400' : ''}
                  ${getPerformanceLevel('renderTime') === 'poor' ? 'text-red-400' : ''}
                `}>
                  {formatMs(metrics.renderTime)}
                </div>
              </div>
              <Progress 
                value={Math.min(100, (metrics.renderTime / 50) * 100)} 
                className={`
                  h-1.5
                  ${getPerformanceLevel('renderTime') === 'good' ? 'bg-green-950 text-green-600' : ''}
                  ${getPerformanceLevel('renderTime') === 'medium' ? 'bg-amber-950 text-amber-600' : ''}
                  ${getPerformanceLevel('renderTime') === 'poor' ? 'bg-red-950 text-red-600' : ''}
                `}
              />
            </div>
            
            {/* Tiempo de validación */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium flex items-center gap-1">
                  <ZapIcon className="h-3 w-3" />
                  Tiempo de validación
                </div>
                <div className={`
                  text-xs font-mono
                  ${getPerformanceLevel('validationTime') === 'good' ? 'text-green-400' : ''}
                  ${getPerformanceLevel('validationTime') === 'medium' ? 'text-amber-400' : ''}
                  ${getPerformanceLevel('validationTime') === 'poor' ? 'text-red-400' : ''}
                `}>
                  {formatMs(metrics.validationTime)}
                </div>
              </div>
              <Progress 
                value={Math.min(100, (metrics.validationTime / 300) * 100)} 
                className={`
                  h-1.5
                  ${getPerformanceLevel('validationTime') === 'good' ? 'bg-green-950 text-green-600' : ''}
                  ${getPerformanceLevel('validationTime') === 'medium' ? 'bg-amber-950 text-amber-600' : ''}
                  ${getPerformanceLevel('validationTime') === 'poor' ? 'bg-red-950 text-red-600' : ''}
                `}
              />
            </div>
            
            {/* Tiempo de respuesta API */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium flex items-center gap-1">
                  <DatabaseIcon className="h-3 w-3" />
                  Tiempo de respuesta API
                </div>
                <div className={`
                  text-xs font-mono
                  ${getPerformanceLevel('apiResponseTime') === 'good' ? 'text-green-400' : ''}
                  ${getPerformanceLevel('apiResponseTime') === 'medium' ? 'text-amber-400' : ''}
                  ${getPerformanceLevel('apiResponseTime') === 'poor' ? 'text-red-400' : ''}
                `}>
                  {formatMs(metrics.apiResponseTime)}
                </div>
              </div>
              <Progress 
                value={Math.min(100, (metrics.apiResponseTime / 2000) * 100)} 
                className={`
                  h-1.5
                  ${getPerformanceLevel('apiResponseTime') === 'good' ? 'bg-green-950 text-green-600' : ''}
                  ${getPerformanceLevel('apiResponseTime') === 'medium' ? 'bg-amber-950 text-amber-600' : ''}
                  ${getPerformanceLevel('apiResponseTime') === 'poor' ? 'bg-red-950 text-red-600' : ''}
                `}
              />
            </div>
            
            {/* Contador de renderizados */}
            <div className="flex justify-between items-center text-xs pt-2">
              <div className="flex items-center gap-1">
                <CpuIcon className="h-3 w-3" />
                Renderizados
              </div>
              <div className="font-mono">{metrics.renderCount}</div>
            </div>
          </TabsContent>
          
          <TabsContent value="memory" className="space-y-3 pt-2">
            {/* Uso de memoria */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium flex items-center gap-1">
                  <MemoryStickIcon className="h-3 w-3" />
                  Uso estimado de memoria
                </div>
                <div className="text-xs font-mono">
                  {formatBytes(metrics.memoryUsage)}
                </div>
              </div>
              <Progress 
                value={Math.min(100, (metrics.memoryUsage / (1024 * 1024)) * 100)} 
                className="h-1.5 bg-blue-950 text-blue-600"
              />
            </div>
            
            {/* Detalles de memoria */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex justify-between items-center">
                <span>Mappings:</span>
                <span className="font-mono">{mappings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tamaño JSON:</span>
                <span className="font-mono">{formatBytes(JSON.stringify(mappings).length * 2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Entradas en caché:</span>
                <span className="font-mono">{metrics.cacheStats.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Memoria de caché:</span>
                <span className="font-mono">{formatBytes(metrics.cacheStats.size * 200)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cache" className="space-y-3 pt-2">
            {/* Estadísticas de caché */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium flex items-center gap-1">
                  <LayoutGridIcon className="h-3 w-3" />
                  Uso de caché
                </div>
                <div className="text-xs font-mono">
                  {metrics.cacheStats.size} / {metrics.cacheStats.maxSize}
                </div>
              </div>
              <Progress 
                value={(metrics.cacheStats.size / metrics.cacheStats.maxSize) * 100} 
                className="h-1.5 bg-purple-950 text-purple-600"
              />
            </div>
            
            {/* Tasa de aciertos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium">
                  Tasa de aciertos
                </div>
                <div className="text-xs font-mono">
                  {formatPercent(metrics.cacheStats.hitRate)}
                </div>
              </div>
              <Progress 
                value={metrics.cacheStats.hitRate * 100} 
                className="h-1.5 bg-green-950 text-green-600"
              />
            </div>
            
            {/* Detalles de caché */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex justify-between items-center">
                <span>Entrada más antigua:</span>
                <span className="font-mono">{formatDate(metrics.cacheStats.oldestEntry)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Entrada más reciente:</span>
                <span className="font-mono">{formatDate(metrics.cacheStats.newestEntry)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
