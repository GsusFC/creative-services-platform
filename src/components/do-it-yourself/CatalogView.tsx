'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
// Importar solo Servicio y ElementoPresupuesto (para la función verDetalles)
import { Servicio, ElementoPresupuesto } from '@/types/do-it-yourself'; 
// ProductCard y PackageCard eliminados
import ServiceCard from './cards/ServiceCard';
import PaginationControls from './PaginationControls';
import { useDiy } from '@/contexts/DiyContext';
// Importar componentes de estado estándar
import LoadingState from './states/LoadingState';
import EmptyState from './states/EmptyState';

// No necesitamos una interfaz de props ya que usamos el contexto para todo

const CatalogView = () => {
  // Obtener todos los datos y funciones necesarios del contexto DIY
  const diyContext = useDiy();
  
  // Extraer los datos necesarios del contexto
  // const elementosFiltrados = diyContext.elementosFiltrados || []; // No se usa actualmente
  const elementosPaginados = diyContext.elementosPaginados || [];
  // tipoSeleccionado eliminado de filtros
  const paginacion = diyContext.paginacion || { 
    paginaActual: 1, 
    elementosPorPagina: 12, 
    totalElementos: 0, 
    totalPaginas: 1 
  };
  
  // Extraer las funciones necesarias del contexto
  const { agregarElementoPresupuesto, cambiarPagina } = diyContext;
  
  // Función para ver detalles (implementación pendiente)
  const verDetallesElemento = (elemento: ElementoPresupuesto) => {
    console.log('Ver detalles del elemento:', elemento);
    // Implementar lógica para mostrar detalles
  };

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
  
  // Simular carga al cambiar de página o filtro (si es necesario)
  // La dependencia de tipoSeleccionado se elimina
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reducir delay
    return () => clearTimeout(timer);
  }, [elementosPaginados]); // Recargar al cambiar elementos paginados

  // Función para renderizar elementos según su tipo - Simplificada
  const renderElemento = (elemento: Servicio) => { // Ahora siempre es Servicio (UI)
    // Renderizar siempre ServiceCard
    return (
      <motion.div key={`servicio-${elemento.id}`} variants={itemVariants}>
        <ServiceCard
          servicio={elemento} // Ya es de tipo Servicio (UI)
          // onAgregarElemento se obtiene del contexto en ServiceCard
          animationVariants={itemVariants}
        />
      </motion.div>
    );
  };

  // Renderizado principal del componente
  return (
    <div className="flex-1">
      {isLoading ? (
        <LoadingState /> // Usar componente estándar
      ) : elementosPaginados.length === 0 ? (
        <EmptyState /> // Usar componente estándar
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
      
      {/* Controles de paginación - Obtiene datos del contexto */}
      {paginacion.totalPaginas > 1 && (
        <div className="mt-6">
          <PaginationControls />
        </div>
      )}
    </div>
  );
};

export default CatalogView;
