'use client';

import React, { useState, useRef, useEffect } from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

// Tipo para la configuración de layout
type LayoutConfig = {
  size: number;         // Tamaño de cada bandera en px
  rows: number[];       // Array que indica cuántas banderas por fila
  alignment?: string[]; // Alineación opcional para cada fila
};

// Función para calcular la configuración de layout según cantidad de letras
// Usando un enfoque porcentual para escalar con el tamaño del canvas
const calculateLayout = (letterCount: number, containerSize: number): LayoutConfig => {
  // El tamaño de la composición será el 50% del contenedor
  const compositionSize = containerSize * 0.5;
  
  switch(letterCount) {
    case 1:
      return { 
        size: compositionSize, 
        rows: [1], 
        alignment: ['center'] 
      };
    case 2:
      return { 
        size: compositionSize / 2, 
        rows: [2], 
        alignment: ['center'] 
      };
    case 3:
      return { 
        size: compositionSize / 3, 
        rows: [3], 
        alignment: ['center'] 
      };
    case 4:
      return { 
        size: compositionSize / 2, 
        rows: [2, 2], 
        alignment: ['center', 'center'] 
      };
    case 5:
      return { 
        size: compositionSize / 3, 
        rows: [3, 2], 
        alignment: ['center', 'flex-end'] 
      };
    case 6:
      return { 
        size: compositionSize / 3, 
        rows: [3, 3], 
        alignment: ['center', 'center'] 
      };
    case 7:
      return { 
        size: compositionSize / 3, 
        rows: [3, 3, 1], 
        alignment: ['center', 'center', 'flex-start'] 
      };
    case 8:
      return { 
        size: compositionSize / 3, 
        rows: [3, 3, 2], 
        alignment: ['center', 'center', 'center'] 
      };
    case 9:
      return { 
        size: compositionSize / 3, 
        rows: [3, 3, 3], 
        alignment: ['center', 'center', 'center'] 
      };
    case 10:
      return { 
        size: compositionSize / 4, 
        rows: [4, 4, 2], 
        alignment: ['center', 'center', 'center'] 
      };
    default:
      // Para más de 10 letras, usar un grid adaptativo
      const rowSize = Math.ceil(Math.sqrt(letterCount));
      return { 
        size: compositionSize / rowSize, 
        rows: Array(Math.ceil(letterCount / rowSize)).fill(rowSize),
        alignment: Array(Math.ceil(letterCount / rowSize)).fill('center')
      };
  }
};

interface AdaptiveDisplayProps {
  word: string;
  backgroundColor: string;
}

const AdaptiveDisplay: React.FC<AdaptiveDisplayProps> = ({ word, backgroundColor }) => {
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
  
  // Calcular la configuración de layout según la cantidad de letras y tamaño del contenedor
  const layout = calculateLayout(letters.length, containerSize);
  
  // Crear filas y banderas directamente con dimensiones basadas en el containerSize
  const flagRows = [];
  let letterIndex = 0;
  
  for (let rowIdx = 0; rowIdx < layout.rows.length; rowIdx++) {
    const flagsInRow = layout.rows[rowIdx];
    const rowFlags = [];
    
    for (let colIdx = 0; colIdx < flagsInRow && letterIndex < letters.length; colIdx++) {
      const letter = letters[letterIndex++];
      const flag = letterToFlag(letter);
      if (!flag) continue;
      
      // Calcular tamaño dinámico basado en containerSize
      rowFlags.push(
        <div 
          key={`flag-${rowIdx}-${colIdx}`} 
          style={{ 
            width: `${layout.size}px`, 
            height: `${layout.size}px`,
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
    }
    
    if (rowFlags.length > 0) {
      flagRows.push(
        <div 
          key={`row-${rowIdx}`} 
          style={{ 
            display: 'flex',
            justifyContent: layout.alignment?.[rowIdx] || 'center',
            margin: '0 auto',
            width: `${containerSize * 0.5}px`
          }}
        >
          {rowFlags}
        </div>
      );
    }
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex flex-col items-center justify-center">
        {flagRows}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
      </div>
    </div>
  );
};

export default AdaptiveDisplay;
