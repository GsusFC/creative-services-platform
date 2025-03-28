'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ElementoPresupuestoExtendido, TipoElemento } from '@/types/do-it-yourself';

interface BudgetItemListProps {
  elementos: ElementoPresupuestoExtendido[];
  onEliminar: (index: number) => void;
  onActualizarCantidad?: (index: number, cantidad: number) => void;
}

/**
 * Componente que renderiza la lista de elementos en el presupuesto
 * Con soporte para cantidades y mejor accesibilidad
 */
const BudgetItemList: React.FC<BudgetItemListProps> = ({ 
  elementos, 
  onEliminar,
  onActualizarCantidad 
}) => {
  // Agrupar elementos por tipo
  const servicios = elementos.filter(e => e.tipo === TipoElemento.SERVICIO);
  const productos = elementos.filter(e => e.tipo === TipoElemento.PRODUCTO);
  const paquetes = elementos.filter(e => e.tipo === TipoElemento.PAQUETE);

  // Animación para los elementos con soporte para preferencias de reducción de movimiento
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 5, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 40
      }
    },
    exit: { 
      opacity: 0, 
      y: 5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Handler para eliminar elementos
  const handleEliminar = useCallback((index: number) => {
    onEliminar(index);
  }, [onEliminar]);

  // Handler para Key Down en botones
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEliminar(index);
    }
  }, [handleEliminar]);

  // Handler para actualizar cantidad
  const handleCantidadChange = useCallback((index: number, cantidad: number) => {
    if (onActualizarCantidad) {
      const nuevaCantidad = Math.max(1, cantidad); // Aseguramos que no sea menor que 1
      onActualizarCantidad(index, nuevaCantidad);
    }
  }, [onActualizarCantidad]);

  // Función para renderizar una sección de elementos
  const renderSeccion = (
    titulo: string, 
    items: ElementoPresupuestoExtendido[], 
    color: string
  ) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center">
          <span 
            className="w-2 h-2 rounded-full mr-2" 
            style={{ backgroundColor: color }}
            aria-hidden="true"
          ></span>
          {titulo} ({items.length})
        </h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
          role="list"
          aria-label={`Lista de ${titulo.toLowerCase()}`}
        >
          {items.map((item) => {
            // Usar el indiceGlobal directamente del item
            const indiceGlobal = item.indiceGlobal; 
            
            return (
              <motion.div 
                key={item.indiceGlobal} // Usar indiceGlobal como key
                variants={itemVariants}
                className="flex justify-between items-center bg-black/20 rounded-md px-3 py-2 text-sm"
                role="listitem"
              >
                <div className="flex-1 text-white/90 truncate pr-2">
                  {item.nombre}
                  {item.cantidad > 1 && (
                    <span className="text-white/60 ml-1">
                      (x{item.cantidad})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {onActualizarCantidad && (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleCantidadChange(indiceGlobal, item.cantidad - 1)} // Usar indiceGlobal
                        disabled={item.cantidad <= 1}
                        className="text-white/50 hover:text-white/90 disabled:text-white/30 transition-colors p-1"
                        aria-label={`Reducir cantidad de ${item.nombre}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-white/70 w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => handleCantidadChange(indiceGlobal, item.cantidad + 1)} // Usar indiceGlobal
                        className="text-white/50 hover:text-white/90 transition-colors p-1"
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <span className="text-white/60 whitespace-nowrap">
                    {(item.precio * item.cantidad).toLocaleString('es-ES')} €
                  </span>
                  <button
                    onClick={() => handleEliminar(indiceGlobal)} // Usar indiceGlobal
                    onKeyDown={(e) => handleKeyDown(e, indiceGlobal)} // Usar indiceGlobal
                    tabIndex={0}
                    aria-label={`Eliminar ${item.nombre} del presupuesto`}
                    className="text-white/40 hover:text-white/90 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  return (
    <div 
      className="overflow-y-auto custom-scrollbar pr-1" 
      style={{ maxHeight: 'calc(100vh - 400px)' }}
      role="region"
      aria-label="Lista de elementos en el presupuesto"
    >
      {/* Renderizar cada sección solo si tiene elementos */}
      {renderSeccion('Servicios', servicios, '#00A3FF')}
      {renderSeccion('Productos', productos, '#00FF85')}
      {renderSeccion('Paquetes', paquetes, '#FF00E5')}
      
      {/* Mensaje cuando no hay elementos */}
      {elementos.length === 0 && (
        <div className="text-center py-8 text-white/40 text-sm">
          <p>No hay elementos en el presupuesto</p>
          <p className="mt-2 text-xs">Selecciona servicios o productos del catálogo</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(BudgetItemList);
