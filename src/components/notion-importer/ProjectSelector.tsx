'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  CircleDashed, 
  Download, 
  Search
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { useProjectSearch } from '../../hooks/useProjectSearch';

export type NotionProject = {
  id: string;
  title: string;
  status: 'imported' | 'not_imported' | 'outdated' | 'error';
  lastUpdated: string;
};

// Definir un tipo para los proyectos recibidos de la API
type NotionApiProject = {
  id: string;
  title?: string;
  lastEditedTime?: string;
  [key: string]: unknown; // Para otros campos que puedan venir de la API
};

interface ProjectSelectorProps {
  /**
   * Lista de proyectos a mostrar en el selector (opcional).
   */
  projects?: NotionProject[];
  /**
   * Función que se llama cuando se seleccionan proyectos.
   * Recibe un arreglo de IDs de proyectos seleccionados.
   */
  onSelectProjects: (selectedIds: string[]) => void;
  /**
   * Función que se llama cuando se quiere importar un proyecto individual.
   */
  onImportProject: (projectId: string) => Promise<void>;
  /**
   * Función para refrescar los datos.
   */
  onRefresh: () => Promise<void>;
  /**
   * Indica si está cargando datos.
   */
  isLoading: boolean;
  /**
   * Proyectos seleccionados externamente.
   * Si se proporciona, se utilizará como selección inicial.
   */
  selectedProjects: string[];
  /**
   * Proyectos que ya han sido importados.
   * Si se proporciona, se utilizará para marcar los proyectos como importados.
   */
  importedProjects: string[];
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects = [],
  onSelectProjects,
  onImportProject,
  onRefresh: _onRefresh,
  isLoading: _isLoading,
  selectedProjects: externalSelectedProjects = [],
  importedProjects = []
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>(externalSelectedProjects);
  const [loading, setLoading] = useState(true);

  const { searchTerm, filteredProjects, handleSearch } = useProjectSearch(projects);

  // Cargar proyectos con useCallback para evitar ciclos de dependencias
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener proyectos reales de Notion (aumentando el límite a 100)
      const response = await fetch('/api/notion/database/sample?limit=100');
      
