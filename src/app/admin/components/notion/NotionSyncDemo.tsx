'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileImage, Video, Check, X } from "lucide-react"

type NotionCase = {
  id: string
  title: string
  description: string
  status: string
  tags: string[]
  imageCount: number
  videoCount: number
}

export function NotionSyncDemo() {
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState<NotionCase[]>([])
  
  // Función que realiza la sincronización con Notion a través del servidor MCP
  const syncWithMCP = async () => {
    setLoading(true)
    
    try {
      // Usar el nuevo servicio MCP para obtener los case studies
      const response = await fetch('/api/notion/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: 'github.com/pashpashpash/mcp-notion-server',
          tool: 'notion_query_database',
          args: {
            database_id: process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'],
            filter: {
              property: 'Status',
              select: {
                equals: 'Listo'
              }
            },
            sorts: [
              {
                property: 'Brand Name',
                direction: 'ascending'
              }
            ]
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al sincronizar con Notion: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transformar la respuesta al formato que espera el componente
      const mappedCases = data.results.map((study: any) => ({
        id: study.id,
        title: study.title,
        description: study.description.substring(0, 100) + (study.description.length > 100 ? '...' : ''),
        status: study.status,
        tags: study.tags || [],
        imageCount: study.mediaItems?.filter((item: any) => item.type === 'image').length || 0,
        videoCount: study.mediaItems?.filter((item: any) => item.type === 'video').length || 0
      }));
      
      setCases(mappedCases);
    } catch (error) {
      console.error("Error al sincronizar con Notion:", error)
    } finally {
      setLoading(false)
    }
  }

  // Determina el color del estado basado en el status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Listo': return 'bg-green-500'
      case 'En progreso': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sincronización con Notion MCP</CardTitle>
        <CardDescription>
          Utiliza el servidor MCP de Notion para sincronizar tus case studies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Este panel de control muestra como el servidor MCP de Notion puede integrarse con tu plataforma para sincronizar los case studies.
          </p>
          
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm mb-4">
            <p className="font-mono mb-2">• Los case studies con estado <span className="font-semibold">&quot;Listo&quot;</span> se publicarán automáticamente</p>
            <p className="font-mono mb-2">• Las imágenes se descargarán a <span className="font-semibold">/public/case-studies/{'{slug}'}</span></p>
            <p className="font-mono">• Los datos textuales se guardarán en <span className="font-semibold">/data/case-studies/{'{id}'}.json</span></p>
          </div>
        </div>
        
        {cases.length > 0 ? (
          <div className="space-y-4">
            {cases.map(item => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description || "Sin descripción"}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FileImage size={14} /> 
                      <span>{item.imageCount} imágenes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video size={14} /> 
                      <span>{item.videoCount} videos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.status === 'Listo' ? 'Se publicará' : 'No se publicará'}
                    </span>
                    {item.status === 'Listo' ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">Haz clic en &quot;Sincronizar con Notion&quot; para ver los case studies disponibles</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={loading}>
          <ExternalLink size={14} className="mr-2" />
          Ver en Notion
        </Button>
        <Button onClick={syncWithMCP} disabled={loading}>
          {loading ? 'Sincronizando...' : 'Sincronizar con Notion'}
        </Button>
      </CardFooter>
    </Card>
  )
}
