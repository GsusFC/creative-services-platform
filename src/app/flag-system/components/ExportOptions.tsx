'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

interface ExportOptionsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  word: string;
  backgroundColor: string; // Añadir prop para el color de fondo
}

// Helper function to embed SVG images
const embedSvgImages = async (svgElement: SVGSVGElement): Promise<void> => {
  const images = svgElement.querySelectorAll('image');
  await Promise.all(Array.from(images).map(async (image) => {
    const href = image.getAttribute('href');
    if (href && href.startsWith('/assets/')) {
      try {
        const response = await fetch(href);
        const svgText = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgText;
        const svgContent = tempDiv.querySelector('svg');

        if (svgContent) {
          const x = image.getAttribute('x') || '0';
          const y = image.getAttribute('y') || '0';
          const width = image.getAttribute('width') || '100';
          const height = image.getAttribute('height') || '100';
          const style = image.getAttribute('style') || '';

          svgContent.setAttribute('x', x);
          svgContent.setAttribute('y', y);
          svgContent.setAttribute('width', width);
          svgContent.setAttribute('height', height);
          svgContent.setAttribute('style', style);

          image.parentNode?.replaceChild(svgContent, image);
        }
      } catch (error) {
        console.error(`Error processing image ${href}:`, error);
        // Optionally re-throw or handle the error differently
      }
    }
  }));
};


export const ExportOptions = ({ svgRef, word, backgroundColor }: ExportOptionsProps) => {
  const [isExporting, setIsExporting] = useState(false);

  // Función para exportar como PNG
  const handleExportPNG = async () => {
    if (!svgRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Obtener el elemento SVG que contiene la composición de banderas
      const svgElement = svgRef.current;
      
      // Crear una copia del SVG para no modificar el original
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Asegurarse de que el SVG tiene las dimensiones correctas
      svgClone.setAttribute('width', '1000');
      svgClone.setAttribute('height', '1000');
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Usar helper function para incrustar imágenes
      await embedSvgImages(svgClone);

      // Serializar el SVG a una cadena
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Crear una imagen para cargar el SVG
      const img = new Image();
      img.width = 1000;
      img.height = 1000;
      
      // Esperar a que la imagen se cargue
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => {
          console.error('Error al cargar la imagen', e);
          reject(new Error('Error al cargar la imagen'));
        };
        img.src = svgUrl;
      });
      
      // Crear un canvas para dibujar la imagen
      const canvas = document.createElement('canvas');
      canvas.width = 1000 * 2; // Alta calidad
      canvas.height = 1000 * 2; // Alta calidad
      
      // Obtener el contexto del canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');
      
      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Limpiar recursos
      URL.revokeObjectURL(svgUrl);
      
      // Convertir el canvas a un blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          // Usar exactamente la palabra introducida por el usuario
          saveAs(blob, `${word}_flagsystem.png`);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error al exportar como PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Función para exportar como SVG
  const handleExportSVG = async () => {
    if (!svgRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Obtener el elemento SVG que contiene la composición de banderas
      const svgElement = svgRef.current;
      
      // Crear una copia del SVG para no modificar el original
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Configurar el SVG para la exportación
      svgClone.setAttribute('width', '1000');
      svgClone.setAttribute('height', '1000');
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Usar el backgroundColor recibido como prop
      const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectElement.setAttribute('width', '1000');
      rectElement.setAttribute('height', '1000');
      rectElement.setAttribute('fill', backgroundColor); // Usar prop
      rectElement.setAttribute('x', '0');
      rectElement.setAttribute('y', '0');
      
      // Insertar el rectángulo negro al principio del SVG para que sirva como fondo
      svgClone.insertBefore(rectElement, svgClone.firstChild);

      // Usar helper function para incrustar imágenes
      await embedSvgImages(svgClone);

      // Convertir el SVG a una cadena
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // Crear un blob con los datos SVG
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      
      // Usar file-saver para guardar el archivo
      // Usar exactamente la palabra introducida por el usuario
      saveAs(blob, `${word}_flagsystem.svg`);
    } catch (error) {
      console.error('Error al exportar como SVG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // La función de copia al portapapeles ha sido eliminada ya que no se utiliza

  return (
    // Usar clases Tailwind para borde
    <div className="bg-black border-t border-gray-800 pt-4"> {/* Añadir padding top */}
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center font-mono">
        {/* Usar clase Tailwind para fill */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-green-500" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2 .707.707.707-.707 2-2a1 1 0 10-1.414-1.414l-.293.293V9z" clipRule="evenodd" />
        </svg>
        Download Composition
      </h2>
      
      {/* Botones de exportación */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          // Usar clases Tailwind para borde y fuente
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white border border-green-500 transition-colors flex items-center justify-center font-mono"
          aria-label="Download as PNG"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium font-mono">DOWNLOAD PNG</span>
        </button>
        
        <button
          onClick={handleExportSVG}
          disabled={isExporting}
          // Usar clases Tailwind para borde y fuente
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white border border-green-500 transition-colors flex items-center justify-center font-mono"
          aria-label="Download as SVG"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium font-mono">DOWNLOAD SVG</span>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 p-2 bg-green-900/20 border border-green-700/30 text-green-400 text-sm flex items-center font-mono">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exportando... Por favor espera.
        </div>
      )}
    </div>
  );
};
