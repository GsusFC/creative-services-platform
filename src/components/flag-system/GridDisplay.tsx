'use client';

import React, { useState, useRef, useEffect } from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

interface GridDisplayProps {
  word: string;
  backgroundColor: string;
  showText?: boolean;
}

const GridDisplay: React.FC<GridDisplayProps> = ({ word, backgroundColor, showText = true }) => {
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
  
  // Calcular el tamaño de las banderas (50% del contenedor dividido por cantidad de letras)
  const compositionSize = containerSize * 0.5; // 50% del canvas
  // Usar el mismo cálculo que en ClassicDisplay para mantener proporciones consistentes
  const flagSize = compositionSize / letters.length;
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="flex justify-center items-center">
        {/* Display usando flexbox + flexwrap con ancho fijo de 2 banderas */}
        <div 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            width: `${flagSize * 2}px`, 
            margin: '0 auto',
            justifyContent: 'center'
          }}
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
        <div className="absolute bottom-4 w-full text-center">
          <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
        </div>
      )}
    </div>
  );
};

export default GridDisplay;
