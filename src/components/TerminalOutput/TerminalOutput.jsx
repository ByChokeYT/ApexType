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
    <div className="w-full rounded-2xl border border-white/[0.04] overflow-hidden bg-apex-s2/25 backdrop-blur-md shadow-lg">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04] bg-apex-s2/65">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]" />
        <span className="ml-3 text-[0.65rem] text-apex-muted font-code tracking-wider font-semibold">
          terminal — {language ?? 'output'}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            done ? 'bg-apex-emerald shadow-[0_0_6px_var(--apex-emerald)]' : 'bg-apex-amber animate-pulse shadow-[0_0_6px_var(--apex-amber)]'
          }`} />
          <span className="text-[0.58rem] text-apex-muted font-code font-bold tracking-wide">
            {done ? 'proceso terminado' : 'ejecutando...'}
          </span>
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-6 py-5 font-code text-[0.82rem] leading-relaxed min-h-[90px] bg-apex-black/20">
        {/* Command line */}
        <div className="flex items-center gap-2 mb-3 opacity-60 text-xs">
          <span className="text-apex-violet font-bold">~</span>
          <span className="text-apex-emerald font-bold">$</span>
          <span className="text-apex-muted font-semibold">node snippet.{language === 'python' ? 'py' : language === 'golang' ? 'go' : language === 'java' ? 'java' : language === 'php' ? 'php' : 'js'}</span>
        </div>

        {/* Output lines — appear one by one */}
        <div className="flex flex-col gap-1.5">
          {visibleLines.map((line, i) => (
            <div key={i} className="flex items-start gap-3 animate-fade-up">
              <span className="text-apex-dim select-none text-[0.65rem] pt-[3px] min-w-[1rem] text-right font-bold">{i + 1}</span>
              <span className="text-apex-emerald drop-shadow-[0_0_4px_rgba(16,185,129,0.15)]">{line}</span>
            </div>
          ))}

          {/* Blinking cursor while typing */}
          {!done && (
            <div className="flex items-center gap-3">
              <span className="text-apex-dim text-[0.65rem] min-w-[1rem] text-right font-bold">{visibleLines.length + 1}</span>
              <span className="inline-block w-[7px] h-[1.1em] bg-apex-muted/50 animate-caret-blink shadow-[0_0_4px_currentColor]" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
