'use client';

import React from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

interface GridDisplayProps {
  word: string;
  backgroundColor: string;
}

const GridDisplay: React.FC<GridDisplayProps> = ({ word, backgroundColor }) => {
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
  
  return (
    <div 
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="w-[70%] mx-auto">
        {/* Display usando flexbox + flexwrap con SVG directos */}
        <div 
          style={{ display: 'flex', flexWrap: 'wrap', width: '140px', margin: '0 auto' }}
          className="sm:scale-100 scale-75 transform origin-center"
        >
          {letters.map((letter, index) => {
            const flag = letterToFlag(letter);
            if (!flag) return null;
            
            return (
              <div 
                key={index} 
                style={{ 
                  width: '70px', 
                  height: '70px', 
                  flexShrink: 0,
                  flexGrow: 0,
                  margin: 0, 
                  padding: 0, 
                  float: 'left'
                }}
                className="sm:w-[70px] sm:h-[70px] w-[50px] h-[50px]"
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
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
      </div>
    </div>
  );
};

export default GridDisplay;
