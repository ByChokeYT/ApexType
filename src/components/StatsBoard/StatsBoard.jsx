import TerminalOutput from '../TerminalOutput/TerminalOutput.jsx'

const GRADE_CONFIG = {
  S: { color: 'text-apex-violet', label: 'Perfecto', glow: 'shadow-[0_0_20px_var(--apex-glow)]' },
  A: { color: 'text-apex-emerald', label: 'Excelente', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]' },
  B: { color: 'text-apex-emerald/80', label: 'Muy bien', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  C: { color: 'text-apex-amber', label: 'Regular', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  D: { color: 'text-apex-amber/70', label: 'Practica más', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.1)]' },
}

const DIFF_LABEL = { basico: '🟢 Básico', medio: '🟡 Medio', profesional: '🔴 Profesional' }

export default function StatsBoard({ wpm, accuracy, errors, elapsed, snippet, onRestart }) {
  const grade = accuracy >= 98 ? 'S' : accuracy >= 92 ? 'A' : accuracy >= 82 ? 'B' : accuracy >= 68 ? 'C' : 'D'
  const { color: gradeColor, label: gradeLabel, glow: gradeGlow } = GRADE_CONFIG[grade]

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-up">

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-apex-emerald animate-pulse shadow-[0_0_8px_var(--apex-emerald)]" />
            <span className="text-[0.62rem] font-bold text-apex-muted tracking-[2.5px] uppercase">
              Sesión completada
            </span>
          </div>
          <div className="flex items-center gap-3 text-[0.68rem] font-code text-apex-muted">
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
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="WPM"      value={wpm}          large accent="violet" />
          <StatCard label="Precisión" value={`${accuracy}%`} large accent="emerald" />
          <StatCard label="Errores"  value={errors} accent="amber" />
          
          {/* Futuristic Grade Card with Rotating Radar Aura */}
          <div className="bg-apex-s2/25 border border-white/[0.04] backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center gap-0.5 shadow-lg relative overflow-hidden group min-h-[110px]">
            <span className="text-[0.55rem] font-bold text-apex-muted tracking-[2px] uppercase z-10">Nota</span>
            
            {/* Spinning decorative frame */}
            <div className="w-16 h-16 rounded-full border border-dashed border-apex-violet/30 absolute z-0 animate-[spin_12s_linear_infinite]" />
            <div className="w-14 h-14 rounded-full border border-dotted border-apex-violet/10 absolute z-0 animate-[spin_6s_linear_infinite_reverse]" />
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-apex-black/50 border border-white/[0.04] z-10 ${gradeGlow}`}>
              <span className={`font-code text-[2.1rem] font-black leading-none ${gradeColor}`}>{grade}</span>
            </div>
            <span className={`text-[0.58rem] font-bold tracking-[1px] ${gradeColor} opacity-90 mt-1.5 z-10`}>{gradeLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Terminal output ─────────────────────────────────────── */}
      {snippet?.output && snippet?.language && (
        <div className="flex flex-col gap-3">
          <span className="text-[0.62rem] font-bold text-apex-muted tracking-[2px] uppercase flex items-center gap-3">
            <span>SALIDA DEL PROGRAMA</span>
            <span className="flex-1 h-[1px] bg-white/[0.04]" />
          </span>
          <TerminalOutput output={snippet.output} language={snippet.language} />
        </div>
      )}

      {/* ── Restart ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 mt-2">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[0.82rem] font-extrabold
                       bg-apex-violet/10 text-apex-violet border border-apex-violet/25
                       hover:bg-apex-violet/20 hover:border-apex-violet/40 hover:shadow-[0_0_15px_var(--apex-glow-strong)]
                       transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            Siguiente fragmento
            <span className="text-apex-violet group-hover:translate-x-1.5 transition-transform duration-200 text-base leading-none">→</span>
          </button>
        </div>
        <span className="text-[0.62rem] text-apex-muted font-medium font-code flex items-center gap-1.5">
          o pulsa <kbd className="text-[0.58rem] bg-white/[0.02] border-b-2 border-white/[0.06] px-1.5 py-0.5 rounded text-apex-text font-bold">Tab</kbd> para un nuevo fragmento
        </span>
      </div>
    </div>
  )
}

function StatCard({ label, value, large = false, accent }) {
  const valueColor = accent === 'violet'
    ? 'text-apex-violet drop-shadow-[0_0_8px_var(--apex-glow)]'
    : accent === 'emerald'
    ? 'text-apex-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]'
    : accent === 'amber'
    ? 'text-apex-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]'
    : 'text-apex-text'

  return (
    <div className="bg-apex-s2/25 border border-white/[0.04] backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center gap-1 shadow-md hover:border-white/[0.06] transition-all duration-300">
      <span className="text-[0.55rem] font-bold text-apex-muted tracking-[2px] uppercase leading-none">{label}</span>
      <span className={`font-code font-extrabold leading-none tracking-tight ${large ? 'text-[2.2rem]' : 'text-[1.8rem]'} ${valueColor}`}>
        {value}
      </span>
    </div>
  )
}
