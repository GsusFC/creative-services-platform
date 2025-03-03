'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Database, 
  Zap, 
  Clock, 
  Settings, 
  Trash2,
  Download,
  Code
} from 'lucide-react';
import { 
  useNotionDebugger, 
  DebugMessage, 
  DebugLevel,
  checkNotionConfig,
  testNotionConnection
} from '@/lib/debug/notion-importer';

interface DebugPanelProps {
  onCloseAction: () => void;
  className?: string;
}

export default function DebugPanel({ onCloseAction, className = '' }: DebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'logs' | 'config' | 'connection'>('logs');
  const [configStatus, setConfigStatus] = useState<{
    isConfigured: boolean;
    databaseName: string;
    properties: string[];
    error?: string;
  }>({
    isConfigured: false,
    databaseName: 'Cargando...',
    properties: []
  });
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    responseTime: number;
    projects: Array<{ id?: string; title?: string }>;
    error?: string;
  }>({
    success: false,
    responseTime: 0,
    projects: []
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(false);

  const {
    state: debugState,
    info: _info,
    warn: _warn,
    error,
    success,
    clearMessages,
    toggleDebugMode: _toggleDebugMode,
    toggleVerboseMode
  } = useNotionDebugger();

  // Verificar configuración al cargar
  useEffect(() => {
    const checkConfig = async () => {
      setIsCheckingConfig(true);
      try {
        const status = await checkNotionConfig();
        setConfigStatus(status);
      } catch (err) {
        console.error('Error al verificar configuración:', err);
        setConfigStatus({
          isConfigured: false,
          databaseName: 'Error',
          properties: [],
          error: err instanceof Error ? err.message : 'Error desconocido'
        });
      } finally {
        setIsCheckingConfig(false);
      }
    };
    
    checkConfig();
  }, []);

  // Probar conexión
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const status = await testNotionConnection();
      setConnectionStatus(status);
      
      if (status.success) {
        success('Conexión exitosa', 'Prueba de conexión', { responseTime: status.responseTime });
      } else {
        error('Error de conexión', 'Prueba de conexión', { error: status.error });
      }
    } catch (err) {
      console.error('Error al probar conexión:', err);
      setConnectionStatus({
        success: false,
        responseTime: 0,
        projects: [],
        error: err instanceof Error ? err.message : 'Error desconocido'
      });
      error('Error al probar conexión', 'Prueba de conexión', { error: err });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Renderizar icono según nivel de mensaje
  const renderMessageIcon = (level: DebugLevel) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  // Formatear timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
  };

  // Formatear datos de mensaje para mostrar
  const formatMessageData = (data: Record<string, unknown> | undefined) => {
    if (!data) return null;
    
    return (
      <pre className="mt-2 p-2 bg-black/40 rounded-md text-xs overflow-x-auto max-h-32 overflow-y-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm ${className}`}>
      <div className="w-[800px] max-w-[95vw] max-h-[90vh] bg-black/80 border border-white/10 rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
          <h2 className="text-lg font-medium text-white/90 flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-400" />
            Panel de Depuración - Notion Importer
          </h2>
          <button
            onClick={onCloseAction}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Cerrar panel de depuración"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        {/* Pestañas */}
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'logs'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('logs')}
          >
            Registros
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'config'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('config')}
          >
            Configuración
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'connection'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('connection')}
          >
            Prueba de Conexión
          </button>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 overflow-auto p-4">
          {/* Pestaña de Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">
                    {debugState.messages.length} mensajes
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs text-white/70">
                      {debugState.messages.filter(m => m.level === 'success').length} éxitos
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs text-white/70">
                      {debugState.messages.filter(m => m.level === 'error').length} errores
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVerboseMode}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      debugState.isVerbose
                        ? 'bg-teal-500/20 text-teal-400'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Modo Detallado
                  </button>
                  <button
                    onClick={clearMessages}
                    className="px-3 py-1.5 bg-white/5 text-white/70 hover:bg-white/10 text-xs rounded-md transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar
                  </button>
                </div>
              </div>
              
              {/* Lista de mensajes */}
              <div className="space-y-2 font-mono">
                {debugState.messages.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    No hay mensajes de depuración
                  </div>
                ) : (
                  debugState.messages.map((message: DebugMessage) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-md border ${
                        message.level === 'error'
                          ? 'bg-red-500/10 border-red-500/20'
                          : message.level === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/20'
                          : message.level === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/20'
                          : 'bg-blue-500/10 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{renderMessageIcon(message.level)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {message.message}
                            </span>
                            <span className="text-xs text-white/50">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          <div className="text-xs text-white/70 mt-1">
                            Fuente: {message.source}
                          </div>
                          {debugState.isVerbose && formatMessageData(message.data)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Pestaña de Configuración */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-white/90 flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  Estado de Configuración
                </h3>
                <button
                  onClick={async () => {
                    setIsCheckingConfig(true);
                    try {
                      const status = await checkNotionConfig();
                      setConfigStatus(status);
                      
                      if (status.isConfigured) {
                        success('Configuración verificada correctamente', 'Verificación de configuración');
                      } else {
                        error('Error en la configuración', 'Verificación de configuración', { error: status.error });
                      }
                    } catch (err) {
                      error('Error al verificar configuración', 'Verificación de configuración', { error: err });
                    } finally {
                      setIsCheckingConfig(false);
                    }
                  }}
                  disabled={isCheckingConfig}
                  className="px-3 py-1.5 bg-white/5 text-white/70 hover:bg-white/10 text-xs rounded-md transition-colors flex items-center gap-1"
                >
                  {isCheckingConfig ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Verificar
                </button>
              </div>
              
              <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    {configStatus.isConfigured ? (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Configurado
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        No configurado
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/70">
                    Base de datos: <span className="text-white/90 font-medium">{configStatus.databaseName}</span>
                  </div>
                </div>
                
                {configStatus.error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                      <div>
                        <div className="font-medium">Error de configuración</div>
                        <div className="text-xs mt-1">{configStatus.error}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white/90">Propiedades disponibles:</h4>
                  {configStatus.properties.length === 0 ? (
                    <div className="text-sm text-white/50 italic">No se encontraron propiedades</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {configStatus.properties.map((prop, index) => (
                        <div key={index} className="text-xs bg-white/5 px-2 py-1 rounded">
                          {prop}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-teal-400" />
                  Configuración de Notion
                </h4>
                
                <div className="space-y-4 text-sm">
                  <p className="text-white/70">
                    Para configurar la integración con Notion, necesitas:
                  </p>
                  
                  <ol className="list-decimal pl-5 space-y-2 text-white/80">
                    <li>Una cuenta de Notion con permisos de administrador</li>
                    <li>Una API key de Notion (desde <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">notion.so/my-integrations</a>)</li>
                    <li>ID de la base de datos que deseas importar</li>
                  </ol>
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 text-blue-400" />
                      <div>
                        <div className="font-medium text-blue-400">Consejo</div>
                        <div className="mt-1">Consulta la documentación para obtener instrucciones detalladas sobre cómo configurar la integración con Notion.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pestaña de Prueba de Conexión */}
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-white/90 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-400" />
                  Prueba de Conexión
                </h3>
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-3 py-1.5 bg-white/5 text-white/70 hover:bg-white/10 text-xs rounded-md transition-colors flex items-center gap-1"
                >
                  {isTestingConnection ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Probar Conexión
                </button>
              </div>
              
              <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    {connectionStatus.success ? (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Conectado
                      </span>
                    ) : connectionStatus.responseTime > 0 ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Error de conexión
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        No probado
                      </span>
                    )}
                  </div>
                  {connectionStatus.responseTime > 0 && (
                    <div className="text-sm text-white/70 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Tiempo de respuesta: <span className="text-white/90 font-medium">{connectionStatus.responseTime}ms</span>
                    </div>
                  )}
                </div>
                
                {connectionStatus.error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                      <div>
                        <div className="font-medium">Error de conexión</div>
                        <div className="text-xs mt-1">{connectionStatus.error}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {connectionStatus.success && connectionStatus.projects.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/90">Proyectos encontrados:</h4>
                    <div className="max-h-60 overflow-y-auto">
                      {connectionStatus.projects.map((project, index) => (
                        <div 
                          key={index} 
                          className="text-xs bg-white/5 p-2 rounded mb-2 flex items-center justify-between"
                        >
                          <div className="truncate max-w-[80%]">
                            {project.title || 'Proyecto sin título'}
                          </div>
                          <div className="text-white/50">
                            ID: {project.id ? project.id.substring(0, 8) + '...' : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!connectionStatus.success && !connectionStatus.error && (
                  <div className="text-center py-6 text-white/50 text-sm">
                    Haz clic en &quot;Probar Conexión&quot; para verificar la conectividad con Notion
                  </div>
                )}
              </div>
              
              <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-400" />
                  Importación de Datos
                </h4>
                
                <div className="space-y-3 text-sm">
                  <p className="text-white/70">
                    La prueba de conexión verifica:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-2 text-white/80">
                    <li>Conectividad con la API de Notion</li>
                    <li>Validez de las credenciales</li>
                    <li>Permisos de acceso a la base de datos</li>
                    <li>Estructura de datos compatible</li>
                  </ul>
                  
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400" />
                      <div>
                        <div className="font-medium text-amber-400">Importante</div>
                        <div className="mt-1">Si la prueba de conexión falla, verifica tus credenciales y permisos en Notion antes de intentar importar datos.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
