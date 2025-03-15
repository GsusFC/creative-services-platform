// Datos mock para el módulo Do-It-Yourself

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
    nombre: 'Digital',
    descripcion: 'Desarrollo web y presencia digital'
  },
  {
    id: 4,
    nombre: 'Contenido',
    descripcion: 'Creación y gestión de contenido'
  },
  {
    id: 5,
    nombre: 'Marketing',
    descripcion: 'Estrategias de promoción y difusión'
  }
];

export const servicios: Servicio[] = [
  // Estrategia
  {
    id: 101,
    nombre: 'Estrategia de Marca',
    descripcion: 'Análisis y definición de valores y posicionamiento de marca',
    precio: 1200,
    tiempo_estimado: '5 días',
    es_independiente: true
  },
  {
    id: 102,
    nombre: 'Investigación de Mercado',
    descripcion: 'Estudio del mercado objetivo y competencia',
    precio: 1500,
    tiempo_estimado: '7 días',
    es_independiente: true
  },
  {
    id: 103,
    nombre: 'Plan de Comunicación',
    descripcion: 'Estrategia integral de comunicación para la marca',
    precio: 1800,
    tiempo_estimado: '10 días',
    es_independiente: true
  },
  
  // Branding
  {
    id: 201,
    nombre: 'Diseño de Logotipo',
    descripcion: 'Creación de logotipo con 3 propuestas y 2 revisiones',
    precio: 800,
    tiempo_estimado: '7 días',
    es_independiente: true
  },
  {
    id: 202,
    nombre: 'Manual de Identidad',
    descripcion: 'Guía completa de uso de marca e identidad visual',
    precio: 1200,
    tiempo_estimado: '14 días',
    es_independiente: false
  },
  {
    id: 203,
    nombre: 'Papelería Corporativa',
    descripcion: 'Diseño de tarjetas, papel membretado y elementos básicos',
    precio: 600,
    tiempo_estimado: '5 días',
    es_independiente: false
  },
  
  // Digital
  {
    id: 301,
    nombre: 'Diseño Web',
    descripcion: 'Diseño de interfaz y experiencia de usuario',
    precio: 1500,
    tiempo_estimado: '10 días',
    es_independiente: true
  },
  {
    id: 302,
    nombre: 'Desarrollo Front-end',
    descripcion: 'Implementación del diseño web en código',
    precio: 2000,
    tiempo_estimado: '15 días',
    es_independiente: false
  },
  {
    id: 303,
    nombre: 'CMS y Back-end',
    descripcion: 'Configuración de sistema de gestión de contenidos',
    precio: 1800,
    tiempo_estimado: '12 días',
    es_independiente: false
  },
  {
    id: 304,
    nombre: 'Optimización SEO',
    descripcion: 'Mejora de posicionamiento en buscadores',
    precio: 900,
    tiempo_estimado: '7 días',
    es_independiente: true
  },
  
  // Contenido
  {
    id: 401,
    nombre: 'Copywriting',
    descripcion: 'Redacción de textos para web y comunicaciones',
    precio: 700,
    tiempo_estimado: '5 días',
    es_independiente: true
  },
  {
    id: 402,
    nombre: 'Fotografía de Producto',
    descripcion: 'Sesión fotográfica profesional de productos',
    precio: 1200,
    tiempo_estimado: '3 días',
    es_independiente: true
  },
  {
    id: 403,
    nombre: 'Vídeo Corporativo',
    descripcion: 'Producción de vídeo de presentación de empresa',
    precio: 2500,
    tiempo_estimado: '21 días',
    es_independiente: true
  },
  
  // Marketing
  {
    id: 501,
    nombre: 'Plan de Redes Sociales',
    descripcion: 'Estrategia y planificación de contenidos para RRSS',
    precio: 1100,
    tiempo_estimado: '7 días',
    es_independiente: true
  },
  {
    id: 502,
    nombre: 'Gestión de Anuncios',
    descripcion: 'Configuración y gestión de campañas publicitarias',
    precio: 800,
    tiempo_estimado: '5 días',
    es_independiente: true
  },
  {
    id: 503,
    nombre: 'Email Marketing',
    descripcion: 'Diseño y programación de newsletters',
    precio: 600,
    tiempo_estimado: '4 días',
    es_independiente: true
  }
];

