'use client';

import { useMemo } from 'react';

interface FlagReferenceProps {
  colorScheme?: 'original' | 'rgb' | 'random';
}

// Función para obtener el nombre de la bandera según la letra
const getFlagName = (letter: string): string => {
  const flagNames: Record<string, string> = {
    'A': 'ALPHA',
    'B': 'BRAVO',
    'C': 'CHARLIE',
    'D': 'DELTA',
    'E': 'ECHO',
    'F': 'FOXTROT',
    'G': 'GOLF',
    'H': 'HOTEL',
    'I': 'INDIA',
    'J': 'JULIET',
    'K': 'KILO',
    'L': 'LIMA',
    'M': 'MIKE',
    'N': 'NOVEMBER',
    'O': 'OSCAR',
    'P': 'PAPA',
    'Q': 'QUEBEC',
    'R': 'ROMEO',
    'S': 'SIERRA',
    'T': 'TANGO',
    'U': 'UNIFORM',
    'V': 'VICTOR',
    'W': 'WHISKY',
    'X': 'XRAY',
    'Y': 'YANKEE',
    'Z': 'ZULU'
  };
  
  return flagNames[letter] || letter;
};

export const FlagReference = ({ colorScheme }: FlagReferenceProps) => {
  // Definir el alfabeto (A-Z) - esto no cambia, así que no necesita memoización
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Memoizamos la función para aplicar filtros según el esquema de color seleccionado
  const getFilterForScheme = useMemo(() => {
    return (letter: string, index: number): string => {
      if (colorScheme === 'original') {
        return '';
      } else if (colorScheme === 'rgb') {
        // Asignar colores RGB basados en la posición
        const position = index % 3;
        if (position === 0) return 'hue-rotate(0deg) saturate(1.5)';
        if (position === 1) return 'hue-rotate(120deg) saturate(1.5)';
        return 'hue-rotate(240deg) saturate(1.5)';
      } else {
        // Esquema aleatorio - usar un valor de rotación de tono basado en la letra
        const hueRotation = (letter.charCodeAt(0) - 65) * (360 / 26);
        return `hue-rotate(${hueRotation}deg) saturate(1.2)`;
      }
    };
  }, [colorScheme]);
  
  // Memoizamos el mapa de banderas para evitar recálculos innecesarios
  const memoizedFlagMap = useMemo(() => {
    // Definimos una interfaz para los elementos del mapa de banderas
    interface FlagReferenceItem {
      letter: string;
      flagName: string;
      filter: string;
    }
    
    return alphabet.map((letter, index) => {
      const filter = getFilterForScheme(letter, index);
      const flagName = getFlagName(letter);
      
      return {
        letter,
        flagName,
        filter
      } as FlagReferenceItem;
    });
  }, [alphabet, getFilterForScheme]);
  
  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 md:p-6 mt-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-white text-xl font-medium mb-2 md:mb-0">Referencia de Banderas Náuticas</h2>
        {colorScheme && (
          <div className="text-sm text-gray-400 hidden md:block">Esquema de color: <span className="text-white font-medium">{colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)}</span></div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
        {memoizedFlagMap.map(({ letter, flagName, filter }) => (
          <div key={letter} className="flex flex-col items-center bg-gray-700 rounded-md p-2 transition-transform hover:scale-105">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative mb-2 flex items-center justify-center">
              <img
                src={`/assets/flags/${letter}-${flagName}.svg`}
                width="100%"
                height="100%"
                style={{ filter, objectFit: 'contain' }}
                alt={`Bandera ${flagName}`}
              />
            </div>
            <span className="text-white font-mono text-xs sm:text-sm text-center">{letter} - {flagName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
