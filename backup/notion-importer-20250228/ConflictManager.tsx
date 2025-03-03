'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ArrowUpDown, 
  CheckCircle2, 
  Check,
  Clock, 
  FileText, 
  FileWarning, 
  RefreshCw,
  SkipForward 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ConflictType = 'different_values' | 'new_item' | 'deleted_in_notion' | 'deleted_locally' | 'unknown';

interface ConflictItemData {
  id: string;
  title: string;
  date: Date;
}

interface ConflictItem {
  id: string;
  notionItem: ConflictItemData | null;
  localItem: ConflictItemData | null;
  fields: string[];
  type: ConflictType;
}

interface ConflictManagerProps {
  conflicts: ConflictItem[];
  onResolve: (conflictId: string, resolution: 'local' | 'notion' | 'merge' | 'skip') => Promise<boolean>;
}

const ConflictManager: React.FC<ConflictManagerProps> = ({ conflicts, onResolve }) => {
  const [expandedConflict, setExpandedConflict] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const [resolutionMessages, setResolutionMessages] = useState<{[key: string]: {success: boolean, message: string}}>({});

  // Renderiza un mensaje descriptivo del tipo de conflicto
  const getConflictTypeMessage = (conflict: ConflictItem) => {
    switch (conflict.type) {
      case 'different_values':
        return (
          <span className="flex items-center gap-2">
            <ArrowUpDown size={16} />
            Valores diferentes en {conflict.fields.join(', ')}
          </span>
        );
      case 'new_item':
        return (
          <span className="flex items-center gap-2">
            <FileText size={16} />
            Nuevo elemento en Notion
          </span>
        );
      case 'deleted_in_notion':
        return (
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Elemento eliminado en Notion
          </span>
        );
      case 'deleted_locally':
        return (
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Elemento eliminado localmente
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Conflicto desconocido
          </span>
        );
    }
  };

  // Función para manejar la resolución de un conflicto
  const handleResolveConflict = async (conflictId: string, resolution: 'local' | 'notion' | 'merge' | 'skip') => {
    // Establecer estado de carga
    setLoadingStates(prev => ({ ...prev, [conflictId]: true }));
    
    try {
      const success = await onResolve(conflictId, resolution);
      
      if (success) {
        setResolutionMessages(prev => ({ 
          ...prev, 
          [conflictId]: { 
            success: true,
            message: `Conflicto resuelto (${
              resolution === 'local' ? 'Usar local' : 
              resolution === 'notion' ? 'Usar Notion' : 
              resolution === 'merge' ? 'Combinar' : 'Omitido'
            })`
          } 
        }));
        
        // Automáticamente eliminar el mensaje después de 3 segundos
        setTimeout(() => {
          setResolutionMessages(prev => {
            const newState = { ...prev };
            delete newState[conflictId];
            return newState;
          });
        }, 3000);
      } else {
        setResolutionMessages(prev => ({ 
          ...prev, 
          [conflictId]: { 
            success: false, 
            message: 'Error al resolver el conflicto' 
          } 
        }));
      }
    } catch (error) {
      console.error('Error al resolver conflicto:', error);
      setResolutionMessages(prev => ({ 
        ...prev, 
        [conflictId]: { 
          success: false, 
          message: 'Error al resolver el conflicto' 
        } 
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [conflictId]: false }));
    }
  };

  // Función para manejar la resolución de todos los conflictos
  const handleResolveAll = async () => {
    for (const conflict of conflicts) {
      await handleResolveConflict(conflict.id, 'notion');
    }
  };

  // Función para renderizar el panel de detalles del conflicto
  const renderConflictDetails = (conflict: ConflictItem) => {
    if (conflict.type === 'different_values') {
      return (
        <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-3">
          <h4 className="font-medium">Campos con diferencias:</h4>
          <div className="space-y-4">
            {conflict.fields.map(field => (
              <div key={field} className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <span className="block text-xs text-blue-400 mb-1">Valor en Notion:</span>
                  <span className="font-mono text-sm">{conflict.notionItem?.[field]}</span>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <span className="block text-xs text-purple-400 mb-1">Valor local:</span>
                  <span className="font-mono text-sm">{conflict.localItem?.[field]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (conflict.type === 'new_item') {
      return (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h4 className="font-medium mb-2">Nuevo elemento de Notion:</h4>
          <div className="space-y-2">
            {Object.entries(conflict.notionItem || {})
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-mono text-sm text-white/60 w-32">{key}:</span>
                  <span className="font-mono text-sm">{String(value)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    
    if (conflict.type === 'deleted_in_notion') {
      return (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h4 className="font-medium mb-2">Elemento eliminado en Notion pero presente localmente:</h4>
          <div className="space-y-2">
            {Object.entries(conflict.localItem || {})
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-mono text-sm text-white/60 w-32">{key}:</span>
                  <span className="font-mono text-sm">{String(value)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
        <p className="text-sm">No hay información detallada disponible para este tipo de conflicto.</p>
      </div>
    );
  };

  // Si no hay conflictos, mostrar un mensaje
  if (conflicts.length === 0) {
    return (
      <div className="p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-400" />
        <p className="text-white/80 mb-2">No hay conflictos pendientes</p>
        <p className="text-white/60 text-sm">
          Todos los proyectos están sincronizados correctamente
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2 text-teal-400">
        <FileWarning size={20} />
        Gestión de Conflictos
      </h3>
      
      <div className="space-y-4">
        {conflicts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-green-400" />
            <p className="text-white/80 mb-2">No hay conflictos pendientes</p>
            <p className="text-white/60 text-sm">
              Todos los proyectos están sincronizados correctamente
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60">
                <span className="font-medium text-white/80">{conflicts.length}</span> conflictos encontrados
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveAll()}
                  disabled={Object.values(loadingStates).some(Boolean)}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Resolver todos los conflictos"
                >
                  <Check size={16} />
                  Resolver todos
                </button>
                <button
                  onClick={() => window.location.reload()}
                  disabled={Object.values(loadingStates).some(Boolean)}
                  className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refrescar lista de conflictos"
                >
                  <RefreshCw size={16} />
                  Refrescar
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div 
                  key={conflict.id} 
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:rgb-border transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-white/90 mb-1 flex items-center gap-2">
                        <FileWarning size={16} className="text-amber-400" />
                        {conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}
                      </h4>
                      <p className="text-sm text-white/60">
                        ID: {conflict.id.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {conflict.type !== 'deleted_locally' && (
                        <button
                          onClick={() => handleResolveConflict(conflict.id, 'notion')}
                          disabled={loadingStates[conflict.id]}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Resolver conflicto para ${conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}`}
                        >
                          <Check size={16} />
                          Usar Notion
                        </button>
                      )}
                      
                      {conflict.type !== 'deleted_in_notion' && (
                        <button
                          onClick={() => handleResolveConflict(conflict.id, 'local')}
                          disabled={loadingStates[conflict.id]}
                          className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Resolver conflicto para ${conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}`}
                        >
                          <Check size={16} />
                          Usar Local
                        </button>
                      )}
                      
                      {conflict.type === 'different_values' && (
                        <button
                          onClick={() => handleResolveConflict(conflict.id, 'merge')}
                          disabled={loadingStates[conflict.id]}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Resolver conflicto para ${conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}`}
                        >
                          <Check size={16} />
                          Combinar
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleResolveConflict(conflict.id, 'skip')}
                        disabled={loadingStates[conflict.id]}
                        className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Omitir conflicto para ${conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}`}
                      >
                        <SkipForward size={14} />
                        Omitir
                      </button>
                      
                      <button
                        onClick={() => setExpandedConflict(expandedConflict === conflict.id ? null : conflict.id)}
                        className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
                        aria-label={`Ver detalles del conflicto para ${conflict.notionItem?.title || conflict.localItem?.title || 'Conflicto sin título'}`}
                      >
                        {expandedConflict === conflict.id ? 'Ocultar detalles' : 'Ver detalles'}
                      </button>
                    </div>
                  </div>
                  
                  {loadingStates[conflict.id] && (
                    <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
                      <Clock size={16} className="animate-spin" />
                      <span className="text-sm">Resolviendo conflicto...</span>
                    </div>
                  )}
                  
                  {resolutionMessages[conflict.id] && (
                    <div className={`p-4 ${resolutionMessages[conflict.id].success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} border-t border-white/10 flex items-center gap-2`}>
                      {resolutionMessages[conflict.id].success ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      <span className="text-sm">{resolutionMessages[conflict.id].message}</span>
                    </div>
                  )}
                  
                  {expandedConflict === conflict.id && renderConflictDetails(conflict)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConflictManager;
