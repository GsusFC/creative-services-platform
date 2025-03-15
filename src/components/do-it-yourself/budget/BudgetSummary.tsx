'use client';

import React from 'react';
import { useDiy } from '@/contexts/DiyContext';

/**
 * Componente que muestra el resumen del presupuesto con todos sus detalles
 */
const BudgetSummary: React.FC = () => {
  // Obtenemos los datos directamente del contexto
  const { 
    totalesPresupuesto,
    opcionesPresupuesto
  } = useDiy();
  
  // Extraemos las opciones que necesitamos
  const { descuentoGlobal, modoSprint } = opcionesPresupuesto;
  
  // Si no hay totales disponibles, no renderizamos nada
  if (!totalesPresupuesto) return null;
  
  const { subtotal, descuento, total, totalConDescuento } = totalesPresupuesto;
  
  // Calculamos el IVA (21%)
  const iva = totalConDescuento * 0.21;
  const totalFinal = totalConDescuento + iva;
  
  return (
    <div className="pt-4 mt-4 border-t border-white/10">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span 
            className="text-white/70"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Subtotal:
          </span>
          <span 
            className="text-white"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${subtotal.toLocaleString()}
          </span>
        </div>
        
        {descuentoGlobal > 0 && (
          <div className="flex justify-between text-sm">
            <span 
              className="text-white/70"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Descuento ({descuentoGlobal}%):
            </span>
            <span 
              className="text-red-400"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              -${descuento.toLocaleString()}
            </span>
          </div>
        )}
        
        {modoSprint && (
          <div className="flex justify-between text-sm">
            <span 
              className="text-white/70"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Modo Sprint (+25%):
            </span>
            <span 
              className="text-[#00ff00]/70"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              +${(total - subtotal).toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
          <span 
            className="text-white/70"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Subtotal con descuento:
          </span>
          <span 
            className="text-white"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${totalConDescuento.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span 
            className="text-white/70"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            IVA (21%):
          </span>
          <span 
            className="text-white/80"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${iva.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-lg font-medium border-t border-white/10 pt-2 mt-2">
          <span 
            className="text-white"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            TOTAL:
          </span>
          <span 
            className="text-white"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${totalFinal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetSummary);
