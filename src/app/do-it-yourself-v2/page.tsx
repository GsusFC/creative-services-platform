'use client';

import React from 'react';
import { DiyProvider } from '@/contexts/DiyContext';
import BudgetContainer from '@/components/do-it-yourself/budget/BudgetContainer';

/**
 * Página de demostración para el módulo "Do It Yourself"
 * Muestra los componentes del presupuesto
 */
export default function DoItYourselfPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Módulo Do-It-Yourself</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-black/50 to-black/80 border border-white/10 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-medium mb-6 border-b border-white/10 pb-3">Componentes del Presupuesto</h2>
          
          {/* Envolvemos todos los componentes en el proveedor de contexto */}
          <DiyProvider>
            <BudgetContainer />
          </DiyProvider>
        </div>
      </div>
    </div>
  );
}
