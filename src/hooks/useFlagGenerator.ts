import { useState, useCallback } from 'react';
import { getRandomWord } from '../lib/flag-system/dictionary';
import { letterToFlag } from '../lib/flag-system/flagMap';

// Module-level constants
const ANIMATION_DELAY = 150;
const MAX_LENGTH = 10; // Fixed maximum length of 10 letters

// Available background colors
const BACKGROUND_COLORS = [
  '#ff0000', // Red
  '#0000ff', // Blue
  '#00ff00', // Green
  '#000000', // Black
  '#ffffff', // White
];

export interface FlagGeneratorState {
  word: string;
  displayWord: string;
  isGenerating: boolean;
  isGeneratedRandomly: boolean;
  maxLength: number;
  isGridMode: boolean;
  backgroundColor: string;
  showText: boolean;
}

export interface FlagGeneratorActions {
  setWord: (word: string) => void;
  generateRandomWord: () => void;
  setMaxLength: (length: number) => void;
  exportAsSvg: () => void;
  toggleGridMode: () => void;
  toggleShowText: () => void;
  changeBackgroundColor: (specificColor?: string) => void;
}

export const useFlagGenerator = (): [FlagGeneratorState, FlagGeneratorActions] => {
  const [word, setWordInternal] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratedRandomly, setIsGeneratedRandomly] = useState(false);
  const [maxLength, setMaxLengthInternal] = useState(MAX_LENGTH); // Usar el máximo fijo
  const [isGridMode, setIsGridMode] = useState(false); // Inicialmente en modo estándar
  const [backgroundColor, setBackgroundColor] = useState('#000000'); // Color inicial: negro
  const [showText, setShowText] = useState(true); // Mostrar texto por defecto

  // Handle word change
  const setWord = useCallback((value: string) => {
    // Filter letters only, convert to uppercase and limit length to max 10
    const filteredValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, MAX_LENGTH);
    setWordInternal(filteredValue);
    setDisplayWord(filteredValue);
    setIsGeneratedRandomly(false);
  }, []);

  // Generate random word
  const generateRandomWord = useCallback(() => {
    setIsGenerating(true);
    const randomWord = getRandomWord(MAX_LENGTH); // Usar el máximo fijo para la palabra aleatoria
    setIsGeneratedRandomly(true);
    
    // Animate the word generation process
    let i = 0;
    const interval = setInterval(() => {
      setDisplayWord(randomWord.substring(0, i + 1));
      i++;
      if (i === randomWord.length) {
        clearInterval(interval);
        setWordInternal(randomWord);
        setIsGenerating(false);
      }
    }, ANIMATION_DELAY);
  }, []);

  // Handle max length change - no longer needed but keeping for API compatibility
  const setMaxLength = useCallback((newLength: number) => {
    setMaxLengthInternal(MAX_LENGTH); // Siempre usar el máximo fijo
  }, []);

  // Toggle grid mode
  const toggleGridMode = useCallback(() => {
    setIsGridMode(prevMode => !prevMode);
  }, []);
  
  // Toggle text visibility
  const toggleShowText = useCallback(() => {
    setShowText(prevShow => !prevShow);
  }, []);
  
  // Change background color randomly or to a specific color
  const changeBackgroundColor = useCallback((specificColor?: string) => {
    if (specificColor) {
      // If a specific color is provided, set it
      setBackgroundColor(specificColor);
    } else {
      // Select a random color different from the current one
      let newColor;
      do {
        const randomIndex = Math.floor(Math.random() * BACKGROUND_COLORS.length);
        newColor = BACKGROUND_COLORS[randomIndex];
      } while (newColor === backgroundColor && BACKGROUND_COLORS.length > 1);
      
      setBackgroundColor(newColor);
    }
  }, [backgroundColor]);

  // Export as SVG
  const exportAsSvg = useCallback(async () => {
    if (!displayWord) return;
    
    try {
      // SVG dimensions
      const width = 1000;
      const height = 1000;
      const flagHeight = 70;
      
      // Determine background color for the SVG
      const bgColor = backgroundColor || '#000000';
      
      // Create SVG content
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <!-- Background -->
        <rect width="${width}" height="${height}" fill="${bgColor}" />`;
      
      // Obtener letras
      const letters = displayWord.split('').map(letter => letter.toUpperCase());
      
      // Usar el enfoque más directo: dibujar cada letra en la posición correcta
      if (isGridMode) {
        // Grid mode: two columns
        const flagSize = Math.min(70, 350 / Math.ceil(letters.length / 2)); // Ajustar según cantidad
        
        // Calculate initial position and dimensions
        const gridWidth = flagSize * 2;
        const gridHeight = flagSize * Math.ceil(letters.length / 2);
        const startX = (width - gridWidth) / 2;
        const startY = (height - gridHeight) / 2;
        
        // Draw flags in grid
        for (let i = 0; i < letters.length; i++) {
          const letter = letters[i];
          const flag = letterToFlag(letter);
          
          if (flag) {
            // Calculate position in the grid
            const row = Math.floor(i / 2);
            const col = i % 2;
            
            // Simplemente dibujamos cada bandera en su posición como un rectángulo con la letra
            const x = startX + col * flagSize;
            const y = startY + row * flagSize;
            
            svgContent += `
            <rect 
              x="${x}" 
              y="${y}" 
              width="${flagSize}" 
              height="${flagSize}" 
              fill="#FF0000" 
              stroke="#FFFFFF" 
              stroke-width="2"
            />
            <text 
              x="${x + flagSize/2}" 
              y="${y + flagSize/2}" 
              font-family="Arial, sans-serif" 
              font-size="${flagSize/2}"
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="white"
            >${letter}</text>`;
          }
        }
      } else {
        // Normal mode: single row
        // Adjust size based on letter count
        const adjustedFlagHeight = Math.min(flagHeight, 500 / displayWord.length);
        
        // Add flags in the center
        const totalWidth = displayWord.length * adjustedFlagHeight;
        let xPosition = (width - totalWidth) / 2;
        const yPosition = (height - adjustedFlagHeight) / 2;
        
        // Add each flag
        for (let i = 0; i < displayWord.length; i++) {
          const letter = displayWord[i];
          const flag = letterToFlag(letter);
          
          if (flag) {
            // Simplemente dibujamos cada bandera en su posición como un rectángulo con la letra
            svgContent += `
            <rect 
              x="${xPosition}" 
              y="${yPosition}" 
              width="${adjustedFlagHeight}" 
              height="${adjustedFlagHeight}" 
              fill="#0000FF" 
              stroke="#FFFFFF" 
              stroke-width="2"
            />
            <text 
              x="${xPosition + adjustedFlagHeight/2}" 
              y="${yPosition + adjustedFlagHeight/2}" 
              font-family="Arial, sans-serif" 
              font-size="${adjustedFlagHeight/2}"
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="white"
            >${letter}</text>`;
            
            xPosition += adjustedFlagHeight;
          }
        }
      }
      
      // Add the word at the bottom if showText is enabled
      if (showText) {
        svgContent += `
        <text 
          x="${width/2}" 
          y="${height - 20}" 
          font-family="Arial, sans-serif" 
          font-size="32"
          text-anchor="middle" 
          fill="white" 
          letter-spacing="0.1em"
        >${displayWord}</text>`;
      }
      
      // Add FLAG SYSTEM signature
      svgContent += `
        <text 
          x="${width - 10}" 
          y="${height - 10}" 
          font-family="Arial, sans-serif" 
          font-size="16" 
          text-anchor="end" 
          fill="white" 
          opacity="0.7"
        >FLAG SYSTEM</text>
      </svg>`;
      
      // Create blob and download
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flag-word-${displayWord.toLowerCase()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Notificar al usuario
      alert('SVG exportado correctamente!');
    } catch (error) {
      console.error('Error al exportar SVG:', error);
      alert('Error al exportar SVG. Revisa la consola para más detalles.');
    }
  }, [displayWord, isGridMode, backgroundColor, showText]);

  return [
    { word, displayWord, isGenerating, isGeneratedRandomly, maxLength, isGridMode, backgroundColor, showText },
    { setWord, generateRandomWord, setMaxLength, exportAsSvg, toggleGridMode, toggleShowText, changeBackgroundColor }
  ];
};
