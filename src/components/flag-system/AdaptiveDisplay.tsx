'use client';

import React from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

// Tipo para la configuración de layout
type LayoutConfig = {
  size: number;         // Tamaño de cada bandera en px
  rows: number[];       // Array que indica cuántas banderas por fila
  alignment?: string[]; // Alineación opcional para cada fila
};

// Función para calcular la configuración de layout según cantidad de letras
const calculateLayout = (letterCount: number): LayoutConfig => {
  switch(letterCount) {
    case 1:
      return { size: 500, rows: [1], alignment: ['center'] };
    case 2:
      return { size: 250, rows: [2], alignment: ['center'] };
    case 3:
      return { size: 166.7, rows: [3], alignment: ['center'] };
    case 4:
      return { size: 250, rows: [2, 2], alignment: ['center', 'center'] };
    case 5:
      return { size: 166.7, rows: [3, 2], alignment: ['center', 'flex-end'] };
    case 6:
      return { size: 166.7, rows: [3, 3], alignment: ['center', 'center'] };
    case 7:
      return { size: 166.7, rows: [3, 3, 1], alignment: ['center', 'center', 'flex-start'] };
    case 8:
      return { size: 166.7, rows: [3, 3, 2], alignment: ['center', 'center', 'center'] };
    case 9:
      return { size: 166.7, rows: [3, 3, 3], alignment: ['center', 'center', 'center'] };
    case 10:
      return { 
        size: 125, 
        rows: [4, 4, 2], 
        alignment: ['center', 'center', 'center']
      };
    default:
      // Para más de 10 letras, usar un grid adaptativo
      const rowSize = Math.ceil(Math.sqrt(letterCount));
      return { 
        size: 500 / rowSize, 
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
  
  // Calcular la configuración de layout según la cantidad de letras
  const layout = calculateLayout(letters.length);
  
  // Preparar las filas
  let letterIndex = 0;
  const rows = [];
  
  // Caso especial para 10 letras - las últimas 2 banderas son más grandes
  const isSpecialTenCase = letters.length === 10;
  
  for (let rowIndex = 0; rowIndex < layout.rows.length; rowIndex++) {
    const rowCount = layout.rows[rowIndex];
    const rowLetters = [];
    
    // Determinar el tamaño de las banderas en esta fila
    let flagSize = layout.size;
    // Para la última fila del caso de 10 letras, duplicar el tamaño
    if (isSpecialTenCase && rowIndex === 2) {
      flagSize = 250; // Doble tamaño para la última fila de 10 letras
    }
    
    // Crear las banderas para esta fila
    for (let i = 0; i < rowCount && letterIndex < letters.length; i++) {
      const letter = letters[letterIndex++];
      const flag = letterToFlag(letter);
      if (!flag) continue;
      
      rowLetters.push(
        <div 
          key={`${rowIndex}-${i}`} 
          style={{ 
            width: `${flagSize}px`, 
            height: `${flagSize}px`, 
            flexShrink: 0,
            flexGrow: 0,
            margin: 0, 
            padding: 0
          }}
          className="relative"
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
    
    // Añadir la fila al conjunto
    if (rowLetters.length > 0) {
      rows.push(
        <div 
          key={`row-${rowIndex}`} 
          style={{ 
            display: 'flex',
            justifyContent: layout.alignment?.[rowIndex] || 'center',
            width: '500px',
            margin: '0 auto'
          }}
        >
          {rowLetters}
        </div>
      );
    }
  }
  
  return (
    <div 
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex flex-col items-center justify-center">
        {rows}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
      </div>
    </div>
  );
};

export default AdaptiveDisplay;
