import { useState, useCallback, useMemo, useEffect } from 'react';
import { projectsConfig } from '@/config/projects';
import { featuredProjects } from '@/data/projects';
import { Project } from '@/types/projects';

// Extender el tipo Project para agregar el campo id
interface ProjectWithId extends Project {
  id: string;
}

interface UseProjectGridReturn {
  projects: ProjectWithId[];
  filteredProjects: ProjectWithId[];
  isLoading: boolean;
  activeFilter: string;
  setFilter: (category: string) => void;
  a11y: typeof projectsConfig.a11y;
  labels: typeof projectsConfig.labels;
  animations: typeof projectsConfig.animations;
  getProjectCardProps: (project: ProjectWithId, index: number) => {
    key: string;
    project: ProjectWithId;
    animationDelay: number;
    a11yLabel: string;
  };
}

export const useProjectGrid = (): UseProjectGridReturn => {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>(projectsConfig.filters.all);
  
  // Cargar los proyectos al inicializar el componente
  useEffect(() => {
    // Simular una carga asíncrona
    const loadProjects = async () => {
      try {
        // Agregar una ID única a cada proyecto
        const projectsWithId = featuredProjects.map(project => ({
          ...project,
          id: `project-${project.slug}`
        }));
        setProjects(projectsWithId as ProjectWithId[]);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Función para establecer el filtro activo
  const setFilter = useCallback((category: string) => {
    setActiveFilter(category);
  }, []);

  // Proyectos filtrados basados en la categoría seleccionada
  const filteredProjects = useMemo(() => {
    if (activeFilter === projectsConfig.filters.all) {
      return projects;
    }
    return projects.filter(project => project.category === activeFilter);
  }, [projects, activeFilter]);

  // Obtener las propiedades para cada tarjeta de proyecto
  const getProjectCardProps = useCallback((project: ProjectWithId, index: number) => {
    return {
      key: project.id,
      project,
      animationDelay: index * 0.1, // Valor fijo para la animación escalonada
      a11yLabel: `${projectsConfig.a11y.projectCard}: ${project.title}`
    };
  }, []);

  return {
    projects,
    filteredProjects,
    isLoading,
    activeFilter,
    setFilter,
    a11y: projectsConfig.a11y,
    labels: projectsConfig.labels,
    animations: projectsConfig.animations,
    getProjectCardProps
  };
};
