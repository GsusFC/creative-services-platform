'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDiy } from '@/contexts/DiyContext';

// Componentes actualizados
import BudgetItemList from './BudgetItemList';
import BudgetTotals from './BudgetTotals';
import BudgetActions from './BudgetActions';
import { BudgetStates } from './BudgetStates';

/**
 * Panel de presupuesto que muestra la información completa del presupuesto
 * Utiliza el contexto global y los componentes actualizados
 */
const BudgetPanel: React.FC = () => {
  const { 
    elementosSeleccionados,
    error,
    opcionesPresupuesto,
    totalesPresupuesto,
    quitarElementoPresupuesto,
    actualizarCantidadElemento
  } = useDiy();
  
  // Handlers para gestionar elementos del presupuesto
  const handleEliminarElemento = (index: number) => {
    quitarElementoPresupuesto(index);
  };
  
  const handleActualizarCantidad = (index: number, nuevaCantidad: number) => {
    actualizarCantidadElemento(index, nuevaCantidad);
  };
  
  // Para evitar mostrar dos spinners de carga, no renderizamos el estado de carga aquí
  // ya que la aplicación principal ya muestra un estado de carga global
  
  // Componente de estado de error
  if (error) {
    return <BudgetStates.Error />;
  }
  
  // Componente de estado vacío
  if (!elementosSeleccionados.length) {
    return <BudgetStates.Empty />;
  }
  
  // Animaciones para contenedor principal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div
      className="bg-black/20 backdrop-blur-sm rounded-md p-4 mb-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="region"
      aria-label="Panel de presupuesto"
    >
      <h3 className="text-white text-xl font-medium mb-4">Tu Presupuesto</h3>
      
      {/* Lista de elementos */}
      <div className="mb-6">
        <BudgetItemList 
          elementos={elementosSeleccionados}
          onEliminar={handleEliminarElemento}
          onActualizarCantidad={handleActualizarCantidad}
        />
      </div>
      
      {/* Resumen de totales */}
      <div className="mb-6">
        <BudgetTotals 
          totales={totalesPresupuesto} 
          opciones={opcionesPresupuesto} 
        />
      </div>
      
      
      {/* Acciones de presupuesto */}
      <BudgetActions />
    </motion.div>
  );
};

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetPanel);
