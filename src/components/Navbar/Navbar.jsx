// Navbar.jsx — Full premium nav with logo, mode toggle, stats, level and sub-filters

const CODE_FILTERS = [
  { id: 'all',        label: 'Todos' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'php',        label: 'PHP' },
  { id: 'python',     label: 'Python' },
  { id: 'golang',     label: 'Go' },
  { id: 'java',       label: 'Java' },
  { id: 'css',        label: 'CSS' },
]

const PROSE_FILTERS = [
  { id: 'all',          label: 'Todos' },
  { id: 'español',      label: '🇧🇴 Español' },
  { id: 'english',      label: '🇺🇸 English' },
  { id: 'citas',        label: 'Citas' },
  { id: 'quotes',       label: 'Quotes' },
  { id: 'historias',    label: 'Historias' },
  { id: 'curiosidades', label: 'Curiosidades' },
]

export default function Navbar({ mode, filter, wpm, accuracy, level, xpPct, onModeChange, onFilterChange }) {
  const filters = mode === 'code' ? CODE_FILTERS : PROSE_FILTERS

  return (
    <header className="w-full">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-6 pb-5 border-b border-white/[0.05]">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-apex-violet/10 border border-apex-violet/20 flex items-center justify-center">
            <span className="text-apex-violet text-sm font-bold">A</span>
          </div>
          <span className="font-ui text-[1.1rem] font-bold tracking-tight">
            <span className="text-apex-violet">apex</span>
            <span className="text-apex-text">Type</span>
          </span>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-apex-surface border border-white/[0.06] rounded-xl p-[3px]">
          <ModeBtn active={mode === 'code'}  icon="💻" label="Código"    onClick={() => onModeChange('code')} />
          <ModeBtn active={mode === 'prose'} icon="✍️"  label="Lectura"   onClick={() => onModeChange('prose')} />
        </div>

        {/* Stats + Level */}
        <div className="flex items-center gap-5">
          <LiveStat label="WPM"  value={wpm} />
          <div className="w-px h-8 bg-white/[0.06]" />
          <LiveStat label="ACC"  value={`${accuracy}%`} />
          <div className="w-px h-8 bg-white/[0.06]" />
          <LevelBadge level={level} xpPct={xpPct} />
        </div>
      </div>

      {/* ── Sub-filter bar ────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 pt-4 flex-wrap">
        <span className="text-[0.65rem] font-semibold text-apex-dim tracking-[1.5px] uppercase mr-2">
          {mode === 'code' ? 'Lenguaje' : 'Categoría'}
        </span>
        {filters.map(f => (
          <FilterChip
            key={f.id}
            label={f.label}
            active={filter === f.id}
            onClick={() => onFilterChange(f.id)}
          />
        ))}
      </div>
    </header>
  )
}

function ModeBtn({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-[0.8rem] font-medium
        transition-all duration-200 whitespace-nowrap
        ${active ? 'bg-apex-s3 text-apex-text shadow-sm' : 'text-apex-muted hover:text-apex-text'}`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </button>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-[0.75rem] font-medium transition-all duration-150
        ${active
          ? 'bg-apex-violet/10 text-apex-violet border border-apex-violet/20'
          : 'text-apex-muted hover:text-apex-text hover:bg-apex-s2 border border-transparent'}`}
    >
      {label}
    </button>
  )
}

function LiveStat({ label, value }) {
  return (
    <div className="flex flex-col items-end gap-[2px]">
      <span className="text-[0.58rem] font-semibold text-apex-dim tracking-[1.5px] uppercase">{label}</span>
      <span className="font-code text-[1.3rem] font-semibold text-apex-text leading-none tracking-tight">{value}</span>
    </div>
  )
}

function LevelBadge({ level, xpPct }) {
  return (
    <div className="flex items-center gap-2 bg-apex-s2 border border-white/[0.06] rounded-lg px-3 py-1.5">
      <span className="text-[0.7rem] font-bold text-apex-violet tracking-wider">NVL {level}</span>
      <div className="w-16 h-[3px] bg-apex-s3 rounded-full overflow-hidden">
        <div
          className="h-full bg-apex-violet transition-all duration-500 rounded-full"
          style={{ width: `${xpPct}%` }}
        />
      </div>
      <span className="text-[0.6rem] text-apex-dim font-code">{xpPct}%</span>
    </div>
  )
}
