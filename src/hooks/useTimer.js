import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * useTimer
 * Manages the session clock, WPM and accuracy calculations.
 * Activates on first keystroke, stops when isFinished becomes true.
 */
export function useTimer(isActive, isFinished, typedChars, errors) {
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed]     = useState(0) // seconds
  const intervalRef               = useRef(null)

  /* Start timer on first active signal */
  useEffect(() => {
    if (isActive && !startTime) {
      setStartTime(Date.now())
    }
  }, [isActive, startTime])

  /* Tick every 250ms while active */
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000)
      }, 250)
    }
    return () => clearInterval(intervalRef.current)
  }, [isActive, startTime])

  /* Stop on finish */
  useEffect(() => {
    if (isFinished) {
      clearInterval(intervalRef.current)
      if (startTime) setElapsed((Date.now() - startTime) / 1000)
    }
  }, [isFinished, startTime])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setStartTime(null)
    setElapsed(0)
  }, [])

  const wpm = elapsed > 0
    ? Math.max(0, Math.round((typedChars / 5) / (elapsed / 60)))
    : 0

  const accuracy = typedChars > 0
    ? Math.round(((typedChars - errors) / typedChars) * 100)
    : 100

  return { wpm, accuracy, elapsed, reset }
}
