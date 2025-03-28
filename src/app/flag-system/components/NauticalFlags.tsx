'use client';

import { useMemo } from 'react';

interface NauticalFlagsProps {
  word: string;
  flagSize: number;
  colorScheme: string; // Aunque no se use para filtros, lo mantenemos por si acaso
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

export const NauticalFlags = ({ word, flagSize }: NauticalFlagsProps) => {
  // La lógica de filtros basada en colorScheme se elimina ya que está fija en 'original'

  // Definimos una interfaz para los elementos del mapa de banderas
  interface FlagItem {
    flagKey: string;
    flagName: string;
    // filter: string; // Ya no es necesario
    index: number;
  }

  // Memoizamos el mapa de banderas para evitar recálculos innecesarios
  const memoizedFlagMap = useMemo(() => {
    // Crear un array de elementos de bandera
    return word.split('').map((char, index) => {
      const flagKey = char.toUpperCase();
      
      // Verificar si el carácter es una letra válida (A-Z)
      if (!/^[A-Z]$/.test(flagKey)) return null;

      const flagName = getFlagName(flagKey);
      // const filter = ''; // Ya no se necesita filtro

      return {
        flagKey,
        flagName,
        // filter, // Ya no es necesario
        index
      } as FlagItem;
    }).filter((item): item is FlagItem => item !== null);
  }, [word]); // Dependencia de getFilterForScheme eliminada
  
  // Calculamos la posición de inicio de manera memoizada, usando el flagSize recibido
  const layoutInfo = useMemo(() => {
    // Usamos directamente el flagSize proporcionado por el padre
    const totalWidth = memoizedFlagMap.length * flagSize;

    // Calculate starting position to center the flags in the available space (600px wide, centered in 1000px)
    // El espacio disponible empieza en x=200 y termina en x=800
    const availableWidth = 600;
    const startX = 200 + (availableWidth - totalWidth) / 2; // Centrado dentro del área de 600px
    const centerY = 500; // Center of the canvas (y=500)

    return {
      startX,
      centerY
    };
  }, [flagSize, memoizedFlagMap.length]);

  // Renderizar las banderas directamente como elementos image
  return (
    <g>
      {memoizedFlagMap.map(({ flagKey, flagName, index }) => {
        // Usar el flagSize directamente y el startX calculado
        const xPosition = layoutInfo.startX + (index * flagSize);
        const yPosition = layoutInfo.centerY - (flagSize / 2); // Centrar verticalmente

        return (
          <image
            key={index}
            href={`/assets/flags/${flagKey}-${flagName}.svg`}
            x={xPosition}
            y={yPosition}
            width={flagSize} // Usar flagSize directamente
            height={flagSize} // Usar flagSize directamente
            preserveAspectRatio="xMidYMid meet"
            // style={{ filter }} // Filtro eliminado
            aria-label={`Bandera ${flagName}`}
            data-flag-key={flagKey}
            data-flag-name={flagName}
          />
        );
      })}
    </g>
  );
};
