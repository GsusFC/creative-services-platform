'use client';

import React, { useCallback } from 'react';
import { FiSave } from 'react-icons/fi';

/**
 * Componente que muestra el botón para guardar el presupuesto
 */
const BudgetActions: React.FC = () => {
  // Handler para manejar eventos de teclado para accesibilidad
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const handleGuardarPresupuesto = useCallback(() => {
    // Implementar lógica para guardar presupuesto
    console.log('Guardando presupuesto...');
    // Aquí se podría implementar la lógica para guardar en localStorage o enviar a una API
  }, []);

  return (
    <div className="mt-4">
      <button 
        className="w-full bg-[#00FF85] text-black py-3 font-medium tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-[#00FF85]/90 transition-colors"
        onClick={handleGuardarPresupuesto}
        onKeyDown={(e) => handleKeyDown(e, handleGuardarPresupuesto)}
        tabIndex={0}
        aria-label="Guardar presupuesto"
      >
        <FiSave className="text-black" />
        GUARDAR PRESUPUESTO
      </button>
    </div>
  );
};

// Aplicamos memoización para evitar renderizados innecesarios
export default React.memo(BudgetActions);
