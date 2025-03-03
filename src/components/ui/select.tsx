'use client';

// Componente Select básico basado en componentes existentes
import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { ScrollArea } from './scroll-area'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectProps = {
  children: React.ReactNode
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

type SelectTriggerProps = {
  id?: string
  children: React.ReactNode
  className?: string
}

type SelectValueProps = {
  placeholder?: string
  className?: string
}

type SelectContentProps = {
  children: React.ReactNode
  className?: string
}

type SelectItemProps = {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

// Contexto para comunicar los componentes
const SelectContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  displayValue: React.ReactNode
  setDisplayValue: React.Dispatch<React.SetStateAction<React.ReactNode>>
}>({
  open: false,
  setOpen: () => {},
  value: "",
  onValueChange: () => {},
  disabled: false,
  displayValue: null,
  setDisplayValue: () => {}
})

export const Select = ({ children, value, onValueChange, disabled, className }: SelectProps) => {
  const [open, setOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState<React.ReactNode>(null)
  
  return (
    <SelectContext.Provider value={{ 
      open, 
      setOpen, 
      value,
      onValueChange,
      disabled,
      displayValue,
      setDisplayValue
    }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({ id, children, className }: SelectTriggerProps) => {
  const { open, setOpen, disabled } = React.useContext(SelectContext)
  
  return (
    <Button
      id={id}
      type="button"
      variant="outline"
      className={cn(
        "w-full justify-between flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      onClick={() => setOpen(!open)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  )
}

export const SelectValue = ({ placeholder, className }: SelectValueProps) => {
  const { value, displayValue } = React.useContext(SelectContext)
  
  return (
    <div className={cn("flex-1 text-left truncate", className)}>
      {displayValue || (value ? value : placeholder)}
    </div>
  )
}

export const SelectContent = ({ children, className }: SelectContentProps) => {
  const { open, setOpen } = React.useContext(SelectContext)
  const ref = useRef<HTMLDivElement>(null)
  
  // Cierra el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  return (
    <div 
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
    >
      <ScrollArea className="max-h-60">
        <div className="p-1">{children}</div>
      </ScrollArea>
    </div>
  )
}

export const SelectItem = ({ value, children, className, disabled }: SelectItemProps) => {
  const { onValueChange, setOpen, setDisplayValue } = React.useContext(SelectContext)
  
  const handleSelect = () => {
    if (disabled) return
    onValueChange(value)
    setDisplayValue(children)
    setOpen(false)
  }
  
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleSelect}
      onKeyDown={(e) => e.key === "Enter" && handleSelect()}
      tabIndex={0}
      role="option"
      aria-selected={false}
    >
      {children}
    </div>
  )
}
