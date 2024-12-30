"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface GrammarFeedback {
  type: 'grammar' | 'style' | 'suggestion'
  errors?: any[]
  message?: string
  timestamp: Date
}

interface GrammarContextType {
  feedback: GrammarFeedback[]
  addGrammarFeedback: (feedback: GrammarFeedback) => void
  clearFeedback: () => void
}

const GrammarContext = createContext<GrammarContextType | undefined>(undefined)

export function GrammarProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<GrammarFeedback[]>([])

  const addGrammarFeedback = (newFeedback: GrammarFeedback) => {
    setFeedback(prev => [...prev, newFeedback])
  }

  const clearFeedback = () => {
    setFeedback([])
  }

  return (
    <GrammarContext.Provider value={{ feedback, addGrammarFeedback, clearFeedback }}>
      {children}
    </GrammarContext.Provider>
  )
}

export const useGrammarContext = () => {
  const context = useContext(GrammarContext)
  if (context === undefined) {
    throw new Error('useGrammarContext must be used within a GrammarProvider')
  }
  return context
} 