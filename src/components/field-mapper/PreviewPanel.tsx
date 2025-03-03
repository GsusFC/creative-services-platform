'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useFieldMapperStore } from '@/lib/field-mapper/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon, AlertCircleIcon } from 'lucide-react'
import { fetchWithTimeout } from '@/lib/field-mapper/api'
import { transformData } from '@/lib/field-mapper/transformations'

interface PreviewData {
  notionData: Record<string, unknown> | null
  transformedData: Record<string, unknown> | null
  error: string | null
  isLoading: boolean
}

export default function PreviewPanel() {
  const [previewData, setPreviewData] = useState<PreviewData>({
    notionData: null,
    transformedData: null,
    error: null,
    isLoading: false,
  })
  
  const mappings = useFieldMapperStore(state => state?.mappings)
  const notionDatabaseId = useFieldMapperStore(state => state?.notionDatabaseId)
  
  // Fetch preview data from Notion
  const fetchPreviewData = async () => {
    if (!notionDatabaseId) {
      setPreviewData(prev => ({ ...prev, error: 'No se ha configurado un ID de base de datos de Notion' }))
      return
    }
    
    setPreviewData(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Fetch a sample entry from Notion database
      const response = await fetchWithTimeout(`/api/notion/database/sample?databaseId=${notionDatabaseId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response?.ok) {
        throw new Error(`Error al obtener datos de muestra: ${response?.statusText}`)
      }
      
      const notionData = await response?.json()
      
      // Transform the data based on current mappings
      const transformedData = transformData(notionData, mappings)
      
      setPreviewData({
        notionData,
        transformedData,
        error: null,
        isLoading: false,
      })
    } catch (error) {
      setPreviewData({
        notionData: null,
        transformedData: null,
        error: error instanceof Error ? error?.message : 'Error desconocido al obtener datos de vista previa',
        isLoading: false,
      })
    }
  }
  
  // Memoize the JSON display to prevent unnecessary re-renders
  const notionDataDisplay = useMemo(() => {
    return previewData?.notionData ? JSON?.stringify(previewData?.notionData, null, 2) : 'No hay datos disponibles'
  }, [previewData?.notionData])
  
  const transformedDataDisplay = useMemo(() => {
    return previewData?.transformedData ? JSON?.stringify(previewData?.transformedData, null, 2) : 'No hay datos disponibles'
  }, [previewData?.transformedData])
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Vista Previa
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPreviewData} 
            disabled={previewData?.isLoading}
          >
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${previewData?.isLoading ? 'animate-spin' : ''}`} />
            {previewData?.isLoading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </CardTitle>
        <CardDescription>
          Visualiza cómo se transformarán los datos de Notion con el mapeo actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        {previewData?.error && (
          <div className="bg-red-50 p-4 rounded-md mb-4 flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">{previewData?.error}</p>
          </div>
        )}
        
        <Tabs defaultValue="transformed">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="transformed" className="flex-1">Datos Transformados</TabsTrigger>
            <TabsTrigger value="original" className="flex-1">Datos Originales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transformed">
            <div className="bg-slate-50 p-4 rounded-md overflow-auto max-h-80">
              <pre className="text-xs">{transformedDataDisplay}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="original">
            <div className="bg-slate-50 p-4 rounded-md overflow-auto max-h-80">
              <pre className="text-xs">{notionDataDisplay}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
