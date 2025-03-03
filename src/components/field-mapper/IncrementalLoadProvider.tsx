'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define load stages for incremental loading
export enum LoadStage {
  Initial = 'initial',
  NotionFields = 'notion_fields',
  WebsiteFields = 'website_fields',
  Mappings = 'mappings',
  Validation = 'validation',
  Complete = 'complete',
  Error = 'error'
}

// Define the context type
interface LoadProgressContextType {
  stage: LoadStage
  progress: number
  error: string | null
  setStage: (stage: LoadStage) => void
  setProgress: (progress: number) => void
  setError: (error: string | null) => void
  completeStage: (stage: LoadStage) => void
  isStageComplete: (stage: LoadStage) => boolean
  completedStages: Set<LoadStage>
}

// Create context with default values
const LoadProgressContext = createContext<LoadProgressContextType>({
  stage: LoadStage.Initial,
  progress: 0,
  error: null,
  setStage: () => {},
  setProgress: () => {},
  setError: () => {},
  completeStage: () => {},
  isStageComplete: () => false,
  completedStages: new Set()
})

// Provider props
interface IncrementalLoadProviderProps {
  children: ReactNode
}

// Provider component
export function IncrementalLoadProvider({ children }: IncrementalLoadProviderProps) {
  const [stage, setStage] = useState<LoadStage>(LoadStage.Initial)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [completedStages, setCompletedStages] = useState<Set<LoadStage>>(new Set())

  // Mark a stage as complete
  const completeStage = (stage: LoadStage) => {
    setCompletedStages(prev => {
      const newSet = new Set(prev)
      newSet.add(stage)
      return newSet
    })
  }

  // Check if a stage is complete
  const isStageComplete = (stage: LoadStage) => {
    return completedStages?.has(stage)
  }

  // Reset progress when stage changes
  useEffect(() => {
    setProgress(0)
  }, [stage])

  return (
    <LoadProgressContext.Provider 
      value={{ 
        stage, 
        progress, 
        error,
        setStage, 
        setProgress,
        setError,
        completeStage, 
        isStageComplete,
        completedStages
      }}
    >
      {children}
    </LoadProgressContext.Provider>
  )
}

// Custom hook to use the load progress context
export function useLoadProgress() {
  const context = useContext(LoadProgressContext)
  if (context === undefined) {
    throw new Error('useLoadProgress must be used within an IncrementalLoadProvider')
  }
  return context
}

// Loading indicator component
export function LoadingIndicator() {
  const context = useContext(LoadProgressContext);
  if (context === undefined) {
    throw new Error('LoadingIndicator must be used within an IncrementalLoadProvider');
  }
  
  const { stage, progress, completedStages, error } = context;
  
  // Calculate overall progress
  const stageWeights = {
    [LoadStage.Initial]: 0,
    [LoadStage.NotionFields]: 0.2,
    [LoadStage.WebsiteFields]: 0.2,
    [LoadStage.Mappings]: 0.3,
    [LoadStage.Validation]: 0.3,
    [LoadStage.Complete]: 0,
    [LoadStage.Error]: 0
  }
  
  const stageOrder = [
    LoadStage.Initial,
    LoadStage.NotionFields,
    LoadStage.WebsiteFields,
    LoadStage.Mappings,
    LoadStage.Validation,
    LoadStage.Complete
  ]
  
  const stageIndex = stageOrder?.indexOf(stage)
  
  // Calculate completed weight
  let completedWeight = 0
  for (let i = 0; i < stageIndex; i++) {
    if (completedStages?.has(stageOrder[i])) {
      completedWeight += stageWeights[stageOrder[i]]
    }
  }
  
  // Current stage progress
  const currentStageProgress = progress * stageWeights[stage]
  
  // Total progress (0-100)
  const totalProgress = Math?.min(100, Math?.round((completedWeight + currentStageProgress) * 100))
  
  // Stage descriptions
  const stageDescriptions = {
    [LoadStage.Initial]: 'Initializing...',
    [LoadStage.NotionFields]: 'Loading Notion fields...',
    [LoadStage.WebsiteFields]: 'Loading website fields...',
    [LoadStage.Mappings]: 'Loading field mappings...',
    [LoadStage.Validation]: 'Validating mappings...',
    [LoadStage.Complete]: 'Complete',
    [LoadStage.Error]: 'Error loading data'
  }
  
  // If we're in error state, show error message
  if (stage === LoadStage.Error && error) {
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-red-400">Error loading data</span>
          <span className="text-sm text-red-400">Failed</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: '100%' }}
          ></div>
        </div>
        <p className="text-sm text-red-400 mt-2">{error}</p>
        <button 
          className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-sm rounded"
          onClick={() => window?.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-zinc-400">{stageDescriptions[stage]}</span>
        <span className="text-sm text-zinc-400">{totalProgress}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${totalProgress}%` }}
        ></div>
      </div>
    </div>
  )
}
