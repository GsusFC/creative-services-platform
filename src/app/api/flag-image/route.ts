import { NextRequest, NextResponse } from 'next/server';
import { letterToFlag } from '@/lib/flag-system/flagMap';
import * as fs from 'fs';
import * as path from 'path';

// API para generar imágenes con las banderas náuticas
export async function GET(request: NextRequest) {
  try {
    // Obtener la palabra y el color de fondo de los parámetros
    const word = request.nextUrl.searchParams.get('word') || 'HELLO';
    const bg = request.nextUrl.searchParams.get('bg') || '#000000';
    
    // Verificar que la palabra no sea demasiado larga
    const safeWord = word.substring(0, 10).toUpperCase();
    
    // En lugar de usar canvas, generaremos un SVG directamente
    // Esto es más sencillo y no requiere dependencias adicionales
    
    const svgWidth = 1200;
    const svgHeight = 630;
    
    // Determinar si será una configuración de una sola línea o de columnas
    const useColumns = safeWord.length > 5;
    
    // Preparar las rutas de las banderas
    const flagPaths = safeWord.split('').map(letter => {
      const flag = letterToFlag(letter);
      return flag ? flag.flagPath : null;
    }).filter(Boolean);
    
    // Generar el contenido SVG
    let svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <!-- Fondo -->
        <rect width="${svgWidth}" height="${svgHeight}" fill="${bg}" />
    `;
    
    // Agregar las banderas
    if (useColumns) {
      // Modo de columnas
      const rows = Math.ceil(flagPaths.length / 2);
      const flagSize = Math.min(svgWidth / 3, svgHeight / (rows + 1));
      
      flagPaths.forEach((flagPath, index) => {
        if (!flagPath) return;
        
        const row = Math.floor(index / 2);
        const col = index % 2;
        
        const x = svgWidth / 2 - flagSize + (col * flagSize);
        const y = (svgHeight / (rows + 1)) * (row + 0.5);
        
        svgContent += `
          <image x="${x}" y="${y}" width="${flagSize}" height="${flagSize}" href="${flagPath}" />
        `;
      });
    } else {
      // Modo de una sola línea
      const flagSize = Math.min(svgWidth / (flagPaths.length + 1), svgHeight * 0.6);
      const startX = (svgWidth - (flagSize * flagPaths.length)) / 2;
      const centerY = svgHeight * 0.4;
      
      flagPaths.forEach((flagPath, index) => {
        if (!flagPath) return;
        const x = startX + (index * flagSize);
        svgContent += `
          <image x="${x}" y="${centerY - flagSize / 2}" width="${flagSize}" height="${flagSize}" href="${flagPath}" />
        `;
      });
    }
    
    // Agregar el texto
    const textColor = bg === '#ffffff' ? '#000000' : '#ffffff';
    svgContent += `
      <text x="${svgWidth / 2}" y="${svgHeight * 0.8}" font-family="Arial" font-size="64" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${safeWord}
      </text>
    `;
    
    // Cerrar el SVG
    svgContent += `</svg>`;
    
    // Devolver el SVG como respuesta
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generando la imagen:', error);
    
    // Devolver una imagen de error
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <rect width="1200" height="630" fill="#333333" />
        <text x="600" y="315" font-family="Arial" font-size="48" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
          Error generando imagen
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
      status: 500,
    });
  }
}
