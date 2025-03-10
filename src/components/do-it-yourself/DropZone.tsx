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
      console.error('Error processing service:', error);
    }
  };

  return (
    <div
      className={`drop-zone relative p-8 border rounded-lg transition-all min-h-[220px] flex flex-col items-center justify-center
                ${isOver 
                  ? 'border-[#00ff00] bg-[#00ff00]/5 shadow-[0_0_20px_rgba(0,255,0,0.2)]' 
                  : 'border-white/10 hover:border-white/30'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ fontFamily: 'var(--font-geist-mono)' }}
    >
      {/* Glow effect overlay when dragging over */}
      <div className={`absolute inset-0 bg-gradient-to-b from-[#00ff00]/5 to-transparent rounded-lg transition-opacity ${isOver ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Target indicator */}
      <div className={`relative z-10 flex flex-col items-center ${isOver ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-12 h-12 mb-4 transition-colors ${isOver ? 'text-[#00ff00]' : 'text-white/30'}`} 
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
        
        <p className={`text-center uppercase transition-colors ${isOver ? 'text-[#00ff00]' : 'text-white/50'}`}>
          {isOver 
            ? 'DROP HERE' 
            : 'DRAG SERVICES HERE'}
        </p>
        <p className="text-[11px] text-white/40 mt-2 max-w-[260px] text-center">
          {isOver 
            ? 'RELEASE TO ADD THIS SERVICE TO YOUR BUDGET' 
            : 'OR CLICK ON SERVICES TO ADD THEM TO YOUR BUDGET'}
        </p>
      </div>
    </div>
  );
};

export default DropZone;
