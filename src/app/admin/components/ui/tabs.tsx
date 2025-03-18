"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ 
  value, 
  onValueChange, 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-800/50 p-1 text-gray-400",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ 
  value, 
  children, 
  className, 
  ...props 
}, ref) => {
  // Get the active value from the closest Tabs component
  const activeValue = React.useContext(TabsContext)
  const isActive = activeValue?.value === value
  
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => activeValue?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-gray-950 shadow-sm" : "hover:bg-gray-700/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ 
  value, 
  children, 
  className, 
  ...props 
}, ref) => {
  // Get the active value from the closest Tabs component
  const activeValue = React.useContext(TabsContext)
  const isActive = activeValue?.value === value
  
  if (!isActive) return null
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn("mt-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

// Create a context to pass the active value down to the triggers and content
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

// Wrap the Tabs component to provide the context
const TabsProvider: React.FC<TabsProps> = (props) => {
  return (
    <TabsContext.Provider value={{ value: props.value, onValueChange: props.onValueChange }}>
      <Tabs {...props} />
    </TabsContext.Provider>
  )
}

export { TabsProvider as Tabs, TabsList, TabsTrigger, TabsContent }
