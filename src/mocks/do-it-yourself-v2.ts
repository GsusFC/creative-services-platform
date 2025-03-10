import { v4 as uuidv4 } from 'uuid';

// Interfaces para los tipos de datos
export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  tiempo_estimado: string;
  departamentos: number[]; // IDs de departamentos relacionados
  servicios: number[]; // IDs de servicios que componen este producto
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: string;
  es_independiente: boolean;
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: string;
  productos: number[]; // IDs de productos que componen este paquete
}

// Datos mock
export const departamentos: Departamento[] = [
  {
    id: 1,
    nombre: 'Estrategia',
    descripcion: 'Planificación estratégica y consultoría de marca'
  },
  {
    id: 2,
    nombre: 'Branding',
    descripcion: 'Servicios de identidad visual y diseño de marca'
  },
  {
    id: 3,
    nombre: 'Digital Product',
    descripcion: 'Diseño y desarrollo de productos digitales'
  },
  {
    id: 4,
    nombre: 'Motion',
    descripcion: 'Animación y efectos visuales para video'
  }
];

export const servicios: Servicio[] = [
  // Estrategia
  {
    id: 101,
    nombre: 'Estrategia de Marca',
    descripcion: 'Definición de posicionamiento, valores y propuesta de valor única para tu marca.',
    precio: 2500,
    tiempo_estimado: '2-3 semanas',
    es_independiente: true
  },
  {
    id: 102,
    nombre: 'Investigación de Mercado',
    descripcion: 'Análisis de mercado, competencia y audiencia para fundamentar decisiones estratégicas.',
    precio: 1800,
    tiempo_estimado: '1-2 semanas',
    es_independiente: true
  },
  {
    id: 103,
    nombre: 'Naming',
    descripcion: 'Creación de nombre para tu marca, producto o servicio con estudio de disponibilidad.',
    precio: 950,
    tiempo_estimado: '1 semana',
    es_independiente: true
  },
  {
    id: 104,
    nombre: 'Diagnóstico de Marca',
    descripcion: 'Evaluación exhaustiva del estado actual de tu marca y recomendaciones de mejora.',
    precio: 1500,
    tiempo_estimado: '1 semana',
    es_independiente: true
  },
  
  // Branding
  {
    id: 201,
    nombre: 'Logo Design',
    descripcion: 'Diseño de símbolo visual que representa la esencia de tu marca.',
    precio: 1200,
    tiempo_estimado: '1-2 semanas',
    es_independiente: true
  },
  {
    id: 202,
    nombre: 'Sistema de Identidad Visual',
    descripcion: 'Desarrollo completo de colores, tipografías y elementos gráficos de tu marca.',
    precio: 2200,
    tiempo_estimado: '2 semanas',
    es_independiente: true
  },
  {
    id: 203,
    nombre: 'Brand Guidelines',
    descripcion: 'Manual de uso y aplicación de todos los elementos de identidad visual.',
    precio: 800,
    tiempo_estimado: '1 semana',
    es_independiente: false
  },
  {
    id: 204,
    nombre: 'Papelería Corporativa',
    descripcion: 'Diseño de tarjetas, papel membretado, sobres y otros elementos impresos.',
    precio: 600,
    tiempo_estimado: '3-5 días',
    es_independiente: false
  },
  {
    id: 205,
    nombre: 'Mockups de Aplicación',
    descripcion: 'Visualización realista de cómo se aplica la marca en diferentes soportes.',
    precio: 750,
    tiempo_estimado: '3-5 días',
    es_independiente: false
  },
  
  // Digital Product
  {
    id: 301,
    nombre: 'UX Design',
    descripcion: 'Diseño de experiencia de usuario para productos digitales centrados en el usuario.',
    precio: 2600,
    tiempo_estimado: '2-3 semanas',
    es_independiente: true
  },
  {
    id: 302,
    nombre: 'UI Design',
    descripcion: 'Interfaz visual atractiva y funcional para aplicaciones web o móviles.',
    precio: 2200,
    tiempo_estimado: '2 semanas',
    es_independiente: true
  },
  {
    id: 303,
    nombre: 'Desarrollo Frontend',
    descripcion: 'Implementación de la interfaz de usuario con código HTML, CSS y JavaScript.',
    precio: 3500,
    tiempo_estimado: '3-4 semanas',
    es_independiente: true
  },
  {
    id: 304,
    nombre: 'Desarrollo Backend',
    descripcion: 'Construcción de la lógica y servicios del servidor para aplicaciones.',
    precio: 4000,
    tiempo_estimado: '3-5 semanas',
    es_independiente: true
  },
  {
    id: 305,
    nombre: 'Auditoría de Usabilidad',
    descripcion: 'Evaluación detallada de la usabilidad de tu producto digital existente.',
    precio: 1500,
    tiempo_estimado: '1 semana',
    es_independiente: true
  },
  
  // Motion
  {
    id: 401,
    nombre: 'Motion Graphics',
    descripcion: 'Animación de gráficos y elementos visuales para dar vida a tu marca.',
    precio: 1800,
    tiempo_estimado: '1-2 semanas',
    es_independiente: true
  },
  {
    id: 402,
    nombre: 'Video Editing',
    descripcion: 'Edición profesional de material audiovisual con corrección de color.',
    precio: 1500,
    tiempo_estimado: '1 semana',
    es_independiente: true
  },
  {
    id: 403,
    nombre: '3D Animation',
    descripcion: 'Modelado y animación tridimensional para proyectos de alto impacto visual.',
    precio: 3500,
    tiempo_estimado: '2-3 semanas',
    es_independiente: true
  },
  {
    id: 404,
    nombre: 'Intro Animada',
    descripcion: 'Secuencia de introducción animada para vídeos corporativos o promocionales.',
    precio: 900,
    tiempo_estimado: '3-5 días',
    es_independiente: true
  },
  {
    id: 405,
    nombre: 'Animación de Logo',
    descripcion: 'Dar vida a tu logo con movimiento para usar en digital y video.',
    precio: 650,
    tiempo_estimado: '2-3 días',
    es_independiente: false
  }
];

