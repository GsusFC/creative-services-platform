'use client';

import React from 'react';

// Componente dummy para resolver problemas de importación durante la compilación
export const TransformationInfoPanel = () => {
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-2">Información de Transformaciones</h3>
      <p className="text-gray-300">
        Este panel está temporalmente deshabilitado para solucionar problemas de despliegue.
      </p>
    </div>
  );
};

export default TransformationInfoPanel;
