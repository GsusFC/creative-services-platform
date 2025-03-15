'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TotalesPresupuesto, OpcionesPresupuesto } from '@/types/do-it-yourself';

interface BudgetTotalsProps {
  totales: TotalesPresupuesto;
  opciones: OpcionesPresupuesto;
}

/**
 * Componente que muestra el resumen de totales del presupuesto
 * Con soporte para animaciones y opciones avanzadas
 */
const BudgetTotals: React.FC<BudgetTotalsProps> = ({ totales, opciones }) => {
  const { descuentoGlobal, modoSprint, incluyeIVA, moneda } = opciones;
  
  // Animaciones para mejorar la experiencia de usuario
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Formato de moneda
  const formatoMoneda = (valor: number): string => {
    return `${valor.toLocaleString('es-ES')} ${moneda || '€'}`;
  };

  return (
    <motion.div 
      className="bg-black/30 p-4 rounded-md mt-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.h3 
        className="text-white text-lg font-medium mb-3"
        variants={itemVariants}
      >
        Resumen
      </motion.h3>
      
      <div className="space-y-2">
        <motion.div 
          className="flex justify-between text-white/70 text-sm"
          variants={itemVariants}
        >
          <span>Subtotal:</span>
          <span>{formatoMoneda(totales.subtotal)}</span>
        </motion.div>
        
        {/* Mostrar descuento si existe */}
        {descuentoGlobal > 0 && (
          <motion.div 
            className="flex justify-between text-white/70 text-sm"
            variants={itemVariants}
          >
            <span>Descuento {descuentoGlobal}%:</span>
            <span>-{formatoMoneda(totales.descuento)}</span>
          </motion.div>
        )}
        
        {/* Mostrar recargo por sprint si está activado */}
        {modoSprint && (
          <motion.div 
            className="flex justify-between text-white/70 text-sm"
            variants={itemVariants}
          >
            <span>Recargo Sprint 30%:</span>
            <span>+{formatoMoneda(totales.recargoSprint)}</span>
          </motion.div>
        )}
        
        {/* IVA (solo si se incluye) */}
        {incluyeIVA && (
          <motion.div 
            className="flex justify-between text-white/70 text-sm"
            variants={itemVariants}
          >
            <span>IVA (21%):</span>
            <span>{formatoMoneda(totales.iva)}</span>
          </motion.div>
        )}
        
        {/* Línea separadora */}
        <motion.div 
          className="border-t border-white/10 my-2"
          variants={itemVariants}
        ></motion.div>
        
        {/* Total */}
        <motion.div 
          className="flex justify-between text-white font-medium"
          variants={itemVariants}
        >
          <span>Total:</span>
          <span>{formatoMoneda(totales.total)}</span>
        </motion.div>
        
        {/* Notas adicionales si existen */}
        {opciones.notasAdicionales && (
          <motion.div
            className="mt-4 pt-3 border-t border-white/10 text-white/50 text-xs italic"
            variants={itemVariants}
          >
            {opciones.notasAdicionales}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(BudgetTotals);
