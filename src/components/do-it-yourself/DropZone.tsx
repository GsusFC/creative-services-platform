'use client';

import React, { useState } from 'react';
import { useDragDrop } from './DragDropProvider';

const DropZone = () => {
  const { addService } = useDragDrop();
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    try {
      const serviceData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (serviceData && serviceData.id) {
        addService(serviceData);
      }
    } catch (error) {
      console.error('Error al procesar el servicio:', error);
    }
  };

  return (
    <div
      className={`drop-zone relative p-8 border-2 border-dashed rounded-xl transition-all min-h-[220px] flex flex-col items-center justify-center group
                ${isOver 
                  ? 'border-[#00ff00] bg-[#00ff00]/10 shadow-[0_0_15px_rgba(0,255,0,0.2)]' 
                  : 'border-gray-700 bg-black/20 hover:border-gray-400 hover:bg-black/30'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Overlay de efecto de brillo cuando hay un objeto sobre la zona */}
      <div className={`absolute inset-0 bg-gradient-to-b from-[#00ff00]/10 to-transparent rounded-xl transition-opacity ${isOver ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Indicador de destino */}
      <div className={`relative z-10 flex flex-col items-center ${isOver ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-12 h-12 mb-4 transition-colors drop-shadow-glow ${isOver ? 'text-[#00ff00]' : 'text-gray-500 group-hover:text-gray-300'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOver ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M19 13l-7 7-7-7m14-8l-7 7-7-7" 
            />
          )}
        </svg>
        
        <p className={`text-center transition-colors font-mono ${isOver ? 'text-[#00ff00]' : 'text-gray-400 group-hover:text-white'}`}>
          {isOver 
            ? '¡SUELTA AQUÍ!' 
            : 'ARRASTRA SERVICIOS AQUÍ'}
        </p>
      </div>
      
      {/* Estilo global para el efecto de brillo */}
      <style jsx global>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 4px rgba(0, 255, 0, 0.5));
        }
      `}</style>
    </div>
  );
};

export default DropZone;
