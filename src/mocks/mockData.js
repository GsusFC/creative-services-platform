/**
 * Datos mock para simular una API de servicios
 * En una implementación real, estos datos vendrían de una API o base de datos
 */

// Categorías de servicios
const categories = [
  {
    id: 'strategy',
    name: 'Estrategia',
    description: 'Planificación estratégica y consultoría de marca',
    icon: 'trending-up'
  },
  {
    id: 'branding',
    name: 'Branding',
    description: 'Servicios de identidad visual y diseño de marca',
    icon: 'palette'
  },
  {
    id: 'digital',
    name: 'Digital Product',
    description: 'Diseño y desarrollo de productos digitales',
    icon: 'code'
  },
  {
    id: 'motion',
    name: 'Motion',
    description: 'Animación y efectos visuales para video',
    icon: 'video'
  }
];

// Servicios disponibles
const services = [
  // Estrategia
  {
    id: 'strategy-brand',
    name: 'Estrategia de Marca',
    description: 'Definición de posicionamiento, valores y propuesta de valor única para tu marca.',
    price: 2500,
    category_id: 'strategy'
  },
  {
    id: 'strategy-research',
    name: 'Investigación',
    description: 'Análisis de mercado, competencia y audiencia para fundamentar decisiones estratégicas.',
    price: 1800,
    category_id: 'strategy'
  },
  {
    id: 'strategy-naming',
    name: 'Naming',
    description: 'Creación de nombre para tu marca, producto o servicio con estudio de disponibilidad.',
    price: 950,
    category_id: 'strategy'
  },
  
  // Branding
  {
    id: 'branding-identity',
    name: 'Identidad Visual',
    description: 'Sistema visual completo con logo, colores, tipografía y elementos gráficos.',
    price: 3200,
    category_id: 'branding'
  },
  {
    id: 'branding-logo',
    name: 'Logo Design',
    description: 'Diseño de símbolo visual que representa la esencia de tu marca.',
    price: 1200,
    category_id: 'branding'
  },
  {
    id: 'branding-guidelines',
    name: 'Brand Guidelines',
    description: 'Manual de uso y aplicación de todos los elementos de identidad visual.',
    price: 800,
    category_id: 'branding'
  },
  
  // Digital Product
  {
    id: 'digital-ux',
    name: 'UX Design',
    description: 'Diseño de experiencia de usuario para productos digitales centrados en el usuario.',
    price: 2600,
    category_id: 'digital'
  },
  {
    id: 'digital-ui',
    name: 'UI Design',
    description: 'Interfaz visual atractiva y funcional para aplicaciones web o móviles.',
    price: 2200,
    category_id: 'digital'
  },
  {
    id: 'digital-web',
    name: 'Web Development',
    description: 'Desarrollo frontend y backend para sitios web y aplicaciones.',
    price: 4500,
    category_id: 'digital'
  },
  {
    id: 'digital-mobile',
    name: 'App Design',
    description: 'Diseño y prototipado de aplicaciones móviles nativas o híbridas.',
    price: 3800,
    category_id: 'digital'
  },
  
  // Motion
  {
    id: 'motion-animation',
    name: 'Motion Graphics',
    description: 'Animación de gráficos y elementos visuales para dar vida a tu marca.',
    price: 1800,
    category_id: 'motion'
  },
  {
    id: 'motion-video',
    name: 'Video Editing',
    description: 'Edición profesional de material audiovisual con corrección de color.',
    price: 1500,
    category_id: 'motion'
  },
  {
    id: 'motion-3d',
    name: '3D Animation',
    description: 'Modelado y animación tridimensional para proyectos de alto impacto visual.',
    price: 3500,
    category_id: 'motion'
  }
];

// Simular API con promesas para imitar comunicación asíncrona
export const mockServiceApi = {
  // Obtener todas las categorías
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 300);
    });
  },
  
  // Obtener todos los servicios
  getServices: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(services);
      }, 500);
    });
  },
  
  // Obtener una categoría por ID
  getCategoryById: (categoryId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          resolve(category);
        } else {
          reject(new Error(`Categoría con ID ${categoryId} no encontrada`));
        }
      }, 200);
    });
  },
  
  // Obtener un servicio por ID
  getServiceById: (serviceId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          resolve(service);
        } else {
          reject(new Error(`Servicio con ID ${serviceId} no encontrado`));
        }
      }, 200);
    });
  },
  
  // Obtener servicios por categoría
  getServicesByCategory: (categoryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryServices = services.filter(s => s.category_id === categoryId);
        resolve(categoryServices);
      }, 300);
    });
  }
};
