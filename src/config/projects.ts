export interface ProjectConfig {
  a11y: {
    projectsSection: string;
    projectCard: string;
    projectImage: string;
    projectTags: string;
    emptyState: string;
  };
  labels: {
    viewProject: string;
    noProjects: string;
    createProject: string;
  };
  filters: {
    all: string;
    categories: string[];
  };
  animations: {
    grid: {
      staggerChildren: number;
    };
    card: {
      initial: {
        opacity: number;
        y: number;
      };
      animate: {
        opacity: number;
        y: number;
      };
      transition: {
        duration: number;
      };
    };
  };
}

export const projectsConfig: ProjectConfig = {
  a11y: {
    projectsSection: 'Galería de proyectos',
    projectCard: 'Tarjeta de proyecto',
    projectImage: 'Imagen destacada del proyecto',
    projectTags: 'Etiquetas del proyecto',
    emptyState: 'No hay proyectos disponibles',
  },
  labels: {
    viewProject: 'Ver proyecto',
    noProjects: 'No hay proyectos disponibles.',
    createProject: 'Crear Proyecto',
  },
  filters: {
    all: 'Todos',
    categories: ['Estrategia', 'Branding', 'Digital', 'UX/UI']
  },
  animations: {
    grid: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    card: {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.4
      }
    }
  }
};
