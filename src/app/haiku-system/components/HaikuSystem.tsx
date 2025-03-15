'use client';

import { useState, useRef, useEffect } from 'react';
import { HaikuFlags } from './HaikuFlags';
import { ExportOptions } from './ExportOptions';

// Función para generar un haiku aleatorio
const generateRandomHaiku = (): string => {
  const haikus = [
    "old pond\nfrog leaps in\nwater's sound",
    "autumn moonlight\na worm digs silently\ninto the chestnut",
    "in the twilight rain\nthese brilliant-hued hibiscus\na lovely sunset",
    "the first cold shower\neven the monkey seems to want\na little coat of straw",
    "over the wintry\nforest winds howl in rage\nwith no leaves to blow",
    "temple bells die out\na distant bell grows bright\nthe scent of flowers",
    "the light of a candle\nis transferred to another candle\nspring twilight",
    "a world of dew\nand within every dewdrop\na world of struggle",
    "lightning flash\nwhat I thought were faces\nare plumes of pampas grass",
    "the wind of Mt Fuji\nI've brought on my fan\na gift from Edo"
  ];
  return haikus[Math.floor(Math.random() * haikus.length)];
};

// Función para formatear el haiku para visualización
const formatHaikuForDisplay = (haiku: string): string => {
  // Reemplazar saltos de línea con espacios para la visualización en banderas
  return haiku.replace(/\n/g, ' ');
};

export const HaikuSystem = () => {
  const [haiku, setHaiku] = useState('');
  const [error, setError] = useState('');
  const [haikuHistory, setHaikuHistory] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Función para manejar cambios en el textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setHaiku(value);
    setError('');
  };

  // Función para cambiar el color de fondo aleatoriamente
  const handleRandomBackground = () => {
    // Generar un color oscuro para mantener el contraste con las banderas
    const color = `#${Math.floor(Math.random() * 0x777777).toString(16).padStart(6, '0')}`;
    setBackgroundColor(color);
  };

  // Añadir haiku al historial cuando cambia
  useEffect(() => {
    if (haiku && !haikuHistory.includes(haiku)) {
      setHaikuHistory(prev => [haiku, ...prev].slice(0, 8));
    }
  }, [haiku, haikuHistory]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-white text-center mb-8">HAIKU FLAG SYSTEM</h1>
      
      {/* Layout principal de dos columnas usando CSS Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8"
        style={{
          '--grid-gap': 'var(--spacing-md)',
          '--grid-gap-md': 'var(--spacing-lg)'
        } as React.CSSProperties}
      >
        {/* Área de visualización de banderas */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div 
            className="w-full aspect-square max-w-[1000px]"
            style={{ backgroundColor: 'transparent' }}
          >
            {haiku && !error && (
              <HaikuFlags 
                haiku={formatHaikuForDisplay(haiku)} 
                svgRef={svgRef}
                backgroundColor={backgroundColor}
              />
            )}
          </div>
        </div>
        
        {/* Panel de control */}
        <div 
          className="flex flex-col gap-6 p-6 shadow-md backdrop-blur-sm"
          style={{ 
            backgroundColor: '#000000', 
            gap: 'var(--spacing-md)'
          }}
        >
          {/* Campo de texto para el haiku */}
          <div className="flex flex-col gap-3">
            <textarea
              id="haiku-input"
              value={haiku}
              onChange={handleInputChange}
              placeholder="Enter your haiku here..."
              className="w-full h-32 px-4 py-2 bg-black text-white border focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
              style={{ borderColor: '#00FF00' }}
              aria-label="Enter your haiku to convert into nautical flags"
            />
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                const randomHaiku = generateRandomHaiku();
                setHaiku(randomHaiku);
              }}
              className="flex-1 whitespace-nowrap px-3 py-2 text-black transition-colors hover:text-white"
              style={{ backgroundColor: '#00FF00', borderColor: '#00FF00' }}
              title="Generate random haiku"
            >
              RANDOM HAIKU
            </button>
            
            <button
              onClick={handleRandomBackground}
              className="flex-1 whitespace-nowrap px-3 py-2 text-white transition-colors bg-black hover:bg-gray-900 border"
              style={{ borderColor: '#00FF00' }}
              title="Change background color randomly"
            >
              RANDOM BG
            </button>
          </div>
          
          {/* Opciones de exportación */}
          {haiku && !error && (
            <div className="mt-4">
              <ExportOptions svgRef={svgRef} haiku={haiku} />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}
          
          {/* Historial de haikus */}
          {haikuHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-white text-sm font-semibold mb-2">Haiku History:</h3>
              <div className="flex flex-col gap-2">
                {haikuHistory.map((historyHaiku, index) => (
                  <button
                    key={`${index}`}
                    onClick={() => setHaiku(historyHaiku)}
                    className="px-2 py-1 text-xs text-white bg-black rounded hover:bg-gray-900 transition-colors border border-gray-800 text-left"
                    title={`Use this haiku`}
                  >
                    {historyHaiku.length > 40 ? historyHaiku.substring(0, 40) + '...' : historyHaiku}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
