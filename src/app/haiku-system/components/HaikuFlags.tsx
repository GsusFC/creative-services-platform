'use client';

import { useMemo, useCallback } from 'react';

interface HaikuFlagsProps {
  haiku: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  backgroundColor: string;
}

interface LayoutInfo {
  adjustedFlagSize: number;
  totalFlags: number;
  coordinates: { x: number; y: number }[];
  validChars: string;
}

/**
 * Información de una bandera individual
 */
interface FlagInfo {
  key: string;
  name: string;
  x: number;
  y: number;
}

/**
 * Determina si un color es claro u oscuro basado en su luminancia
 * @param hexColor - Color en formato hexadecimal (con o sin #)
 * @returns true si el color es claro, false si es oscuro
 */
const isLightColor = (hexColor: string): boolean => {
  // Eliminar el # si existe
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor;
  
  // Convertir a RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calcular la luminosidad percibida
  // Fórmula: (0.299*R + 0.587*G + 0.114*B) / 255
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminancia es mayor a 0.5, se considera un color claro
  return luminance > 0.5;
}

/**
 * Procesa el texto del haiku y extrae información básica
 * @param haiku - Texto del haiku
 * @returns Objeto con información procesada del haiku
 */
const processHaikuText = (haiku: string) => {
  // Eliminar caracteres no válidos y convertir a mayúsculas
  const validChars = haiku.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  
  // Dividir el haiku en líneas (versos)
  const lines = haiku.split('\n');
  
  // Encontrar el verso más largo (en número de caracteres sin espacios)
  const longestLineLength = Math.max(...lines.map(line => 
    line.toUpperCase().replace(/[^A-Z0-9]/g, '').length
  ));
  
  // Calcular el número de palabras en el verso más largo
  const wordsInLongestLine = Math.max(...lines.map(line => 
    line.split(/\s+/).length
  ));
  
  // Determinar el número total de caracteres válidos (excluyendo espacios)
  const totalChars = validChars.replace(/\s/g, '').length;
  
  return {
    validChars,
    lines,
    longestLineLength,
    wordsInLongestLine,
    totalChars
  };
};

/**
 * Calcula el tamaño óptimo de las banderas basado en las dimensiones del haiku
 * @param longestLineLength - Longitud de la línea más larga
 * @param wordsInLongestLine - Número de palabras en la línea más larga
 * @returns Tamaño ajustado de la bandera
 */
const calculateOptimalFlagSize = (longestLineLength: number, wordsInLongestLine: number): number => {
  // Definir el margen de seguridad (15% del canvas para mantener un margen más contenido)
  const safetyMargin = 150; // 15% de 1000px
  
  // Calcular el espacio disponible para las banderas
  const availableWidth = 1000 - (safetyMargin * 2);
  
  // Calcular el tamaño máximo de bandera que permitiría que el verso más largo quepa
  const maxFlagSizeByWidth = availableWidth / (
    (longestLineLength * 0.8) + ((wordsInLongestLine - 1) * 0.7)
  );
  
  // Limitar el tamaño de la bandera entre 35px y 90px para mantener un tamaño proporcionado
  const adjustedFlagSize = Math.min(90, Math.max(35, maxFlagSizeByWidth));
  
  // Redondear a un número entero para evitar problemas de renderizado
  return Math.floor(adjustedFlagSize);
};

/**
 * Función principal para calcular la disposición de las banderas
 * @param haiku - Texto del haiku
 * @returns Objeto con la información del layout
 */
const calculateLayout = (haiku: string): LayoutInfo => {
  // Procesar el texto del haiku
  const { validChars, longestLineLength, wordsInLongestLine, totalChars } = processHaikuText(haiku);
  
  // Calcular el tamaño óptimo de las banderas
  const adjustedFlagSize = calculateOptimalFlagSize(longestLineLength, wordsInLongestLine);
  
  // Generar las coordenadas para cada bandera
  const coordinates = generateWaveCoordinates(totalChars, 1000, adjustedFlagSize, haiku);
  
  return {
    adjustedFlagSize,
    totalFlags: totalChars,
    coordinates,
    validChars
  };
};

// Función para generar coordenadas en espiral (alternativa a la disposición en onda)
// Actualmente no se usa, pero se mantiene como referencia para futuras implementaciones
/*
const generateSpiralCoordinates = (
  totalFlags: number, 
  canvasSize: number = 1000, 
  flagSize: number = 100
) => {
  const coordinates: { x: number; y: number }[] = [];
  const center = canvasSize / 2;
  const maxRadius = (canvasSize / 2) * 0.8; // 80% del radio máximo para dejar margen
  
  // Parámetros de la espiral
  const a = maxRadius / (totalFlags * 0.5); // Factor de expansión
  const b = 0.4; // Densidad de la espiral
  
  for (let i = 0; i < totalFlags; i++) {
    // Ecuación paramétrica de la espiral
    const angle = b * i;
    const radius = a * angle;
    
    // Convertir coordenadas polares a cartesianas
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    
    coordinates.push({ x, y });
  }
  
  return coordinates;
};
*/

