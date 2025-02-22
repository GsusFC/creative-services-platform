'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { motion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

interface ExtendedTooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  accentColor?: string;
}

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 20
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  ExtendedTooltipContentProps
>(({ className, sideOffset = 4, accentColor, ...props }, ref) => {
  const y = useSpring(10, spring)
  const opacity = useSpring(0, spring)

  React.useEffect(() => {
    y.set(0)
    opacity.set(1)
    return () => {
      y.set(10)
      opacity.set(0)
    }
  }, [])

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn('z-50', className)}
        {...props}
      >
        <motion.div
          style={{
            y,
            opacity,
            borderColor: accentColor || 'rgba(255, 255, 255, 0.2)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          className={cn(
            'px-3 py-2 text-sm bg-black shadow-lg relative',
            'font-mono'
          )}
        >
          {props.children}
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent"
            style={{
              borderTopColor: accentColor || 'rgba(255, 255, 255, 0.2)',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              delay: 0.1
            }}
          />
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
