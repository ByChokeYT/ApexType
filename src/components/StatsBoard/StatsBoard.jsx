export default function StatsBoard({ wpm, accuracy, errors, elapsed, onRestart }) {
  const grade = accuracy >= 98 ? 'S' : accuracy >= 95 ? 'A' : accuracy >= 88 ? 'B' : accuracy >= 75 ? 'C' : 'D'
  const gradeColor = {
    S: 'text-apex-violet', A: 'text-apex-emerald',
    B: 'text-apex-emerald/70', C: 'text-apex-amber', D: 'text-apex-amber/70'
  }[grade]

  return (
    <div className="w-full flex flex-col items-center gap-10 animate-fade-up py-4">

      {/* Header */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-apex-emerald" />
          <span className="text-[0.65rem] font-semibold text-apex-muted tracking-[2px] uppercase">
            Sesión completada
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-apex-emerald" />
        </div>
        <p className="text-apex-dim text-[0.75rem]">
          Tiempo: {elapsed ? `${elapsed.toFixed(1)}s` : '--'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="flex items-end gap-12 justify-center">

        {/* WPM — hero stat */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">WPM</span>
          <span className="font-code text-[4.5rem] font-bold text-apex-violet leading-none tracking-[-3px]">
            {wpm}
          </span>
        </div>

        {/* Divider */}
        <div className="h-20 w-px bg-white/[0.05]" />

        {/* Precision */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">Precisión</span>
          <span className="font-code text-[2.8rem] font-bold text-apex-text leading-none tracking-[-2px]">
            {accuracy}%
          </span>
        </div>

        {/* Errors */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">Errores</span>
          <span className="font-code text-[2.8rem] font-bold text-apex-text leading-none tracking-[-2px]">
            {errors}
          </span>
        </div>

        {/* Divider */}
        <div className="h-20 w-px bg-white/[0.05]" />

        {/* Grade */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-apex-dim tracking-[2px] uppercase">Nota</span>
          <span className={`font-code text-[4.5rem] font-bold leading-none tracking-tight ${gradeColor}`}>
            {grade}
          </span>
        </div>
      </div>

      {/* Restart button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-[0.85rem] font-semibold
                     bg-apex-s2 text-apex-text border border-white/[0.08]
                     hover:bg-apex-s3 hover:border-white/[0.12]
                     transition-all duration-150 group"
        >
          <span>Siguiente fragmento</span>
          <span className="text-apex-muted group-hover:text-apex-text transition-colors">→</span>
        </button>
        <p className="text-[0.65rem] text-apex-dim">
          o presiona{' '}
          <kbd className="font-code text-[0.6rem] text-apex-muted border border-white/[0.06] border-b-2 px-1.5 py-0.5 rounded bg-apex-s2">
            Tab
          </kbd>
          {' '}para reiniciar
        </p>
      </div>
    </div>
  )
}
