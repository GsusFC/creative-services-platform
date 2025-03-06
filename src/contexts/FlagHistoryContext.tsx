import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FlagHistoryContextType {
  history: string[];
  addToHistory: (word: string) => void;
  clearHistory: () => void;
}

const FlagHistoryContext = createContext<FlagHistoryContextType | undefined>(undefined);

export const FlagHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<string[]>([]);
  
  const addToHistory = useCallback((word: string) => {
    if (word && !history.includes(word)) {
      setHistory(prev => [word, ...prev].slice(0, 10)); // Keep only last 10
    }
  }, [history]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);
  
  return (
    <FlagHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </FlagHistoryContext.Provider>
  );
};

export const useFlagHistory = (): FlagHistoryContextType => {
  const context = useContext(FlagHistoryContext);
  if (context === undefined) {
    throw new Error('useFlagHistory must be used within a FlagHistoryProvider');
  }
  return context;
};
