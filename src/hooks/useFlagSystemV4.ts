import { useState, useCallback, useRef } from 'react';
import { useFlagHistory } from '@/contexts/FlagHistoryContext';
import { getRandomWord } from '@/lib/flag-system/dictionary';
import { supportedLetters } from '@/lib/flag-system/flagUtils';

// Constantes
const ANIMATION_DELAY = 150;
const MAX_LENGTH = 10;

// Colores de fondo disponibles
const BACKGROUND_COLORS = [
  '#000000', // Negro
  '#00162e', // Azul oscuro
  '#1a1a1a', // Gris muy oscuro
  '#271527', // Púrpura oscuro
  '#2E1503', // Marrón oscuro
  '#FFFFFF', // Blanco
];

export interface FlagSystemState {
  word: string;
  displayWord: string;
  isGenerating: boolean;
  maxLength: number;
  isGridMode: boolean;
  backgroundColor: string;
  showText: boolean;
}

export interface FlagSystemActions {
  setWord: (word: string) => void;
  generateRandomWord: () => Promise<void>;
  setMaxLength: (length: number) => void;
  toggleGridMode: () => void;
  toggleShowText: () => void;
  changeBackgroundColor: (specificColor?: string) => void;
}

export const useFlagSystemV4 = (): [FlagSystemState, FlagSystemActions] => {
  // Estado principal
  const [word, setWordInternal] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [maxLength, setMaxLengthInternal] = useState(MAX_LENGTH);
  const [isGridMode, setIsGridMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [showText, setShowText] = useState(false);
  
  // Referencias para intervalos
  const animationInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Acceso al historial de banderas
  const { addToHistory } = useFlagHistory();

  // Manejar cambio de palabra - con filtrado de caracteres
  const setWord = useCallback((value: string) => {
    // Filtrar solo letras, convertir a mayúsculas y limitar longitud
    const filteredValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, maxLength);
    setWordInternal(filteredValue);
    setDisplayWord(filteredValue);
    
    // Añadir al historial solo si tiene contenido
    if (filteredValue) {
      addToHistory(filteredValue);
    }
  }, [maxLength, addToHistory]);

  // Generar palabra aleatoria con animación
  const generateRandomWord = useCallback(async () => {
    // Limpiamos cualquier intervalo pendiente
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
    }
    
    setIsGenerating(true);
    
    try {
      // Obtener palabra aleatoria con el máximo de longitud permitida
      const randomWord = getRandomWord(maxLength);
      
      // Animar la generación de la palabra letra por letra
      let i = 0;
      animationInterval.current = setInterval(() => {
        setDisplayWord(randomWord.substring(0, i + 1));
        i++;
        if (i === randomWord.length) {
          if (animationInterval.current) {
            clearInterval(animationInterval.current);
            animationInterval.current = null;
          }
          setWordInternal(randomWord);
          setIsGenerating(false);
          
          // Añadir al historial
          addToHistory(randomWord);
        }
      }, ANIMATION_DELAY);
    } catch (error) {
      console.error('Error al generar palabra aleatoria:', error);
      setIsGenerating(false);
    }
  }, [maxLength, addToHistory]);

  // Manejar cambio de longitud máxima
  const setMaxLength = useCallback((newLength: number) => {
    const clampedLength = Math.min(Math.max(1, newLength), MAX_LENGTH);
    setMaxLengthInternal(clampedLength);
    
    // Si la palabra actual es más larga que el nuevo máximo, truncarla
    if (word.length > clampedLength) {
      const truncatedWord = word.substring(0, clampedLength);
      setWordInternal(truncatedWord);
      setDisplayWord(truncatedWord);
    }
  }, [word]);

  // Alternar entre modos grid/lista
  const toggleGridMode = useCallback(() => {
    setIsGridMode(prev => !prev);
  }, []);
  
  // Alternar visualización de texto en banderas
  const toggleShowText = useCallback(() => {
    setShowText(prev => !prev);
  }, []);
  
  // Cambiar color de fondo
  const changeBackgroundColor = useCallback((specificColor?: string) => {
    if (specificColor) {
      // Si se proporciona un color específico, establecerlo
      setBackgroundColor(specificColor);
    } else {
      // Seleccionar un color aleatorio diferente del actual
      let newColor;
      do {
        const randomIndex = Math.floor(Math.random() * BACKGROUND_COLORS.length);
        newColor = BACKGROUND_COLORS[randomIndex];
      } while (newColor === backgroundColor && BACKGROUND_COLORS.length > 1);
      
      setBackgroundColor(newColor);
    }
  }, [backgroundColor]);

  return [
    { word, displayWord, isGenerating, maxLength, isGridMode, backgroundColor, showText },
    { setWord, generateRandomWord, setMaxLength, toggleGridMode, toggleShowText, changeBackgroundColor }
  ];
};
