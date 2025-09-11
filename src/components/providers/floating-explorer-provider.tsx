"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from "react"

interface FloatingExplorerContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleExplorer: () => void
  shareOpen: boolean
  setShareOpen: (open: boolean) => void
  toggleShare: () => void
}

const FloatingExplorerContext = createContext<FloatingExplorerContextType | undefined>(undefined)

export function FloatingExplorerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const toggleExplorer = useCallback(() => setIsOpen(prev => !prev), [])
  const toggleShare = useCallback(() => setShareOpen(prev => !prev), [])

  const contextValue = useMemo(() => ({ 
    isOpen, 
    setIsOpen, 
    toggleExplorer, 
    shareOpen, 
    setShareOpen, 
    toggleShare 
  }), [isOpen, shareOpen, toggleExplorer, toggleShare])

  return (
    <FloatingExplorerContext.Provider value={contextValue}>
      {children}
    </FloatingExplorerContext.Provider>
  )
}

export function useFloatingExplorer() {
  const context = useContext(FloatingExplorerContext)
  if (context === undefined) {
    throw new Error("useFloatingExplorer must be used within a FloatingExplorerProvider")
  }
  return context
}