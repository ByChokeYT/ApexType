export default function StatsBoard({ wpm, accuracy, errors, onRestart }) {
  return (
    <div className="flex flex-col items-center gap-10 animate-fade-up">
      <p className="text-[0.7rem] font-semibold text-apex-muted tracking-[3px] uppercase">
        Sesión Completada
      </p>

      {/* Stats row */}
      <div className="flex gap-16 items-baseline">
        <StatCard label="WPM"      value={wpm}          accent />
        <StatCard label="Precisión" value={`${accuracy}%`} />
        <StatCard label="Errores"  value={errors}       />
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="
          px-6 py-2.5 rounded-[10px] text-[0.82rem] font-medium
          bg-apex-s2 text-apex-muted border border-white/[0.06]
          hover:bg-apex-s3 hover:text-apex-text hover:border-white/10
          transition-all duration-150
        "
      >
        Siguiente <kbd className="ml-1 font-code text-[0.7rem] text-apex-muted border border-white/[0.06] border-b-2 px-1 py-px rounded bg-apex-s2">Tab</kbd>
      </button>
    </div>
  )
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[0.62rem] font-semibold text-apex-muted tracking-[2px] uppercase">{label}</span>
      <span className={`font-code text-[3.5rem] font-bold tracking-[-2px] leading-none ${accent ? 'text-apex-violet' : 'text-apex-text'}`}>
        {value}
      </span>
    </div>
  )
}
