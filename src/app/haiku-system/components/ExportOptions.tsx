'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

interface ExportOptionsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  haiku: string;
}

export const ExportOptions = ({ svgRef, haiku: _haiku }: ExportOptionsProps) => {
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
      
      // Procesar todas las imágenes para incluirlas en el SVG
      const images = svgClone.querySelectorAll('image');
      
      // Convertir las imágenes externas en imágenes embebidas
      await Promise.all(Array.from(images).map(async (image) => {
        const href = image.getAttribute('href');
        if (href && href.startsWith('/assets/')) {
          try {
            // Cargar la imagen SVG de la bandera
            const response = await fetch(href);
            const svgText = await response.text();
            
            // Crear un elemento SVG con el contenido de la bandera
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgText;
            const svgContent = tempDiv.querySelector('svg');
            
            if (svgContent) {
              // Obtener los atributos de la imagen original
              const x = image.getAttribute('x') || '0';
              const y = image.getAttribute('y') || '0';
              const width = image.getAttribute('width') || '100';
              const height = image.getAttribute('height') || '100';
              
              // Crear un nuevo elemento SVG para reemplazar la imagen
              const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              newSvg.setAttribute('x', x);
              newSvg.setAttribute('y', y);
              newSvg.setAttribute('width', width);
              newSvg.setAttribute('height', height);
              newSvg.setAttribute('viewBox', svgContent.getAttribute('viewBox') || '0 0 100 100');
              newSvg.innerHTML = svgContent.innerHTML;
              
              // Reemplazar la imagen con el nuevo SVG
              image.parentNode?.replaceChild(newSvg, image);
            }
          } catch (error) {
            console.error(`Error al procesar la imagen ${href}:`, error);
          }
        }
      }));
      
      // Asegurarse de que el fondo es negro
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', '0');
      bgRect.setAttribute('y', '0');
      bgRect.setAttribute('width', '1000');
      bgRect.setAttribute('height', '1000');
      bgRect.setAttribute('fill', '#000000');
      svgClone.insertBefore(bgRect, svgClone.firstChild);
      
      // Convertir el SVG a una cadena de texto
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // Crear un blob con los datos del SVG
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      // Crear una URL para el blob
      const url = URL.createObjectURL(svgBlob);
      
      // Crear un elemento canvas para convertir el SVG a PNG
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      
      // Obtener el contexto del canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }
      
      // Crear una imagen con el SVG
      const img = new Image();
      img.src = url;
      
      // Esperar a que la imagen se cargue
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0);
      
      // Convertir el canvas a un blob PNG
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('No se pudo convertir el canvas a PNG'));
          }
        }, 'image/png');
      });
      
      // Generar un nombre de archivo basado en el haiku
      const filename = `haiku-${Date.now()}.png`;
      
      // Descargar el archivo PNG
      saveAs(pngBlob, filename);
      
      // Liberar la URL del blob
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar como PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Función para exportar como SVG
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Obtener el elemento SVG
      const svgElement = svgRef.current;
      
      // Crear una copia del SVG
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Configurar atributos necesarios
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('width', '1000');
      svgClone.setAttribute('height', '1000');
      
      // Asegurarse de que el fondo es negro
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', '0');
      bgRect.setAttribute('y', '0');
      bgRect.setAttribute('width', '1000');
      bgRect.setAttribute('height', '1000');
      bgRect.setAttribute('fill', '#000000');
      svgClone.insertBefore(bgRect, svgClone.firstChild);
      
      // Convertir el SVG a una cadena de texto
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // Añadir la declaración XML
      const svgWithXml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgData;
      
      // Crear un blob con los datos del SVG
      const blob = new Blob([svgWithXml], { type: 'image/svg+xml;charset=utf-8' });
      
      // Generar un nombre de archivo basado en el haiku
      const filename = `haiku-${Date.now()}.svg`;
      
      // Descargar el archivo SVG
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error al exportar como SVG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-black border-t border-gray-800">
      <h2 className="text-white text-lg font-semibold mb-4 flex items-center font-mono">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="#00FF00">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2 .707.707.707-.707 2-2a1 1 0 10-1.414-1.414l-.293.293V9z" clipRule="evenodd" />
        </svg>
        Download Composition
      </h2>
      
      {/* Botones de exportación */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white border transition-colors flex items-center justify-center font-mono"
          style={{ borderColor: '#00FF00' }}
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
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white border transition-colors flex items-center justify-center font-mono"
          style={{ borderColor: '#00FF00' }}
          aria-label="Download as SVG"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium font-mono">DOWNLOAD SVG</span>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 p-2 bg-green-900/20 border border-green-900 rounded text-sm text-white font-mono">
          Procesando la exportación, por favor espere...
        </div>
      )}
    </div>
  );
};
