'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, DatabaseIcon } from 'lucide-react'
import { checkNotionAvailability } from '@/lib/notion/utils'

export default function NotionSettingsPage() {
  const [notionDatabaseId, setNotionDatabaseId] = useState('')
  const [notionApiKey, setNotionApiKey] = useState('')
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  // Cargar datos de configuración
  useEffect(() => {
    // En un entorno real, estos valores se obtendrían de forma segura
    setNotionDatabaseId(process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'] || '')
    setNotionApiKey(process.env['NEXT_PUBLIC_NOTION_API_KEY'] ? '••••••••••••••••' : '')
    
    // Verificar si la sincronización está habilitada
    // Este valor viene del flag DISABLE_SYNC_TO_NOTION en useCaseStudyManager.ts
    setSyncEnabled(false) // Por defecto desactivado
  }, [])

  // Probar conexión con MCP-Notion
  const handleTestConnection = async () => {
    setConnectionStatus('checking')
    setConnectionError(null)
    
    try {
      const isAvailable = await checkNotionAvailability();
      
      setIsConnected(isAvailable)
      setConnectionStatus(isAvailable ? 'success' : 'error')
      if (!isAvailable) {
        setConnectionError('No se pudo conectar con el servicio MCP-Notion. Asegúrate de que esté en ejecución.')
      }
    } catch (error) {
      setIsConnected(false)
      setConnectionStatus('error')
      setConnectionError('Error al verificar la conexión: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }
  
  // Sincronizar con Notion
  const syncWithNotion = async () => {
    setConnectionStatus('checking')
    setConnectionError(null)
    
    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncAll'
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al sincronizar con Notion')
      }
      
      setConnectionStatus('success')
    } catch (error) {
      setConnectionStatus('error')
      setConnectionError('Error al sincronizar: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="admin-page min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/case-studies" className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-1" /> Volver a Case Studies
          </Link>
          <h1 className="text-3xl font-bold mb-2">Configuración de Notion</h1>
          <p className="text-gray-400">Configura la conexión con Notion para gestionar los case studies</p>
        </div>
        
        <div className="space-y-8">
          {/* Panel de configuración de Notion */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Configuración de Notion</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ID de Base de Datos de Notion
                </label>
                <input
                  type="text"
                  value={notionDatabaseId}
                  readOnly
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                  placeholder="notion-database-id"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Configurado en variables de entorno (NEXT_PUBLIC_NOTION_DATABASE_ID)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  API Key de Notion <span className="technical-term api-key">************</span>
                </label>
                <input
                  type="password"
                  value={notionApiKey}
                  readOnly
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                  placeholder="notion-api-key"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Configurado en variables de entorno (NEXT_PUBLIC_NOTION_API_KEY)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estado de Sincronización
                </label>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${syncEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{syncEnabled ? 'Habilitada' : 'Deshabilitada'}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  La sincronización hacia Notion está actualmente {syncEnabled ? 'habilitada' : 'deshabilitada'}. 
                  {!syncEnabled && ' Los cambios solo se guardan localmente.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTestConnection}
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center ${connectionStatus === 'checking' ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                disabled={connectionStatus === 'checking'}
              >
                {connectionStatus === 'checking' ? (
                  <>
                    <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>Probar conexión</>
                )}
              </button>
              
              <button
                onClick={syncWithNotion}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors flex items-center"
                disabled={connectionStatus === 'checking' || !isConnected}
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Sincronizar ahora
              </button>
              
              {connectionStatus === 'success' && (
                <div className="flex items-center text-green-500">
                  <CheckCircleIcon className="w-5 h-5 mr-1" />
                  Conectado
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="flex items-center text-red-500">
                  <XCircleIcon className="w-5 h-5 mr-1" />
                  Error de conexión
                </div>
              )}
            </div>
            
            {connectionError && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-900 rounded-md text-red-200 text-sm">
                {connectionError}
              </div>
            )}
          </div>
          
          {/* Panel de información de Notion */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Información de Notion</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                La plataforma utiliza Notion como fuente de datos para gestionar los case studies y sus recursos relacionados.
              </p>
              
              {isConnected && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Estructura de datos en Notion</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><strong>Brand Name</strong>: Nombre principal del case study</li>
                    <li><strong>Description</strong>: Descripción detallada</li>
                    <li><strong>Tagline</strong>: Frase destacada</li>
                    <li><strong>Closing Claim</strong>: Frase de cierre</li>
                    <li><strong>Slug</strong>: URL amigable</li>
                    <li><strong>Services</strong>: Etiquetas de servicios (tags)</li>
                    <li><strong>Multimedia</strong>: Imágenes y videos asociados</li>
                  </ul>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-900 rounded-md text-blue-200 text-sm">
                <p>
                  <strong>Nota:</strong> Para habilitar la sincronización bidireccional, cambia el valor de 
                  <code className="bg-blue-900/50 px-1 rounded mx-1">DISABLE_SYNC_TO_NOTION</code> a 
                  <code className="bg-blue-900/50 px-1 rounded mx-1">false</code> 
                  en el archivo <code className="bg-blue-900/50 px-1 rounded mx-1">src/hooks/useCaseStudyManager.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
