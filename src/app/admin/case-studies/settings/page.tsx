'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, DatabaseIcon } from 'lucide-react'
import { testSupabaseConnection } from '@/lib/supabase'

export default function SupabaseSettingsPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
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
    } catch (error) {
      setIsConnected(false)
      setConnectionStatus('error')
      setConnectionError('Error al verificar la conexión: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }
  
  // Verificar tablas en Supabase
  const checkTables = async () => {
    if (!isConnected) {
      setConnectionError('Debes conectar primero con Supabase')
      return
    }
    
    try {
      // Aquí se podría implementar una verificación de las tablas disponibles
      console.log('Verificación de tablas no implementada')
    } catch (error) {
      setConnectionError('Error al verificar las tablas: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }

  // Guardar configuración
  const handleSaveConfig = async () => {
    setConnectionStatus('checking')
    setConnectionError(null)
    
    try {
      const response = await fetch('/api/cms/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseUrl,
          supabaseKey,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la configuración')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setConnectionStatus('success')
        alert(data.message)
        
        // Intentar conectarse con la nueva configuración
        setTimeout(() => {
          handleTestConnection()
        }, 1000)
      } else {
        throw new Error('Error al guardar la configuración')
      }
    } catch (error) {
      setConnectionStatus('error')
      setConnectionError('Error al guardar la configuración: ' + 
        (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="admin-page min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración de Supabase</h1>
          <p className="text-gray-400">Configura la conexión a la base de datos Supabase</p>
        </div>
        
        <div className="space-y-8">
          {/* Panel de configuración de Supabase */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Configuración de Supabase</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL de Supabase <span className="technical-term">https://[proyecto].supabase.co</span>
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
                  API Key de Supabase <span className="technical-term api-key">************</span>
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
                disabled={connectionStatus === 'checking'}
              >
                Guardar configuración
              </button>
              
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
          
          {/* Panel de información de Base de Datos */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Información de la Base de Datos</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                La plataforma utiliza Supabase como base de datos para gestionar los casos de estudio y sus recursos relacionados.
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={checkTables}
                  className="px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center bg-purple-600 hover:bg-purple-700"
                  disabled={!isConnected}
                >
                  <DatabaseIcon className="w-4 h-4 mr-2" />
                  Verificar tablas
                </button>
              </div>
              
              {isConnected && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Estructura de la base de datos</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>Tabla <code>case_studies</code>: Almacena los datos principales de los casos de estudio</li>
                    <li>Tabla <code>media_items</code>: Almacena los recursos multimedia asociados a los casos</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Panel de información adicional */}
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-white">Documentación y recursos</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Recursos útiles para trabajar con Supabase y la plataforma de servicios creativos.
              </p>
              
              <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Enlaces útiles</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>
                    <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Documentación oficial de Supabase</a>
                  </li>
                  <li>
                    <a href="/admin/case-studies" className="text-purple-400 hover:text-purple-300 underline">Volver al panel de administración de casos de estudio</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/admin/case-studies" 
            className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver a Casos de Estudio
          </Link>
        </div>
      </div>
    </div>
  )
}
