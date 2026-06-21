import TerminalOutput from '../TerminalOutput/TerminalOutput.jsx'

const GRADE_CONFIG = {
  S: { color: 'text-apex-violet', label: 'Perfecto' },
  A: { color: 'text-apex-emerald', label: 'Excelente' },
  B: { color: 'text-apex-emerald/70', label: 'Muy bien' },
  C: { color: 'text-apex-amber', label: 'Regular' },
  D: { color: 'text-apex-amber/70', label: 'Practica más' },
}

const DIFF_LABEL = { basico: '🟢 Básico', medio: '🟡 Medio', profesional: '🔴 Profesional' }

export default function StatsBoard({ wpm, accuracy, errors, elapsed, snippet, onRestart }) {
  const grade = accuracy >= 98 ? 'S' : accuracy >= 92 ? 'A' : accuracy >= 82 ? 'B' : accuracy >= 68 ? 'C' : 'D'
  const { color: gradeColor, label: gradeLabel } = GRADE_CONFIG[grade]

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-up">

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-apex-emerald" />
            <span className="text-[0.65rem] font-semibold text-apex-muted tracking-[2px] uppercase">
              Sesión completada
            </span>
          </div>
          <div className="flex items-center gap-3 text-[0.7rem] text-apex-dim">
            {snippet?.difficulty && (
              <span>{DIFF_LABEL[snippet.difficulty]}</span>
            )}
            {elapsed > 0 && (
              <>
                <span className="text-white/10">·</span>
                <span>{elapsed.toFixed(1)}s</span>
              </>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="WPM"      value={wpm}          large accent="violet" />
          <StatCard label="Precisión" value={`${accuracy}%`} large />
          <StatCard label="Errores"  value={errors} />
          <div className="bg-apex-s2 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">Nota</span>
            <span className={`font-code text-[2.5rem] font-bold leading-none ${gradeColor}`}>{grade}</span>
            <span className={`text-[0.62rem] font-medium ${gradeColor} opacity-70`}>{gradeLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Terminal output ─────────────────────────────────────── */}
      {snippet?.output && snippet?.language && (
        <div className="flex flex-col gap-2">
          <span className="text-[0.62rem] font-semibold text-apex-dim tracking-[2px] uppercase flex items-center gap-2">
            <span>Salida del programa</span>
            <span className="flex-1 h-px bg-white/[0.04]" />
          </span>
          <TerminalOutput output={snippet.output} language={snippet.language} />
        </div>
      )}

      {/* ── Restart ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-[0.85rem] font-semibold
                     bg-apex-s2 text-apex-text border border-white/[0.08]
                     hover:bg-apex-s3 hover:border-white/[0.14]
                     transition-all duration-150 group"
        >
          Siguiente fragmento
          <span className="text-apex-muted group-hover:text-apex-text transition-colors text-base">→</span>
        </button>
        <span className="text-[0.65rem] text-apex-dim">
          o{' '}
          <kbd className="font-code text-[0.6rem] text-apex-muted border border-white/[0.06] border-b-2 px-1.5 py-0.5 rounded bg-apex-s2">Tab</kbd>
        </span>
      </div>
    </div>
  )
}

function StatCard({ label, value, large = false, accent }) {
  const valueClass = accent === 'violet'
    ? 'text-apex-violet'
    : 'text-apex-text'

  return (
    <div className="bg-apex-s2 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center gap-1">
      <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">{label}</span>
      <span className={`font-code font-bold leading-none tracking-tight ${large ? 'text-[2.5rem]' : 'text-[2rem]'} ${valueClass}`}>
        {value}
      </span>
    </div>
  )
}
