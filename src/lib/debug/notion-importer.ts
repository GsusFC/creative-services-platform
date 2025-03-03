'use client';

import { useState } from 'react';

// Types for debugging
export type DebugLevel = 'info' | 'warning' | 'error' | 'success';

export interface DebugMessage {
  id: string;
  timestamp: Date;
  level: DebugLevel;
  message: string;
  source: string;
  data?: Record<string, unknown>;
}

export interface NotionDebugState {
  messages: DebugMessage[];
  isEnabled: boolean;
  isVerbose: boolean;
}

// Create a debug context for the Notion importer
export const useNotionDebugger = () => {
  const [debugState, setDebugState] = useState<NotionDebugState>({
    messages: [],
    isEnabled: true,
    isVerbose: false
  });

  // Add a debug message
  const logMessage = (
    level: DebugLevel,
    message: string,
    source: string,
    data?: unknown
  ) => {
    if (!debugState.isEnabled) return;

    // Convert data to Record<string, unknown> if it exists
    const processedData = data ? 
      (typeof data === 'object' ? data as Record<string, unknown> : { value: data }) : 
      undefined;

    const newMessage: DebugMessage = {
      id: `debug-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      source,
      data: debugState.isVerbose ? processedData : undefined
    };

    setDebugState(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages].slice(0, 100) // Keep last 100 messages
    }));

    // Also log to console for easier debugging
    const consoleMethod = level === 'error' 
      ? console.error 
      : level === 'warning' 
        ? console.warn 
        : console.log;
    
    consoleMethod(`[Notion Importer][${source}] ${message}`, data);
  };

  // Clear all debug messages
  const clearMessages = () => {
    setDebugState(prev => ({
      ...prev,
      messages: []
    }));
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugState(prev => ({
      ...prev,
      isEnabled: !prev.isEnabled
    }));
  };

  // Toggle verbose mode
  const toggleVerboseMode = () => {
    setDebugState(prev => ({
      ...prev,
      isVerbose: !prev.isVerbose
    }));
  };

  // Convenience methods for different log levels
  const info = (message: string, source: string, data?: unknown) => 
    logMessage('info', message, source, data);
  
  const warn = (message: string, source: string, data?: unknown) => 
    logMessage('warning', message, source, data);
  
  const error = (message: string, source: string, data?: unknown) => 
    logMessage('error', message, source, data);
  
  const success = (message: string, source: string, data?: unknown) => 
    logMessage('success', message, source, data);

  // Debug API requests
  const debugFetch = async (url: string, options?: RequestInit) => {
    info(`Fetching ${url}`, 'API');
    
    try {
      const startTime = performance.now();
      const response = await fetch(url, options);
      const endTime = performance.now();
      
      const responseClone = response.clone();
      let responseData;
      
      try {
        responseData = await responseClone.json();
      } catch (e) {
        responseData = { error: 'Could not parse response as JSON' };
      }
      
      if (response.ok) {
        success(
          `Fetch successful (${Math.round(endTime - startTime)}ms)`, 
          'API', 
          { url, options, status: response.status, data: responseData }
        );
      } else {
        error(
          `Fetch failed with status ${response.status}`, 
          'API', 
          { url, options, status: response.status, data: responseData }
        );
      }
      
      return response;
    } catch (err) {
      error(
        `Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        'API', 
        { url, options, error: err }
      );
      throw err;
    }
  };

  // Debug API responses
  const debugResponse = async <T,>(response: Response, source: string): Promise<T> => {
    try {
      const data = await response.json() as T;
      
      if (response.ok) {
        success(`Response processed successfully`, source, data);
      } else {
        error(`Response error: ${response.status}`, source, data);
      }
      
      return data;
    } catch (err) {
      error(
        `Response parsing error: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        source, 
        { status: response.status, error: err }
      );
      throw err;
    }
  };

  // Debug component lifecycle
  const debugComponent = (componentName: string) => {
    info(`Component mounted: ${componentName}`, 'Component');
    
    return () => {
      info(`Component unmounted: ${componentName}`, 'Component');
    };
  };

  return {
    state: debugState,
    info,
    warn,
    error,
    success,
    clearMessages,
    toggleDebugMode,
    toggleVerboseMode,
    debugFetch,
    debugResponse,
    debugComponent
  };
};

// Utility to check Notion API configuration
export const checkNotionConfig = async () => {
  try {
    const response = await fetch('/api/notion/database/structure');
    const data = await response.json();
    
    return {
      isConfigured: data.success === true,
      databaseName: data.databaseName || 'Unknown',
      properties: data.properties || [],
      error: data.error
    };
  } catch (error) {
    return {
      isConfigured: false,
      databaseName: 'Error',
      properties: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Utility to test Notion API connection
export const testNotionConnection = async () => {
  const startTime = performance.now();
  
  try {
    const response = await fetch('/api/notion/database/sample?limit=1');
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    const data = await response.json();
    
    return {
      success: response.ok && data.success === true,
      responseTime,
      projects: data.projects || [],
      error: data.error
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    return {
      success: false,
      responseTime,
      projects: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
