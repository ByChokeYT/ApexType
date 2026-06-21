import { useEffect, useRef, useState, useCallback } from 'react'

const CHAR_CLASS = {
  pending:   'text-apex-dim',
  correct:   'text-apex-emerald',
  incorrect: 'text-apex-amber underline decoration-dotted underline-offset-2',
  current:   'text-apex-text',
}

export default function TypingArea({ snippet, charStates, currentIndex, badge, onInput, onBackspace }) {
  const wrapperRef  = useRef(null)
  const inputRef    = useRef(null)
  const charRefs    = useRef([])
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 })

  /* Focus input on mount + on any click in the area */
  useEffect(() => { inputRef.current?.focus() }, [])

  /* Update caret position whenever index changes */
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const target = charRefs.current[currentIndex] ?? charRefs.current[currentIndex - 1]
    if (!target) return

    const wRect = wrapper.getBoundingClientRect()
    const cRect = target.getBoundingClientRect()

    const left = currentIndex >= charStates.length
      ? cRect.right - wRect.left
      : cRect.left  - wRect.left

    setCaretPos({ top: cRect.top - wRect.top, left })
  }, [currentIndex, charStates.length])

  /* Keyboard handler */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') { e.preventDefault(); return } // Tab handled in parent
    if (e.key === 'Backspace') { e.preventDefault(); onBackspace(); return }
  }, [onBackspace])

  const handleInput = useCallback((e) => {
    const val = e.target.value
    if (!val) return
    const char = val[val.length - 1]
    onInput(char)
    e.target.value = ''
  }, [onInput])

  return (
    <div
      className="flex flex-col gap-6 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Badge */}
      <span className="font-code text-[0.7rem] text-apex-muted tracking-widest uppercase">
        {badge}
      </span>

      {/* Text display */}
      <div
        ref={wrapperRef}
        className="relative font-code text-[1.6rem] leading-[1.8] whitespace-pre-wrap break-words select-none max-h-[220px] overflow-hidden"
      >
        {/* Caret */}
        <span
          className="absolute w-[2px] rounded-[1px] bg-apex-violet animate-caret-blink pointer-events-none"
          style={{ top: caretPos.top, left: caretPos.left, height: '1.5em' }}
        />

        {/* Characters */}
        {snippet.split('').map((char, i) => (
          <span
            key={i}
            ref={el => charRefs.current[i] = el}
            className={`transition-colors duration-[60ms] ${CHAR_CLASS[charStates[i] ?? 'pending']} ${i === currentIndex ? CHAR_CLASS.current : ''}`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Hidden capture input */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none w-px h-px"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div>
  )
}
