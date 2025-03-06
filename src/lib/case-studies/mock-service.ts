import { CaseStudy } from "@/types/case-study";

// Datos mock para los case studies
const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "1",
    title: "Proyecto Nebula",
    client: "Nebula Technologies",
    description: "Plataforma de visualización de datos científicos para investigadores",
    description2: "Desarrollamos una plataforma avanzada de visualización de datos científicos que permite a investigadores de diversas disciplinas analizar y compartir conjuntos de datos complejos con una interfaz intuitiva. El proyecto incluyó visualizaciones 3D interactivas, colaboración en tiempo real y compatibilidad con formatos especializados.",
    mediaItems: [
      {
        type: "image",
        url: "/projects/nebula.svg",
        alt: "Dashboard principal de la plataforma Nebula",
        width: 1920,
        height: 1080,
        order: 1,
        displayMode: "single"
      },
      {
        type: "image",
        url: "/projects/adidas-1.svg",
        alt: "Visualización de datos en tiempo real",
        width: 800,
        height: 600,
        order: 2,
        displayMode: "dual_left"
      },
      {
        type: "image",
        url: "/projects/nike.svg",
        alt: "Interfaz de colaboración entre investigadores",
        width: 800,
        height: 600,
        order: 3,
        displayMode: "dual_right"
      },
      {
        type: "video",
        url: "https://player.vimeo.com/video/783455878", 
        videoType: "vimeo",
        thumbnailUrl: "/projects/eco.svg",
        alt: "Demo de la plataforma Nebula",
        width: 1920,
        height: 1080,
        order: 4,
        displayMode: "single"
      }
    ],
    tags: ["DATA VISUALIZATION", "SCIENTIFIC", "DASHBOARD", "COLLABORATION"],
    order: 1,
    slug: "proyecto-nebula",
    status: "published",
    featured: true,
    featuredOrder: 1
  },
  {
    id: "2",
    title: "Quantum Interface",
    client: "Quantum Solutions",
    description: "Rediseño de la interfaz de usuario para el sistema Quantum",
    description2: "Rediseñamos completamente la interfaz de usuario del sistema Quantum, una plataforma empresarial para gestión de recursos. El nuevo diseño se enfocó en la usabilidad, accesibilidad y estética moderna, resultando en un aumento del 45% en la productividad de los usuarios y una reducción del 60% en los errores de entrada de datos.",
    mediaItems: [
      {
        type: "image",
        url: "/projects/quantum.svg",
        alt: "Nueva interfaz del sistema Quantum",
        width: 1920,
        height: 1080,
        order: 1,
        displayMode: "single"
      },
      {
        type: "image",
        url: "/projects/adidas.svg",
        alt: "Comparativa antes-después de la interfaz",
        width: 800,
        height: 600,
        order: 2,
        displayMode: "dual_left"
      },
      {
        type: "image",
        url: "/projects/adidas-hero.svg",
        alt: "Análisis de flujos de usuario",
        width: 800,
        height: 600,
        order: 3,
        displayMode: "dual_right"
      }
    ],
    tags: ["UI/UX", "ENTERPRISE", "REDESIGN"],
    order: 2,
    slug: "quantum-interface",
    status: "published",
    featured: true,
    featuredOrder: 2
  },
  {
    id: "3",
    title: "Campaña ECO",
    client: "Eco Fundación",
    description: "Campaña de concientización ambiental con interacción digital",
    description2: "Desarrollamos una campaña multiplataforma para concientizar sobre problemas ambientales que combinó elementos digitales y físicos. Utilizamos realidad aumentada para permitir a los usuarios interactuar con instalaciones físicas, visualizar el impacto ambiental y compartir sus experiencias en redes sociales, logrando un alcance de más de 2 millones de personas.",
    mediaItems: [
      {
        type: "image",
        url: "/projects/eco.svg",
        alt: "Instalación principal de la campaña ECO",
        width: 1920,
        height: 1080,
        order: 1,
        displayMode: "single"
      },
      {
        type: "video",
        url: "https://player.vimeo.com/video/783455878",
        videoType: "vimeo",
        thumbnailUrl: "/projects/nebula.svg",
        alt: "Video promocional de la campaña",
        width: 1920,
        height: 1080,
        order: 2,
        displayMode: "single"
      },
      {
        type: "image",
        url: "/projects/spotify.svg",
        alt: "Estadísticas de engagement de la campaña",
        width: 800,
        height: 600,
        order: 3,
        displayMode: "dual_left"
      },
      {
        type: "image",
        url: "/projects/supreme.svg",
        alt: "Ejemplos de interacción con realidad aumentada",
        width: 800,
        height: 600,
        order: 4,
        displayMode: "dual_right"
      }
    ],
    tags: ["CAMPAIGN", "ENVIRONMENTAL", "AUGMENTED REALITY"],
    order: 3,
    slug: "campana-eco",
    status: "published",
    featured: true,
    featuredOrder: 3
  },
  {
    id: "4",
    title: "Aplicación Adidas Originals",
    client: "Adidas",
    description: "Aplicación móvil exclusiva para la línea Originals",
    description2: "Diseñamos y desarrollamos una aplicación móvil exclusiva para la línea Adidas Originals que conecta a los usuarios con lanzamientos limitados, eventos especiales y contenido exclusivo. La aplicación incluye autenticación de productos mediante blockchain, realidad aumentada para prueba virtual de productos y un sistema de reserva para lanzamientos limitados.",
    mediaItems: [
      {
        type: "image",
        url: "/projects/adidas.svg",
        alt: "Pantalla principal de la aplicación Adidas Originals",
        width: 1920,
        height: 1080,
        order: 1,
        displayMode: "single"
      },
      {
        type: "image",
        url: "/projects/adidas-1.svg",
        alt: "Sistema de prueba virtual con realidad aumentada",
        width: 800,
        height: 600,
        order: 2,
        displayMode: "dual_left"
      },
      {
        type: "image",
        url: "/projects/adidas-hero.svg",
        alt: "Función de autenticación de productos",
        width: 800,
        height: 600,
        order: 3,
        displayMode: "dual_right"
      }
    ],
    tags: ["APPLICATION", "MOBILE", "AUGMENTED REALITY", "BLOCKCHAIN"],
    order: 4,
    slug: "adidas-originals-app",
    status: "published",
    featured: true,
    featuredOrder: 4
  }
];

// Obtener todos los case studies
export async function getMockCaseStudies(): Promise<CaseStudy[]> {
  // Simulamos una pequeña demora para imitar una solicitud de red
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CASE_STUDIES;
}

// Obtener un case study por su slug
export async function getMockCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  // Simulamos una pequeña demora para imitar una solicitud de red
  await new Promise(resolve => setTimeout(resolve, 200));
  const caseStudy = MOCK_CASE_STUDIES.find(cs => cs.slug === slug);
  return caseStudy || null;
}

// Obtener los case studies destacados
export async function getMockFeaturedCaseStudies(): Promise<CaseStudy[]> {
  // Simulamos una pequeña demora para imitar una solicitud de red
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CASE_STUDIES.filter(cs => cs.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}
