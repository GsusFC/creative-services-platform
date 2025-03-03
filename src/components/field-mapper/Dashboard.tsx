/**
 * Field Mapper Dashboard
 * 
 * Panel de control principal que integra todos los componentes de monitoreo
 * y estadísticas del Field Mapper.
 */

'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboardIcon, 
  BarChart4Icon, 
  ActivityIcon, 
  Settings2Icon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

// Importar componentes de monitoreo
import StatsPanel from './StatsPanel'
import PerformanceMonitor from './PerformanceMonitor'
import PerformanceHistory from './PerformanceHistory'
import { performanceService } from '@/lib/field-mapper/performance-service'

// Tipo para los problemas detectados
type Issue = {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: number
  resolved: boolean
}

// Simulación de problemas detectados
const mockIssues: Issue[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Tiempo de validación excesivo',
    description: 'El tiempo de validación de tipos supera los 500ms en promedio, lo que puede causar bloqueos en la interfaz de usuario.',
    timestamp: Date?.now() - 1000 * 60 * 30, // 30 minutos atrás
    resolved: false
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Baja tasa de aciertos de caché',
    description: 'La tasa de aciertos de caché es inferior al 40%, lo que indica que la estrategia de caché podría mejorarse.',
    timestamp: Date?.now() - 1000 * 60 * 120, // 2 horas atrás
    resolved: false
  },
  {
    id: '3',
    severity: 'info',
    title: 'Campos sin mapear',
    description: 'Hay 5 campos de Notion que no están mapeados a campos del sitio web.',
    timestamp: Date?.now() - 1000 * 60 * 240, // 4 horas atrás
    resolved: true
  }
]

