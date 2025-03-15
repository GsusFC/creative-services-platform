'use client';

import { useMemo } from 'react';

interface HaikuFlagsProps {
  haiku: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  backgroundColor: string;
}

// Función para calcular la disposición de las banderas
const calculateLayout = (haiku: string) => {
  // Eliminar caracteres no válidos y convertir a mayúsculas
  const validChars = haiku.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  
  // Dividir el haiku en líneas (si contiene saltos de línea)
  // const haikuLines = validChars.split('\n'); // No usado por ahora
  
  // Determinar el número total de caracteres válidos (excluyendo espacios)
  const totalChars = validChars.replace(/\s/g, '').length;
  
  // Tamaño base para las banderas
  const baseFlagSize = 100;
  
  // Ajustar el tamaño de las banderas según la cantidad de caracteres
  let adjustedFlagSize = baseFlagSize;
  if (totalChars > 30) {
    adjustedFlagSize = Math.max(50, baseFlagSize - (totalChars - 30) * 1.5);
  }
  
  // Calcular el espacio entre banderas
  const flagSpacing = adjustedFlagSize * 0.05;
  
  // Determinar la disposición de las banderas (espiral, flujo orgánico, etc.)
  // Para este ejemplo, usaremos una disposición en espiral
  
  return {
    validChars,
    adjustedFlagSize,
    flagSpacing,
    totalChars
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

// Función para generar coordenadas centradas con palabras agrupadas sin efectos
const generateWaveCoordinates = (
  totalFlags: number,
  canvasSize: number = 1000,
  flagSize: number = 100,
  haiku: string
) => {
  const coordinates: { x: number; y: number }[] = [];
  
  // Dividir el haiku en palabras
  const words = haiku.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/);
  
  // Calcular el número total de caracteres (para verificación)
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  
  // Calcular el número total de palabras
  const totalWords = words.length;
  
  // Calcular el número aproximado de palabras por línea
  const wordsPerLine = Math.ceil(Math.sqrt(totalWords));
  
  // Verificar que el número total de caracteres coincide con totalFlags
  if (totalChars !== totalFlags) {
    console.warn('El número de caracteres no coincide con el total de banderas');
  }
  
  // Calcular el ancho total que ocuparán las palabras
  const totalWidth = wordsPerLine * (flagSize * 1.5);
  // Calcular el alto total que ocuparán las palabras
  const totalHeight = Math.ceil(totalWords / wordsPerLine) * (flagSize * 1.2);
  
  // Calcular las coordenadas de inicio para centrar el conjunto
  const startX = (canvasSize - totalWidth) / 2;
  const startY = (canvasSize - totalHeight) / 2;
  
  // Índice del carácter actual
  let charIndex = 0;
  
  // Recorrer cada palabra
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];
    const row = Math.floor(wordIndex / wordsPerLine);
    const col = wordIndex % wordsPerLine;
    
    // Posición base para la palabra (centrada, sin efectos)
    const wordX = startX + col * (flagSize * 1.5);
    const baseY = startY + row * (flagSize * 1.2);
    
    // Posicionar cada carácter de la palabra (sin espacios entre ellos)
    for (let charPos = 0; charPos < word.length; charPos++) {
      coordinates[charIndex] = {
        x: wordX + charPos * (flagSize * 0.8), // Caracteres juntos dentro de la palabra
        y: baseY
      };
      charIndex++;
    }
  }
  
  return coordinates;
};

export const HaikuFlags = ({ haiku, svgRef, backgroundColor }: HaikuFlagsProps) => {
  // Calcular la disposición de las banderas
  const layoutInfo = useMemo(() => calculateLayout(haiku), [haiku]);
  
  // Generar las coordenadas para las banderas
  const flagCoordinates = useMemo(() => {
    const chars = layoutInfo.validChars.replace(/\s/g, '');
    return generateWaveCoordinates(chars.length, 1000, layoutInfo.adjustedFlagSize, haiku);
  }, [layoutInfo, haiku]);
  
  // Renderizar las banderas
  const renderFlags = () => {
    const result = [];
    const chars = layoutInfo.validChars.replace(/\s/g, '');
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const { x, y } = flagCoordinates[i];
      
      // Determinar la clave y nombre de la bandera
      const flagKey = char;
      let flagName = '';
      
      // Asignar nombres a las banderas según el código internacional
      switch (char) {
        case 'A': flagName = 'ALPHA'; break;
        case 'B': flagName = 'BRAVO'; break;
        case 'C': flagName = 'CHARLIE'; break;
        case 'D': flagName = 'DELTA'; break;
        case 'E': flagName = 'ECHO'; break;
        case 'F': flagName = 'FOXTROT'; break;
        case 'G': flagName = 'GOLF'; break;
        case 'H': flagName = 'HOTEL'; break;
        case 'I': flagName = 'INDIA'; break;
        case 'J': flagName = 'JULIET'; break;
        case 'K': flagName = 'KILO'; break;
        case 'L': flagName = 'LIMA'; break;
        case 'M': flagName = 'MIKE'; break;
        case 'N': flagName = 'NOVEMBER'; break;
        case 'O': flagName = 'OSCAR'; break;
        case 'P': flagName = 'PAPA'; break;
        case 'Q': flagName = 'QUEBEC'; break;
        case 'R': flagName = 'ROMEO'; break;
        case 'S': flagName = 'SIERRA'; break;
        case 'T': flagName = 'TANGO'; break;
        case 'U': flagName = 'UNIFORM'; break;
        case 'V': flagName = 'VICTOR'; break;
        case 'W': flagName = 'WHISKEY'; break;
        case 'X': flagName = 'XRAY'; break;
        case 'Y': flagName = 'YANKEE'; break;
        case 'Z': flagName = 'ZULU'; break;
        case '0': flagName = 'ZERO'; break;
        case '1': flagName = 'ONE'; break;
        case '2': flagName = 'TWO'; break;
        case '3': flagName = 'THREE'; break;
        case '4': flagName = 'FOUR'; break;
        case '5': flagName = 'FIVE'; break;
        case '6': flagName = 'SIX'; break;
        case '7': flagName = 'SEVEN'; break;
        case '8': flagName = 'EIGHT'; break;
        case '9': flagName = 'NINE'; break;
        default: continue; // Saltar caracteres no válidos
      }
      
      // Añadir la bandera al resultado
      result.push(
        <image
          key={i}
          href={`/assets/flags/${flagKey}-${flagName}.svg`}
          x={x}
          y={y}
          width={layoutInfo.adjustedFlagSize}
          height={layoutInfo.adjustedFlagSize}
          preserveAspectRatio="xMidYMid meet"
          aria-label={`Bandera ${flagName}`}
          data-flag-key={flagKey}
          data-flag-name={flagName}
        />
      );
    }
    
    return result;
  };
  
  // Renderizar el texto del haiku de forma simple
  const renderHaikuText = () => {
    // El texto completo del haiku se muestra en una línea recta en la parte inferior
    
    return (
      <text
        x="500"
        y="950"
        textAnchor="middle"
        className="text-xs fill-white opacity-40"
      >
        {haiku.replace(/\n/g, ' / ')}
      </text>
    );
  };
  
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
      {/* Área de respeto */}
      <rect 
        x="200" 
        y="200" 
        width="600" 
        height="600" 
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
