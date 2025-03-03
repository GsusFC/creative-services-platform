'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { RefreshCw, Bug } from 'lucide-react';
import SyncScheduler from './SyncScheduler';
import ConflictManager from './ConflictManager';
import ImportStats from './ImportStats';
import ProjectSelector from './ProjectSelector';
import NotionToCaseStudyConverter from './NotionToCaseStudyConverter';
import DebugPanel from './DebugPanel';
import { useNotionDebugger } from '@/lib/debug/notion-importer';

type ImportStatus = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};
type LastSyncInfo = {
  date: Date;
  status: 'success' | 'error' | 'partial';
  itemsImported: number;
  errors: number;
  duration: number;
};

type ScheduleInfo = {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  time?: string;
  day?: string;
  lastRun?: Date;
  nextRun?: Date;
};

// Tipo para los conflictos
type Conflict = {
  id: string;
  notionItem: { id: string; title: string; date: Date } | null;
  localItem: { id: string; title: string; date: Date } | null;
  fields: string[];
  type: 'different_values' | 'new_item' | 'deleted_in_notion';
};

// Interfaces para las respuestas de la API
interface StatsResponse {
  success: boolean;
  total?: number;
  synced?: number;
  pending?: number;
  withErrors?: number;
  conflicts?: Conflict[];
  schedule?: ScheduleInfo;
  message?: string;
}

interface NotionProject {
  id: string;
  title: string;
  properties?: Record<string, unknown>;
  url?: string;
  created_time?: string;
  last_edited_time?: string;
}

interface ProjectsResponse {
  success: boolean;
  projects?: NotionProject[];
  message?: string;
}

interface ImportResponse {
  success: boolean;
  imported?: number;
  errors?: number;
  importedIds?: string[];
  message?: string;
}

interface ConflictResponse {
  success: boolean;
  message?: string;
}

interface ScheduleResponse {
  success: boolean;
  message?: string;
}

// Propiedades para ProjectSelector

