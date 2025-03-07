import React, { memo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getFlagInfo, supportedLetters } from '../../lib/flag-system/flagUtils';
import FlagPattern from './FlagPatterns';

interface FlagCanvasProps {
  word: string;
  isGridMode: boolean;
  backgroundColor: string;
  showText: boolean;
}

interface FlagCanvasRef {
  exportSvg: () => void;
}

// Array de background color options
const backgroundPatterns = [
  'bg-grid-white/[0.05]',
  'bg-dots-white/[0.05]',
  'bg-lines-white/[0.05]',
];

const FlagCanvas = forwardRef<FlagCanvasRef, FlagCanvasProps>(function FlagCanvas({
  word,
  isGridMode,
  backgroundColor,
  showText
}, ref) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [bgPattern, setBgPattern] = useState(0);

  // Function to cycle through background patterns
  const changePattern = () => {
    setBgPattern((prev) => (prev + 1) % backgroundPatterns.length);
  };

  // Exponer la función exportSvg mediante forwardRef
  useImperativeHandle(ref, () => ({
    exportSvg: () => {
      handleExportSvg();
    }
  }));

  // Render each letter as a flag element
  const renderFlags = () => {
    if (!word) return <div className="text-white/50 text-center py-16 font-mono">Escribe una palabra para ver su representación con banderas</div>;

    const letters = word.toUpperCase().split('');
    
    // Filter out unsupported characters
    const validLetters = letters.filter(letter => supportedLetters.includes(letter));
    
    if (validLetters.length === 0) {
      return <div className="text-white/50 text-center py-16 font-mono">No se encontraron caracteres válidos. Intenta con A-Z</div>;
    }
    
    // Reset svgRefs array to match the new number of letters
    svgRefs.current = Array(validLetters.length).fill(null);
    
    return (
      <div className={`w-full flex ${isGridMode ? 'flex-wrap justify-center gap-6' : 'flex-col items-center gap-6'}`}>
        {validLetters.map((letter, index) => {
          const flagInfo = getFlagInfo(letter);
          if (!flagInfo) return null;
          
          return (
            <div key={`${letter}-${index}`} className={`${isGridMode ? 'w-24 h-24' : 'w-full max-w-md aspect-[3/2]'}`}>
              <div className="relative w-full h-full overflow-hidden border border-white/10 rounded-md">
                {/* Flag implementation using SVG patterns */}
                <div 
                  className="w-full h-full"
                  ref={el => {
                    if (el) {
                      const svgEl = el.querySelector('svg');
                      if (svgEl) {
                        svgRefs.current[index] = svgEl as SVGSVGElement;
                      }
                    }
                  }}
                >
                  <FlagPattern flagInfo={flagInfo} showLetter={showText} />
                </div>
              </div>
              {isGridMode && !showText && (
                <div className="text-center mt-2 text-xs text-white/70 font-mono">
                  {letter}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Función auxiliar para obtener el SVG como texto desde una URL
  const fetchSvgContent = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error fetching ${url}: ${response.statusText}`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error(`Error fetching SVG from ${url}:`, error);
      // Retornar un SVG de respaldo simple en caso de error
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#cccccc"/>
        <text x="50" y="50" font-family="Arial" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="black">?</text>
      </svg>`;
    }
  };

  // Export SVG functionality
  const handleExportSvg = async () => {
    if (!word || !canvasRef.current) return;
    
    const validLetters = word.toUpperCase().split('').filter(letter => supportedLetters.includes(letter));
    if (validLetters.length === 0) return;
    
    try {
      // Crear un nuevo SVG contenedor para la exportación
      const xmlns = "http://www.w3.org/2000/svg";
      const svgExport = document.createElementNS(xmlns, "svg");
      
      // Establecer dimensiones basadas en el modo
      let width, height;
      
      if (isGridMode) {
        // En modo grid, organizamos las banderas en una cuadrícula
        const cols = Math.min(validLetters.length, 5); // Máximo 5 columnas
        const rows = Math.ceil(validLetters.length / cols);
        
        width = cols * 300 + (cols - 1) * 20; // 300 de ancho con 20px de espacio
        height = rows * 200 + (rows - 1) * 20; // 200 de alto con 20px de espacio
        
        svgExport.setAttribute("width", width.toString());
        svgExport.setAttribute("height", height.toString());
        svgExport.setAttribute("viewBox", `0 0 ${width} ${height}`);
        
        // Configurar fondo
        const rect = document.createElementNS(xmlns, "rect");
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", backgroundColor);
        svgExport.appendChild(rect);
        
        // Añadir cada bandera a la cuadrícula
        validLetters.forEach((letter, index) => {
          const flagInfo = getFlagInfo(letter);
          if (!flagInfo || !svgRefs.current[index]) return;
          
          const row = Math.floor(index / cols);
          const col = index % cols;
          const x = col * (300 + 20);
          const y = row * (200 + 20);
          
          // Obtener el contenido SVG desde la ruta
          const flagSvgPath = flagInfo.flagPath;
          const flagUrl = window.location.origin + flagSvgPath;
          
          try {
            // Clonar y ajustar la posición del SVG original
            const svgClone = svgRefs.current[index]?.cloneNode(true) as SVGSVGElement;
            if (!svgClone) return;
            
            const g = document.createElementNS(xmlns, "g");
            g.setAttribute("transform", `translate(${x}, ${y})`);
            
            // Añadir el contenido del SVG original
            Array.from(svgClone.childNodes).forEach(node => {
              g.appendChild(node.cloneNode(true));
            });
            
            // Añadir el texto de la letra si es necesario
            if (showText) {
              const text = document.createElementNS(xmlns, "text");
              text.setAttribute("x", "150");
              text.setAttribute("y", "100");
              text.setAttribute("text-anchor", "middle");
              text.setAttribute("dominant-baseline", "middle");
              text.setAttribute("fill", "#FFFFFF");
              text.setAttribute("font-size", "40");
              text.setAttribute("font-weight", "bold");
              text.setAttribute("style", "filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5))");
              text.textContent = letter;
              g.appendChild(text);
            }
            
            svgExport.appendChild(g);
          } catch (error) {
            console.error(`Error processing SVG for letter ${letter}:`, error);
          }
        });
      } else {
        // En modo estándar, apilamos las banderas verticalmente
        width = 300;
        height = validLetters.length * 200 + (validLetters.length - 1) * 20;
        
        svgExport.setAttribute("width", width.toString());
        svgExport.setAttribute("height", height.toString());
        svgExport.setAttribute("viewBox", `0 0 ${width} ${height}`);
        
        // Configurar fondo
        const rect = document.createElementNS(xmlns, "rect");
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", backgroundColor);
        svgExport.appendChild(rect);
        
        // Añadir cada bandera verticalmente
        validLetters.forEach((letter, index) => {
          const flagInfo = getFlagInfo(letter);
          if (!flagInfo || !svgRefs.current[index]) return;
          
          const y = index * (200 + 20);
          
          try {
            // Clonar y ajustar la posición del SVG original
            const svgClone = svgRefs.current[index]?.cloneNode(true) as SVGSVGElement;
            if (!svgClone) return;
            
            const g = document.createElementNS(xmlns, "g");
            g.setAttribute("transform", `translate(0, ${y})`);
            
            // Añadir el contenido del SVG original
            Array.from(svgClone.childNodes).forEach(node => {
              g.appendChild(node.cloneNode(true));
            });
            
            // Añadir el texto de la letra si es necesario
            if (showText) {
              const text = document.createElementNS(xmlns, "text");
              text.setAttribute("x", "150");
              text.setAttribute("y", "100");
              text.setAttribute("text-anchor", "middle");
              text.setAttribute("dominant-baseline", "middle");
              text.setAttribute("fill", "#FFFFFF");
              text.setAttribute("font-size", "40");
              text.setAttribute("font-weight", "bold");
              text.setAttribute("style", "filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5))");
              text.textContent = letter;
              g.appendChild(text);
            }
            
            svgExport.appendChild(g);
          } catch (error) {
            console.error(`Error processing SVG for letter ${letter}:`, error);
          }
        });
      }
      
      // Añadir firma FLAG SYSTEM
      const signature = document.createElementNS(xmlns, "text");
      signature.setAttribute("x", (width - 20).toString());
      signature.setAttribute("y", (height - 20).toString());
      signature.setAttribute("text-anchor", "end");
      signature.setAttribute("font-family", "Arial, sans-serif");
      signature.setAttribute("font-size", "16");
      signature.setAttribute("fill", backgroundColor === '#ffffff' ? '#666666' : '#ffffff');
      signature.setAttribute("opacity", "0.7");
      signature.textContent = "FLAG SYSTEM v4";
      svgExport.appendChild(signature);
      
      // Convertir el SVG a una cadena
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgExport);
      
      // Añadir el espacio de nombres XML si es necesario
      if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      
      // Añadir la declaración XML
      svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
      
      // Convertir SVG string a un blob
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Crear un enlace para descargar y hacer clic en él
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `flag_${word.toLowerCase()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Liberar el objeto URL
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error exporting SVG:', error);
      alert('Error al exportar SVG. Por favor, intenta de nuevo.');
    }
  };
  
  return (
    <div className="w-full relative">
      <div 
        ref={canvasRef}
        className={`w-full rounded-xl overflow-hidden border border-white/10 p-6 ${backgroundPatterns[bgPattern]}`}
        style={{ minHeight: '240px', backgroundColor }}
      >
        {renderFlags()}
      </div>
      
      <div className="mt-4 flex justify-between">
        <button 
          onClick={handleExportSvg} 
          disabled={!word}
          className="text-xs text-white/50 hover:text-white/80 disabled:opacity-30 flex items-center gap-1 font-mono"
          aria-label="Exportar SVG"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          EXPORT SVG
        </button>
        
        <button 
          onClick={changePattern} 
          className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 font-mono"
          aria-label="Cambiar patrón de fondo"
        >
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
          CAMBIAR PATRÓN
        </button>
      </div>
    </div>
  );
});

export default memo(FlagCanvas);
