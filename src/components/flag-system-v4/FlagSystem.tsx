'use client';

import React, { useRef, useEffect } from 'react';
import { useFlagSystemV4 } from '@/hooks/useFlagSystemV4';
import { useFlagHistory } from '@/contexts/FlagHistoryContext';
import FlagCanvas from './FlagCanvas';
import { Switch } from '@/components/ui/switch';

// Tipo para la referencia del componente FlagCanvas
interface FlagCanvasRef {
  exportSvg: () => void;
}

// Componente para mostrar el historial
const HistoryPanel = () => {
  const { history, addToHistory, clearHistory } = useFlagHistory();
  const [{ }, { setWord }] = useFlagSystemV4();
  
  // Manejar clic en palabra del historial
  const handleWordClick = (word: string) => {
    setWord(word);
  };
  
  if (history.length === 0) {
    return (
      <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
        <h3 className="font-sans text-sm text-white/80 mb-2 uppercase tracking-wide">Historial</h3>
        <p className="text-white/40 text-center py-4 font-sans text-sm">No hay palabras en el historial</p>
      </div>
    );
  }
  
  return (
    <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-sans text-sm text-white/80 uppercase tracking-wide">Historial</h3>
        <button 
          onClick={clearHistory}
          className="text-xs text-white/40 hover:text-white/70 transition-colors font-sans px-2 py-1 bg-white/5 rounded hover:bg-white/10"
          aria-label="Limpiar historial"
        >
          Limpiar
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

// Componente para la interfaz de selección de modo
const DisplayModeToggle = ({ 
  isGridMode, 
  onChange 
}: { 
  isGridMode: boolean; 
  onChange: () => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className="text-white/60 text-sm font-sans">Modo Lista</span>
      <Switch 
        checked={isGridMode}
        onCheckedChange={onChange}
        aria-label="Alternar modo de visualización"
      />
      <span className="text-white/60 text-sm font-sans">Modo Grid</span>
    </div>
  );
};

// Componente principal FlagSystem v4
const FlagSystemV4: React.FC = () => {
  // Referencia al componente FlagCanvas para la exportación SVG
  const canvasRef = useRef<FlagCanvasRef>(null);
  
  // Hook personalizado para el estado del sistema de banderas
  const [
    { word, displayWord, isGenerating, maxLength, isGridMode, backgroundColor, showText },
    { setWord, generateRandomWord, toggleGridMode, toggleShowText, changeBackgroundColor }
  ] = useFlagSystemV4();

  // Referencia al input de texto
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantener focus en el input al escribir
  useEffect(() => {
    if (word && !isGenerating && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [word, isGenerating]);
  
  // Manejar la exportación SVG a través de la referencia
  const handleExportSvg = () => {
    if (canvasRef.current) {
      canvasRef.current.exportSvg();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 mb-8 p-0">
      {/* Área de visualización de banderas */}
      <div className="w-full lg:w-[65%] flex justify-center mx-auto px-4 lg:px-0">
        <div className="w-full aspect-square">
          <div className="flex justify-center w-full relative">
            {/* Mostrar el componente FlagCanvas con la referencia */}
            <FlagCanvas
              ref={canvasRef}
              word={displayWord}
              isGridMode={isGridMode}
              backgroundColor={backgroundColor}
              showText={showText}
            />
          </div>
        </div>
      </div>
      
      {/* Panel de control - optimizado para móvil y escritorio */}
      <div className="w-full lg:w-[35%] px-4 lg:px-0">
        {/* Controles compactos para móvil */}
        <div className="lg:hidden w-full bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex flex-col gap-2">
            {/* Toggle de modo de visualización */}
            <DisplayModeToggle 
              isGridMode={isGridMode} 
              onChange={toggleGridMode} 
            />
            
            {/* Input de texto */}
            <div className="mb-2">
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-black border border-white/20 rounded-md py-2 px-3 text-base font-sans uppercase focus:border-[#00ff00] focus:outline-none"
                placeholder="ESCRIBE AQUÍ..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                aria-label="Palabra a convertir en banderas"
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2 w-full">
              <button
                onClick={() => generateRandomWord()}
                disabled={isGenerating}
                className="flex-grow px-3 py-2 bg-[#00ff00] text-black font-sans uppercase tracking-wider text-xs disabled:opacity-50 hover:brightness-110 transition-all duration-300"
                aria-label="Generar palabra aleatoria"
              >
                {isGenerating ? '...' : 'ALEATORIO'}
              </button>
              <button
                onClick={handleExportSvg}
                disabled={!displayWord}
                className="flex-grow bg-white/10 border border-white/20 text-white font-sans text-xs uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
                aria-label="Exportar SVG"
              >
                SVG
              </button>
              <button
                onClick={() => changeBackgroundColor()}
                className="w-10 px-0 py-1 bg-blue-500 text-white font-sans uppercase tracking-wider text-xs hover:bg-blue-600 transition-all duration-300"
                aria-label="Cambiar color de fondo"
              >
                BG
              </button>
            </div>
            
            {/* Toggle de texto */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="font-sans text-xs text-white/80">Mostrar texto</span>
              <Switch 
                checked={showText}
                onCheckedChange={toggleShowText}
                aria-label="Mostrar texto en banderas"
              />
            </div>
          </div>
        </div>
        
        {/* Controles completos para escritorio */}
        <div className="hidden lg:block w-full bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex flex-col gap-5">
            {/* Toggle de modo de visualización */}
            <DisplayModeToggle 
              isGridMode={isGridMode} 
              onChange={toggleGridMode} 
            />
            
            {/* Input de texto */}
            <div className="w-full">
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-base font-sans uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
                placeholder="ESCRIBE UNA PALABRA..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                aria-label="Palabra a convertir en banderas"
              />
            </div>
            
            {/* Botones principales */}
            <div className="flex gap-3 w-full mb-3">
              <button
                onClick={() => generateRandomWord()}
                disabled={isGenerating}
                className="flex-grow-[3] px-6 py-3 bg-[#00ff00] text-black font-sans text-sm uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
                aria-label="Generar palabra aleatoria"
              >
                {isGenerating ? 'GENERANDO...' : 'ALEATORIO'}
              </button>
              
              <button
                onClick={() => changeBackgroundColor()}
                className="flex-grow-[1] px-4 py-3 bg-blue-500 text-white font-sans text-sm uppercase tracking-wider hover:bg-blue-600 transition-all duration-300"
                aria-label="Cambiar color de fondo"
              >
                FONDO
              </button>
            </div>
            
            {/* Botón de exportación */}
            <div className="w-full mb-3">
              <button
                disabled={!displayWord}
                onClick={handleExportSvg}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white font-sans text-sm uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
                aria-label="Exportar SVG"
              >
                EXPORTAR SVG
              </button>
            </div>
            
            {/* Separador */}
            <div className="w-full border-t border-white/10 pt-4 mb-3"></div>
            
            {/* Toggle de visualización de texto */}
            <div className="w-full flex items-center justify-between">
              <span className="font-sans text-sm text-white/80">Mostrar texto en banderas</span>
              <Switch 
                checked={showText}
                onCheckedChange={toggleShowText}
                aria-label="Mostrar texto en banderas"
              />
            </div>
          </div>
        </div>
        
        {/* Panel de historial - versión escritorio */}
        <div className="hidden lg:block">
          <HistoryPanel />
        </div>
        
        {/* Panel compacto de historial para móvil */}
        <div className="lg:hidden mt-3">
          <HistoryPanel />
        </div>
      </div>
    </div>
  );
};

export default FlagSystemV4;
