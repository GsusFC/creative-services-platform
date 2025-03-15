'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDiy } from '@/contexts/DiyContext';

// Importamos los componentes actualizados
import BudgetPanel from './BudgetPanel';
import { BudgetStates } from './BudgetStates';

/**
 * Contenedor principal para el módulo de presupuesto
 * Este componente integra todos los componentes y funcionalidades
 */
const BudgetContainer: React.FC = () => {
  const { 
    elementosSeleccionados,
    estaCargando, 
    error,
    totalesPresupuesto
  } = useDiy();
  
  // Estado para controlar animaciones y enfoque de accesibilidad
  const [isVisible, setIsVisible] = useState(false);
  
  // Efecto para gestionar visibilidad con delay para mejora de accesibilidad
  useEffect(() => {
    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animaciones con mejor soporte para preferencias de reducción de movimiento
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const elementVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Renderizar diferentes estados según la situación
  if (estaCargando) {
    return <BudgetStates.Loading />;
  }
  
  if (error) {
    return <BudgetStates.Error />;
  }
  
  if (!elementosSeleccionados || elementosSeleccionados.length === 0) {
    return <BudgetStates.Empty />;
  }
  
  return (
    <motion.section
      className="w-full h-full"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      role="region"
      aria-label="Resumen del presupuesto"
    >
      <div className="p-4 md:p-6">
        <motion.h2 
          className="text-2xl font-bold text-white mb-6"
          variants={elementVariants}
        >
          Resumen de Presupuesto
        </motion.h2>
        
        <BudgetPanel />
        
        <motion.div 
          className="mt-8 text-white/70 text-sm"
          variants={elementVariants}
        >
          <p className="mb-2">
            Los precios mostrados son orientativos y pueden variar según los requisitos específicos del proyecto.
          </p>
          {totalesPresupuesto && (
            <p className="text-white/50 text-xs">
              Última actualización: {new Date().toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetContainer);
