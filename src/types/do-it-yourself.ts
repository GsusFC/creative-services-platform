/**
 * Tipos compartidos para el módulo Do-It-Yourself
 */

// Importar tipos del repositorio desde su archivo específico
import { Service, ServiceCategory } from '@/lib/do-it-yourself/repository/types';

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
  id: number; // Mantenemos number por ahora, el mapeo se hace en la capa de servicio
   nombre: string;
   descripcion: string | null;
   precio: number;
   tiempo_estimado?: string | null; // Hecho opcional con ?
 }
 
/**
 * Interfaz para servicios (Tipo UI)
 */
export interface Servicio extends ElementoBase {
  es_independiente: boolean;
  // Podríamos añadir categoryId numérico aquí si el mapeo lo hace
  departamentoId?: number; 
}

/**
 * Interfaz para productos (Tipo UI)
 */
export interface Producto extends ElementoBase {
  servicios?: number[]; 
  departamentos?: number[]; // Añadido para consistencia con mocks si se usan
}

/**
 * Interfaz para paquetes (Tipo UI)
 */
export interface Paquete extends ElementoBase {
  productos?: number[]; 
}

/**
 * Tipo unión para los elementos que pueden ser añadidos al presupuesto (Tipos UI)
 */
export type ElementoPresupuesto = Servicio | Producto | Paquete;

/**
 * Interfaz extendida para los elementos DENTRO del presupuesto 
 */
export interface ElementoPresupuestoExtendido {
  // Propiedades básicas de ElementoBase
  id: number; // Mantenemos number
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
  indiceGlobal: number; // Cambiado a number para consistencia con Date.now()
}

/**
 * Interfaz para los departamentos (Tipo UI)
 */
export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string | null;
}

/**
 * Interfaz para los filtros aplicados - CORREGIDA
 */
export interface FiltrosAplicados {
  // Usaremos departamentoId ya que la capa de servicio mapea Category a Departamento
  departamentoId: number | null; 
  // tipoElemento se elimina ya que solo manejamos Servicios (mapeados a Servicio UI)
  // tipoElemento: TipoElemento; 
}

/**
 * Interfaz para la configuración de paginación (sin cambios)
 */
export interface ConfiguracionPaginacion {
  paginaActual: number;
  elementosPorPagina: number;
  totalElementos: number;
  totalPaginas: number;
}

/**
 * Interfaz para los totales calculados del presupuesto (sin cambios)
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
 * Interfaz para las opciones globales del presupuesto (sin cambios)
 */
export interface OpcionesPresupuesto {
  descuentoGlobal: number;
  modoSprint: boolean;
  incluyeIVA: boolean;
  moneda: string;
  notasAdicionales?: string;
}

// MediaFilters y AnimationSettings se mantienen

/**
 * Interfaz para la respuesta de compartir el presupuesto (sin cambios)
 */
export interface RespuestaCompartir {
  success: boolean;
  shareUrl?: string;
  url?: string;
  mensaje?: string;
  error?: string;
}

/**
 * Interfaz para la respuesta de descargar el presupuesto (sin cambios)
 */
export interface RespuestaDescarga {
  success: boolean;
  filePath?: string;
  mensaje?: string;
  error?: string;
}

/**
 * Interfaz para el estado global del contexto DIY - CORREGIDA
 */
export interface DiyContextState {
  // Estado de filtros - CORREGIDO
  filtros: FiltrosAplicados;
  setDepartamentoSeleccionado: (id: number | null) => void; // Mantenemos nombre por consistencia UI
  // setTipoSeleccionado eliminado

  // Datos del catálogo
  allCategories: Departamento[]; // Cambiado a Departamento[] (mapeado)

  // Estado del presupuesto
  elementosSeleccionados: ElementoPresupuestoExtendido[];
  agregarElementoPresupuesto: (servicio: Servicio, cantidad?: number) => void; // Acepta Servicio (UI)
  quitarElementoPresupuesto: (indiceGlobal: number) => void; 
  actualizarCantidadElemento: (indiceGlobal: number, cantidad: number) => void; 

  // Opciones globales
  opcionesPresupuesto: OpcionesPresupuesto;
  setDescuentoGlobal: (porcentaje: number) => void;
  setModoSprint: (activo: boolean) => void;
  actualizarOpcionesPresupuesto: (opciones: Partial<OpcionesPresupuesto>) => void;

  // Estado de paginación
  paginacion: ConfiguracionPaginacion;
  cambiarPagina: (pagina: number) => void;

  // Datos calculados
  elementosFiltrados: Servicio[]; // Cambiado a Servicio[] (UI)
  elementosPaginados: Servicio[]; // Cambiado a Servicio[] (UI)
  totalesPresupuesto: TotalesPresupuesto;
  calcularTotales: () => TotalesPresupuesto; 

  // Acciones del presupuesto
  compartirPresupuesto: () => Promise<RespuestaCompartir>;
  descargarPresupuesto: () => Promise<RespuestaDescarga>;

  // Estados de carga y error
  estaCargando: boolean;
  error: string | null;

  // Funciones auxiliares eliminadas
}