export const productos: Producto[] = [
  {
    id: 1001,
    nombre: 'Identidad Corporativa Básica',
    precio: 3200, // Precio con pequeño descuento sobre la suma de servicios
    descripcion: 'Pack básico de identidad visual que incluye logo, colores y tipografía corporativa.',
    tiempo_estimado: '2-3 semanas',
    departamentos: [2], // Branding
    servicios: [201, 202] // Logo Design + Sistema de Identidad Visual
  },
  {
    id: 1002,
    nombre: 'Identidad Corporativa Completa',
    precio: 4500, // Precio con descuento sobre la suma de servicios
    descripcion: 'Sistema completo de identidad visual con manual de uso y aplicaciones.',
    tiempo_estimado: '3-4 semanas',
    departamentos: [2], // Branding
    servicios: [201, 202, 203, 204, 205] // Todos los servicios de branding
  },
  {
    id: 1003,
    nombre: 'Estrategia de Marca Esencial',
    precio: 4000,
    descripcion: 'Definición estratégica de tu marca con naming e identidad visual básica.',
    tiempo_estimado: '3-4 semanas',
    departamentos: [1, 2], // Estrategia, Branding
    servicios: [101, 103, 201] // Estrategia de Marca + Naming + Logo Design
  },
  {
    id: 1004,
    nombre: 'Sitio Web Corporativo',
    precio: 8000,
    descripcion: 'Diseño y desarrollo de sitio web profesional alineado con tu marca.',
    tiempo_estimado: '6-8 semanas',
    departamentos: [3], // Digital Product
    servicios: [301, 302, 303, 304] // UX + UI + Frontend + Backend
  },
  {
    id: 1005,
    nombre: 'Video Promocional Animado',
    precio: 3500,
    descripcion: 'Video promocional con motion graphics y edición profesional.',
    tiempo_estimado: '2-3 semanas',
    departamentos: [4], // Motion
    servicios: [401, 402, 405] // Motion Graphics + Video Editing + Animación de Logo
  },
  {
    id: 1006,
    nombre: 'Rediseño UX/UI',
    precio: 4000,
    descripcion: 'Evaluación y rediseño de la experiencia e interfaz de usuario de tu producto digital.',
    tiempo_estimado: '3-4 semanas',
    departamentos: [3], // Digital Product
    servicios: [305, 301, 302] // Auditoría + UX + UI
  }
];

export const paquetes: Paquete[] = [
  {
    id: 2001,
    nombre: 'Pack Lanzamiento',
    descripcion: 'Todo lo que necesitas para lanzar una nueva marca al mercado: estrategia, identidad y web.',
    precio: 12000, // Precio con descuento significativo
    tiempo_estimado: '8-10 semanas',
    productos: [1003, 1002, 1004] // Estrategia + Identidad Completa + Web
  },
  {
    id: 2002,
    nombre: 'Pack Presencia Digital',
    descripcion: 'Mejora tu presencia digital con un sitio web renovado y contenido audiovisual de impacto.',
    precio: 10000,
    tiempo_estimado: '6-8 semanas',
    productos: [1004, 1005] // Web + Video
  },
  {
    id: 2003,
    nombre: 'Pack Rebranding',
    descripcion: 'Revitaliza completamente tu marca con una nueva estrategia e identidad visual.',
    precio: 7500,
    tiempo_estimado: '5-7 semanas',
    productos: [1003, 1002] // Estrategia + Identidad Completa
  }
];

// Funciones helper para obtener datos relacionados
export function getServiciosDeProducto(productoId: number): Servicio[] {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return [];
  
  return servicios.filter(servicio => 
    producto.servicios.includes(servicio.id)
  );
}

export function getProductosDePaquete(paqueteId: number): Producto[] {
  const paquete = paquetes.find(p => p.id === paqueteId);
  if (!paquete) return [];
  
  return productos.filter(producto => 
    paquete.productos.includes(producto.id)
  );
}

export function getServiciosDeDepartamento(departamentoId: number): Servicio[] {
  // En un entorno real, esto requeriría una búsqueda más compleja
  // Aquí lo simulamos con una asignación manual basada en los rangos de IDs
  const rangos = {
    1: [100, 199], // Estrategia: IDs 100-199
    2: [200, 299], // Branding: IDs 200-299
    3: [300, 399], // Digital: IDs 300-399
    4: [400, 499]  // Motion: IDs 400-499
  };
  
  const rango = rangos[departamentoId as keyof typeof rangos];
  if (!rango) return [];
  
  return servicios.filter(
    servicio => servicio.id >= rango[0] && servicio.id <= rango[1]
  );
}

export function getProductosDeDepartamento(departamentoId: number): Producto[] {
  return productos.filter(producto => 
    producto.departamentos.includes(departamentoId)
  );
}
