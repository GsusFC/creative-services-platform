export type Shortcut = {
  id: string
  title: string
  url: string
  type: 'document' | 'link'
}

const DEFAULT_SHORTCUTS: Shortcut[] = []

export const getShortcuts = (): Shortcut[] => {
  if (typeof window === 'undefined') return DEFAULT_SHORTCUTS
  const stored = window.localStorage.getItem('shortcuts')
  return stored ? JSON.parse(stored) : DEFAULT_SHORTCUTS
}

export const setShortcuts = (shortcuts: Shortcut[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('shortcuts', JSON.stringify(shortcuts))
}

export const addShortcut = (shortcut: Omit<Shortcut, 'id'>) => {
  const shortcuts = getShortcuts()
  const newShortcut = {
    ...shortcut,
    id: Math.random().toString(36).substr(2, 9)
  }
  setShortcuts([...shortcuts, newShortcut])
  return newShortcut
}

export const removeShortcut = (id: string) => {
  const shortcuts = getShortcuts()
  setShortcuts(shortcuts.filter(s => s.id !== id))
}