      if (!response.ok) {
        throw new Error(`Error al obtener proyectos: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.projects && Array.isArray(data.projects)) {
        // Transformar los proyectos de Notion al formato requerido
        data.projects.map((project: NotionApiProject) => ({
          id: project.id,
          title: project.title || 'Proyecto sin título',
          status: importedProjects.includes(project.id) ? 'imported' : 'not_imported',
          lastUpdated: project.lastEditedTime || Date.now().toString(),
        }));
        
        // Mantener la selección externa o usar un array vacío
        setSelectedProjects(externalSelectedProjects || []);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      
      // En caso de error, usar datos de ejemplo como fallback
      const fallbackProjects: NotionProject[] = [
        {
          id: 'proj1',
          title: 'Rediseño Web Corporativa',
          status: 'imported',
          lastUpdated: new Date(2025, 1, 15).toString(),
        },
        {
          id: 'proj2',
          title: 'Campaña Redes Sociales Q1',
          status: 'not_imported',
          lastUpdated: new Date(2025, 1, 20).toString(),
        },
        {
          id: 'proj3',
          title: 'Desarrollo App Móvil',
          status: 'outdated',
          lastUpdated: new Date(2025, 1, 10).toString(),
        }
      ];
      
      // Seleccionar todos los proyectos por defecto
      const projectIds = fallbackProjects.map(p => p.id);
      setSelectedProjects(projectIds);
    } finally {
      setLoading(false);
    }
  }, [importedProjects, externalSelectedProjects]);

  // Cargar proyectos al iniciar
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Consolidar useEffects relacionados con selección
  useEffect(() => {
    // Actualizar selección cuando cambia externamente
    if (JSON.stringify(externalSelectionRef.current) !== JSON.stringify(externalSelectedProjects)) {
      setSelectedProjects(externalSelectedProjects);
      externalSelectionRef.current = [...externalSelectedProjects];
    }

    // Notificar al componente padre cuando cambia la selección
    const hasSelectionChanged = JSON.stringify(selectedProjects) !== JSON.stringify(prevSelectionRef.current) &&
                             JSON.stringify(selectedProjects) !== JSON.stringify(externalSelectedProjects);
    
    if (hasSelectionChanged && !loading) {
      onSelectProjects(selectedProjects);
    }
    
    // Actualizar la referencia
    prevSelectionRef.current = [...selectedProjects];
  }, [selectedProjects, externalSelectedProjects, loading, onSelectProjects]);

  // Simplificar paginación
  const paginatedProjects = React.useMemo(() => {
    return filteredProjects.slice(0, 10); // Mostrar siempre los primeros 10 proyectos
  }, [filteredProjects]);

  // Manejar la selección de un proyecto
  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjects(prev => {
      const newSelection = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      return newSelection;
    });
  }, []);

  // Función para limpiar toda la selección
  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
  }, []);

  // Manejar la importación directa de un proyecto
  const handleImportProject = useCallback(async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await onImportProject(projectId);
  }, [onImportProject]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    // No implementado
    console.log('Cambio de página:', page);
  };

  // Manejar cambio de elementos por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // No implementado
    console.log('Cambio de elementos por página:', e.target.value);
  };

  // Componente ProjectItem
  const ProjectItem = React.memo(({ project, isSelected, onSelect, onImport }: {
    project: NotionProject;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onImport: (id: string, e: React.MouseEvent) => Promise<void>;
  }) => (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSelect(project.id);
        }
      }}
      className={`group flex items-center justify-between p-4 mb-2 rounded-lg cursor-pointer transition-colors ${isSelected
        ? 'bg-teal-500/10 border border-teal-500/20'
        : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
      aria-label={`Proyecto: ${project.title}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white/20 flex-shrink-0">
          {isSelected && (
            <span className="text-teal-400 text-xs">✓</span>
          )}
        </span>
        <span 
          className={`font-medium ${isSelected ? 'text-white' : 'text-white/90'} hover:text-white`}
        >
          {project.title}
        </span>
        
        {project.status !== 'imported' && (
          <button
            onClick={(e) => onImport(project.id, e)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center gap-1 text-xs"
            aria-label="Importar proyecto"
          >
            <Download size={12} />
            Importar
          </button>
        )}
      </div>
      <div className="text-white/60 text-sm">
        {new Date(project.lastUpdated).toLocaleDateString('es-ES')}
      </div>
      <StatusBadge status={project.status} />
    </div>
  ));
  ProjectItem.displayName = 'ProjectItem';

  // Componente StatusBadge
  const StatusBadge = React.memo(({ status }: { status: NotionProject['status'] }) => (
    <div>
      {status === 'imported' ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
          <CheckCircle2 size={12} />
          Importado
        </span>
      ) : status === 'outdated' ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-400/20 text-amber-400 rounded-full text-xs">
          <AlertCircle size={12} />
          Desactualizado
        </span>
      ) : status === 'error' ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
          <AlertCircle size={12} />
          Error
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
          <CircleDashed size={12} />
          Pendiente
        </span>
      )}
    </div>
  ));
  StatusBadge.displayName = 'StatusBadge';

  const externalSelectionRef = useRef<string[]>([]);
  const prevSelectionRef = useRef<string[]>([]);

  return (
    <div 
      className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono"
      role="region"
      aria-label="Selector de proyectos"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-semibold text-white/90"
          id="project-selector-title"
        >
          Seleccionar Proyectos
        </h2>
        <button
          onClick={handleClearSelection}
          className="px-4 py-2 text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          aria-label="Limpiar selección"
        >
          Limpiar Selección
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pr-10 text-white/90 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="Buscar proyectos..."
            aria-label="Buscar proyectos"
            aria-describedby="project-selector-title"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        </div>
      </div>

      <div role="listbox" aria-label="Lista de proyectos">
        {paginatedProjects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedProjects.includes(project.id)}
            onSelect={handleSelectProject}
            onImport={handleImportProject}
          />
        ))}
      </div>

      {/* Paginación y selector de elementos por página */}
      {filteredProjects.length > 10 && (
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Mostrar:</span>
            <select 
              value={10}
              onChange={handleItemsPerPageChange}
              className="bg-white/5 border border-white/10 rounded-lg text-white/90 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              aria-label="Elementos por página"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>por página</span>
          </div>
          <Pagination
            currentPage={1}
            totalPages={Math.ceil(filteredProjects.length / 10)}
            onPageChangeAction={handlePageChange}
            className="flex items-center gap-2"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
