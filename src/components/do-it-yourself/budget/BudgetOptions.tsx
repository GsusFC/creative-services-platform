'use client';

import React, { useCallback } from 'react';
import { useDiy } from '@/contexts/DiyContext';

/**
 * Componente que muestra y permite modificar las opciones del presupuesto
 */
const BudgetOptions: React.FC = () => {
  // Obtenemos los datos y métodos directamente del contexto
  const { 
    opcionesPresupuesto,
    setDescuentoGlobal,
    setModoSprint
  } = useDiy();
  
  // Extraemos las opciones del objeto para facilitar su uso
  const { descuentoGlobal, modoSprint } = opcionesPresupuesto;
  
  // Usar callbacks para evitar recreaciones innecesarias de las funciones
  const handleToggleSprint = useCallback(() => {
    setModoSprint(!modoSprint);
  }, [modoSprint, setModoSprint]);
  
  const handleDescuentoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = parseInt(e.target.value, 10);
    setDescuentoGlobal(valor);
  }, [setDescuentoGlobal]);
  
  const handleSprintKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleSprint();
    }
  }, [handleToggleSprint]);
  
  return (
    <div className="bg-black/30 p-4 rounded-md mt-4">
      <h3 className="text-white text-lg font-medium mb-3">Opciones</h3>
      
      <div className="space-y-4">
        {/* Selector de descuento */}
        <div>
          <label htmlFor="descuento" className="block text-white/70 text-sm mb-1">
            Descuento global
          </label>
          <select
            id="descuento"
            value={descuentoGlobal}
            onChange={handleDescuentoChange}
            className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 text-white text-sm"
            aria-label="Seleccionar porcentaje de descuento global"
          >
            <option value="0">Sin descuento</option>
            <option value="5">5% de descuento</option>
            <option value="10">10% de descuento</option>
            <option value="15">15% de descuento</option>
            <option value="20">20% de descuento</option>
            <option value="25">25% de descuento</option>
          </select>
        </div>
        
        {/* Toggle de modo sprint */}
        <div>
          <span className="block text-white/70 text-sm mb-1">Modo Sprint</span>
          <div 
            role="checkbox"
            aria-checked={modoSprint}
            tabIndex={0}
            className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
              modoSprint ? 'bg-[#00ff00]' : 'bg-gray-700'
            } flex items-center px-1`}
            onClick={handleToggleSprint}
            onKeyDown={handleSprintKeyDown}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                modoSprint ? 'translate-x-6' : ''
              }`} 
            />
          </div>
          <p className="text-white/50 text-xs mt-1">
            {modoSprint 
              ? 'Activado: Entrega acelerada (+25% coste)'
              : 'Desactivado: Entrega estándar'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetOptions);
