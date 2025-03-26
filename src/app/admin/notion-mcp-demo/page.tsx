'use client'

import { NotionSyncDemo } from '../components/notion/NotionSyncDemo'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotionMCPDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white p-8">
      {/* Cabecera */}
      <div className="flex items-center mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
            <ArrowLeft size={16} />
            <span>Volver al Dashboard</span>
          </Button>
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Demostración de MCP con Notion</h1>
          <p className="text-gray-400 mb-6">
            Esta demostración utiliza el servidor MCP (Model Context Protocol) para integrar tu aplicación con Notion.
            Los case studies con estado "Listo" en Notion se sincronizarán y publicarán automáticamente en tu sitio web.
          </p>
          
          <div className="bg-blue-950/30 border border-blue-900/30 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">¿Cómo funciona?</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>El servidor MCP se conecta a tu cuenta de Notion mediante una API key</li>
              <li>Consulta la base de datos de case studies y filtra por estado "Listo"</li>
              <li>Descarga automáticamente las imágenes asociadas al case study</li>
              <li>Guarda los datos en formato JSON para que tu aplicación pueda acceder a ellos</li>
              <li>Los case studies con estado "Listo" aparecen en la página pública</li>
            </ol>
          </div>
        </div>
        
        {/* Componente de Sincronización */}
        <NotionSyncDemo />
        
        <div className="mt-8 bg-gray-900/50 border border-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Información técnica</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-300">Configuración del servidor MCP</h3>
              <pre className="mt-2 p-4 bg-black/30 rounded text-sm font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "github.com/pashpashpash/mcp-notion-server": {
      "command": "node",
      "args": ["/path/to/build/index.js"],
      "env": {
        "NOTION_API_TOKEN": "your-notion-api-token"
      }
    }
  }
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-300">Llamadas a herramientas MCP</h3>
              <pre className="mt-2 p-4 bg-black/30 rounded text-sm font-mono overflow-x-auto">
{`// Ejemplo de llamada a una herramienta MCP
const response = await fetch('/api/notion/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    server: 'github.com/pashpashpash/mcp-notion-server',
    tool: 'notion_query_database',
    args: {
      database_id: 'your-database-id',
      filter: { property: 'Status', select: { equals: 'Listo' } }
    }
  })
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
