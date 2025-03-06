'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFlagGenerator } from '@/hooks/useFlagGenerator';
import { useFlagHistory } from '@/contexts/FlagHistoryContext';
import { letterToFlag } from '@/lib/flag-system/flagMap';
import { Switch } from '../ui/switch';

// Componente para mostrar las banderas en el canvas
const FlagDisplay = ({ 
  word, 
  isGridMode, 
  backgroundColor 
}: { 
  word: string; 
  isGridMode: boolean;
  backgroundColor: string;
}) => {
  if (!word) {
    return (
      <div className="text-center p-8">
        <span className="text-white/60 font-mono text-xl block">
          Ingresa o genera una palabra para visualizar las banderas
        </span>
      </div>
    );
  }

  // Determinar tamaño de banderas según longitud de palabra
  let flagSize = "w-20 h-20";
  if (word.length > 6) {
    flagSize = "w-16 h-16";
  }
  if (word.length > 8) {
    flagSize = "w-14 h-14";
  }

  // Array de letras para mostrar
  const letters = word.split('').map(letter => letter.toUpperCase());
  
  // Renderizado según el modo
  if (isGridMode) {
    // Modo columnas: dos columnas sin espacio
    return (
      <div 
        className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
        style={{ backgroundColor }}
      >
        <div className="w-[70%] mx-auto">
          {/* Display usando flexbox + flexwrap con SVG directos */}
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '200px', margin: '0 auto' }}>
            {letters.map((letter, index) => {
              const flag = letterToFlag(letter);
              if (!flag) return null;
              
              return (
                <div 
                  key={index} 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    flexShrink: 0,
                    flexGrow: 0,
                    margin: 0, 
                    padding: 0, 
                    float: 'left'
                  }}
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
          <span className="text-white font-druk text-4xl font-bold tracking-wider">{word}</span>
        </div>
      </div>
    );
  }
  
  // Modo normal: una sola fila
  return (
    <div 
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="flex flex-row justify-center" style={{ fontSize: 0, lineHeight: 0 }}>
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
                  width: '100px', 
                  height: '100px',
                  objectFit: 'contain'
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-druk text-4xl font-bold tracking-wider">{word}</span>
      </div>
    </div>
  );
};

