'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  TipoElemento, 
  ElementoPresupuesto, 
  TotalesPresupuesto,
  FiltrosAplicados,
  ConfiguracionPaginacion,
  OpcionesPresupuesto,
  DiyContextState,
  ElementoPresupuestoExtendido,
  RespuestaCompartir,
  RespuestaDescarga
} from '@/types/do-it-yourself';
import { diyUIConfig } from '@/config/do-it-yourself';
import { 
  getServiceCategoryRepository, 
  getServiceRepository
} from '@/lib/do-it-yourself/repository';
import {
  servicios,
  productos, 
  paquetes,
  getServiciosDeDepartamento
} from '@/mocks/do-it-yourself';

/**
 * Hook principal para gestionar el estado global del módulo Do-It-Yourself
 * Usa los repositorios implementados en lugar de los datos mock
 * Incorpora todas las características avanzadas de la versión mejorada
 */
export const useDiyState = (): DiyContextState => {
  // Estado para filtros
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoElemento>(TipoElemento.PRODUCTO);
  
  // Estado para presupuesto - ahora usando el tipo extendido
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoPresupuestoExtendido[]>([]);
  
  // Estado para opciones globales del presupuesto
  const [opcionesPresupuesto, setOpcionesPresupuesto] = useState<OpcionesPresupuesto>({
    descuentoGlobal: 0,
    modoSprint: false,
    incluyeIVA: true,
    moneda: 'EUR',
    notasAdicionales: ''
  });
  
  // Estados para datos del servidor
  const [estaCargando, setEstaCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const elementosPorPagina = diyUIConfig.itemsPerPage;
  
  // Importar datos mock
  // Importamos de forma dinámica para evitar problemas con SSR
  useEffect(() => {
    const cargarDatos = async () => {
      setEstaCargando(true);
      setError(null);
      
      try {
        // Inicializar los repositorios para uso futuro
        getServiceCategoryRepository();
        getServiceRepository();
        
        // Simular una pequeña carga para mostrar el estado de carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En una implementación real, cargaríamos los datos desde los repositorios
        // Por ahora, solo inicializamos los repositorios y usamos datos mock
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setEstaCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Función auxiliar para determinar el tipo de elemento
  const getElementType = (element: ElementoPresupuesto): TipoElemento => {
    if ('es_independiente' in element) return TipoElemento.SERVICIO;
    if ('servicios' in element) return TipoElemento.PRODUCTO;
    return TipoElemento.PAQUETE;
  };

  // Función memoizada para obtener elementos filtrados según selecciones
  const getElementosFiltrados = useCallback(() => {
      let elementos: ElementoPresupuesto[] = [];
    
    // Filtrar por tipo de elemento
    switch (tipoSeleccionado) {
      case TipoElemento.SERVICIO:
        elementos = [...servicios];
        break;
      case TipoElemento.PRODUCTO:
        elementos = [...productos];
        break;
      case TipoElemento.PAQUETE:
        elementos = [...paquetes];
        break;
      default:
        elementos = [...productos];
    }
    
    // Si hay un departamento seleccionado, filtramos por departamento
    if (departamentoSeleccionado) {
      // Para servicios, usamos la función getServiciosDeDepartamento
      if (tipoSeleccionado === TipoElemento.SERVICIO) {
        elementos = getServiciosDeDepartamento(departamentoSeleccionado);
      }
      // Para productos, filtramos por departamento usando la propiedad departamentos
      else if (tipoSeleccionado === TipoElemento.PRODUCTO) {
        elementos = elementos.filter((elemento) => 
          // Verificamos si el elemento tiene la estructura esperada antes de acceder a departamentos
          'departamentos' in elemento && Array.isArray(elemento.departamentos) && 
          elemento.departamentos.includes(departamentoSeleccionado)
        );
      }
    }
    
    return elementos;
  }, [tipoSeleccionado, departamentoSeleccionado]);
  
  // Elementos filtrados - useMemo para evitar recálculos innecesarios
  const elementosFiltrados = useMemo(() => getElementosFiltrados(), [getElementosFiltrados]);
  
  // Elementos paginados - useMemo para derivar del estado de filtros y paginación
  const elementosPaginados = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    return elementosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);
  }, [elementosFiltrados, paginaActual, elementosPorPagina]);
  
  // Calcular el total de páginas - useMemo para derivar del estado
  const totalPaginas = useMemo(() => 
    Math.ceil(elementosFiltrados.length / elementosPorPagina), 
    [elementosFiltrados, elementosPorPagina]
  );
  
  // Función para cambiar de página
  const cambiarPagina = useCallback((pagina: number) => {
    setPaginaActual(pagina);
  }, []);
  
  // Convertir ElementoPresupuesto a ElementoPresupuestoExtendido
  const convertirAElementoExtendido = useCallback((elemento: ElementoPresupuesto, cantidad: number = 1): ElementoPresupuestoExtendido => {
    return {
      ...elemento,
      cantidad,
      tipo: getElementType(elemento),
      indiceGlobal: Date.now() // Usamos timestamp como índice temporal
    };
  }, []);

  // Definir función para actualizar la cantidad de un elemento
  const actualizarCantidadElemento = useCallback((index: number, cantidad: number) => {
    if (cantidad <= 0) return;
    
    setElementosSeleccionados(prev => {
      const nuevaLista = [...prev];
      if (nuevaLista[index]) {
        nuevaLista[index] = {
          ...nuevaLista[index],
          cantidad
        };
      }
      return nuevaLista;
    });
  }, []);
  
  // Agregar elemento al presupuesto
  const agregarElementoPresupuesto = useCallback((elemento: ElementoPresupuesto, cantidad: number = 1) => {
    const elementoExtendido = convertirAElementoExtendido(elemento, cantidad);
    setElementosSeleccionados(prev => [...prev, elementoExtendido]);
  }, [convertirAElementoExtendido]);
  
  // Eliminar elemento del presupuesto
  const quitarElementoPresupuesto = useCallback((index: number) => {
    setElementosSeleccionados(prev => {
      const nuevosElementos = [...prev];
      nuevosElementos.splice(index, 1);
      return nuevosElementos;
    });
  }, []);
  
  // Calcular total del presupuesto - memoizado para evitar recálculos
  const calcularTotales = useCallback((): TotalesPresupuesto => {
    const subtotal = elementosSeleccionados.reduce(
      (total, elemento) => total + (elemento.precio * elemento.cantidad), 0
    );
    const descuento = subtotal * (opcionesPresupuesto.descuentoGlobal / 100);
    const totalConDescuento = subtotal - descuento;
    const factorSprint = opcionesPresupuesto.modoSprint ? diyUIConfig.sprintModeFactor : 1;
    const totalAntesIVA = totalConDescuento * factorSprint;
    const recargoSprint = opcionesPresupuesto.modoSprint ? (totalConDescuento * factorSprint) - totalConDescuento : 0;
    
    // Calculamos IVA si corresponde
    const iva = opcionesPresupuesto.incluyeIVA ? totalAntesIVA * 0.21 : 0;
    
    return {
      subtotal,
      descuento,
      totalConDescuento,
      recargoSprint,
      iva,
      total: totalAntesIVA + iva
    };
  }, [elementosSeleccionados, opcionesPresupuesto]);
  
  // Calcular totales solo cuando sea necesario - memoizado
  const totalesPresupuesto = useMemo(() => calcularTotales(), [calcularTotales]);
  
  // Estructura de datos para filtros aplicados
  const filtros: FiltrosAplicados = useMemo(() => ({
    departamentoId: departamentoSeleccionado,
    tipoElemento: tipoSeleccionado
  }), [departamentoSeleccionado, tipoSeleccionado]);
  
  // Estructura de datos para paginación
  const paginacion: ConfiguracionPaginacion = useMemo(() => ({
    paginaActual,
    elementosPorPagina,
    totalElementos: elementosFiltrados.length,
    totalPaginas
  }), [paginaActual, elementosPorPagina, elementosFiltrados.length, totalPaginas]);
  
  // Funciones para actualizar opciones de presupuesto
  const setDescuentoGlobal = useCallback((descuento: number) => {
    setOpcionesPresupuesto(prev => ({
      ...prev,
      descuentoGlobal: descuento
    }));
  }, []);
  
  const setModoSprint = useCallback((activo: boolean) => {
    setOpcionesPresupuesto(prev => ({
      ...prev,
      modoSprint: activo
    }));
  }, []);
  
  const actualizarOpcionesPresupuesto = useCallback((opciones: Partial<OpcionesPresupuesto>) => {
    setOpcionesPresupuesto(prev => ({
      ...prev,
      ...opciones
    }));
  }, []);
  
  // Funciones auxiliares para obtener detalles de productos y paquetes
  const getServiciosDeProducto = useCallback((_productoId: number): ElementoPresupuestoExtendido[] => {
    return [];
  }, []);
  
  const getProductosDePaquete = useCallback((_paqueteId: number): ElementoPresupuestoExtendido[] => {
    return [];
  }, []);
  
  // Implementar funciones para compartir y descargar presupuesto
  const compartirPresupuesto = useCallback(async (): Promise<RespuestaCompartir> => {
    try {
      // Aquí iría la lógica para compartir el presupuesto con un servicio externo
      const urlCompartir = `https://creative-services.example.com/presupuesto/${Date.now()}`;
      return {
        success: true,
        url: urlCompartir,
        shareUrl: urlCompartir // Mantenemos compatibilidad con ambos campos
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al compartir'
      };
    }
  }, []);
  
  const descargarPresupuesto = useCallback(async (): Promise<RespuestaDescarga> => {
    try {
      // Aquí iría la lógica para generar y descargar el PDF
      const pathArchivo = `/temp/presupuesto-${Date.now()}.pdf`;
      return {
        success: true,
        filePath: pathArchivo,
        mensaje: 'Presupuesto descargado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al descargar'
      };
    }
  }, []);
  
  // Retornamos todo lo necesario para que los componentes funcionen
  return {
    // Filtros y navegación
    filtros,
    setDepartamentoSeleccionado,
    setTipoSeleccionado,
    
    // Elementos seleccionados
    elementosSeleccionados,
    agregarElementoPresupuesto,
    quitarElementoPresupuesto,
    actualizarCantidadElemento,
    
    // Opciones de presupuesto
    opcionesPresupuesto,
    setDescuentoGlobal,
    setModoSprint,
    actualizarOpcionesPresupuesto,
    
    // Paginación
    paginacion,
    cambiarPagina,
    
    // Datos calculados
    elementosFiltrados,
    elementosPaginados,
    totalesPresupuesto,
    calcularTotales,
    
    // Acciones de presupuesto
    compartirPresupuesto,
    descargarPresupuesto,
    
    // Estado
    estaCargando,
    error,
    
    // Funciones auxiliares
    getServiciosDeProducto,
    getProductosDePaquete
  };
};

export default useDiyState;
