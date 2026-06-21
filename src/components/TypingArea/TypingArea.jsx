import { useEffect, useRef, useCallback } from 'react'

const CHAR_STATE_CLASS = {
  pending:   'text-apex-dim',
  correct:   'text-apex-emerald',
  incorrect: 'text-apex-amber underline decoration-dotted underline-offset-4',
}

export default function TypingArea({ snippet, charStates, currentIndex, badge, onInput, onBackspace }) {
  const wrapperRef = useRef(null)
  const inputRef   = useRef(null)
  const charRefs   = useRef([])
  const caretRef   = useRef(null)

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Move caret on index change
  useEffect(() => {
    const wrapper = wrapperRef.current
    const caret   = caretRef.current
    if (!wrapper || !caret) return

    const target = charRefs.current[currentIndex] ?? charRefs.current[currentIndex - 1]
    if (!target) return

    const wRect = wrapper.getBoundingClientRect()
    const cRect = target.getBoundingClientRect()

    const left = currentIndex >= (snippet?.length ?? 0)
      ? cRect.right - wRect.left
      : cRect.left  - wRect.left

    caret.style.top  = `${cRect.top - wRect.top}px`
    caret.style.left = `${left}px`
  }, [currentIndex, snippet])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') { e.preventDefault(); return }
    if (e.key === 'Backspace') { e.preventDefault(); onBackspace(); }
  }, [onBackspace])

  const handleInputEvent = useCallback((e) => {
    const val = e.target.value
    if (!val) return
    onInput(val[val.length - 1])
    e.target.value = ''
  }, [onInput])

  return (
    <div className="w-full flex flex-col gap-5" onClick={() => inputRef.current?.focus()}>

      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-code text-[0.68rem] text-apex-muted
                         bg-apex-s2 border border-white/[0.05] px-2.5 py-1 rounded-md
                         tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-apex-violet animate-pulse inline-block" />
          {badge}
        </span>
      </div>

      {/* Typing display */}
      <div
        ref={wrapperRef}
        className="relative font-code text-[1.55rem] leading-[1.85] whitespace-pre-wrap break-words
                   select-none cursor-text min-h-[160px]"
      >
        {/* Caret */}
        <span
          ref={caretRef}
          className="absolute w-[2px] rounded-sm bg-apex-violet animate-caret-blink pointer-events-none"
          style={{ height: '1.6em', transition: 'left 0.05s ease, top 0.05s ease' }}
        />

        {/* Characters */}
        {snippet.split('').map((char, i) => {
          const state = charStates[i] ?? 'pending'
          const isCurrent = i === currentIndex
          return (
            <span
              key={i}
              ref={el => charRefs.current[i] = el}
              className={`${CHAR_STATE_CLASS[state]} ${isCurrent ? '!text-apex-text' : ''} transition-colors duration-[60ms]`}
            >
              {char}
            </span>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-apex-s3 rounded-full overflow-hidden">
        <div
          className="h-full bg-apex-violet/40 rounded-full transition-all duration-150"
          style={{ width: `${snippet.length > 0 ? (currentIndex / snippet.length) * 100 : 0}%` }}
        />
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        className="fixed opacity-0 pointer-events-none -top-full"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="off"
        onKeyDown={handleKeyDown}
        onInput={handleInputEvent}
      />
    </div>
  )
}
