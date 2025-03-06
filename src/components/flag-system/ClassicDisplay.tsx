'use client';

import React, { useState, useRef, useEffect } from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

interface ClassicDisplayProps {
  word: string;
  backgroundColor: string;
  showText?: boolean;
}

const ClassicDisplay: React.FC<ClassicDisplayProps> = ({ word, backgroundColor, showText = true }) => {
  // Referencia al contenedor para medir su tamaño
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(1000); // Tamaño inicial por defecto
  
  // Detectar el tamaño del contenedor
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Usar el valor más pequeño entre ancho y alto para asegurar aspecto cuadrado
        const size = Math.min(width, height);
        setContainerSize(size);
      }
    };
    
    // Actualizar tamaño inicial
    updateSize();
    
    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!word) {
    return (
      <div className="text-center p-8">
        <span className="text-white/60 font-sans text-xl block">
          Enter or generate a word to display flags
        </span>
      </div>
    );
  }

  // Array de letras para mostrar
  const letters = word.split('').map(letter => letter.toUpperCase());
  
  // Calcular tamaño de la composición (50% del contenedor)
  const compositionSize = containerSize * 0.5;
  
  // Calcular tamaño dinámico para las banderas
  const flagSize = compositionSize / letters.length;
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="w-full flex justify-center items-center">
        {/* Display horizontal clásico (banderas una al lado de otra) */}
        <div 
          className="flex flex-row flex-nowrap justify-center"
          style={{ gap: '0', width: `${compositionSize}px` }}
        >
          {letters.map((letter, index) => {
            const flag = letterToFlag(letter);
            if (!flag) return null;
            
            return (
              <div 
                key={index} 
                style={{ 
                  width: `${flagSize}px`, 
                  height: `${flagSize}px`, 
                  flexShrink: 0,
                  flexGrow: 0,
                  margin: 0,
                  padding: 0
                }}
              >
                <img 
                  src={flag.flagPath} 
                  alt={`Bandera para la letra ${letter}`}
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Palabra en el borde inferior (condicionalmente visible) */}
      {showText && (
        <div className="absolute bottom-40 w-full text-center">
          <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
        </div>
      )}
    </div>
  );
};

export default ClassicDisplay;
