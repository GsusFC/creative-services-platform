import { useState, useCallback } from 'react';
import { getRandomWord } from '../lib/flag-system/dictionary';
import { letterToFlag } from '../lib/flag-system/flagMap';

// Module-level constants
const ANIMATION_DELAY = 150;
const DEFAULT_MAX_LENGTH = 6;

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
  const [maxLength, setMaxLengthInternal] = useState(DEFAULT_MAX_LENGTH);
  const [isGridMode, setIsGridMode] = useState(false); // Inicialmente en modo estándar
  const [backgroundColor, setBackgroundColor] = useState('#000000'); // Color inicial: negro
  const [showText, setShowText] = useState(true); // Mostrar texto por defecto

  // Handle word change
  const setWord = useCallback((value: string) => {
    // Filter letters only, convert to uppercase and limit length
    const filteredValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, maxLength);
    setWordInternal(filteredValue);
    setDisplayWord(filteredValue);
    setIsGeneratedRandomly(false);
  }, [maxLength]);

  // Generate random word
  const generateRandomWord = useCallback(() => {
    setIsGenerating(true);
    const randomWord = getRandomWord(maxLength);
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
  }, [maxLength]);

  // Handle max length change
  const setMaxLength = useCallback((newLength: number) => {
    setMaxLengthInternal(newLength);
    // Truncate current word if it exceeds the new limit
    if (word.length > newLength) {
      const truncatedWord = word.substring(0, newLength);
      setWordInternal(truncatedWord);
      setDisplayWord(truncatedWord);
    }
  }, [word]);

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
  const exportAsSvg = useCallback(() => {
    if (!displayWord) return;
    
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
    
    if (isGridMode) {
      // Grid mode: two columns
      const isOdd = letters.length % 2 !== 0;
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
          
          // Convertir ruta relativa a absoluta
          const absolutePath = window.location.origin + flag.flagPath;
          
          svgContent += `
          <image 
            x="${startX + col * flagSize}" 
            y="${startY + row * flagSize}" 
            width="${flagSize}" 
            height="${flagSize}" 
            href="${absolutePath}"
          />`;
        }
      }
    } else {
      // Normal mode: single row
      // Adjust size based on letter count
      const adjustedFlagHeight = Math.min(flagHeight, 500 / displayWord.length);
      
      // Add flags in the center
      const totalWidth = displayWord.length * adjustedFlagHeight;
      let xPosition = (width - totalWidth) / 2;
      
      // Add each flag
      for (let i = 0; i < displayWord.length; i++) {
        const letter = displayWord[i];
        const flag = letterToFlag(letter);
        
        if (flag) {
          // Convertir ruta relativa a absoluta
          const absolutePath = window.location.origin + flag.flagPath;
          
          svgContent += `
          <image 
            x="${xPosition}" 
            y="${(height - adjustedFlagHeight) / 2}" 
            width="${adjustedFlagHeight}" 
            height="${adjustedFlagHeight}" 
            href="${absolutePath}"
          />`;
          
          xPosition += adjustedFlagHeight;
        }
      }
    }
    
    // Add the word at the bottom if showText is enabled
    if (showText) {
      svgContent += `
      <text 
        x="${width/2}" 
        y="${height - 40}" 
        font-family="Arial, sans-serif" 
        font-size="48"
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
    
    try {
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
