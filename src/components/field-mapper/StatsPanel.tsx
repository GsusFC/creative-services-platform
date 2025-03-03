/**
 * Field Mapper Stats Panel
 * 
 * Este componente muestra estadísticas sobre el uso del Field Mapper,
 * incluyendo información sobre los mappings, tipos de campos, y validaciones.
 */

'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFieldMapperStore } from '@/lib/field-mapper/store'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { 
  BarChart3Icon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon,
  ListIcon,
  TagIcon
} from 'lucide-react'

export default function StatsPanel() {
  // Obtener datos del store
  const mappings = useFieldMapperStore(state => state?.mappings)
  const notionFields = useFieldMapperStore(state => state?.notionFields)
  const websiteFields = useFieldMapperStore(state => state?.websiteFields)
  
  // Calcular estadísticas
  const stats = useMemo(() => {
    // Contar mappings por estado
    const validMappings = mappings?.filter(m => 
      m?.notionField && 
      m?.websiteField && 
      m?.isValid !== false
    ).length
    
    const invalidMappings = mappings?.filter(m => 
      m?.notionField && 
      m?.websiteField && 
      m?.isValid === false
    ).length
    
    const incompleteMappings = mappings?.filter(m => 
      !m?.notionField || 
      !m?.websiteField
    ).length
    
    // Contar tipos de campos de Notion
    const notionTypeCount: Record<string, number> = {}
    notionFields?.forEach(field => {
      notionTypeCount[field?.type] = (notionTypeCount[field?.type] || 0) + 1
    })
    
    // Contar tipos de campos del sitio web
    const websiteTypeCount: Record<string, number> = {}
    websiteFields?.forEach(field => {
      websiteTypeCount[field?.type] = (websiteTypeCount[field?.type] || 0) + 1
    })
    
    // Contar campos mapeados
    const mappedNotionFields = new Set(mappings?.map(m => m?.notionField).filter(Boolean))
    const mappedWebsiteFields = new Set(mappings?.map(m => m?.websiteField).filter(Boolean))
    
    // Contar campos con transformaciones
    const withTransformations = mappings?.filter(m => m?.transformation).length
    
    const statsData: FieldMapping = {
      total: mappings?.length,
      valid: validMappings,
      invalid: invalidMappings,
      incomplete: incompleteMappings,
      notionTypeCount,
      websiteTypeCount,
      mappedNotionFields: mappedNotionFields?.size,
      mappedWebsiteFields: mappedWebsiteFields?.size,
      withTransformations,
      notionFieldsTotal: notionFields?.length,
      websiteFieldsTotal: websiteFields?.length,
      mappingCoverage: {
        notion: notionFields?.length > 0 
          ? (mappedNotionFields?.size / notionFields?.length) * 100 
          : 0,
        website: websiteFields?.length > 0 
          ? (mappedWebsiteFields?.size / websiteFields?.length) * 100 
          : 0
      }
    }
    
    return statsData
  }, [mappings, notionFields, websiteFields])
  
  // Datos para el gráfico de estado de mappings
  const mappingStatusData = [
    { name: 'Válidos', value: stats?.valid, color: '#22c55e' },
    { name: 'Inválidos', value: stats?.invalid, color: '#ef4444' },
    { name: 'Incompletos', value: stats?.incomplete, color: '#f59e0b' }
  ].filter(item => item?.value > 0)
  
  // Datos para el gráfico de cobertura
  const coverageData = [
    { name: 'Campos de Notion mapeados', value: stats?.mappingCoverage?.notion, color: '#3b82f6' },
    { name: 'Campos del sitio web mapeados', value: stats?.mappingCoverage?.website, color: '#8b5cf6' }
  ]
  
  // Convertir conteos de tipos a arrays para visualización
  const notionTypeData = Object.entries(stats?.notionTypeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b?.value - a?.value)
    .slice(0, 5) // Top 5
  
  const websiteTypeData = Object.entries(stats?.websiteTypeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b?.value - a?.value)
    
  // Colores para los gráficos
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6']
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3Icon className="h-4 w-4" />
          Estadísticas del Field Mapper
        </CardTitle>
        <CardDescription className="text-xs">
          Resumen de mappings y campos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado de mappings */}
          <div>
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
              <ListIcon className="h-3 w-3" />
              Estado de mappings
            </h4>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircleIcon className="h-3 w-3 text-green-500" />
                  <span>Válidos:</span>
                  <span className="font-mono">{stats?.valid}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <XCircleIcon className="h-3 w-3 text-red-500" />
                  <span>Inválidos:</span>
                  <span className="font-mono">{stats?.invalid}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <AlertCircleIcon className="h-3 w-3 text-amber-500" />
                  <span>Incompletos:</span>
                  <span className="font-mono">{stats?.incomplete}</span>
                </div>
                <div className="flex items-center gap-1 text-xs mt-1 font-medium">
                  <span>Total:</span>
                  <span className="font-mono">{stats?.total}</span>
                </div>
              </div>
              
              {/* Gráfico de estado */}
              <div className="h-[100px] w-[100px]">
                {mappingStatusData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mappingStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mappingStatusData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} mappings`, '']}
                        labelFormatter={(name) => `${name}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                    No hay datos
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cobertura de mappings */}
          <div>
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              Cobertura de mappings
            </h4>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Campos de Notion mapeados:</span>
                  <span className="font-mono">
                    {stats?.mappedNotionFields} / {stats?.notionFieldsTotal}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${stats?.mappingCoverage?.notion}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Campos del sitio web mapeados:</span>
                  <span className="font-mono">
                    {stats?.mappedWebsiteFields} / {stats?.websiteFieldsTotal}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full" 
                    style={{ width: `${stats?.mappingCoverage?.website}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Mappings con transformaciones:</span>
                  <span className="font-mono">
                    {stats?.withTransformations} / {stats?.total}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full" 
                    style={{ width: `${stats?.total > 0 ? (stats?.withTransformations / stats?.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tipos de campos */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-medium mb-2">Distribución de tipos de campos</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Tipos de Notion */}
              <div>
                <h5 className="text-xs text-gray-400 mb-1">Notion</h5>
                <div className="flex flex-wrap gap-1">
                  {notionTypeData?.map((type, index) => (
                    <Badge 
                      key={type?.name}
                      variant="outline" 
                      className="text-[10px]"
                      style={{ borderColor: COLORS[index % COLORS?.length] + '40' }}
                    >
                      {type?.name}: {type?.value}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Tipos del sitio web */}
              <div>
                <h5 className="text-xs text-gray-400 mb-1">Sitio web</h5>
                <div className="flex flex-wrap gap-1">
                  {websiteTypeData?.map((type, index) => (
                    <Badge 
                      key={type?.name}
                      variant="outline" 
                      className="text-[10px]"
                      style={{ borderColor: COLORS[index % COLORS?.length] + '40' }}
                    >
                      {type?.name}: {type?.value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
