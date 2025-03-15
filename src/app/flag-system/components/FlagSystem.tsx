'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { NauticalFlags } from './NauticalFlags';
import { ExportOptions } from './ExportOptions';

// Definir los tipos de esquemas de color disponibles
type ColorScheme = 'original' | 'random' | string;

// Definición de tipos simplificada

// Función para generar una palabra aleatoria
const generateRandomWord = (): string => {
  const words = [
    // Palabras comunes en inglés
    'HELLO', 'WORLD', 'LOVE', 'TIME', 'LIFE', 'WORK', 'PLAY', 'GOOD', 'BEST',
    'HAPPY', 'SMILE', 'DREAM', 'HOPE', 'PEACE', 'FAITH', 'TRUTH', 'POWER',
    'LIGHT', 'MUSIC', 'DANCE', 'BOOK', 'FILM', 'FOOD', 'WATER', 'EARTH',
    'SPACE', 'STAR', 'MOON', 'SUN', 'WIND', 'RAIN', 'SNOW', 'TREE', 'BIRD',
    'MIND', 'SOUL', 'HEART', 'BRAIN', 'IDEA', 'THINK', 'LEARN', 'TEACH',
    'BUILD', 'MAKE', 'CODE', 'DATA', 'TECH', 'GAME', 'TEAM', 'LEAD', 'GROW',
    // Algunas palabras cortas (2-3 letras)
    'OK', 'GO', 'HI', 'NO', 'UP', 'ON', 'IN', 'OUT', 'YES', 'NOW', 'NEW', 'OLD',
    'BIG', 'TOP', 'END', 'WAY', 'DAY', 'ONE', 'TWO', 'SIX', 'TEN', 'RED', 'SKY'
  ];
  return words[Math.floor(Math.random() * words.length)];
};

export const FlagSystem = () => {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  // Esquema de color fijo en 'original'
  const colorScheme: ColorScheme = 'original';
  // Estado para el color de fondo
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  // Historial de palabras generadas
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Handle input change - memoizado con useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    
    // Check if input contains spaces
    if (value.includes(' ')) {
      setError('Por favor, introduce una única palabra sin espacios');
    } else {
      setError('');
    }
    
    setWord(value);
  }, []);
  
  // Función para añadir una palabra al historial
  const addToHistory = useCallback((newWord: string) => {
    if (newWord && !error) {
      setWordHistory(prev => {
        // Evitar duplicados consecutivos
        if (prev.length > 0 && prev[0] === newWord) {
          return prev;
        }
        // Mantener solo las últimas 10 palabras
        return [newWord, ...prev].slice(0, 10);
      });
    }
  }, [error]);
  
  // Función para cambiar el color de fondo de forma aleatoria
  const handleRandomBackground = useCallback(() => {
    const backgrounds = [
      // RGB
      '#FF0000', // Rojo
      '#00FF00', // Verde
      '#0000FF', // Azul
      // Blanco y Negro
      '#FFFFFF', // Blanco
      '#000000', // Negro
    ];
    
    // Seleccionar un color aleatorio diferente al actual
    let newColor;
    do {
      newColor = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    } while (newColor === backgroundColor);
    
    setBackgroundColor(newColor);
  }, [backgroundColor]);
  
  // Efecto para añadir palabras al historial cuando cambian
  useEffect(() => {
    if (word) {
      addToHistory(word);
    }
  }, [word, addToHistory]);

  // Se ha eliminado el sistema de cambio de esquema de color

  // Calculate flag size based on word length - memoizado con useMemo
  const calculateFlagSize = useMemo(() => {
    return (wordLength: number): number => {
      // Canvas is 1000x1000px with 20% margin on each side
      // Available space is 600px (60% of width)
      const availableWidth = 600;
      
      // Las banderas siempre ocuparán todo el espacio disponible
      // Si es una sola letra, ocupará casi todo el espacio
      if (wordLength === 1) {
        return availableWidth * 0.9; // 90% del espacio disponible para una sola letra
      }
      
      // Para cualquier número de letras, distribuir uniformemente en el espacio disponible
      // con un pequeño margen (5%) para que no toque los bordes
      return (availableWidth * 0.95) / wordLength;
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-white text-center mb-8">NAUTICAL FLAG SYSTEM</h1>
      
      {/* Layout principal de dos columnas usando CSS Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8"
        style={{
          '--grid-gap': 'var(--spacing-md)',
          '--grid-gap-md': 'var(--spacing-lg)'
        } as React.CSSProperties}
      >
        {/* Columna izquierda (2/3): Canvas principal */}
        <div className="md:col-span-2 flex flex-col items-center">
          {/* SVG Canvas con proporción 1:1 */}
          <div 
            className="w-full aspect-square max-w-[1000px]"
            style={{ 
              backgroundColor: 'transparent'
            }}
          >
            <svg
              ref={svgRef}
              width="1000"
              height="1000"
              viewBox="0 0 1000 1000"
              className="w-full h-full"
              style={{ backgroundColor }}
              aria-label={`Representación en banderas náuticas de la palabra ${word}`}
            >
              {/* Zona de respeto (20% de margen) - completamente transparente */}
              <rect
                x="200"
                y="200"
                width="600"
                height="600"
                fill="transparent"
                stroke="transparent"
                strokeWidth="0"
              />

              {/* Render flags */}
              {word && !error && (
                <NauticalFlags
                  word={word}
                  flagSize={calculateFlagSize(word.length)}
                  colorScheme={colorScheme}
                />
              )}
            </svg>
          </div>
        </div>
        
        {/* Columna derecha (1/3): Panel de controles */}
        <div 
          className="flex flex-col gap-6 p-6 shadow-md backdrop-blur-sm"
          style={{ 
            backgroundColor: '#000000', 
            gap: 'var(--spacing-md)'
          }}
        >
          {/* Se ha eliminado el selector de esquema de color */}
          
          {/* Campo de texto */}
          <div className="flex flex-col gap-3">
            <input
              id="flag-input"
              type="text"
              value={word}
              onChange={handleInputChange}
              placeholder="Enter a word"
              className="w-full px-4 py-2 bg-black text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ borderColor: '#00FF00' }}
              aria-label="Enter a word to convert into nautical flags"
            />
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                const randomWord = generateRandomWord();
                setWord(randomWord);
              }}
              className="flex-1 whitespace-nowrap px-3 py-2 text-black transition-colors hover:text-white" style={{ backgroundColor: '#00FF00', borderColor: '#00FF00' }}
              title="Generate random word"
            >
              RANDOM
            </button>
            
            <button
              onClick={handleRandomBackground}
              className="flex-1 whitespace-nowrap px-3 py-2 text-white transition-colors bg-black hover:bg-gray-900 border" style={{ borderColor: '#00FF00' }}
              title="Change background color randomly"
            >
              RANDOM BG
            </button>
          </div>
          
          {/* Opciones de exportación */}
          {word && !error && (
            <div className="mt-4">
              <ExportOptions svgRef={svgRef} word={word} />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}
          
          {/* Historial de palabras */}
          {wordHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-white text-sm font-semibold mb-2">Word History:</h3>
              <div className="flex flex-wrap gap-2">
                {wordHistory.map((historyWord, index) => (
                  <button
                    key={`${historyWord}-${index}`}
                    onClick={() => setWord(historyWord)}
                    className="px-2 py-1 text-xs text-white bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                    title={`Use ${historyWord}`}
                  >
                    {historyWord}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Se ha eliminado el panel de referencias de banderas */}
    </div>
  );
};
