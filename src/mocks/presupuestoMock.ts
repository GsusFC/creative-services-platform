/**
 * Datos mock para el presupuesto
 * Estos datos se utilizan para pruebas y desarrollo
 */
import { 
  TipoElemento,
  ElementoPresupuestoExtendido, 
  OpcionesPresupuesto
} from '@/types/do-it-yourself';

// Elementos de presupuesto mock
export const elementosSeleccionadosMock: ElementoPresupuestoExtendido[] = [
  {
    id: 1,
    nombre: 'Diseño de Logotipo',
    descripcion: 'Incluye 3 propuestas y 2 rondas de cambios',
    precio: 450,
    tiempo_estimado: '7 días',
    es_independiente: true,
    cantidad: 1,
    tipo: TipoElemento.SERVICIO
  },
  {
    id: 2,
    nombre: 'Desarrollo Web',
    descripcion: 'Sitio web responsive con 5 páginas',
    precio: 1200,
    tiempo_estimado: '14 días',
    es_independiente: true,
    cantidad: 1,
    tipo: TipoElemento.SERVICIO
  },
  {
    id: 3,
    nombre: 'Pack de Redes Sociales',
    descripcion: 'Diseño para perfiles y 10 plantillas de posts',
    precio: 350,
    tiempo_estimado: '5 días',
    servicios: [4, 5],
    cantidad: 1,
    tipo: TipoElemento.PRODUCTO
  },
  {
    id: 4,
    nombre: 'Paquete Completo de Branding',
    descripcion: 'Incluye logo, web y redes sociales',
    precio: 1800,
    tiempo_estimado: '30 días',
    productos: [1, 3],
    cantidad: 1,
    tipo: TipoElemento.PAQUETE
  }
];

// Opciones de presupuesto mock
export const opcionesPresupuestoMock: OpcionesPresupuesto = {
  descuentoGlobal: 10,
  modoSprint: true,
  incluyeIVA: true,
  moneda: 'EUR',
  notasAdicionales: 'Este presupuesto es válido por 30 días. Incluye dos rondas de revisiones para cada servicio.'
};
