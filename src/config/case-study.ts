export interface CaseStudyConfig {
  navigation: {
    allProjects: string;
    nextProject: string;
    prevProject: string;
  };
  a11y: {
    heroSection: string;
    contentSection: string;
    gallerySection: string;
    videosSection: string;
    scrollIndicator: string;
    navigationSection: string;
  };
  placeholders: {
    fallbackImage: string;
    imageAlt: string;
  };
}

export const caseStudyConfig: CaseStudyConfig = {
  navigation: {
    allProjects: 'TODOS LOS PROYECTOS',
    nextProject: 'SIGUIENTE PROYECTO',
    prevProject: 'PROYECTO ANTERIOR',
  },
  a11y: {
    heroSection: 'Sección principal del caso de estudio',
    contentSection: 'Descripción detallada del proyecto',
    gallerySection: 'Galería de imágenes del proyecto',
    videosSection: 'Videos relacionados al proyecto',
    scrollIndicator: 'Desplázate hacia abajo para ver el contenido',
    navigationSection: 'Navegación entre proyectos',
  },
  placeholders: {
    fallbackImage: '/projects/quantum.svg',
    imageAlt: 'Imagen del proyecto',
  },
};
