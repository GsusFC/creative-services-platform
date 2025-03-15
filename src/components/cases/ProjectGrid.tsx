'use client'

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProjectGrid } from '@/hooks/useProjectGrid';
import ProjectCard from './ProjectCard';

/**
 * Componente que muestra una cuadrícula de proyectos con filtros y animaciones.
 * Implementa un diseño modular y características de accesibilidad.
 */
const ProjectGrid = memo(function ProjectGrid() {
  const {
    filteredProjects,
    isLoading,
    a11y,
    labels
  } = useProjectGrid();

  // Función para manejar el cambio de filtro de categoría
  // Comentada hasta que se implemente la funcionalidad de filtrado
  // const handleFilterChange = (category: string) => {
  //   setFilter(category);
  // };

  // Pantalla de carga mientras se recuperan los proyectos
  if (isLoading) {
    return (
      <div className="space-y-8" aria-live="polite">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[16/9] bg-neutral-800 animate-pulse rounded-sm"></div>
        ))}
      </div>
    );
  }

  return (
    <section aria-label={a11y.projectsSection}>
      {/* Filtros de categoría - actualmente deshabilitados hasta tener más proyectos */}
      {/* <div className="flex gap-4 mb-8">
        {[labels.filters.all, ...labels.filters.categories].map(category => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeFilter === category
                ? 'bg-[#00ff00] text-black font-medium'
                : 'bg-white/10 text-white/60 hover:bg-white/20 transition-colors'
            }`}
            aria-pressed={activeFilter === category}
          >
            {category}
          </button>
        ))}
      </div> */}

      {filteredProjects.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              animationDelay={index * 0.1}
              a11yLabel={`${a11y.projectCard}: ${project.title}`}
            />
          ))}
        </motion.div>
      ) : (
        <div 
          className="py-16 text-center bg-neutral-900 rounded-sm"
          aria-label={a11y.emptyState}
        >
          <p className="text-white/60 mb-4">{labels.noProjects}</p>
          <Link 
            href="/admin/case-studies/new"
            className="inline-block px-6 py-3 bg-[#00ff00] text-black font-medium rounded-sm hover:bg-[#00dd00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-offset-2 focus:ring-offset-black"
            tabIndex={0}
          >
            {labels.createProject}
          </Link>
        </div>
      )}
    </section>
  );
});

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
