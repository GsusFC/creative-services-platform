'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Pause, 
  RefreshCw, 
  RotateCcw, 
  Save, 
  XCircle 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type ScheduleInfo = {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  time?: string;
  day?: string;
  lastRun?: Date;
  nextRun?: Date;
};

interface SyncSchedulerProps {
  currentSchedule: ScheduleInfo;
  onSave: (schedule: ScheduleInfo) => Promise<boolean>;
}

const SyncScheduler: React.FC<SyncSchedulerProps> = ({ currentSchedule, onSave }) => {
  const [schedule, setSchedule] = useState<ScheduleInfo>(currentSchedule);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    setSchedule(currentSchedule);
  }, [currentSchedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setSchedule({
        ...schedule,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setSchedule({
        ...schedule,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveMessage(null);
    
    try {
      const success = await onSave(schedule);
      
      if (success) {
        setSaveMessage({
          type: 'success',
          text: 'Programación guardada correctamente',
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: 'No se pudo guardar la programación',
        });
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setSaveMessage({
        type: 'error',
        text: 'Error al guardar la configuración',
      });
    } finally {
      setIsLoading(false);
      
      // Auto-limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2 text-teal-400">
        <Clock size={20} />
        Programador de Sincronización
      </h3>
      
      <div className="space-y-6">
        {/* Estado actual */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:rgb-border transition-all duration-500">
          <h4 className="text-lg font-medium mb-3 text-white/80">Estado Actual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-teal-500/50 transition-all duration-300 flex flex-col">
              <span className="text-white/60 text-sm mb-1">Última Sincronización</span>
              <span className="text-white/90 font-medium">
                {schedule.lastRun ? new Date(schedule.lastRun).toLocaleString('es-ES') : 'Nunca'}
              </span>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
              <span className="text-white/60 text-sm mb-1">Próxima Sincronización</span>
              <span className="text-white/90 font-medium">
                {schedule.nextRun ? new Date(schedule.nextRun).toLocaleString('es-ES') : 'No programada'}
              </span>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col">
              <span className="text-white/60 text-sm mb-1">Frecuencia</span>
              <span className="text-white/90 font-medium">
                {schedule.frequency ? `Cada ${schedule.frequency} horas` : 'No configurada'}
              </span>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-green-500/50 transition-all duration-300 flex flex-col">
              <span className="text-white/60 text-sm mb-1">Estado</span>
              <span className={`font-medium ${schedule.enabled ? 'text-green-400' : 'text-amber-400'} flex items-center gap-1`}>
                {schedule.enabled ? (
                  <>
                    <CheckCircle2 size={14} />
                    Activo
                  </>
                ) : (
                  <>
                    <Pause size={14} />
                    Pausado
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        
        {/* Configuración */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:rgb-border transition-all duration-500">
          <h4 className="text-lg font-medium mb-3 text-white/80">Configuración</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="frequency" className="block text-white/80 mb-2 text-sm">
                  Frecuencia de Sincronización
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={schedule.frequency}
                  onChange={handleChange}
                  disabled={!schedule.enabled}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white/90 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="hourly">Cada hora</option>
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-white/80 mb-2 text-sm">
                  Hora de Inicio
                </label>
                <input
                  id="time"
                  type="time"
                  value={schedule.time || '00:00'}
                  onChange={handleChange}
                  disabled={!schedule.enabled}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white/90 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={schedule.enabled}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="enabled"
                className="text-white/80 cursor-pointer"
              >
                Sincronización Automática Activa
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Guardar configuración"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Acciones manuales */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:rgb-border transition-all duration-500">
          <h4 className="text-lg font-medium mb-3 text-white/80">Acciones Manuales</h4>
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sincronizar ahora"
            >
              <RefreshCw size={16} />
              Sincronizar Ahora
            </button>
          </div>
        </div>
        
        {/* Historial de sincronizaciones */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:rgb-border transition-all duration-500">
          <h4 className="text-lg font-medium mb-3 text-white/80 flex items-center justify-between">
            <span>Historial de Sincronizaciones</span>
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-2 text-white/60 text-sm">Fecha</th>
                  <th className="text-left p-2 text-white/60 text-sm">Estado</th>
                  <th className="text-left p-2 text-white/60 text-sm">Elementos</th>
                  <th className="text-left p-2 text-white/60 text-sm">Duración</th>
                </tr>
              </thead>
              <tbody>
                {/* No se muestra el historial de sincronizaciones */}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Toast para notificaciones */}
        {saveMessage && (
          <div className={`px-4 py-2 rounded-lg text-sm ${
            saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {saveMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncScheduler;
