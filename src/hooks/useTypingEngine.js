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
    let nextIndex = currentIndex

    setCharStates(prev => {
      const next = [...prev]
      if (typedChar === snippet[currentIndex]) {
        next[currentIndex] = 'correct'
        nextIndex = currentIndex + 1

        // If we just typed a newline, auto-complete leading whitespace on the next line (VS Code style)
        if (typedChar === '\n') {
          while (nextIndex < snippet.length && (snippet[nextIndex] === ' ' || snippet[nextIndex] === '\t')) {
            next[nextIndex] = 'correct'
            nextIndex++
          }
        }
      } else {
        next[currentIndex] = 'incorrect'
        setErrors(e => e + 1)
        nextIndex = currentIndex + 1
      }
      return next
    })

    setCurrentIndex(prev => {
      const finalIndex = nextIndex
      if (finalIndex >= snippet.length) {
        setIsFinished(true)
        setIsActive(false)
      }
      return finalIndex
    })
  }, [snippet, currentIndex])

  /** Process a backspace */
  const handleBackspace = useCallback(() => {
    if (currentIndex <= 0) return

    let targetIndex = currentIndex - 1

    // VS Code Backspace Undo: Check if we are reversing past auto-skipped indentation.
    // If all characters from the preceding newline up to the current index are spaces/tabs,
    // we backspace past all of them to the newline.
    let isLeadingWhitespace = true
    let scanIndex = targetIndex
    while (scanIndex >= 0) {
      if (snippet[scanIndex] === '\n') {
        break
      }
      if (snippet[scanIndex] !== ' ' && snippet[scanIndex] !== '\t') {
        isLeadingWhitespace = false
        break
      }
      scanIndex--
    }

    if (isLeadingWhitespace && scanIndex >= 0) {
      targetIndex = scanIndex // Jump back to the newline character itself
    }

    setCurrentIndex(targetIndex)
    setCharStates(prev => {
      const next = [...prev]
      for (let i = targetIndex; i < currentIndex; i++) {
        next[i] = 'pending'
      }
      return next
    })
  }, [currentIndex, snippet])

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