// Componente de historial
const HistoryPanel = () => {
  const { history, addToHistory, clearHistory } = useFlagHistory();
  const { setWord } = useFlagGenerator()[1];
  
  // Manejar clic en palabra del historial
  const handleWordClick = (word: string) => {
    setWord(word); // Establecer la palabra seleccionada en el input
  };
  
  if (history.length === 0) {
    return (
      <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
        <h3 className="font-druk text-sm text-white/80 mb-2 uppercase tracking-wide">Historial</h3>
        <p className="text-white/40 text-center py-4 font-mono text-sm">No hay palabras en el historial</p>
      </div>
    );
  }
  
  return (
    <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-druk text-sm text-white/80 uppercase tracking-wide">Historial</h3>
        <button 
          onClick={clearHistory}
          className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono px-2 py-1 bg-white/5 rounded hover:bg-white/10"
        >
          Limpiar
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((word, index) => (
          <div 
            key={index} 
            className="px-3 py-1 bg-white/10 rounded-md text-white cursor-pointer hover:bg-[#00ff00]/20 hover:border-[#00ff00]/30 transition-colors border border-transparent"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de paleta de colores
const ColorPalette = ({ onSelectColor }: { onSelectColor: (color: string) => void }) => {
  const colors = [
    { value: '#000000', label: 'Negro' },
    { value: '#ffffff', label: 'Blanco' },
    { value: '#ff0000', label: 'Rojo' },
    { value: '#0000ff', label: 'Azul' },
    { value: '#00ff00', label: 'Verde' }
  ];
  
  return (
    <div className="flex justify-between gap-2 mt-2">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => onSelectColor(color.value)}
          className="w-8 h-8 rounded-full border border-white/20 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
    </div>
  );
};

export default function FlagSystem() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [
    { word, displayWord, isGenerating, isGeneratedRandomly, maxLength, isGridMode, backgroundColor },
    { setWord, generateRandomWord, setMaxLength, exportAsSvg, toggleGridMode, changeBackgroundColor }
  ] = useFlagGenerator();
  
  const { addToHistory } = useFlagHistory();
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  // Mantener focus en el input al escribir
  useEffect(() => {
    if (word && !isGenerating && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [word, isGenerating]);
  
  // Añadir al historial cuando se genera o escribe una palabra completa
  useEffect(() => {
    if (displayWord && !isGenerating) {
      addToHistory(displayWord);
    }
  }, [displayWord, isGenerating, addToHistory]);

  // Manejar la selección directa de color
  const handleColorSelect = (color: string) => {
    setShowColorPalette(false);
    // Usar la función actualizada para establecer un color específico
    changeBackgroundColor(color);
  };

  return (
    <div className="w-full max-w-8xl flex flex-col lg:flex-row gap-8 mb-8">
      {/* Área de visualización de banderas */}
      <div className="w-full lg:w-2/3 flex justify-center" style={{maxWidth: "min(66.66%, -200px + 100vh)", opacity: 1, transform: "none"}}>
        <div className="w-full aspect-square">
          <div className="flex justify-center w-full relative">
            <div 
              style={{
                width: "1000px", 
                height: "1000px", 
                position: "relative", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                maxWidth: "100%", 
                border: "1px solid #333", 
                borderRadius: "8px", 
                overflow: "hidden", 
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                backgroundColor
              }}
              className="transition-all duration-300"
            >
              <FlagDisplay 
                word={displayWord} 
                isGridMode={isGridMode} 
                backgroundColor={backgroundColor} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel de controles */}
      <div className="w-full lg:w-1/3">
        <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex flex-col gap-5">
            {/* Opciones de visualización - ahora encima del input */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-druk text-sm text-white/80 uppercase tracking-wide">Modo visualización</h3>
              <div className="flex items-center gap-3">
                <label className="text-white text-sm">Fila</label>
                <Switch 
                  checked={isGridMode}
                  onCheckedChange={toggleGridMode}
                />
                <label className="text-white text-sm">Columnas</label>
              </div>
            </div>
            
            {/* Entrada de texto */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-druk text-white/80 uppercase tracking-wide">Crear palabra (máx {maxLength} letras)</label>
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-xl font-mono uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
                placeholder="AAA..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={generateRandomWord}
                disabled={isGenerating}
                className="px-6 py-3 bg-[#00ff00] text-black font-druk uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? 'GENERANDO...' : 'PALABRA ALEATORIA'}
              </button>
              
              <button
                onClick={() => {
                  // Usar solo colores RGB, blanco y negro
                  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
                  const randomIndex = Math.floor(Math.random() * colors.length);
                  changeBackgroundColor(colors[randomIndex]);
                }}
                className="px-6 py-3 bg-blue-500 text-white font-druk uppercase tracking-wider hover:bg-blue-600 transition-all duration-300"
              >
                ALTERNAR FONDO
              </button>
              
              <button
                disabled={!displayWord}
                onClick={exportAsSvg}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-druk uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
              >
                EXPORTAR SVG
              </button>
            </div>
            
            {/* Control de longitud */}
            <div className="w-full border-t border-white/10 pt-4">
              <label className="block mb-2 text-sm font-druk text-white/80 uppercase tracking-wide">Longitud máxima</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="10"
                  className="w-full accent-[#00ff00]"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                />
                <span className="font-druk text-xl text-white">{maxLength}</span>
              </div>
            </div>
            
            {/* Selector de color eliminado */}
          </div>
        </div>
        
        {/* Panel de historial */}
        <HistoryPanel />
      </div>
    </div>
  );
}
