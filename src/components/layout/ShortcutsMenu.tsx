'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getShortcuts, type Shortcut } from '@/lib/shortcuts'

interface ShortcutsMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function ShortcutsMenu({ isOpen, onClose }: ShortcutsMenuProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  useEffect(() => {
    setShortcuts(getShortcuts())
  }, [isOpen]) // Refresh shortcuts when menu opens

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.shortcuts-menu') && !target.closest('.logo-button')) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="shortcuts-menu fixed left-1/2 top-[90px] -translate-x-1/2 w-[280px] bg-black border border-white/20 shadow-2xl z-50"
    >
      <div className="p-2">
        {shortcuts.length > 0 ? (
          <div className="space-y-1">
            {shortcuts.map((shortcut) => (
              <a
                key={shortcut.id}
                href={shortcut.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 hover:bg-white/5 transition-colors text-white/75 hover:text-white font-mono text-sm"
              >
                {shortcut.title}
              </a>
            ))}
          </div>
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-white/40 font-mono text-sm">No shortcuts yet</p>
            <a
              href="/settings"
              className="inline-block mt-2 text-[#00FF00] hover:text-[#00FF00]/80 font-mono text-sm"
            >
              Add in Settings →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}