export default function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  
  // Contar problemas por severidad
  const criticalCount = issues?.filter(i => i?.severity === 'critical' && !i?.resolved).length
  const warningCount = issues?.filter(i => i?.severity === 'warning' && !i?.resolved).length
  const infoCount = issues?.filter(i => i?.severity === 'info' && !i?.resolved).length
  
  // Función para actualizar los datos
  const refreshData = () => {
    // En una aplicación real, aquí se actualizarían los datos
    // Por ahora, solo actualizamos la marca de tiempo
    setLastRefresh(new Date())
    
    // Capturar un nuevo snapshot de rendimiento
    performanceService?.captureSnapshot()
  }
  
  // Función para marcar un problema como resuelto
  const resolveIssue = (id: string) => {
    setIssues(issues?.map(issue => 
      issue?.id === id ? { ...issue, resolved: true } : issue
    ))
  }
  
  // Efecto para auto-refrescar
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData()
      }, 60000) // Actualizar cada minuto
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Field Mapper Dashboard</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-xs">Auto-refresh</Label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            className="h-8 gap-1"
          >
            <RefreshCwIcon className="h-3.5 w-3.5" />
            <span className="text-xs">Actualizar</span>
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Última actualización: {lastRefresh?.toLocaleString()}
      </div>
      
      {/* Resumen de problemas */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="flex gap-2 flex-wrap">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircleIcon className="h-3 w-3" />
              {criticalCount} {criticalCount === 1 ? 'problema crítico' : 'problemas críticos'}
            </Badge>
          )}
          
          {warningCount > 0 && (
            <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500">
              <AlertCircleIcon className="h-3 w-3" />
              {warningCount} {warningCount === 1 ? 'advertencia' : 'advertencias'}
            </Badge>
          )}
          
          {infoCount > 0 && (
            <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
              <AlertCircleIcon className="h-3 w-3" />
              {infoCount} {infoCount === 1 ? 'sugerencia' : 'sugerencias'}
            </Badge>
          )}
        </div>
      )}
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="text-xs">
            <LayoutDashboardIcon className="h-3.5 w-3.5 mr-1.5" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            <ActivityIcon className="h-3.5 w-3.5 mr-1.5" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <BarChart4Icon className="h-3.5 w-3.5 mr-1.5" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings2Icon className="h-3.5 w-3.5 mr-1.5" />
            Configuración
          </TabsTrigger>
        </TabsList>
        
        {/* Pestaña de resumen */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsPanel />
            <PerformanceMonitor />
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4" />
                Problemas detectados
              </CardTitle>
              <CardDescription className="text-xs">
                Problemas y advertencias que requieren atención
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {issues?.filter(i => !i?.resolved).length === 0 ? (
                    <div className="flex items-center justify-center h-[100px] text-sm text-muted-foreground">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                      No se han detectado problemas
                    </div>
                  ) : (
                    issues
                      .filter(i => !i?.resolved)
                      .sort((a, b) => {
                        // Ordenar por severidad y luego por timestamp
                        const severityOrder = { critical: 0, warning: 1, info: 2 }
                        const severityDiff = severityOrder[a?.severity] - severityOrder[b?.severity]
                        if (severityDiff !== 0) return severityDiff
                        return b?.timestamp - a?.timestamp
                      })
                      .map(issue => (
                        <Alert 
                          key={issue?.id}
                          variant={
                            issue?.severity === 'critical' ? 'destructive' : 
                            'default'
                          }
                          className="py-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <AlertTitle className="text-xs font-medium flex items-center gap-1.5">
                                {issue?.severity === 'critical' && <AlertCircleIcon className="h-3.5 w-3.5" />}
                                {issue?.severity === 'warning' && <AlertCircleIcon className="h-3.5 w-3.5" />}
                                {issue?.severity === 'info' && <AlertCircleIcon className="h-3.5 w-3.5" />}
                                {issue?.title}
                              </AlertTitle>
                              <AlertDescription className="text-xs mt-1">
                                {issue?.description}
                              </AlertDescription>
                              <div className="text-[10px] text-muted-foreground mt-1">
                                Detectado: {new Date(issue?.timestamp).toLocaleString()}
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-[10px]"
                              onClick={() => resolveIssue(issue?.id)}
                            >
                              Resolver
                            </Button>
                          </div>
                        </Alert>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pestaña de rendimiento */}
        <TabsContent value="performance" className="space-y-4">
          <PerformanceHistory />
          <PerformanceMonitor />
        </TabsContent>
        
        {/* Pestaña de estadísticas */}
        <TabsContent value="stats">
          <div className="space-y-4 py-4">
            <StatsPanel />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Historial de actividad</CardTitle>
                <CardDescription className="text-xs">
                  Registro de operaciones recientes
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {/* Aquí iría un registro de actividad real */}
                    {Array?.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="text-xs p-2 border border-border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {i % 3 === 0 ? 'Validación de tipos' : 
                             i % 3 === 1 ? 'Actualización de mapping' : 
                             'Carga de datos'}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(Date?.now() - i * 1000 * 60 * 5).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {i % 3 === 0 ? 'Validación completada en 78ms' : 
                           i % 3 === 1 ? 'Mapping actualizado correctamente' : 
                           'Datos cargados desde la caché'}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de configuración */}
        <TabsContent value="settings">
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuración de rendimiento</CardTitle>
                <CardDescription className="text-xs">
                  Ajusta la configuración para optimizar el rendimiento
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cache-enabled" className="text-sm">Caché habilitada</Label>
                      <Switch id="cache-enabled" defaultChecked />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Habilita o deshabilita el sistema de caché para validaciones de tipo
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="worker-enabled" className="text-sm">Web Worker para validaciones</Label>
                      <Switch id="worker-enabled" defaultChecked />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Utiliza un web worker para ejecutar validaciones complejas sin bloquear la UI
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="virtualization-enabled" className="text-sm">Virtualización de listas</Label>
                      <Switch id="virtualization-enabled" defaultChecked />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Renderiza solo los elementos visibles en la pantalla para mejorar el rendimiento
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monitoring-enabled" className="text-sm">Monitoreo de rendimiento</Label>
                      <Switch id="monitoring-enabled" defaultChecked />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Registra métricas de rendimiento para análisis y optimización
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">Guardar configuración</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Acciones de mantenimiento</CardTitle>
                <CardDescription className="text-xs">
                  Acciones para mantener el rendimiento óptimo
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    Limpiar caché
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    Reiniciar worker
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    Exportar datos de rendimiento
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    Restablecer configuración predeterminada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
