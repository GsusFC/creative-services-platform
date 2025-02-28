'use client';

import React from 'react';
import { 
  Activity, 
  AlertCircle, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  RefreshCw 
} from 'lucide-react';

interface ImportStatsProps {
  stats: {
    total: number;
    synced: number;
    pending: number;
    withErrors: number;
  };
  lastSync: {
    date: Date;
    status: 'success' | 'error' | 'partial';
    itemsImported: number;
    errors: number;
    duration: number;
  } | null;
  onRefresh: () => void;
}

const ImportStats: React.FC<ImportStatsProps> = ({ stats, lastSync, onRefresh }) => {
  // Función para formatear duración en segundos
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} segundos`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} seg`;
  };

  return (
    <div className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2 text-teal-400">
        <Activity size={20} />
        Estadísticas de Importación
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Estadística: Total de elementos */}
          <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10 hover:border-teal-500/50 transition-all duration-300">
            <div>
              <h3 className="text-white/60 text-sm mb-1">Total de Proyectos</h3>
              <p className="text-3xl font-semibold text-white/90">{stats.total}</p>
            </div>
            <ArrowUpDown size={20} className="text-white/40" />
          </div>
          
          {/* Estadística: Elementos sincronizados */}
          <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10 hover:border-green-500/50 transition-all duration-300">
            <div>
              <h3 className="text-green-400 text-sm mb-1">Sincronizados</h3>
              <p className="text-3xl font-semibold text-white/90">{stats.synced}</p>
              <p className="text-xs text-white/60 mt-1">
                {Math.round((stats.synced / stats.total) * 100)}% del total
              </p>
            </div>
            <CheckCircle2 size={20} className="text-green-400" />
          </div>
          
          {/* Estadística: Elementos pendientes */}
          <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10 hover:border-amber-500/50 transition-all duration-300">
            <div>
              <h3 className="text-amber-400 text-sm mb-1">Pendientes</h3>
              <p className="text-3xl font-semibold text-white/90">{stats.pending}</p>
              <p className="text-xs text-white/60 mt-1">
                {Math.round((stats.pending / stats.total) * 100)}% del total
              </p>
            </div>
            <Clock size={20} className="text-amber-400" />
          </div>
          
          {/* Estadística: Elementos con errores */}
          <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10 hover:border-red-500/50 transition-all duration-300">
            <div>
              <h3 className="text-red-400 text-sm mb-1">Con Errores</h3>
              <p className="text-3xl font-semibold text-white/90">{stats.withErrors}</p>
              <p className="text-xs text-white/60 mt-1">
                {Math.round((stats.withErrors / stats.total) * 100)}% del total
              </p>
            </div>
            <AlertCircle size={20} className="text-red-400" />
          </div>
        </div>
        
        {/* Información de última sincronización */}
        <div className="p-4 bg-white/5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10 hover:rgb-border transition-all duration-500">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center gap-2 text-white/80">
              <Clock size={16} />
              Última Sincronización
            </h3>
            
            {lastSync ? (
              <>
                <p className="flex items-center gap-2">
                  {lastSync.status === 'success' && <CheckCircle2 size={16} className="text-green-400" />}
                  {lastSync.status === 'partial' && <AlertCircle size={16} className="text-amber-400" />}
                  {lastSync.status === 'error' && <AlertCircle size={16} className="text-red-400" />}
                  <span className="text-sm text-white/80">
                    {lastSync.date.toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Importados:</span>
                    <span className="text-sm text-white/80">{lastSync.itemsImported}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Errores:</span>
                    <span className="text-sm text-white/80">{lastSync.errors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Duración:</span>
                    <span className="text-sm text-white/80">{formatDuration(lastSync.duration)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-white/60">No hay sincronizaciones recientes</p>
            )}
          </div>
          
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-blue-100/50 text-blue-400 rounded-lg hover:bg-blue-200/50 transition-colors flex items-center gap-2 text-sm"
            aria-label="Refrescar estadísticas"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStats;
