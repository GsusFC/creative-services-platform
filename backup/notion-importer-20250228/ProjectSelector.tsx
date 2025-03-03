'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  CheckSquare, 
  CircleDashed, 
  Download, 
  Folder, 
  Layers, 
  Search
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

export type NotionProject = {
  id: string;
  title: string;
  lastUpdated: Date;
  status: 'imported' | 'not_imported' | 'outdated' | 'error';
};

// Definir un tipo para los proyectos recibidos de la API
type NotionApiProject = {
  id: string;
  title?: string;
  lastEditedTime?: string;
  [key: string]: unknown; // Para otros campos que puedan venir de la API
};

interface ProjectSelectorProps {
  onSelectProjects: (selectedIds: string[]) => void;
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
  importedProjects?: string[]; // IDs de proyectos que ya han sido importados
  selectedProjects?: string[]; // IDs de proyectos seleccionados externamente
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  onSelectProjects,
  onRefresh,
  isLoading = false,
  importedProjects = [],
  selectedProjects: externalSelectedProjects = []
}) => {
  const [projects, setProjects] = useState<NotionProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(externalSelectedProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        const notionProjects: NotionProject[] = data.projects.map((project: NotionApiProject) => ({
          id: project.id,
          title: project.title || 'Proyecto sin título',
          lastUpdated: new Date(project.lastEditedTime || Date.now()),
          // Marcar como importados los proyectos que ya están en importedProjects
          status: importedProjects.includes(project.id) ? 'imported' : 'not_imported'
        }));
        
        setProjects(notionProjects);
        
        // Seleccionar todos los proyectos por defecto
        const projectIds = notionProjects.map(p => p.id);
        setSelectedProjects(projectIds);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      
      // En caso de error, usar datos de ejemplo como fallback
      const fallbackProjects: NotionProject[] = [
        {
          id: 'proj1',
          title: 'Rediseño Web Corporativa',
          lastUpdated: new Date(2025, 1, 15),
          status: 'imported'
        },
        {
          id: 'proj2',
          title: 'Campaña Redes Sociales Q1',
          lastUpdated: new Date(2025, 1, 20),
          status: 'not_imported'
        },
        {
          id: 'proj3',
          title: 'Desarrollo App Móvil',
          lastUpdated: new Date(2025, 1, 10),
          status: 'outdated'
        }
      ];
      
      setProjects(fallbackProjects);
      
      // Seleccionar todos los proyectos por defecto
      const projectIds = fallbackProjects.map(p => p.id);
      setSelectedProjects(projectIds);
    } finally {
      setLoading(false);
    }
  }, [importedProjects]);

  // Cargar proyectos al iniciar
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Actualizar selección cuando cambia externamente
  useEffect(() => {
    if (externalSelectedProjects && externalSelectedProjects.length > 0) {
      setSelectedProjects(externalSelectedProjects);
    }
  }, [externalSelectedProjects]);

  // Actualizar el estado de los proyectos cuando cambia importedProjects
  useEffect(() => {
    if (importedProjects.length > 0 && projects.length > 0) {
      setProjects(prevProjects => 
        prevProjects.map(project => ({
          ...project,
          status: importedProjects.includes(project.id) ? 'imported' : 'not_imported'
        }))
      );
    }
  }, [importedProjects, projects.length]);

  // Añadir un nuevo useEffect para manejar la selección inicial de proyectos
  useEffect(() => {
    if (projects.length > 0 && selectedProjects.length > 0) {
      // Solo notificar al componente padre cuando cambia la selección explícitamente
      // No durante la inicialización
      const hasSelectionChanged = JSON.stringify(selectedProjects) !== JSON.stringify(externalSelectedProjects);
      if (hasSelectionChanged && !isLoading) {
        onSelectProjects(selectedProjects);
      }
    }
  }, [selectedProjects, onSelectProjects, projects.length, externalSelectedProjects, isLoading]);

  // Manejar la actualización manual de proyectos
  const handleRefresh = async () => {
    try {
      await fetchProjects();
      await onRefresh();
    } catch (error) {
      console.error('Error al actualizar proyectos:', error);
    }
  };

  // Manejar la selección de un proyecto
  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSelection = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      return newSelection;
    });
  };

  // Manejar selección/deselección de todos los proyectos visibles en la página actual
  const handleToggleSelectAll = () => {
    const visibleProjects = paginatedProjects.map(p => p.id);
    
    const allVisible = visibleProjects.every(id => selectedProjects.includes(id));
    
    if (allVisible) {
      // Deseleccionar solo los visibles
      setSelectedProjects(prev => prev.filter(id => !visibleProjects.includes(id)));
    } else {
      // Seleccionar los visibles que no estén ya seleccionados
      setSelectedProjects(prev => {
        const newSelection = [...prev];
        visibleProjects.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Filtrar proyectos según búsqueda y filtros
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  
  // Obtener los proyectos para la página actual
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar cambio de elementos por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página
  };

  return (
    <div className="p-6 bg-black/60 rounded-lg border border-white/10 shadow-sm font-mono">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium flex items-center gap-2 text-teal-400">
          <Folder size={20} />
          Proyectos de Notion
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-full md:w-64"
            />
          </div>
          
          <button
            onClick={handleToggleSelectAll}
            className="px-3 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
            aria-label="Seleccionar todos los proyectos"
          >
            <CheckSquare size={16} />
            {paginatedProjects.length > 0 && paginatedProjects.every(p => selectedProjects.includes(p.id)) ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            statusFilter === 'all' 
              ? 'bg-white/10 text-white/90' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <Layers size={14} />
          Todos
        </button>
        <button
          onClick={() => setStatusFilter('imported')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            statusFilter === 'imported' 
              ? 'bg-green-400/20 text-green-400' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <CheckCircle2 size={14} />
          Importados
        </button>
        <button
          onClick={() => setStatusFilter('not_imported')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            statusFilter === 'not_imported' 
              ? 'bg-amber-400/20 text-amber-400' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <CircleDashed size={14} />
          No Importados
        </button>
        <button
          onClick={() => setStatusFilter('selected')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            statusFilter === 'selected' 
              ? 'bg-blue-400/20 text-blue-400' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <CheckSquare size={14} />
          Seleccionados ({selectedProjects.length})
        </button>
      </div>
      
      {/* Lista de proyectos */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 bg-white/5 border-b border-white/10 text-white/60 text-sm">
          <div></div>
          <div>Nombre del Proyecto</div>
          <div>Última Actualización</div>
          <div>Estado</div>
        </div>
        
        <div>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              {searchQuery 
                ? 'No se encontraron proyectos que coincidan con la búsqueda' 
                : 'No hay proyectos disponibles'}
            </div>
          ) : (
            paginatedProjects.map(project => (
              <div 
                key={project.id}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 border-b border-white/5 hover:bg-white/5 items-center"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                </div>
                <div>
                  <label 
                    className="font-medium text-white/90 cursor-pointer hover:text-white"
                  >
                    {project.title}
                  </label>
                </div>
                <div className="text-white/60 text-sm">
                  {project.lastUpdated.toLocaleDateString('es-ES')}
                </div>
                <div>
                  {project.status === 'imported' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                      <CheckCircle2 size={12} />
                      Importado
                    </span>
                  ) : project.status === 'outdated' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-400/20 text-amber-400 rounded-full text-xs">
                      <AlertCircle size={12} />
                      Desactualizado
                    </span>
                  ) : project.status === 'error' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
                      <AlertCircle size={12} />
                      Error
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                      <Download size={12} />
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChangeAction={handlePageChange}
            className="flex items-center gap-2"
          />
        </div>
      )}
      
      {/* Botón de importar seleccionados */}
      {selectedProjects.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onSelectProjects(selectedProjects)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            aria-label="Importar proyectos seleccionados"
          >
            <Download size={18} />
            Importar ({selectedProjects.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
