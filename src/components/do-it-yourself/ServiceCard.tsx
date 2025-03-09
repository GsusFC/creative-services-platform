'use client';

import React, { useState } from 'react';
import { useDragDrop } from './DragDropProvider';

interface ServiceProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
}

const ServiceCard = ({ id, name, description, price, category_id }: ServiceProps) => {
  const { addService } = useDragDrop();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // Configurar los datos del drag
    e.dataTransfer.setData('application/json', JSON.stringify({
      id,
      name,
      description,
      price,
      category_id
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    addService({
      id,
      name,
      description,
      price,
      category_id
    });
  };

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  return (
    <div
      className={`service-card py-2 px-3 bg-black/20 border-l-2 border-[#00ff00]/40 transition-all 
                 ${isDragging ? 'opacity-50 scale-95 border-dashed' : 'opacity-100'} 
                 cursor-grab hover:bg-black/40 group relative`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-mono text-white group-hover:text-[#00ff00] transition-colors truncate mr-1">{name}</h3>
        <span className="text-[#00ff00] font-mono text-xs whitespace-nowrap">
          {new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR' 
          }).format(price)}
        </span>
      </div>
      
      {/* Botón minimalista para mostrar descripción */}
      <div className="flex items-center mt-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsDescriptionVisible(!isDescriptionVisible);
          }}
          className="text-xs text-gray-500 hover:text-white flex items-center focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-3 w-3 mr-1 transition-transform ${isDescriptionVisible ? 'rotate-90' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[10px]">info</span>
        </button>
        
        {/* Indicador de arrastre sutil */}
        <div className="ml-auto w-3 h-3 opacity-30 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Descripción expandible */}
      {isDescriptionVisible && (
        <p className="text-gray-400 text-[10px] mt-1 line-clamp-2">{description}</p>
      )}
    </div>
  );
};

export default ServiceCard;