export const productos: Producto[] = [
  {
    id: 1001,
    nombre: 'Identidad Corporativa Básica',
    precio: 3200, // Precio con pequeño descuento sobre la suma de servicios
    descripcion: 'Paquete completo de identidad visual que incluye logotipo, manual básico y papelería',
    tiempo_estimado: '21 días',
    departamentos: [2], // Branding
    servicios: [201, 202, 203] // Logo, Manual, Papelería
  },
  {
    id: 1002,
    nombre: 'Pack Website Básico',
    precio: 4700,
    descripcion: 'Diseño y desarrollo de sitio web con hasta 5 páginas y CMS básico',
    tiempo_estimado: '30 días',
    departamentos: [3, 4], // Digital, Contenido
    servicios: [301, 302, 303, 401] // Diseño Web, Front, Back, Copy
  },
  {
    id: 1003,
    nombre: 'Plan Social Media Trimestral',
    precio: 2800,
    descripcion: 'Estrategia, contenidos y gestión de redes sociales durante 3 meses',
    tiempo_estimado: '90 días (servicio continuado)',
    departamentos: [4, 5], // Contenido, Marketing
    servicios: [401, 501, 502] // Copy, Plan RRSS, Anuncios
  },
  {
    id: 1004,
    nombre: 'Estrategia Digital Completa',
    precio: 3900,
    descripcion: 'Análisis, plan de comunicación digital y estrategia de contenidos',
    tiempo_estimado: '15 días',
    departamentos: [1, 3, 5], // Estrategia, Digital, Marketing
    servicios: [101, 103, 304, 501] // Estrategia Marca, Plan Comunicación, SEO, Plan RRSS
  }
];

export const paquetes: Paquete[] = [
  {
    id: 2001,
    nombre: 'Lanzamiento de Marca',
    descripcion: 'Todo lo necesario para lanzar una marca desde cero: estrategia, identidad y web',
    precio: 9500, // Descuento significativo sobre productos individuales
    tiempo_estimado: '45 días',
    productos: [1001, 1002, 1004] // Identidad, Web, Estrategia Digital
  },
  {
    id: 2002,
    nombre: 'Presencia Digital Completa',
    descripcion: 'Paquete para establecer una presencia digital sólida con web y redes sociales',
    precio: 7800,
    tiempo_estimado: '90 días',
    productos: [1002, 1003, 1004] // Web, Social Media, Estrategia Digital
  }
];

// Funciones helper para obtener datos relacionados
export function getServiciosDeProducto(productoId: number): Servicio[] {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return [];
  
  return servicios.filter(servicio => producto.servicios.includes(servicio.id));
}

export function getProductosDePaquete(paqueteId: number): Producto[] {
  const paquete = paquetes.find(p => p.id === paqueteId);
  if (!paquete) return [];
  
  return productos.filter(producto => paquete.productos.includes(producto.id));
}

export function getServiciosDeDepartamento(departamentoId: number): Servicio[] {
  // Implementación simple para demo
  switch(departamentoId) {
    case 1: // Estrategia
      return servicios.filter(s => s.id >= 100 && s.id < 200);
    case 2: // Branding
      return servicios.filter(s => s.id >= 200 && s.id < 300);
    case 3: // Digital
      return servicios.filter(s => s.id >= 300 && s.id < 400);
    case 4: // Contenido
      return servicios.filter(s => s.id >= 400 && s.id < 500);
    case 5: // Marketing
      return servicios.filter(s => s.id >= 500 && s.id < 600);
    default:
      return [];
  }
}

export function getProductosDeDepartamento(departamentoId: number): Producto[] {
  return productos.filter(p => p.departamentos.includes(departamentoId));
}
