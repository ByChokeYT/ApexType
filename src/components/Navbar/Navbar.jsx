// Navbar.jsx
const CODE_FILTERS  = ['all', 'javascript', 'php', 'python', 'golang', 'java', 'css']
const PROSE_FILTERS = ['all', 'español', 'english', 'citas', 'quotes', 'historias', 'stories', 'curiosidades', 'facts']

const FILTER_LABELS = {
  all: 'Todos', javascript: 'JS', php: 'PHP', python: 'Python',
  golang: 'Go', java: 'Java', css: 'CSS',
  español: 'ES', english: 'EN',
  citas: 'Citas', quotes: 'Quotes',
  historias: 'Historias', stories: 'Stories',
  curiosidades: 'Curiosidades', facts: 'Facts',
}

export default function Navbar({ mode, filter, wpm, accuracy, level, xpPct, onModeChange, onFilterChange }) {
  const filters = mode === 'code' ? CODE_FILTERS : PROSE_FILTERS

  return (
    <header className="relative z-10 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        {/* Level + XP */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-apex-muted tracking-[1.5px] uppercase">
            NVL {level}
          </span>
          <div className="w-14 h-[2px] bg-apex-s3 rounded-full overflow-hidden">
            <div
              className="h-full bg-apex-violet opacity-60 transition-all duration-500"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Logo */}
        <div className="font-ui text-xl font-bold tracking-tight">
          <span className="text-apex-violet">apex</span>
          <span className="text-apex-text">Type</span>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-5">
          <Stat label="WPM"  value={wpm} />
          <Stat label="ACC"  value={`${accuracy}%`} />
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex justify-center">
        <div className="flex gap-0 bg-apex-surface border border-white/[0.06] rounded-[10px] p-[3px]">
          <ModeBtn active={mode === 'code'}  icon="💻" label="Programación"      onClick={() => onModeChange('code')}  />
          <ModeBtn active={mode === 'prose'} icon="✍️" label="Lectura y Escritura" onClick={() => onModeChange('prose')} />
        </div>
      </div>

      {/* Sub-filters */}
      <div className="flex justify-center gap-1 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`
              px-3 py-1 rounded-md text-[0.75rem] font-medium transition-all duration-150
              ${filter === f
                ? 'text-apex-violet bg-apex-violet/10'
                : 'text-apex-muted hover:text-apex-text hover:bg-apex-s2'}
            `}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
    </header>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-end gap-px">
      <span className="text-[0.6rem] font-semibold text-apex-muted tracking-[1.5px] uppercase">{label}</span>
      <span className="font-code text-xl font-semibold text-apex-text tracking-tight leading-none">{value}</span>
    </div>
  )
}

function ModeBtn({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2 rounded-[8px] text-[0.82rem] font-medium
        transition-all duration-200 whitespace-nowrap
        ${active
          ? 'bg-apex-s3 text-apex-text shadow-sm'
          : 'text-apex-muted hover:text-apex-text'}
      `}
    >
      <span>{icon}</span> {label}
    </button>
  )
}
