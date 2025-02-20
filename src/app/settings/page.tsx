'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getShortcuts, addShortcut, removeShortcut, type Shortcut } from '@/lib/shortcuts'

export default function SettingsPage() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [newShortcut, setNewShortcut] = useState({ title: '', url: '', type: 'link' as const })
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setShortcuts(getShortcuts())
  }, [])

  const handleAddNew = () => {
    if (!newShortcut.title || !newShortcut.url) return
    const added = addShortcut(newShortcut)
    setShortcuts([...shortcuts, added])
    setNewShortcut({ title: '', url: '', type: 'link' })
    setIsAdding(false)
  }

  const handleRemove = (id: string) => {
    removeShortcut(id)
    setShortcuts(shortcuts.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white pt-[120px] pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
          SETTINGS
        </h1>

        <div className="space-y-12">
          {/* Shortcuts Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>
              SHORTCUTS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add New Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                {isAdding ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newShortcut.title}
                      onChange={e => setNewShortcut({ ...newShortcut, title: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm font-mono"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={newShortcut.url}
                      onChange={e => setNewShortcut({ ...newShortcut, url: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm font-mono"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-white/60 hover:text-white text-sm font-mono px-3 py-2"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleAddNew}
                        className="bg-[#00FF00] text-black text-sm font-mono px-3 py-2 rounded hover:bg-[#00FF00]/90"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/60 group-hover:text-white"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                      <span className="text-2xl">+</span>
                    </div>
                    <span className="font-mono text-sm">ADD SHORTCUT</span>
                  </button>
                )}
              </motion.div>

              {/* Existing Shortcuts */}
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
                >
                  <button
                    onClick={() => handleRemove(shortcut.id)}
                    className="absolute top-3 right-3 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <a
                    href={shortcut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="font-mono text-lg mb-2">{shortcut.title}</h3>
                    <p className="text-white/60 text-sm truncate font-mono">{shortcut.url}</p>
                  </a>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Other settings sections can be added here */}
        </div>
      </div>
    </div>
  )
}
