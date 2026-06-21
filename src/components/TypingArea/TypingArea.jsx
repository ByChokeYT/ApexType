import { useEffect, useRef, useCallback } from 'react'
import { playKeySound } from '../../utils/sound.js'

const CHAR_STATE_CLASS = {
  pending:   'text-apex-dim opacity-35',
  correct:   'text-apex-emerald font-medium drop-shadow-[0_0_1px_rgba(16,185,129,0.3)]',
  incorrect: 'text-apex-amber bg-apex-amber/10 border-b border-dotted border-apex-amber/80 rounded-sm px-[1px] -mx-[1px]',
}

export default function TypingArea({ snippet, charStates, currentIndex, badge, soundMode, onInput, onBackspace }) {
  const wrapperRef = useRef(null)
  const inputRef   = useRef(null)
  const charRefs   = useRef([])
  const caretRef   = useRef(null)

  // Auto-focus on mount & refocuser
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
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (currentIndex > 0) {
        playKeySound(soundMode, false)
      }
      onBackspace()
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const isCorrect = snippet[currentIndex] === '\n'
      playKeySound(soundMode, !isCorrect)
      onInput('\n')
      return
    }
  }, [onBackspace, currentIndex, soundMode, onInput, snippet])

  const handleInputEvent = useCallback((e) => {
    const val = e.target.value
    if (!val) return
    const typedChar = val[val.length - 1]
    const isCorrect = typedChar === snippet[currentIndex]

    // Play click sound or buzzer on error
    playKeySound(soundMode, !isCorrect)

    onInput(typedChar)
    e.target.value = ''
  }, [onInput, snippet, currentIndex, soundMode])

  return (
    <div 
      className="w-full flex flex-col gap-6 bg-apex-s2/25 border border-white/[0.04] backdrop-blur-md rounded-2xl p-7 md:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/[0.06] cursor-text relative overflow-hidden" 
      onClick={() => inputRef.current?.focus()}
    >
      {/* Background flare inside card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-apex-glow opacity-30 rounded-full blur-2xl pointer-events-none" />

      {/* Header / Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-code text-[0.65rem] text-apex-violet
                         bg-apex-violet/5 border border-apex-violet/15 px-3 py-1 rounded-lg
                         tracking-[2px] uppercase font-bold shadow-[0_0_8px_var(--apex-glow)]">
          <span className="w-1.5 h-1.5 rounded-full bg-apex-violet animate-pulse inline-block shadow-[0_0_4px_var(--apex-violet)]" />
          {badge}
        </span>
        <span className="text-[0.62rem] text-apex-muted font-code font-medium tracking-wide">
          Pulsa <kbd className="text-[0.58rem] bg-white/[0.02] border-b-2 border-white/[0.06] px-1 py-0.5 rounded text-apex-text">Tab</kbd> para reiniciar
        </span>
      </div>

      {/* Typing display */}
      <div
        ref={wrapperRef}
        className="relative font-code text-[1.65rem] leading-[1.8] whitespace-pre-wrap break-words
                   select-none min-h-[160px] text-apex-text"
      >
        {/* Caret (Dynamic Neon Glowing Cursor) */}
        <span
          ref={caretRef}
          className="absolute w-[2.5px] rounded-full bg-apex-violet animate-caret-blink pointer-events-none"
          style={{ 
            height: '1.45em', 
            transition: 'left 0.07s cubic-bezier(0.19, 1, 0.22, 1), top 0.09s cubic-bezier(0.19, 1, 0.22, 1)',
            boxShadow: '0 0 10px var(--apex-violet), 0 0 4px var(--apex-violet)'
          }}
        />

        {/* Characters */}
        {snippet.split('').map((char, i) => {
          const state = charStates[i] ?? 'pending'
          const isCurrent = i === currentIndex
          
          if (char === '\n') {
            return (
              <span
                key={i}
                ref={el => charRefs.current[i] = el}
                className={`${CHAR_STATE_CLASS[state]} ${
                  isCurrent ? '!text-apex-text border-b-2 border-apex-violet/40 pb-[2px]' : ''
                } transition-all duration-[60ms] text-[1.1rem] opacity-50`}
              >
                ↵{'\n'}
              </span>
            )
          }

          return (
            <span
              key={i}
              ref={el => charRefs.current[i] = el}
              className={`${CHAR_STATE_CLASS[state]} ${
                isCurrent ? '!text-apex-text border-b-2 border-apex-violet/40 pb-[2px]' : ''
              } transition-all duration-[60ms]`}
            >
              {char}
            </span>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full flex items-center gap-3 mt-2">
        <div className="flex-1 h-[3px] bg-white/[0.03] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-apex-violet rounded-full transition-all duration-200 shadow-[0_0_8px_var(--apex-violet)]"
            style={{ width: `${snippet.length > 0 ? (currentIndex / snippet.length) * 100 : 0}%` }}
          />
        </div>
        <span className="font-code text-[0.62rem] text-apex-muted font-bold min-w-[2.5rem] text-right">
          {snippet.length > 0 ? Math.round((currentIndex / snippet.length) * 100) : 0}%
        </span>
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
