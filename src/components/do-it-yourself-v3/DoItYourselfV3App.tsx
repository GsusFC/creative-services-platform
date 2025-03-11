'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

// Importaciones de componentes
// @ts-expect-error - Componente existe pero TypeScript no lo reconoce aún
import CatalogView from './CatalogView';
// @ts-expect-error - Componente existe pero TypeScript no lo reconoce aún
import BudgetPanel from './BudgetPanel';
// @ts-expect-error - Componente existe pero TypeScript no lo reconoce aún
import FilterPanel from './FilterPanel';
import { 
  departamentos,
  servicios, 
  productos, 
  paquetes,
  getServiciosDeProducto,
  getProductosDePaquete,
  Servicio,
  Producto,
  Paquete
} from '@/mocks/do-it-yourself-v2';

// Enumeración de tipos de elementos
export enum TipoElemento {
  PRODUCTO = 'producto',
  SERVICIO = 'servicio',
  PAQUETE = 'paquete'
}

// Tipo unión para los elementos que pueden ser añadidos al presupuesto
export type ElementoPresupuesto = Servicio | Producto | Paquete;

const DoItYourselfV3App = () => {
  // Estados
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoElemento>(TipoElemento.PRODUCTO);
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoPresupuesto[]>([]);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [descuentoGlobal, setDescuentoGlobal] = useState<number>(0);
  const [modoSprint, setModoSprint] = useState<boolean>(false);
  const elementosPorPagina = 9;
  
  // Obtener elementos filtrados según selecciones - simplificado
  const getElementosFiltrados = useCallback(() => {
    switch (tipoSeleccionado) {
      case TipoElemento.PRODUCTO:
        return productos;
      case TipoElemento.SERVICIO:
        return servicios;
      case TipoElemento.PAQUETE:
        return paquetes;
      default:
        return [];
    }
  }, [tipoSeleccionado]);
  
  // Calcular total del presupuesto - memoizado para evitar recálculos
  const calcularTotal = useCallback(() => {
    const subtotal = elementosSeleccionados.reduce((total, elemento) => total + elemento.precio, 0);
    const descuento = subtotal * (descuentoGlobal / 100);
    const totalConDescuento = subtotal - descuento;
    const factorSprint = modoSprint ? 1.5 : 1; // Factor de multiplicación para modo sprint
    
    return {
      subtotal,
      descuento,
      totalConDescuento,
      total: totalConDescuento * factorSprint
    };
  }, [elementosSeleccionados, descuentoGlobal, modoSprint]);
  
  // Agregar elemento al presupuesto con useCallback
  const handleAgregarElemento = useCallback((elemento: ElementoPresupuesto) => {
    setElementosSeleccionados(prev => [...prev, elemento]);
  }, []);
  
  // Eliminar elemento del presupuesto con useCallback
  const handleEliminarElemento = useCallback((index: number) => {
    setElementosSeleccionados(prev => {
      const nuevosElementos = [...prev];
      nuevosElementos.splice(index, 1);
      return nuevosElementos;
    });
  }, []);
  
  // Elementos totales y paginados
  const elementosTotales = useMemo(() => getElementosFiltrados(), [getElementosFiltrados]);
  const elementos = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    return elementosTotales.slice(indiceInicio, indiceInicio + elementosPorPagina);
  }, [elementosTotales, paginaActual, elementosPorPagina]);
  
  // Calcular el total de páginas
  const totalPaginas = useMemo(() => 
    Math.ceil(elementosTotales.length / elementosPorPagina), 
    [elementosTotales, elementosPorPagina]
  );
  
  // Función para cambiar de página
  const cambiarPagina = useCallback((pagina: number) => {
    setPaginaActual(pagina);
  }, []);
  
  // Calcular totales solo cuando sea necesario
  const totales = useMemo(() => calcularTotal(), [calcularTotal]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* Panel de Filtros */}
      <FilterPanel
        departamentos={departamentos}
        departamentoSeleccionado={departamentoSeleccionado}
        setDepartamentoSeleccionado={setDepartamentoSeleccionado}
        tipoSeleccionado={tipoSeleccionado}
        setTipoSeleccionado={setTipoSeleccionado}
        descuentoGlobal={descuentoGlobal}
        setDescuentoGlobal={setDescuentoGlobal}
        modoSprint={modoSprint}
        setModoSprint={setModoSprint}
      />

      <div className="flex flex-col md:flex-row gap-3 min-h-[600px]">
        {/* Panel Central - Catálogo */}
        <div className="w-full md:w-4/5 flex flex-col bg-black p-3">
          <CatalogView 
            elementos={elementos}
            elementosTotales={elementosTotales}
            totalPaginas={totalPaginas}
            paginaActual={paginaActual}
            onCambiarPagina={cambiarPagina}
            tipoSeleccionado={tipoSeleccionado}
            onAgregarElemento={handleAgregarElemento}
            getServiciosDeProducto={getServiciosDeProducto}
            getProductosDePaquete={getProductosDePaquete}
          />
        </div>
        
        {/* Panel de Presupuesto - Ocupa todo el alto disponible */}
        <div className="w-full md:w-1/5 mt-3 md:mt-0">
          <BudgetPanel 
            elementosSeleccionados={elementosSeleccionados}
            onEliminarElemento={handleEliminarElemento}
            descuentoGlobal={descuentoGlobal}
            modoSprint={modoSprint}
            totales={totales}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DoItYourselfV3App;
