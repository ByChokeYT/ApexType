import { useEffect, useState } from 'react'

/**
 * TerminalOutput
 * Simulates a terminal window showing what the typed code would output.
 * Lines appear one by one with a typewriter animation.
 */
export default function TerminalOutput({ output, language }) {
  const lines = (output ?? '').split('\n').filter(Boolean)
  const [visibleLines, setVisibleLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    setVisibleLines([])
    setDone(false)
    if (!lines.length) return

    // Reveal lines one by one
    lines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
        if (i === lines.length - 1) setDone(true)
      }, 180 + i * 260)
    })
  }, [output]) // eslint-disable-line

  return (
    <div className="w-full rounded-xl border border-white/[0.06] overflow-hidden bg-apex-s2">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-apex-surface">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[0.68rem] text-apex-muted font-code tracking-wider">
          terminal — {language ?? 'output'}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${done ? 'bg-apex-emerald' : 'bg-apex-amber animate-pulse'}`} />
          <span className="text-[0.6rem] text-apex-dim font-code">
            {done ? 'proceso terminado' : 'ejecutando...'}
          </span>
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-4 font-code text-[0.88rem] leading-relaxed min-h-[80px]">
        {/* Command line */}
        <div className="flex items-center gap-2 mb-3 opacity-60">
          <span className="text-apex-violet">~</span>
          <span className="text-apex-emerald">$</span>
          <span className="text-apex-muted">node snippet.{language === 'python' ? 'py' : language === 'golang' ? 'go' : language === 'java' ? 'java' : language === 'php' ? 'php' : 'js'}</span>
        </div>

        {/* Output lines — appear one by one */}
        <div className="flex flex-col gap-1">
          {visibleLines.map((line, i) => (
            <div key={i} className="flex items-start gap-3 animate-fade-up">
              <span className="text-apex-dim select-none text-[0.7rem] pt-[2px] min-w-[1rem] text-right">{i + 1}</span>
              <span className="text-apex-emerald">{line}</span>
            </div>
          ))}

          {/* Blinking cursor while typing */}
          {!done && (
            <div className="flex items-center gap-3">
              <span className="text-apex-dim text-[0.7rem] min-w-[1rem] text-right">{visibleLines.length + 1}</span>
              <span className="inline-block w-[8px] h-[1em] bg-apex-muted/50 animate-caret-blink" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
