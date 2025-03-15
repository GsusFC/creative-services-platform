'use client';

import { useMemo } from 'react';

interface NauticalFlagsProps {
  word: string;
  flagSize: number;
  colorScheme: string;
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

export const NauticalFlags = ({ word, flagSize, colorScheme }: NauticalFlagsProps) => {
  // Memoizamos la función para aplicar filtros según el esquema de color seleccionado
  // Memoizamos solo cuando cambia el esquema de color
  const getFilterForScheme = useMemo(() => {
    return (letter: string, _index: number): string => {
      if (colorScheme === 'original') {
        return '';
      } else if (colorScheme === 'random' || colorScheme.startsWith('scheme-')) {
        // Para esquemas aleatorios o guardados
        // Generamos un valor de rotación basado en la letra y un valor semilla
        // Si es un esquema guardado, extraemos el seed del ID (scheme-{timestamp}-{seed})
        let seedValue = 0;
        
        if (colorScheme.startsWith('scheme-')) {
          // Extraer el valor semilla del ID del esquema (formato: scheme-{seed}-{timestamp})
          const schemeId = colorScheme.split('-');
          if (schemeId.length >= 3) {
            seedValue = parseInt(schemeId[1]);
          }
        }
        
        // Calculamos la rotación de tono basada en la letra y el seed
        const letterValue = letter.charCodeAt(0) - 65;
        const hueRotation = (letterValue * 14 + seedValue) % 360;
        
        return `hue-rotate(${hueRotation}deg) saturate(1.2)`;
      } else {
        return '';  // Valor por defecto
      }
    };
  }, [colorScheme]);

  // Definimos una interfaz para los elementos del mapa de banderas
  interface FlagItem {
    flagKey: string;
    flagName: string;
    filter: string;
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
      const filter = getFilterForScheme(flagKey, index);
      
      return {
        flagKey,
        flagName,
        filter,
        index
      } as FlagItem;
    }).filter((item): item is FlagItem => item !== null)
  }, [word, getFilterForScheme]);
  
  // Calculamos el tamaño de las banderas y la posición de inicio de manera memoizada
  const layoutInfo = useMemo(() => {
    // Implementar lógica de escalado dinámico para palabras largas
    // Si la palabra es muy larga (ocupa más del 80% del canvas), ajustamos el tamaño
    const availableWidth = 600; // 60% del canvas (descontando el 20% de margen a cada lado)
    const isLongWord = word.length > (availableWidth / flagSize) * 0.8;
    
    // Ajustar el tamaño de la bandera si la palabra es muy larga
    const adjustedFlagSize = isLongWord 
      ? Math.max(30, availableWidth / word.length) // Mínimo 30px para mantener visibilidad
      : flagSize;
    
    // Calculate total width of all flags with the adjusted size
    const totalWidth = memoizedFlagMap.length * adjustedFlagSize;
    
    // Calculate starting position to center the flags in the available space
    const startX = (1000 - totalWidth) / 2;
    const centerY = 500; // Center of the canvas
    
    return {
      adjustedFlagSize,
      startX,
      centerY
    };
  }, [word.length, flagSize, memoizedFlagMap.length]);
  
  // Renderizar las banderas directamente como elementos image
  return (
    <g>
      {memoizedFlagMap.map(({ flagKey, flagName, filter, index }) => {
        const xPosition = layoutInfo.startX + (index * layoutInfo.adjustedFlagSize);
        const yPosition = layoutInfo.centerY - (layoutInfo.adjustedFlagSize / 2);
        
        return (
          <image
            key={index}
            href={`/assets/flags/${flagKey}-${flagName}.svg`}
            x={xPosition}
            y={yPosition}
            width={layoutInfo.adjustedFlagSize}
            height={layoutInfo.adjustedFlagSize}
            preserveAspectRatio="xMidYMid meet"
            style={{ filter }}
            aria-label={`Bandera ${flagName}`}
            data-flag-key={flagKey}
            data-flag-name={flagName}
          />
        );
      })}
    </g>
  );
};
