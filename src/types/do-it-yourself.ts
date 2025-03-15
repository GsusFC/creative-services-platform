/**
 * Tipos compartidos para el módulo Do-It-Yourself
 */

/**
 * Enumeración de tipos de elementos
 */
export enum TipoElemento {
  PRODUCTO = 'producto',
  SERVICIO = 'servicio',
  PAQUETE = 'paquete'
}

/**
 * Interfaz base para todos los elementos presupuestables
 */
export interface ElementoBase {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  tiempo_estimado: string | null;
}

/**
 * Interfaz para servicios
 */
export interface Servicio extends ElementoBase {
  es_independiente: boolean;
}

/**
 * Interfaz para productos
 */
export interface Producto extends ElementoBase {
  servicios?: number[]; // IDs de servicios asociados que se obtienen de la tabla de relación producto_servicio
}

/**
 * Interfaz para paquetes
 */
export interface Paquete extends ElementoBase {
  productos?: number[]; // IDs de productos incluidos que se obtienen de la tabla de relación paquete_producto
}

/**
 * Tipo unión para los elementos que pueden ser añadidos al presupuesto
 */
export type ElementoPresupuesto = Servicio | Producto | Paquete;

/**
 * Interfaz extendida para los elementos del presupuesto 
 */
export interface ElementoPresupuestoExtendido {
  // Propiedades básicas de ElementoBase
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  tiempo_estimado: string | null;
  
  // Propiedades específicas según el tipo
  es_independiente?: boolean; // Para servicios
  servicios?: number[]; // Para productos
  productos?: number[]; // Para paquetes
  
  // Propiedades adicionales 
  cantidad: number;
  tipo: TipoElemento;
  indiceGlobal?: number; // Para tracking interno
}

/**
 * Interfaz para los departamentos
 */
export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string | null;
}

/**
 * Interfaz para los filtros aplicados
 */
export interface FiltrosAplicados {
  departamentoId: number | null;
  tipoElemento: TipoElemento;
}

/**
 * Interfaz para la configuración de paginación
 */
export interface ConfiguracionPaginacion {
  paginaActual: number;
  elementosPorPagina: number;
  totalElementos: number;
  totalPaginas: number;
}

/**
 * Interfaz para los totales calculados del presupuesto
 * Incluye propiedades para IVA y recargo por sprint
 */
export interface TotalesPresupuesto {
  subtotal: number;
  descuento: number;
  totalConDescuento: number;
  total: number;
  recargoSprint: number;
  iva: number;
}

/**
 * Interfaz para las opciones globales del presupuesto
 */
export interface OpcionesPresupuesto {
  descuentoGlobal: number;
  modoSprint: boolean;
  incluyeIVA: boolean;
  moneda: string;
  notasAdicionales?: string;
}

/**
 * Interfaz para los filtros de medios (imágenes/videos)
 */
export interface MediaFilters {
  heroImage?: string;
  heroVideo?: { url: string, type?: string };
  galleryImages?: Array<{ url: string, alt?: string }>;
  videos?: Array<{ url: string, thumbnailUrl?: string, videoType?: 'youtube' | 'vimeo' | 'local' }>;
}

/**
 * Interfaz para la configuración de animaciones
 */
export interface AnimationSettings {
  catalogContainer?: {
    hidden: Record<string, unknown>;
    visible: Record<string, unknown>;
  };
  catalogItem?: {
    hidden: Record<string, unknown>;
    visible: Record<string, unknown>;
  };
  budget?: {
    hidden: Record<string, unknown>;
    visible: Record<string, unknown>;
  };
  cardHover?: Record<string, unknown>;
}

/**
 * Interfaz para la respuesta de compartir el presupuesto
 */
export interface RespuestaCompartir {
  success: boolean;
  shareUrl?: string;
  url?: string;
  mensaje?: string;
  error?: string;
}

/**
 * Interfaz para la respuesta de descargar el presupuesto
 */
export interface RespuestaDescarga {
  success: boolean;
  filePath?: string;
  mensaje?: string;
  error?: string;
}

/**
 * Interfaz para el estado global del contexto DIY
 */

export interface DiyContextState {
  // Estado de filtros y tipo seleccionado
  filtros: FiltrosAplicados;
  setDepartamentoSeleccionado: (id: number | null) => void;
  setTipoSeleccionado: (tipo: TipoElemento) => void;
  
  // Estado del presupuesto
  elementosSeleccionados: ElementoPresupuestoExtendido[];
  agregarElementoPresupuesto: (elemento: ElementoPresupuesto, cantidad?: number) => void;
  quitarElementoPresupuesto: (index: number) => void;
  actualizarCantidadElemento: (index: number, cantidad: number) => void;
  
  // Opciones globales
  opcionesPresupuesto: OpcionesPresupuesto;
  setDescuentoGlobal: (porcentaje: number) => void;
  setModoSprint: (activo: boolean) => void;
  actualizarOpcionesPresupuesto: (opciones: Partial<OpcionesPresupuesto>) => void;
  
  // Estado de paginación
  paginacion: ConfiguracionPaginacion;
  cambiarPagina: (pagina: number) => void;
  
  // Datos calculados
  elementosFiltrados: ElementoPresupuesto[];
  elementosPaginados: ElementoPresupuesto[];
  totalesPresupuesto: TotalesPresupuesto;
  calcularTotales: () => TotalesPresupuesto;
  
  // Acciones del presupuesto
  compartirPresupuesto: () => Promise<RespuestaCompartir>;
  descargarPresupuesto: () => Promise<RespuestaDescarga>;
  
  // Estados de carga y error
  estaCargando: boolean;
  error: string | null;
  
  // Funciones auxiliares
  getServiciosDeProducto: (productoId: number) => ElementoPresupuestoExtendido[];
  getProductosDePaquete: (paqueteId: number) => ElementoPresupuestoExtendido[];
}
