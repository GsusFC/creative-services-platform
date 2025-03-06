'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFlagGenerator } from '@/hooks/useFlagGenerator';
import { useFlagHistory } from '@/contexts/FlagHistoryContext';
import { letterToFlag } from '@/lib/flag-system/flagMap';
import { Switch } from '../ui/switch';

import ClassicDisplay from './ClassicDisplay';
import GridDisplay from './GridDisplay';
import AdaptiveDisplay from './AdaptiveDisplay';

// Define los tipos de visualización disponibles
type DisplayMode = 'classic' | 'grid' | 'adaptive';

// Componente TabSelector para cambiar entre modos de visualización
const TabSelector = ({ 
  activeMode, 
  onChange 
}: { 
  activeMode: DisplayMode; 
  onChange: (mode: DisplayMode) => void;
}) => {
  return (
    <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/10 w-fit">
      <button
        onClick={() => onChange('classic')}
        className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${
          activeMode === 'classic' 
            ? 'bg-white/20 text-white' 
            : 'bg-transparent text-white/60 hover:text-white/80'
        }`}
      >
        Clásico
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${
          activeMode === 'grid' 
            ? 'bg-white/20 text-white' 
            : 'bg-transparent text-white/60 hover:text-white/80'
        }`}
      >
        Grid
      </button>
      <button
        onClick={() => onChange('adaptive')}
        className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${
          activeMode === 'adaptive' 
            ? 'bg-white/20 text-white' 
            : 'bg-transparent text-white/60 hover:text-white/80'
        }`}
      >
        Adaptativo
      </button>
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
        <h3 className="font-sans text-sm text-white/80 mb-2 uppercase tracking-wide">History</h3>
        <p className="text-white/40 text-center py-4 font-sans text-sm">No words in history</p>
      </div>
    );
  }
  
  return (
    <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-sans text-sm text-white/80 uppercase tracking-wide">History</h3>
        <button 
          onClick={clearHistory}
          className="text-xs text-white/40 hover:text-white/70 transition-colors font-sans px-2 py-1 bg-white/5 rounded hover:bg-white/10"
        >
          Clear
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((word, index) => (
          <div 
            key={index} 
            className="px-2 py-0.5 bg-white/10 rounded-md text-white text-xs cursor-pointer hover:bg-[#00ff00]/20 hover:border-[#00ff00]/30 transition-colors border border-transparent font-sans"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

// Versión móvil compacta del historial
const MobileHistoryPanel = () => {
  const { history, clearHistory } = useFlagHistory();
  const { setWord } = useFlagGenerator()[1];

  return (
    <div className="lg:hidden">
      <div className="w-full mt-3 bg-black/30 border border-white/10 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-sans text-xs text-white/80 uppercase tracking-wide">History</h3>
          <button 
            onClick={clearHistory}
            className="text-[10px] text-white/40 hover:text-white/70 transition-colors font-sans px-1.5 py-0.5 bg-white/5 rounded hover:bg-white/10"
          >
            Clear
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {history.length === 0 ? (
            <p className="text-white/40 text-center w-full py-2 font-sans text-xs">No words in history</p>
          ) : (
            history.map((word, index) => (
              <div 
                key={index} 
                className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px] cursor-pointer hover:bg-[#00ff00]/20 hover:border-[#00ff00]/30 transition-colors border border-transparent font-sans"
                onClick={() => setWord(word)}
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>
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
  
  // Estado para el modo de visualización (tabs)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('adaptive');
  
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
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 mb-8 p-0">
      {/* Flag display area - optimized for all screen sizes */}
      <div className="w-full lg:w-[75%] flex justify-center mx-auto px-4 lg:px-0">
        <div className="w-full aspect-square">
          <div className="flex justify-center w-full relative">
            <div 
              style={{
                position: "relative", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",  
                border: "1px solid #333", 
                borderRadius: "8px", 
                overflow: "hidden", 
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                backgroundColor,
                width: "100%",
                height: "100%",
                maxWidth: "1000px",
                maxHeight: "1000px",
                aspectRatio: "1 / 1"
              }}
              className="transition-all duration-300"
            >
              {/* Sistema de tabs y visualización adaptativa */}
              <>
                <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                  <TabSelector 
                    activeMode={displayMode} 
                    onChange={setDisplayMode} 
                  />
                </div>
                
                {/* Renderizar el componente adecuado según el modo activo */}
                {displayMode === 'classic' && (
                  <ClassicDisplay word={displayWord} backgroundColor={backgroundColor} />
                )}
                {displayMode === 'grid' && (
                  <GridDisplay word={displayWord} backgroundColor={backgroundColor} />
                )}
                {displayMode === 'adaptive' && (
                  <AdaptiveDisplay word={displayWord} backgroundColor={backgroundColor} />
                )}
              </>
            </div>
          </div>
        </div>
      </div>
      
      {/* Control panel - mobile optimized */}
      <div className="w-full lg:w-[25%] px-4 lg:px-0">
        {/* Mobile compact controls - optimizados */}
        <div className="lg:hidden w-full bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              {/* Input de texto */}
              <input
                type="text"
                ref={inputRef}
                className="flex-grow bg-black border border-white/20 rounded-md py-2 px-3 text-base font-sans uppercase focus:border-[#00ff00] focus:outline-none"
                placeholder="TYPE HERE..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
              
              {/* Botón para abrir opciones de visualización */}
              <button
                onClick={() => {
                  // Toggle entre los diferentes modos en móvil
                  if (displayMode === 'classic') setDisplayMode('grid');
                  else if (displayMode === 'grid') setDisplayMode('adaptive');
                  else setDisplayMode('classic');
                }}
                className="flex justify-center items-center rounded-md bg-black/40 border border-white/10 w-10 h-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
            
            {/* Controles secundarios */}
            <div className="flex gap-2 w-full">
              <button
                onClick={generateRandomWord}
                disabled={isGenerating}
                className="flex-grow px-3 py-2 bg-[#00ff00] text-black font-sans uppercase tracking-wider text-xs disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? '...' : 'RANDOM'}
              </button>
              <button
                onClick={() => {
                  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
                  const randomIndex = Math.floor(Math.random() * colors.length);
                  changeBackgroundColor(colors[randomIndex]);
                }}
                className="w-10 px-0 py-1 bg-blue-500 text-white font-sans uppercase tracking-wider text-xs hover:bg-blue-600 transition-all duration-300"
              >
                BG
              </button>
            </div>
            
            {/* Slider para longitud */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min="2"
                max="10"
                className="flex-grow h-1 accent-[#00ff00]"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value))}
              />
              <span className="font-sans text-sm text-white/80 w-4 text-center">{maxLength}</span>
            </div>
          </div>
        </div>
        
        {/* Desktop full controls - hidden on mobile */}
        <div className="hidden lg:block w-full bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex flex-col gap-5">
            {/* Sistema de tabs en panel de control */}
            <div className="flex justify-center mb-4">
              <TabSelector 
                activeMode={displayMode} 
                onChange={setDisplayMode} 
              />
            </div>
            
            {/* Text input */}
            <div className="w-full">
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-xl font-sans uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
                placeholder="TYPE OR GENERATE WORD..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>
            
            {/* Action buttons - main buttons in row */}
            <div className="flex gap-3 w-full mb-3">
              <button
                onClick={generateRandomWord}
                disabled={isGenerating}
                className="flex-grow-[3] px-6 py-3 bg-[#00ff00] text-black font-sans uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? 'GENERATING...' : 'RANDOM WORD'}
              </button>
              
              <button
                onClick={() => {
                  // Using only RGB colors, black and white
                  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
                  const randomIndex = Math.floor(Math.random() * colors.length);
                  changeBackgroundColor(colors[randomIndex]);
                }}
                className="flex-grow-[1] px-4 py-3 bg-blue-500 text-white font-sans uppercase tracking-wider hover:bg-blue-600 transition-all duration-300"
              >
                BG
              </button>
            </div>
            
            {/* Export button on second line */}
            <div className="w-full mb-3">
              <button
                disabled={!displayWord}
                onClick={exportAsSvg}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white font-sans uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
              >
                EXPORT SVG
              </button>
            </div>
            
            {/* Length control */}
            <div className="w-full border-t border-white/10 pt-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="10"
                  className="w-full accent-[#00ff00]"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                />
                <span className="font-sans text-xl text-white">{maxLength}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de historial - versión desktop y móvil */}
        <div className="hidden lg:block">
          <HistoryPanel />
        </div>
        
        {/* Historial eliminado en versión móvil según requisito */}
      </div>
    </div>
  );
}
