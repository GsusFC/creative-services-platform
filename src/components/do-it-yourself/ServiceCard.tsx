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
      <div className="flex flex-col">
        <h3 className="text-xs text-white uppercase group-hover:text-[#00ff00] transition-colors" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {name}
        </h3>
        
        <div className="flex justify-end mt-2">
          <span className="text-[#00ff00] text-xs whitespace-nowrap uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD' 
            }).format(price)}
          </span>
        </div>
      </div>

      {/* Add visual indicator */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-transparent border-r-[#00ff00]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default ServiceCard;
