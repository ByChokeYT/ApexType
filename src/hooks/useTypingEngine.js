import { useState, useCallback } from 'react'

/**
 * useTypingEngine
 * Pure logic hook — no DOM manipulation, no timers.
 * Manages character states, index tracking and errors.
 */
export function useTypingEngine() {
  const [snippet, setSnippet]             = useState('')
  const [charStates, setCharStates]       = useState([]) // 'pending' | 'correct' | 'incorrect'
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [errors, setErrors]               = useState(0)
  const [isActive, setIsActive]           = useState(false)
  const [isFinished, setIsFinished]       = useState(false)

  /** Load a new snippet and reset all state */
  const reset = useCallback((newSnippet) => {
    setSnippet(newSnippet)
    setCharStates(new Array(newSnippet.length).fill('pending'))
    setCurrentIndex(0)
    setErrors(0)
    setIsActive(false)
    setIsFinished(false)
  }, [])

  /** Process a typed character */
  const handleInput = useCallback((typedChar) => {
    setIsActive(true)
    setCharStates(prev => {
      const next = [...prev]
      if (typedChar === snippet[currentIndex]) {
        next[currentIndex] = 'correct'
      } else {
        next[currentIndex] = 'incorrect'
        setErrors(e => e + 1)
      }
      return next
    })

    setCurrentIndex(prev => {
      const next = prev + 1
      if (next >= snippet.length) {
        setIsFinished(true)
        setIsActive(false)
      }
      return next
    })
  }, [snippet, currentIndex])

  /** Process a backspace */
  const handleBackspace = useCallback(() => {
    if (currentIndex <= 0) return
    setCurrentIndex(prev => prev - 1)
    setCharStates(prev => {
      const next = [...prev]
      next[currentIndex - 1] = 'pending'
      return next
    })
  }, [currentIndex])

  return {
    snippet,
    charStates,
    currentIndex,
    errors,
    isActive,
    isFinished,
    reset,
    handleInput,
    handleBackspace,
  }
}
