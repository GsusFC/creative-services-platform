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
  RespuestaDescarga,
  // Importar tipos UI necesarios
  Servicio, 
  Departamento 
} from '@/types/do-it-yourself'; 
import { diyUIConfig } from '@/config/do-it-yourself';
import { 
  getServiceCategoryRepository, 
  getServiceRepository,
  // Importar tipos del repositorio
  Service as RepoService, 
  ServiceCategory as RepoServiceCategory 
} from '@/lib/do-it-yourself/repository';
// Mocks eliminados

/**
 * Hook principal para gestionar el estado global del módulo Do-It-Yourself
 * Usa los repositorios implementados
 */
export const useDiyState = (): DiyContextState => {
  // Estado para filtros - Volver a departamentoId (number | null)
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);
  
  // Estado para presupuesto - Mantenemos ElementoPresupuestoExtendido
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoPresupuestoExtendido[]>([]);
  
  // Estado para opciones globales del presupuesto
  const [opcionesPresupuesto, setOpcionesPresupuesto] = useState<OpcionesPresupuesto>({
    descuentoGlobal: 0,
    modoSprint: false,
    incluyeIVA: true,
    moneda: 'EUR', 
    notasAdicionales: ''
  });
  
  // Estados para datos del servidor - Almacenar datos mapeados (Tipos UI)
  const [allServices, setAllServices] = useState<Servicio[]>([]); // Tipo UI
  const [allCategories, setAllCategories] = useState<Departamento[]>([]); // Tipo UI
  const [estaCargando, setEstaCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const elementosPorPagina = diyUIConfig.itemsPerPage;
  
  // Cargar datos desde la capa de servicio al montar
  useEffect(() => {
    const cargarDatos = async () => {
      setEstaCargando(true);
      setError(null);
      
      try {
        // Importar funciones de servicio (asegúrate que la ruta es correcta)
        const { getDepartamentos, getServicios } = await import('@/lib/do-it-yourself/services'); 
        
        // Cargar departamentos (mapeados de categorías) y servicios en paralelo
        const [deptResult, servResult] = await Promise.all([
          getDepartamentos(),
          getServicios() 
        ]);
        
        // Manejar errores
        if (deptResult.error) throw new Error(`Error cargando departamentos: ${deptResult.error}`);
        if (servResult.error) throw new Error(`Error cargando servicios: ${servResult.error}`);
        
        // Actualizar estado con los datos cargados (Tipos UI)
        setAllCategories(deptResult.departamentos || []); // Guardar Departamentos
        setAllServices(servResult.servicios || []); // Guardar Servicios
        
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
      } finally {
        setEstaCargando(false);
      }
    };
    
    cargarDatos();
  }, []); // Ejecutar solo al montar

  // Función auxiliar para determinar el tipo de elemento - Simplificada
  const getElementType = (_element: ElementoPresupuesto | RepoService): TipoElemento => {
    // Ahora siempre será SERVICIO ya que solo cargamos servicios (mapeados a tipo Servicio UI)
    return TipoElemento.SERVICIO;
  };

  // Función memoizada para obtener elementos filtrados según selecciones
  // Filtra sobre allServices (tipo Servicio UI) usando departamentoSeleccionado (number | null)
  const getElementosFiltrados = useCallback(() => {
    if (departamentoSeleccionado === null) {
      return allServices; // Si no hay departamento, mostrar todos los servicios
    }
    // Filtrar servicios por departamentoId (ahora incluido en el tipo Servicio UI gracias al mapeo)
    return allServices.filter(service => service.departamentoId === departamentoSeleccionado);

  }, [allServices, departamentoSeleccionado]);
  
  // Elementos filtrados - useMemo para evitar recálculos innecesarios
  const elementosFiltrados = useMemo(getElementosFiltrados, [getElementosFiltrados]);
  
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
  
  // Convertir Servicio (Tipo UI) a ElementoPresupuestoExtendido
  const convertirAElementoExtendido = useCallback((servicio: Servicio, cantidad: number = 1): ElementoPresupuestoExtendido => {
    return {
      ...servicio, // id (number), nombre, descripcion, precio, tiempo_estimado, es_independiente
      cantidad,
      tipo: TipoElemento.SERVICIO, // Siempre será SERVICIO
      indiceGlobal: Date.now() + Math.random(), // Índice único temporal
    };
  }, []);

  // Función para actualizar la cantidad de un elemento por indiceGlobal
  const actualizarCantidadElemento = useCallback((indiceGlobal: number, cantidad: number) => {
    if (cantidad <= 0) return; // No permitir cantidad cero o negativa
    
    setElementosSeleccionados(prev => 
      prev.map(el => 
        el.indiceGlobal === indiceGlobal ? { ...el, cantidad } : el
      )
    );
  }, []);
  
  // Agregar elemento (Servicio UI) al presupuesto, incrementando cantidad si ya existe
  const agregarElementoPresupuesto = useCallback((servicio: Servicio, cantidadInicial: number = 1) => {
    setElementosSeleccionados(prev => {
      const existenteIndex = prev.findIndex(el => el.id === servicio.id && el.tipo === TipoElemento.SERVICIO);
      
      if (existenteIndex > -1) {
        // Si existe, incrementar cantidad
        const newState = [...prev];
        const itemExistente = newState[existenteIndex];
        newState[existenteIndex] = { 
          ...itemExistente, 
          cantidad: itemExistente.cantidad + cantidadInicial 
        };
        return newState;
      } else {
        // Si no existe, añadir nuevo
        const elementoExtendido = convertirAElementoExtendido(servicio, cantidadInicial);
        return [...prev, elementoExtendido];
      }
    });
  }, [convertirAElementoExtendido]); // convertirAElementoExtendido no cambia, así que la dependencia está bien
  
  // Eliminar elemento del presupuesto por su índice global
  const quitarElementoPresupuesto = useCallback((indiceGlobal: number) => {
    setElementosSeleccionados(prev => prev.filter(el => el.indiceGlobal !== indiceGlobal));
  }, []);
  
  // Calcular total del presupuesto - memoizado para evitar recálculos
  const calcularTotales = useCallback((): TotalesPresupuesto => {
    const subtotal = elementosSeleccionados.reduce(
      (total, elemento) => total + (elemento.precio * elemento.cantidad), 0
    );
    
    const descuento = subtotal * (opcionesPresupuesto.descuentoGlobal / 100);
    const totalConDescuento = subtotal - descuento;
    
    // Aplicar factor sprint si está activo
    const factorSprint = opcionesPresupuesto.modoSprint ? (diyUIConfig.sprintModeFactor || 1.3) : 1; 
    const totalConSprint = totalConDescuento * factorSprint;
    const recargoSprint = totalConSprint - totalConDescuento;
    
    // Calcular IVA sobre el total con sprint (si aplica) - Usar valor fijo
    const iva = opcionesPresupuesto.incluyeIVA ? totalConSprint * 0.21 : 0; 
    
    return {
      subtotal,
      descuento,
      totalConDescuento,
      recargoSprint,
      iva,
      total: totalConSprint + iva
    };
  }, [elementosSeleccionados, opcionesPresupuesto]);
  
  // Calcular totales solo cuando sea necesario - memoizado
  const totalesPresupuesto = useMemo(calcularTotales, [calcularTotales]);
  
  // Estructura de datos para filtros aplicados - CORREGIDO
  const filtros: FiltrosAplicados = useMemo(() => ({
    departamentoId: departamentoSeleccionado, // Usar departamentoId (number | null)
  }), [departamentoSeleccionado]);
  
  // Estructura de datos para paginación
  const paginacion: ConfiguracionPaginacion = useMemo(() => ({
    paginaActual,
    elementosPorPagina,
    totalElementos: elementosFiltrados.length, // Basado en servicios filtrados
    totalPaginas
  }), [paginaActual, elementosPorPagina, elementosFiltrados.length, totalPaginas]);
  
  // Funciones para actualizar opciones de presupuesto (sin cambios en lógica, solo validación)
  const setDescuentoGlobal = useCallback((descuento: number) => {
    setOpcionesPresupuesto(prev => ({ ...prev, descuentoGlobal: Math.max(0, Math.min(100, descuento)) })); // Validar rango 0-100
  }, []);
  
  const setModoSprint = useCallback((activo: boolean) => {
    setOpcionesPresupuesto(prev => ({ ...prev, modoSprint: activo }));
  }, []);
  
  const actualizarOpcionesPresupuesto = useCallback((opciones: Partial<OpcionesPresupuesto>) => {
    setOpcionesPresupuesto(prev => ({ ...prev, ...opciones }));
  }, []);
  
  // Funciones auxiliares eliminadas (getServiciosDeProducto, getProductosDePaquete)
  
  // Implementar funciones para compartir y descargar presupuesto (sin cambios, lógica simulada)
  const compartirPresupuesto = useCallback(async (): Promise<RespuestaCompartir> => {
    // Lógica simulada - Debería usar el repositorio de presupuestos si se implementa
    console.log("Compartiendo presupuesto:", { elementosSeleccionados, opcionesPresupuesto, totalesPresupuesto });
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      const urlCompartir = `https://example.com/budget/${Date.now()}`;
      return { success: true, url: urlCompartir, shareUrl: urlCompartir };
    } catch (error) {
      console.error("Error al compartir:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al compartir'
      };
    }
  }, [elementosSeleccionados, opcionesPresupuesto, totalesPresupuesto]); // Dependencias para la simulación
  
  const descargarPresupuesto = useCallback(async (): Promise<RespuestaDescarga> => {
    // Lógica simulada - Debería usar el repositorio o una función de generación de PDF
    console.log("Descargando presupuesto:", { elementosSeleccionados, opcionesPresupuesto, totalesPresupuesto });
    try {
      // Simular generación de archivo
      await new Promise(resolve => setTimeout(resolve, 500));
      const pathArchivo = `/downloads/presupuesto-${Date.now()}.pdf`;
      return { success: true, filePath: pathArchivo, mensaje: 'PDF generado (simulado)' };
    } catch (error) {
      console.error("Error al descargar:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al descargar'
      };
    }
  }, [elementosSeleccionados, opcionesPresupuesto, totalesPresupuesto]); // Dependencias para la simulación
  
  // Retornamos todo lo necesario para que los componentes funcionen - CORREGIDO
  return {
    // Filtros y navegación - CORREGIDO
    filtros,
    setDepartamentoSeleccionado, // Usar el setter correcto
    
    // Datos del catálogo
    allCategories, // Mantenido (son Departamentos mapeados)

    // Elementos seleccionados
    elementosSeleccionados, // Mismo tipo, pero ahora solo contendrá Servicios
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
    elementosFiltrados, // Ahora son Servicio[] (UI)
    elementosPaginados, // Ahora son Servicio[] (UI)
    totalesPresupuesto,
    calcularTotales, 
    
    // Acciones de presupuesto
    compartirPresupuesto,
    descargarPresupuesto,
    
    // Estado
    estaCargando,
    error,
    // Funciones auxiliares eliminadas
  };
};

export default useDiyState;

// TODO: Revisar lógica de filtrado en getElementosFiltrados para usar IDs numéricos o ajustar mapeo.
