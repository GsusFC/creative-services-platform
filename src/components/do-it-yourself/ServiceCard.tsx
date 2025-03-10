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
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // Set drag data
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

  return (
    <div
      className={`service-card p-2 border border-white/10 bg-black/20 hover:border-white/30 transition-all 
                 ${isDragging ? 'opacity-50 scale-95 border-[#00ff00]/50' : 'opacity-100'} 
                 cursor-grab group relative`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{ fontFamily: 'var(--font-geist-mono)' }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xs text-white uppercase group-hover:text-[#00ff00] transition-colors truncate mr-1">
          {name}
        </h3>
        <span className="text-[#00ff00] text-xs whitespace-nowrap">
          {new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }).format(price)}
        </span>
      </div>
      
      {/* Info button and drag indicator */}
      <div className="flex items-center mt-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsDescriptionVisible(!isDescriptionVisible);
          }}
          className="text-[10px] text-white/50 hover:text-white inline-flex items-center focus:outline-none"
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
          <span className="text-[10px]">INFO</span>
        </button>
        
        {/* Drag indicator */}
        <div className="ml-auto w-3 h-3 opacity-30 group-hover:opacity-100 text-[#00ff00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Expandable description */}
      {isDescriptionVisible && (
        <p className="text-white/60 text-[10px] mt-1 line-clamp-2">{description}</p>
      )}

      {/* Add visual indicator */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-transparent border-r-[#00ff00]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default ServiceCard;
