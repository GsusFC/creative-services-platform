'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDiy } from '@/contexts/DiyContext';
import { ElementoPresupuestoExtendido } from '@/types/do-it-yourself';

interface BudgetGroupProps {
  titulo: string;
  elementos: ElementoPresupuestoExtendido[];
  startIndex: number;
}

/**
 * Componente que renderiza un grupo de elementos del presupuesto
 */
const BudgetGroup: React.FC<BudgetGroupProps> = ({ 
  titulo, 
  elementos, 
  startIndex
}) => {
  const { quitarElementoPresupuesto } = useDiy();
  
  // Handler optimizado para eliminar elementos
  const handleEliminar = useCallback((index: number) => {
    quitarElementoPresupuesto(index);
  }, [quitarElementoPresupuesto]);
  
  // Handler para Key Down en botones
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEliminar(index);
    }
  }, [handleEliminar]);
  
  // No renderizar si no hay elementos
  if (elementos.length === 0) return null;
  
  // Animación para los elementos
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
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <div className="mb-4">
      <h4 className="text-white text-md font-medium mb-2">{titulo}</h4>
      
      <motion.div 
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {elementos.map((elemento, idx) => {
          const index = startIndex + idx;
          return (
            <motion.div 
              key={`${elemento.id}-${index}`}
              className="flex items-center justify-between bg-black/40 border border-white/10 rounded p-3"
              variants={itemVariants}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span 
                    className="text-white font-medium truncate"
                    style={{ maxWidth: 'calc(100% - 60px)' }}
                  >
                    {elemento.nombre}
                  </span>
                  <span className="text-white/40 text-xs">
                    {elemento.cantidad && elemento.cantidad > 1 ? `x${elemento.cantidad}` : ''}
                  </span>
                </div>
                <p className="text-white/50 text-xs truncate">{elemento.descripcion}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span 
                  className="text-white whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  ${(elemento.precio * (elemento.cantidad || 1)).toLocaleString()}
                </span>
                
                <button
                  onClick={() => handleEliminar(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/50 p-1"
                  tabIndex={0}
                  aria-label={`Eliminar ${elemento.nombre} del presupuesto`}
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

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetGroup);
