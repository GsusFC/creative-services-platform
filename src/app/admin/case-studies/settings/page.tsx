'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, DatabaseIcon } from 'lucide-react'
import { testSupabaseConnection, checkNotionFdwStatus, syncNotionData } from '@/lib/supabase'

export default function NotionSettingsPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  const [fdwStatus, setFdwStatus] = useState<'idle' | 'checking' | 'configured' | 'not-configured' | 'error'>('idle')
  const [fdwInfo, setFdwInfo] = useState<{ configured: boolean; databaseCount: number } | null>(null)
  const [fdwError, setFdwError] = useState<string | null>(null)
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [syncResult, setSyncResult] = useState<{ added: number; updated: number; errors: string[] } | null>(null)
  
  // Cargar datos de configuración
  useEffect(() => {
    // En un entorno real, estos valores se obtendrían de forma segura
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  }, [])

  // Probar conexión con Supabase
  const handleTestConnection = async () => {
    setConnectionStatus('checking')
    setConnectionError(null)
    
    try {
      const result = await testSupabaseConnection();
      
      setIsConnected(result.connected)
      setConnectionStatus(result.connected ? 'success' : 'error')
      setConnectionError(result.error || null)
      
      // Si se conectó exitosamente, verificar el estado del FDW de Notion
      if (result.connected) {
        checkFdwStatus();
      }
    } catch (error) {
      setIsConnected(false)
      setConnectionStatus('error')
      setConnectionError('Error al verificar la conexión: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }
  
  // Verificar estado del FDW de Notion
  const checkFdwStatus = async () => {
    setFdwStatus('checking')
    setFdwError(null)
    
    try {
      const result = await checkNotionFdwStatus();
      
      setFdwStatus(result.configured ? 'configured' : 'not-configured')
      setFdwInfo({
        configured: result.configured,
        databaseCount: result.databaseCount || 0
      })
      setFdwError(result.error || null)
    } catch (error) {
      setFdwStatus('error')
      setFdwError('Error al verificar la configuración de Notion: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }

  // Sincronizar datos desde Notion a través de Supabase
  const handleSyncFromNotion = async () => {
    if (!isConnected) {
      setConnectionError('Debes conectar primero con Supabase')
      return
    }
    
    if (fdwStatus !== 'configured') {
      setFdwError('El Foreign Data Wrapper de Notion no está configurado correctamente')
      return
    }
    
    setSyncStatus('syncing')
    setSyncResult(null)
    
    try {
      const result = await syncNotionData();
      
      if (result.success) {
        setSyncStatus('success')
        setSyncResult({
          added: result.added || 0,
          updated: result.updated || 0,
          errors: []
        })
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error) {
      setSyncStatus('error')
      setSyncResult({
        added: 0,
        updated: 0,
        errors: ['Error durante la sincronización: ' + 
          (error instanceof Error ? error.message : String(error))]
      })
    }
  }

  // Guardar configuración
  const handleSaveConfig = async () => {
    alert('En una implementación real, esto guardaría las credenciales de forma segura en el servidor')
    // En una implementación real, esto enviaría los datos a una API segura
    // que almacenaría las credenciales de forma encriptada
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integración Supabase + Notion</h1>
          <p className="text-gray-400">Configura la conexión con Supabase y el Foreign Data Wrapper de Notion</p>
        </div>
        
        <div className="space-y-8">
          {/* Panel de configuración de Supabase */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Configuración de Supabase</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL de Supabase
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                  placeholder="https://xxxxxxxx.supabase.co"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL del proyecto de Supabase
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  API Key de Supabase
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Clave anónima de tu proyecto (anon key)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
              >
                Guardar Configuración
              </button>
              
              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'checking'}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors"
              >
                {connectionStatus === 'checking' ? 'Verificando...' : 'Probar Conexión'}
              </button>
            </div>
            
            {/* Estado de conexión */}
            {connectionStatus !== 'idle' && (
              <div className={`mt-4 p-4 rounded-md ${
                connectionStatus === 'checking' ? 'bg-blue-900/30 border-blue-800' :
                connectionStatus === 'success' ? 'bg-green-900/30 border-green-800' :
                'bg-red-900/30 border-red-800'
              } border`}>
                {connectionStatus === 'checking' && (
                  <p className="flex items-center">
                    <RefreshCwIcon className="animate-spin mr-2 h-4 w-4" />
                    Verificando conexión con Supabase...
                  </p>
                )}
                
                {connectionStatus === 'success' && (
                  <div>
                    <p className="flex items-center text-green-400">
                      <CheckCircleIcon className="mr-2 h-5 w-5" />
                      Conexión con Supabase establecida correctamente
                    </p>
                  </div>
                )}
                
                {connectionStatus === 'error' && (
                  <div>
                    <p className="flex items-center text-red-400">
                      <XCircleIcon className="mr-2 h-5 w-5" />
                      Error de conexión
                    </p>
                    {connectionError && (
                      <p className="text-sm mt-1">{connectionError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Panel de estado del FDW de Notion */}
          {isConnected && (
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4 text-white">Estado del Foreign Data Wrapper de Notion</h2>
              
              <div className="mb-6">
                <p className="text-gray-300">
                  El Foreign Data Wrapper (FDW) permite a Supabase conectarse directamente a la API de Notion.
                  Esta configuración debe realizarse a través del panel de administración de Supabase.
                </p>
              </div>
              
              {fdwStatus === 'idle' && (
                <button
                  onClick={checkFdwStatus}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
                >
                  Verificar Estado
                </button>
              )}
              
              {fdwStatus === 'checking' && (
                <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-md">
                  <p className="flex items-center">
                    <RefreshCwIcon className="animate-spin mr-2 h-4 w-4" />
                    Verificando configuración del FDW de Notion...
                  </p>
                </div>
              )}
              
              {fdwStatus === 'configured' && fdwInfo && (
                <div className="p-4 bg-green-900/30 border border-green-800 rounded-md">
                  <p className="flex items-center text-green-400 font-medium">
                    <CheckCircleIcon className="mr-2 h-5 w-5" />
                    Foreign Data Wrapper de Notion configurado correctamente
                  </p>
                  <p className="text-gray-300 mt-2">
                    Bases de datos disponibles: {fdwInfo.databaseCount}
                  </p>
                </div>
              )}
              
              {fdwStatus === 'not-configured' && (
                <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded-md">
                  <p className="flex items-center text-yellow-400 font-medium">
                    <XCircleIcon className="mr-2 h-5 w-5" />
                    Foreign Data Wrapper de Notion no configurado
                  </p>
                  <p className="text-gray-300 mt-2">
                    Debes configurar el FDW de Notion en tu proyecto de Supabase siguiendo la documentación.
                  </p>
                  <a 
                    href="https://supabase.com/docs/guides/database/extensions/wrappers/notion" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-400 hover:underline"
                  >
                    Ver documentación de configuración →
                  </a>
                </div>
              )}
              
              {fdwStatus === 'error' && (
                <div className="p-4 bg-red-900/30 border border-red-800 rounded-md">
                  <p className="flex items-center text-red-400 font-medium">
                    <XCircleIcon className="mr-2 h-5 w-5" />
                    Error al verificar el FDW de Notion
                  </p>
                  {fdwError && (
                    <p className="text-gray-300 mt-2">{fdwError}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Panel de sincronización de datos */}
          {isConnected && fdwStatus === 'configured' && (
            <div className="bg-black/30 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4 text-white">Sincronizar Datos</h2>
              
              <div className="mb-6">
                <p className="text-gray-300">
                  Sincroniza los estudios de caso desde Notion hacia tu base de datos de Supabase.
                  Esto ejecutará la función RPC configurada en Supabase para importar los datos.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSyncFromNotion}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800/50 rounded-md text-white font-medium transition-colors flex items-center"
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <RefreshCwIcon className="animate-spin mr-2 h-4 w-4" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCwIcon className="mr-2 h-4 w-4" />
                      Sincronizar Ahora
                    </>
                  )}
                </button>
              </div>
              
              {/* Resultados de sincronización */}
              {syncResult && (
                <div className={`mt-4 p-4 rounded-md ${
                  syncStatus === 'success' ? 'bg-green-900/30 border-green-800' :
                  'bg-red-900/30 border-red-800'
                } border`}>
                  <div>
                    <p className="flex items-center font-semibold">
                      {syncStatus === 'success' ? (
                        <>
                          <CheckCircleIcon className="mr-2 h-5 w-5 text-green-400" />
                          <span className="text-green-400">Sincronización completada</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="mr-2 h-5 w-5 text-red-400" />
                          <span className="text-red-400">Error en la sincronización</span>
                        </>
                      )}
                    </p>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Registros añadidos:</span> {syncResult.added}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Registros actualizados:</span> {syncResult.updated}
                      </p>
                      
                      {syncResult.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-red-400">Errores ({syncResult.errors.length}):</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {syncResult.errors.map((error, index) => (
                              <li key={index} className="text-xs text-red-300">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Panel de opciones avanzadas */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Opciones Avanzadas</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Ajusta la configuración avanzada para la integración.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSync"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-black/50"
                  />
                  <label htmlFor="autoSync" className="ml-2 block text-sm text-gray-300">
                    Sincronizar automáticamente cada 24 horas
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="realTimeSync"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-black/50"
                  />
                  <label htmlFor="realTimeSync" className="ml-2 block text-sm text-gray-300">
                    Activar sincronización en tiempo real mediante webhooks
                  </label>
                </div>
              </div>
            </div>
            
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
            >
              Guardar Configuración Avanzada
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/admin/case-studies"
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Volver al Panel de CMS
          </Link>
        </div>
      </div>
    </div>
  )
}