/**
 * Calcula el ancho total que ocupará una línea de texto
 * @param wordsInLine - Array de palabras en la línea
 * @param flagSize - Tamaño de la bandera
 * @returns Ancho total de la línea en píxeles
 */
const calculateLineWidth = (wordsInLine: string[], flagSize: number): number => {
  return wordsInLine.reduce((width, word, wordIndex) => {
    // Ancho de la palabra actual sin espacio entre caracteres
    const wordWidth = word.length * flagSize;
    // Añadir espacio entre palabras (excepto para la primera palabra)
    return width + wordWidth + (wordIndex > 0 ? flagSize * 0.5 : 0);
  }, 0);
};

/**
 * Calcula las coordenadas Y para cada línea del haiku
 * @param totalLines - Número total de líneas
 * @param flagSize - Tamaño de la bandera
 * @param canvasSize - Tamaño del canvas
 * @returns Array con las posiciones Y de cada línea
 */
const calculateLineYPositions = (totalLines: number, flagSize: number, canvasSize: number): number[] => {
  const lineSpacing = flagSize * 1.8; // Aumentar el espacio entre versos para un mejor efecto visual
  const totalHeight = totalLines * lineSpacing;
  // Calcular la posición Y inicial para centrar verticalmente
  const startY = (canvasSize - totalHeight) / 2 + flagSize * 0.3; // Ajustar ligeramente hacia abajo
  
  // Generar un array con las posiciones Y de cada línea
  return Array.from({ length: totalLines }, (_, index) => startY + index * lineSpacing);
};

/**
 * Función para generar coordenadas centradas con palabras agrupadas sin efectos
 * @param totalFlags - Número total de banderas a generar
 * @param canvasSize - Tamaño del canvas (ancho y alto)
 * @param flagSize - Tamaño de cada bandera
 * @param haiku - Texto del haiku
 * @returns Array de coordenadas para cada bandera
 */
const generateWaveCoordinates = (
  totalFlags: number,
  canvasSize: number = 1000,
  flagSize: number = 100,
  haiku: string
): { x: number; y: number }[] => {
  const coordinates: { x: number; y: number }[] = [];
  
  // Dividir el haiku en líneas (versos)
  const lines = haiku.split('\n');
  
  // Dividir cada línea en palabras y aplanar el array
  const wordsByLine = lines.map(line => 
    line.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/)
  );
  
  // Calcular el número total de caracteres (para verificación)
  const totalChars = wordsByLine.flat().reduce((sum, word) => sum + word.length, 0);
  
  // Verificar que el número total de caracteres coincide con totalFlags
  if (totalChars !== totalFlags) {
    console.warn('El número de caracteres no coincide con el total de banderas');
  }
  
  // Calcular las posiciones Y para cada línea
  const lineYPositions = calculateLineYPositions(wordsByLine.length, flagSize, canvasSize);
  
  // Índice del carácter actual
  let charIndex = 0;
  
  // Recorrer cada línea (verso)
  for (let lineIndex = 0; lineIndex < wordsByLine.length; lineIndex++) {
    const wordsInLine = wordsByLine[lineIndex];
    
    // Calcular el ancho total que ocupará esta línea
    const lineWidth = calculateLineWidth(wordsInLine, flagSize);
    
    // Calcular la posición inicial X para centrar la línea
    const lineStartX = (canvasSize - lineWidth) / 2;
    
    // Posición Y para esta línea
    const lineY = lineYPositions[lineIndex];
    
    // Posición X actual para esta línea
    let currentX = lineStartX;
    
    // Recorrer cada palabra en la línea
    for (let wordIndex = 0; wordIndex < wordsInLine.length; wordIndex++) {
      const word = wordsInLine[wordIndex];
      
      // Añadir espacio entre palabras (excepto para la primera palabra)
      if (wordIndex > 0) {
        currentX += flagSize * 0.5; // Reducir el espacio entre palabras para un aspecto más compacto
      }
      
      // Posicionar cada carácter de la palabra sin ningún espacio entre ellos
      for (let charPos = 0; charPos < word.length; charPos++) {
        coordinates[charIndex] = {
          x: currentX + charPos * flagSize, // Sin espacio entre caracteres
          y: lineY
        };
        charIndex++;
      }
      
      // Actualizar la posición X para la siguiente palabra
      currentX += word.length * flagSize;
    }
  }
  
  return coordinates;
};

/**
 * Obtiene el nombre de la bandera según el código internacional
 * @param char - Carácter para el que se busca el nombre de la bandera
 * @returns Nombre de la bandera o cadena vacía si no es válido
 */
