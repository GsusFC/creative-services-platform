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
  
  // Definir el margen de seguridad (20% del canvas)
  const safetyMargin = 200; // 20% de 1000px
  
  // Calcular el espacio disponible para las banderas
  const availableWidth = 1000 - (safetyMargin * 2);
  
  // Calcular el tamaño máximo de bandera que permitiría que el verso más largo quepa
  // Consideramos que cada carácter ocupa 0.8 veces el tamaño de la bandera
  // y que necesitamos espacio entre palabras (0.7 veces el tamaño de la bandera)
  const maxFlagSizeByWidth = availableWidth / (
    (longestLineLength * 0.8) + ((wordsInLongestLine - 1) * 0.7)
  );
  
  // Limitar el tamaño de la bandera entre 40px y 100px
  let adjustedFlagSize = Math.min(100, Math.max(40, maxFlagSizeByWidth));
  
  // Redondear a un número entero para evitar problemas de renderizado
  adjustedFlagSize = Math.floor(adjustedFlagSize);
  
  // Calcular el espacio entre banderas
  const flagSpacing = adjustedFlagSize * 0.05;
  
  return {
    validChars,
    adjustedFlagSize,
    flagSpacing,
    totalChars,
    longestLineLength,
    wordsInLongestLine
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
  
  // Definir el margen de seguridad (20% del canvas)
  const safetyMargin = 200; // 20% de 1000px
  
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
  
  // Índice del carácter actual
  let charIndex = 0;
  
  // Recorrer cada línea (verso)
  for (let lineIndex = 0; lineIndex < wordsByLine.length; lineIndex++) {
    const wordsInLine = wordsByLine[lineIndex];
    
    // Calcular el ancho total que ocupará esta línea
    const lineWidth = wordsInLine.reduce((width, word, wordIndex) => {
      // Ancho de la palabra actual
      const wordWidth = word.length * (flagSize * 0.8);
      // Añadir espacio entre palabras (excepto para la primera palabra)
      return width + wordWidth + (wordIndex > 0 ? flagSize * 0.7 : 0);
    }, 0);
    
    // Calcular la posición inicial X para centrar la línea
    const lineStartX = (canvasSize - lineWidth) / 2;
    
    // Calcular la posición Y para esta línea
    const lineY = safetyMargin + lineIndex * (flagSize * 1.5);
    
    // Posición X actual para esta línea
    let currentX = lineStartX;
    
    // Recorrer cada palabra en la línea
    for (let wordIndex = 0; wordIndex < wordsInLine.length; wordIndex++) {
      const word = wordsInLine[wordIndex];
      
      // Añadir espacio entre palabras (excepto para la primera palabra)
      if (wordIndex > 0) {
        currentX += flagSize * 0.7; // Espacio entre palabras
      }
      
      // Posicionar cada carácter de la palabra (sin espacios entre ellos)
      for (let charPos = 0; charPos < word.length; charPos++) {
        coordinates[charIndex] = {
          x: currentX + charPos * (flagSize * 0.8), // Caracteres juntos dentro de la palabra
          y: lineY
        };
        charIndex++;
      }
      
      // Actualizar la posición X para la siguiente palabra
      currentX += word.length * (flagSize * 0.8);
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
    // Usar el tamaño ajustado de banderas basado en el verso más largo
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
