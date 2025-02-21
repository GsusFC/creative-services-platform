'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getShortcuts, addShortcut, removeShortcut, type Shortcut } from '@/lib/shortcuts'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
}

export function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newShortcut, setNewShortcut] = useState({ title: '', url: '', type: 'link' as const })

  useEffect(() => {
    setShortcuts(getShortcuts())
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.context-menu')) {
        onClose()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClose])

  const handleAddNew = () => {
    if (!newShortcut.title || !newShortcut.url) return
    const added = addShortcut(newShortcut)
    setShortcuts([...shortcuts, added])
    setIsAddingNew(false)
    setNewShortcut({ title: '', url: '', type: 'link' })
  }

  const handleRemove = (id: string) => {
    removeShortcut(id)
    setShortcuts(shortcuts.filter(s => s.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="context-menu fixed bg-black border border-white/20 p-2 shadow-lg z-50"
      style={{ left: x, top: y }}
    >
      <div className="w-64">
        {shortcuts.length > 0 && (
          <div className="mb-2 space-y-1">
            {shortcuts.map(shortcut => (
              <div
                key={shortcut.id}
                className="flex items-center justify-between group px-3 py-2 hover:bg-white/5 transition-colors"
              >
                <a
                  href={shortcut.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-mono text-sm flex-1 truncate"
                >
                  {shortcut.title}
                </a>
                <button
                  onClick={() => handleRemove(shortcut.id)}
                  className="text-white/40 hover:text-white ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {isAddingNew ? (
          <div className="space-y-2 p-2 border border-white/10">
            <input
              type="text"
              placeholder="Title"
              value={newShortcut.title}
              onChange={e => setNewShortcut({ ...newShortcut, title: e.target.value })}
              className="w-full bg-black border border-white/20 text-white px-2 py-1 text-sm font-mono"
            />
            <input
              type="text"
              placeholder="URL"
              value={newShortcut.url}
              onChange={e => setNewShortcut({ ...newShortcut, url: e.target.value })}
              className="w-full bg-black border border-white/20 text-white px-2 py-1 text-sm font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-white/60 hover:text-white text-sm font-mono px-2 py-1"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddNew}
                className="bg-[#00FF00] text-black text-sm font-mono px-2 py-1 hover:bg-[#00FF00]/90"
              >
                ADD
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full text-left px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-mono"
          >
            + ADD SHORTCUT
          </button>
        )}
      </div>
    </motion.div>
  )
}
