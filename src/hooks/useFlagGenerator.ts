import { useState, useCallback } from 'react';
import { getRandomWord } from '../lib/flag-system/dictionary';
import { letterToFlag } from '../lib/flag-system/flagMap';

// Module-level constants
const ANIMATION_DELAY = 150;
const DEFAULT_MAX_LENGTH = 6;

// Colores disponibles para el fondo
const BACKGROUND_COLORS = [
  '#ff0000', // Rojo
  '#0000ff', // Azul
  '#00ff00', // Verde
  '#000000', // Negro
  '#ffffff', // Blanco
];

export interface FlagGeneratorState {
  word: string;
  displayWord: string;
  isGenerating: boolean;
  isGeneratedRandomly: boolean;
  maxLength: number;
  isGridMode: boolean;
  backgroundColor: string;
}

export interface FlagGeneratorActions {
  setWord: (word: string) => void;
  generateRandomWord: () => void;
  setMaxLength: (length: number) => void;
  exportAsSvg: () => void;
  toggleGridMode: () => void;
  changeBackgroundColor: () => void;
}

export const useFlagGenerator = (): [FlagGeneratorState, FlagGeneratorActions] => {
  const [word, setWordInternal] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratedRandomly, setIsGeneratedRandomly] = useState(false);
  const [maxLength, setMaxLengthInternal] = useState(DEFAULT_MAX_LENGTH);
  const [isGridMode, setIsGridMode] = useState(false); // Inicialmente en modo estándar
  const [backgroundColor, setBackgroundColor] = useState('#000000'); // Color inicial: negro

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
  
  // Cambiar color de fondo aleatoriamente
  const changeBackgroundColor = useCallback(() => {
    // Seleccionar un color aleatorio diferente al actual
    let newColor;
    do {
      const randomIndex = Math.floor(Math.random() * BACKGROUND_COLORS.length);
      newColor = BACKGROUND_COLORS[randomIndex];
    } while (newColor === backgroundColor && BACKGROUND_COLORS.length > 1);
    
    setBackgroundColor(newColor);
  }, [backgroundColor]);

  // Export as SVG
  const exportAsSvg = useCallback(() => {
    if (!displayWord) return;
    
    // SVG dimensions
    const width = 1000;
    const height = 1000;
    const flagHeight = 80;
    
    // Create SVG content
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <!-- Black background -->
      <rect width="${width}" height="${height}" fill="black" />`;
      
    // Add flags in the center
    const totalWidth = displayWord.length * flagHeight;
    let xPosition = (width - totalWidth) / 2;
    
    // Add each flag
    for (let i = 0; i < displayWord.length; i++) {
      const letter = displayWord[i];
      const flag = letterToFlag(letter);
      
      if (flag) {
        svgContent += `
        <image 
          x="${xPosition}" 
          y="${(height - flagHeight) / 2}" 
          width="${flagHeight}" 
          height="${flagHeight}" 
          href="${flag.flagPath}"
        />`;
        
        xPosition += flagHeight;
      }
    }
    
    // Add the word text if randomly generated
    if (isGeneratedRandomly) {
      svgContent += `
      <text 
        x="${width/2}" 
        y="${height - 20}" 
        font-family="Druk Text Wide Heavy, system-ui" 
        font-size="48" 
        font-weight="bold"
        text-anchor="middle" 
        fill="white" 
        letter-spacing="0.05em"
      >${displayWord}</text>`;
    }
    
    // Add FLAG SYSTEM signature
    svgContent += `
      <text 
        x="${width - 10}" 
        y="${height - 10}" 
        font-family="monospace" 
        font-size="16" 
        text-anchor="end" 
        fill="#333333"
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
  }, [displayWord, isGeneratedRandomly]);

  return [
    { word, displayWord, isGenerating, isGeneratedRandomly, maxLength, isGridMode, backgroundColor },
    { setWord, generateRandomWord, setMaxLength, exportAsSvg, toggleGridMode, changeBackgroundColor }
  ];
};