const getFlagName = (char: string): string => {
  const flagNames: Record<string, string> = {
    'A': 'ALPHA', 'B': 'BRAVO', 'C': 'CHARLIE', 'D': 'DELTA', 'E': 'ECHO',
    'F': 'FOXTROT', 'G': 'GOLF', 'H': 'HOTEL', 'I': 'INDIA', 'J': 'JULIET',
    'K': 'KILO', 'L': 'LIMA', 'M': 'MIKE', 'N': 'NOVEMBER', 'O': 'OSCAR',
    'P': 'PAPA', 'Q': 'QUEBEC', 'R': 'ROMEO', 'S': 'SIERRA', 'T': 'TANGO',
    'U': 'UNIFORM', 'V': 'VICTOR', 'W': 'WHISKY', 'X': 'XRAY', 'Y': 'YANKEE',
    'Z': 'ZULU', '0': 'ZERO', '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR',
    '5': 'FIVE', '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE'
  };
  
  return flagNames[char] || '';
};

/**
 * Genera la información de las banderas a partir del texto del haiku
 * @param chars - Caracteres válidos del haiku
 * @param coordinates - Coordenadas para cada bandera
 * @returns Array de información de banderas
 */
const generateFlagsInfo = (chars: string, coordinates: { x: number; y: number }[]): FlagInfo[] => {
  const result: FlagInfo[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const flagName = getFlagName(char);
    
    // Saltar caracteres no válidos
    if (!flagName) continue;
    
    result.push({
      key: char,
      name: flagName,
      x: coordinates[i].x,
      y: coordinates[i].y
    });
  }
  
  return result;
};

/**
 * Renderiza una bandera individual
 * @param flag - Información de la bandera
 * @param index - Índice de la bandera
 * @param flagSize - Tamaño de la bandera
 * @returns Elemento JSX de la bandera
 */
const renderFlag = (flag: FlagInfo, index: number, flagSize: number) => {
  return (
    <image
      key={index}
      href={`/assets/flags/${flag.key}-${flag.name}.svg`}
      x={flag.x}
      y={flag.y}
      width={flagSize}
      height={flagSize * 1.1}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Bandera ${flag.name}`}
      data-flag-key={flag.key}
      data-flag-name={flag.name}
    />
  );
};

/**
 * Componente principal para renderizar las banderas de señales marítimas
 */
export const HaikuFlags = ({ haiku, svgRef, backgroundColor }: HaikuFlagsProps) => {
  // Calcular la disposición de las banderas
  const layoutInfo = useMemo(() => calculateLayout(haiku), [haiku]);
  
  // Generar las coordenadas para las banderas
  const flagCoordinates = useMemo(() => {
    const chars = layoutInfo.validChars.replace(/\s/g, '');
    // Usar el tamaño ajustado de banderas basado en el verso más largo
    return generateWaveCoordinates(chars.length, 1000, layoutInfo.adjustedFlagSize, haiku);
  }, [layoutInfo, haiku]);
  
  // Generar la información de las banderas
  const flags = useMemo(() => {
    const chars = layoutInfo.validChars.replace(/\s/g, '');
    return generateFlagsInfo(chars, flagCoordinates);
  }, [layoutInfo.validChars, flagCoordinates]);
  
  // Renderizar las banderas
  const renderFlags = useCallback(() => {
    return flags.map((flag, index) => 
      renderFlag(flag, index, layoutInfo.adjustedFlagSize)
    );
  }, [flags, layoutInfo.adjustedFlagSize]);
  
  // Renderizar el texto del haiku
  const renderHaikuText = useCallback(() => {
    // Determinar el color del texto basado en el color de fondo
    const textColor = isLightColor(backgroundColor) ? 'fill-black' : 'fill-white';
    
    return (
      <text
        x="500"
        y="950"
        textAnchor="middle"
        className={`text-xs ${textColor} opacity-40`}
      >
        {haiku.replace(/\n/g, ' / ')}
      </text>
    );
  }, [haiku, backgroundColor]);
  
  return (
    <svg 
      width="1000" 
      height="1000" 
      viewBox="0 0 1000 1000" 
      className="w-full h-full"
      ref={svgRef}
      aria-label={`Representación en banderas náuticas del haiku: ${haiku}`}
      style={{ backgroundColor }}
    >
      {/* Área de respeto con margen más contenido */}
      <rect 
        x="150" 
        y="150" 
        width="700" 
        height="700" 
        fill="transparent" 
        stroke="transparent" 
        strokeWidth="0"
      />
      
      {/* Grupo de banderas */}
      <g>
        {renderFlags()}
      </g>
      
      {/* Texto del haiku */}
      {renderHaikuText()}
    </svg>
  );
};