const NotionProjectImporter = () => {
  const notionDebugger = useNotionDebugger();
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ status: 'idle', message: '' });
  const [lastSync, setLastSync] = useState<LastSyncInfo | null>(null);
  const [schedule, setSchedule] = useState<ScheduleInfo>({
    enabled: false,
    frequency: 'daily',
    time: '03:00',
  });
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [dbStats, setDbStats] = useState({
    total: 0,
    synced: 0,
    pending: 0,
    withErrors: 0,
  });
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [importedProjects, setImportedProjects] = useState<string[]>([]);

  // Obtener estadísticas de la base de datos
  const fetchDatabaseStats = useCallback(async () => {
    try {
      setImportStatus({ status: 'loading', message: 'Cargando estadísticas...' });
      
      const statsToastId = toast.loading('Obteniendo estadísticas de Notion...');
      notionDebugger.info('Obteniendo estadísticas de la base de datos', 'Stats');
      
      // Llamada a la API para obtener estadísticas
      const response = await notionDebugger.debugFetch('/api/notion/database/stats');
      
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
      }
      
      const data = await notionDebugger.debugResponse<StatsResponse>(response, 'Stats');
      
      if (data.success) {
        // Actualizar el estado con las estadísticas
        setDbStats({
          total: data.total || 0,
          synced: data.synced || 0,
          pending: data.pending || 0,
          withErrors: data.withErrors || 0
        });
        
        // Actualizar última sincronización
        setLastSync({
          date: new Date(),
          status: 'success',
          itemsImported: data.total || 0,
          errors: data.withErrors || 0,
          duration: 5.2
        });
        
        // Actualizar conflictos si existen en la respuesta
        if (data.conflicts) {
          setConflicts(data.conflicts);
        }

        // Actualizar programación si existe en la respuesta
        if (data.schedule) {
          setSchedule(data.schedule);
        }
        
        setImportStatus({ status: 'success', message: 'Estadísticas cargadas con éxito' });
        
        toast.success('Estadísticas actualizadas', {
          id: statsToastId
        });
      } else {
        throw new Error(data.message || 'Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      
      const errorMessage = 'No se pudieron cargar las estadísticas de la base de datos.';
      
      setImportStatus({ status: 'error', message: errorMessage });
      
      toast.error(errorMessage);
    }
  }, [notionDebugger]);

  // Obtener proyectos reales de Notion
  const fetchNotionProjects = useCallback(async () => {
    try {
      setImportStatus({ status: 'loading', message: 'Cargando proyectos...' });
      
      const projectsToastId = toast.loading('Cargando proyectos de Notion...');
      notionDebugger.info('Obteniendo proyectos de Notion', 'Projects');
      
      // Llamada a la API para obtener proyectos
      const response = await notionDebugger.debugFetch('/api/notion/database/sample?limit=100');
      
      if (!response.ok) {
        throw new Error(`Error al obtener proyectos: ${response.statusText}`);
      }
      
      const data = await notionDebugger.debugResponse<ProjectsResponse>(response, 'Projects');
      
      if (data.success && data.projects) {
        // Actualizar el estado con los proyectos obtenidos pero sin disparar importación automática
        // En lugar de seleccionar todos automáticamente, no seleccionamos ninguno
        setSelectedProjects([]);
        
        // Inicialmente ningún proyecto está importado
        setImportedProjects([]);
        
        setImportStatus({ status: 'success', message: 'Proyectos cargados con éxito' });
        
        toast.success('Proyectos cargados con éxito', {
          id: projectsToastId
        });
      } else {
        throw new Error(data.message || 'Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar proyectos de Notion:', error);
      
      const errorMessage = 'No se pudieron cargar los proyectos de Notion.';
      
      setImportStatus({ status: 'error', message: errorMessage });
      
      toast.error(errorMessage);
    }
  }, [notionDebugger]);

  // Función para limpiar la selección de proyectos
  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
  }, []);

  // Cargar estadísticas de la base de datos al iniciar
  useEffect(() => {
    fetchDatabaseStats();
    fetchNotionProjects();
    
    // Log component lifecycle
    const cleanup = notionDebugger.debugComponent('NotionProjectImporter');
    return cleanup;
  }, [fetchDatabaseStats, fetchNotionProjects, notionDebugger]);

  // Mostrar notificaciones cuando cambia el estado de importación
  useEffect(() => {
    if (importStatus.status === 'success') {
      toast.success(importStatus.message, {
        duration: 5000
      });
    } else if (importStatus.status === 'error') {
      toast.error(importStatus.message, {
        duration: 8000
      });
    }
  }, [importStatus]);

  // Función para iniciar una importación manual
  const handleManualImport = useCallback(async () => {
    try {
      setImportStatus({ status: 'loading', message: 'Importando...' });
      
      const importToastId = toast.loading('Importando proyectos seleccionados...');
      notionDebugger.info(`Importando ${selectedProjects.length} proyectos`, 'Import');
      
      // En una implementación real, esto sería una llamada a la API
      const response = await notionDebugger.debugFetch('/api/notion/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectIds: selectedProjects,
          databaseId: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || 'a3a61fb1fb954b1a9534aeb723597368' // Usar el ID de la base de datos de Notion
        }),
      });
      
      const data = await notionDebugger.debugResponse<ImportResponse>(response, 'Import');
      
      if (data.success) {
        const successMessage = `Importación completada. ${data.imported || 0} proyectos importados, ${data.errors || 0} errores.`;
        
        setImportStatus({ 
          status: 'success', 
          message: successMessage 
        });
        
        toast.success(successMessage, {
          id: importToastId
        });
        
        // Actualizar la lista de proyectos importados
        if (data.importedIds) {
          setImportedProjects(data.importedIds);
        }
        
        // Actualizar estadísticas
        fetchDatabaseStats();
      } else {
        throw new Error(data.message || 'Error desconocido durante la importación');
      }
    } catch (error) {
      console.error('Error durante la importación:', error);
      
      const errorMessage = `Error durante la importación: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      
      setImportStatus({ 
        status: 'error', 
        message: errorMessage 
      });
      
      toast.error(errorMessage);
    }
  }, [selectedProjects, notionDebugger, fetchDatabaseStats]);

  // Función para importar un proyecto individual
  const handleImportSingleProject = useCallback(async (projectId: string) => {
    try {
      // Mostrar solo un indicador de carga (toast o estado, no ambos)
      setImportStatus({ status: 'loading', message: `Importando proyecto...` });
      
      const singleImportToastId = toast.loading(`Importando proyecto...`);
      notionDebugger.info(`Importando proyecto individual: ${projectId}`, 'Import');
      
      // Llamada a la API para importar un solo proyecto
      const response = await notionDebugger.debugFetch('/api/notion/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectIds: [projectId],
          databaseId: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || 'a3a61fb1fb954b1a9534aeb723597368'
        }),
      });
      
      const data = await notionDebugger.debugResponse<ImportResponse>(response, 'Import');
      
      if (data.success) {
        // Actualizar el estado sin mostrar mensaje duplicado
        setImportStatus({ 
          status: 'success', 
          message: `Proyecto importado con éxito.` 
        });
        
        // Actualizar el toast en lugar de crear uno nuevo
        toast.success(`Proyecto importado con éxito.`, {
          id: singleImportToastId
        });
        
        // Actualizar la lista de proyectos importados
        if (data.importedIds) {
          setImportedProjects(prev => [...prev, ...data.importedIds || []]);
        }
        
        // Actualizar estadísticas
        fetchDatabaseStats();
      } else {
        throw new Error(data.message || 'Error desconocido durante la importación');
      }
    } catch (error) {
      console.error('Error durante la importación del proyecto:', error);
      
      // Actualizar el estado sin mostrar mensaje duplicado
      setImportStatus({ 
        status: 'error', 
        message: `Error durante la importación: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
      
      // Mostrar solo un mensaje de error
      toast.error(`Error al importar proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }, [notionDebugger, fetchDatabaseStats]);

  // Función para resolver un conflicto
  const handleResolveConflict = useCallback(async (conflictId: string, resolution: 'notion' | 'local' | 'merge' | 'skip'): Promise<boolean> => {
    try {
      notionDebugger.info(`Resolviendo conflicto ${conflictId} con resolución: ${resolution}`, 'Conflicts');
      
      // En una implementación real, esto sería una llamada a la API
      const response = await notionDebugger.debugFetch(`/api/notion/conflicts/${conflictId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      
      const data = await notionDebugger.debugResponse<ConflictResponse>(response, 'Conflicts');
      
      if (data.success) {
        // Actualizar la lista de conflictos (eliminar el resuelto)
        setConflicts(conflicts.filter(conflict => conflict.id !== conflictId));
        
        toast.success(`Conflicto resuelto utilizando versión de ${
          resolution === 'notion' ? 'Notion' : 
          resolution === 'local' ? 'Case Study' : 
          resolution === 'merge' ? 'ambos (merge)' : 'omitido'
        }`);
        
        return true;
      } else {
        throw new Error(data.message || 'Error desconocido al resolver conflicto');
      }
    } catch (error) {
      console.error('Error al resolver conflicto:', error);
      toast.error(`Error al resolver conflicto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return false;
    }
  }, [conflicts, notionDebugger]);

  // Función para guardar la configuración de programación
  const saveScheduleConfig = useCallback(async (newSchedule: ScheduleInfo): Promise<boolean> => {
    try {
      notionDebugger.info('Guardando configuración de sincronización', 'Schedule', newSchedule);
      
      // En una implementación real, esto sería una llamada a la API
      const response = await notionDebugger.debugFetch('/api/notion/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });
      
      const data = await notionDebugger.debugResponse<ScheduleResponse>(response, 'Schedule');
      
      if (data.success) {
        setSchedule(newSchedule);
        toast.success('Configuración de sincronización guardada');
        return true;
      } else {
        throw new Error(data.message || 'Error desconocido al guardar configuración');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error(`Error al guardar configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return false;
    }
  }, [notionDebugger]);

  return (
    <div className="p-6 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 font-mono">
      <Tabs defaultValue="projects" className="w-full font-mono">
        <div className="flex items-center mb-6">
          <TabsList className="bg-white/5 border border-white/10 flex-grow">
            <TabsTrigger value="projects" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Conflictos
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
              Programación
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDebugPanelOpen(true)}
              className="btn-rgb-secondary px-3 py-2 rounded-lg flex items-center gap-2 font-mono"
              aria-label="Abrir panel de depuración"
            >
              <Bug size={18} />
              Debug
            </button>
            
            <button
              onClick={handleManualImport}
              disabled={importStatus.status === 'loading'}
              className="btn-rgb-primary px-4 py-2 rounded-lg flex items-center gap-2 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sincronizar todos los proyectos"
            >
              <RefreshCw size={18} className={importStatus.status === 'loading' ? 'animate-spin' : ''} />
              {importStatus.status === 'loading' ? 'Sincronizando...' : 'Sincronizar Todo'}
            </button>
          </div>
        </div>
        
        <TabsContent value="projects" className="mt-6">
          <ProjectSelector 
            onSelectProjects={setSelectedProjects}
            onImportProject={handleImportSingleProject}
            onRefresh={fetchDatabaseStats}
            isLoading={importStatus.status === 'loading'}
            importedProjects={importedProjects}
            selectedProjects={selectedProjects}
          />
          
          <NotionToCaseStudyConverter
            selectedProjects={selectedProjects}
            importedProjects={importedProjects}
            onClearSelection={handleClearSelection}
          />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <ImportStats 
            stats={dbStats} 
            lastSync={lastSync} 
            onRefresh={fetchDatabaseStats}
          />
        </TabsContent>
        
        <TabsContent value="conflicts" className="mt-6">
          <ConflictManager 
            conflicts={conflicts} 
            onResolve={handleResolveConflict} 
          />
        </TabsContent>
        
        <TabsContent value="scheduler" className="mt-6">
          <SyncScheduler 
            currentSchedule={schedule} 
            onSave={saveScheduleConfig}
          />
        </TabsContent>
      </Tabs>
      
      {/* Debug Panel */}
      {isDebugPanelOpen && (
        <DebugPanel 
          onCloseAction={() => setIsDebugPanelOpen(false)} 
        />
      )}
    </div>
  );
};

export default NotionProjectImporter;
