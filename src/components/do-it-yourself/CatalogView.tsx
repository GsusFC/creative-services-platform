'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { TipoElemento, ElementoPresupuesto, Servicio, Producto, Paquete } from '@/types/do-it-yourself';
import ProductCard from './cards/ProductCard';
import ServiceCard from './cards/ServiceCard';
import PackageCard from './cards/PackageCard';
import PaginationControls from './PaginationControls';
import { useDiy } from '@/contexts/DiyContext';

// No necesitamos una interfaz de props ya que usamos el contexto para todo

const CatalogView = () => {
  // Obtener todos los datos y funciones necesarios del contexto DIY
  const diyContext = useDiy();
  
  // Extraer los datos necesarios del contexto
  // const elementosFiltrados = diyContext.elementosFiltrados || []; // No se usa actualmente
  const elementosPaginados = diyContext.elementosPaginados || [];
  const tipoSeleccionado = diyContext.filtros?.tipoElemento || TipoElemento.PRODUCTO;
  const paginacion = diyContext.paginacion || { 
    paginaActual: 1, 
    elementosPorPagina: 12, 
    totalElementos: 0, 
    totalPaginas: 1 
  };
  
  // Extraer las funciones necesarias
  const agregarElemento = diyContext.agregarElemento || ((_elemento: ElementoPresupuesto) => {});
  // Asumimos que esta función existe aunque no esté en la interfaz
  const verDetallesElemento = (elemento: ElementoPresupuesto) => {
    console.log('Ver detalles del elemento:', elemento);
    // Implementar lógica para mostrar detalles
  };
  const cambiarPagina = diyContext.cambiarPagina || ((_pagina: number) => {});

  // Las configuraciones de animación se definen localmente
  
  // Definir las variantes de animación para el contenedor y los elementos
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Estado para animación de carga
  const [isLoading, setIsLoading] = useState(true);
  
  // Simular carga al cambiar de tipo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [tipoSeleccionado]);
  
  // Función para renderizar elementos según su tipo
  const renderElemento = (elemento: ElementoPresupuesto) => {
    // Determinar el tipo basado en las propiedades del elemento
    if ('servicios' in elemento) {
      // Es un producto
      return (
        <motion.div key={`producto-${elemento.id}`} variants={itemVariants}>
          <ProductCard
            producto={elemento as Producto}
            onAgregarElemento={agregarElemento}
            onVerDetalles={verDetallesElemento}
            animationVariants={itemVariants}
          />
        </motion.div>
      );
    } else if ('es_independiente' in elemento) {
      // Es un servicio
      return (
        <motion.div key={`servicio-${elemento.id}`} variants={itemVariants}>
          <ServiceCard
            servicio={elemento as Servicio}
            onAgregarElemento={agregarElemento}
            animationVariants={itemVariants}
          />
        </motion.div>
      );
    } else if ('productos' in elemento) {
      // Es un paquete
      return (
        <motion.div key={`paquete-${elemento.id}`} variants={itemVariants}>
          <PackageCard
            paquete={elemento as Paquete}
            onAgregarElemento={agregarElemento}
            onVerDetalles={verDetallesElemento}
            animationVariants={itemVariants}
          />
        </motion.div>
      );
    }
    
    return null;
  };

  // Función para renderizar el estado de carga
  const renderLoading = () => (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-2 h-2 bg-[#00ff00] rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 1, 0.2]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <span className="text-xs text-white/60 mt-3" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          Cargando elementos...
        </span>
      </div>
    </div>
  );
  
  // Función para renderizar cuando no hay elementos
  const renderEmpty = () => (
    <div className="flex items-center justify-center h-[400px] w-full">
      <p 
        className="text-white/50 text-center"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        No hay elementos disponibles con los filtros seleccionados.
      </p>
    </div>
  );

  // Renderizado principal del componente
  return (
    <div className="flex-1">
      {isLoading ? (
        renderLoading()
      ) : elementosPaginados.length === 0 ? (
        renderEmpty()
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-4"
        >
          {elementosPaginados.map(elemento => renderElemento(elemento))}
        </motion.div>
      )}
      
      {/* Controles de paginación */}
      {paginacion.totalPaginas > 1 && (
        <div className="mt-6">
          <PaginationControls
            paginacion={paginacion}
            onCambioPagina={cambiarPagina}
          />
        </div>
      )}
    </div>
  );
};

export default CatalogView;
