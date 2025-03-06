'use client';

import React from 'react';
import { letterToFlag } from '@/lib/flag-system/flagMap';

interface ClassicDisplayProps {
  word: string;
  backgroundColor: string;
}

const ClassicDisplay: React.FC<ClassicDisplayProps> = ({ word, backgroundColor }) => {
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
      <div className="flex flex-row justify-center flex-wrap sm:flex-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
        {letters.map((letter, index) => {
          const flag = letterToFlag(letter);
          if (!flag) return null;
          
          return (
            <div key={index} className="flex items-center" style={{ margin: 0, padding: 0 }}>
              <img 
                src={flag.flagPath} 
                alt={`Bandera para la letra ${letter}`}
                style={{ 
                  display: 'inline-block', 
                  objectFit: 'contain'
                }}
                className="sm:w-[70px] sm:h-[70px] w-[50px] h-[50px]"
              />
            </div>
          );
        })}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-sans text-xl sm:text-2xl md:text-4xl tracking-wider">{word}</span>
      </div>
    </div>
  );
};

export default ClassicDisplay;
