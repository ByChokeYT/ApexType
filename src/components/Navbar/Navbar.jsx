// Navbar.jsx — Full premium nav with logo, mode toggle, stats, level and sub-filters
import { playKeySound } from '../../utils/sound.js'

const CODE_FILTERS = [
  { id: 'all',        label: 'Todos' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'php',        label: 'PHP' },
  { id: 'python',     label: 'Python' },
  { id: 'golang',     label: 'Go' },
  { id: 'java',       label: 'Java' },
  { id: 'css',        label: 'CSS' },
]

const DIFFICULTY_FILTERS = [
  { id: 'all',          label: 'Todos', dot: '' },
  { id: 'basico',       label: 'Básico', dot: 'bg-apex-emerald' },
  { id: 'medio',        label: 'Medio',  dot: 'bg-apex-amber' },
  { id: 'profesional',  label: 'Profesional', dot: 'bg-apex-violet' },
]

const PROSE_LANG_FILTERS = [
  { id: 'all',        label: 'Todos' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'php',        label: 'PHP' },
  { id: 'python',     label: 'Python' },
  { id: 'golang',     label: 'Go' },
  { id: 'java',       label: 'Java' },
  { id: 'css',        label: 'CSS' },
]

const PROSE_GENRE_FILTERS = [
  { id: 'all',          label: 'Todos' },
  { id: 'español',      label: '🇧🇴 Español' },
  { id: 'english',      label: '🇺🇸 English' },
  { id: 'citas',        label: 'Citas' },
  { id: 'quotes',       label: 'Quotes' },
  { id: 'historias',    label: 'Historias' },
  { id: 'curiosidades', label: 'Curiosidades' },
]

export default function Navbar({
  mode,
  filter,
  proseGenre,
  difficulty,
  wpm,
  accuracy,
  level,
  xpPct,
  theme,
  onThemeChange,
  sound,
  onSoundChange,
  focusMode,
  onFocusModeChange,
  currentView,
  onViewChange,
  onModeChange,
  onFilterChange,
  onProseGenreChange,
  onDifficultyChange,
}) {
  const langFilters = mode === 'code' ? CODE_FILTERS : PROSE_LANG_FILTERS

  return (
    <header className="w-full flex flex-col gap-5">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-6 pb-4 border-b border-white/[0.04]">
        
        {/* Left Section: Logo, Brand & Tech Hub Navigation */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-apex-violet/10 border border-apex-violet/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_var(--apex-glow-strong)]">
              <svg className="w-5 h-5 text-apex-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="font-ui text-[1.15rem] font-extrabold tracking-tight leading-none">
                <span className="text-apex-violet transition-colors duration-300">apex</span>
                <span className="text-apex-text">Type</span>
              </h1>
              <span className="text-[0.55rem] text-apex-muted font-semibold uppercase tracking-[2px] mt-0.5">Elite Trainer</span>
            </div>
          </div>

          {/* View Switcher Button */}
          {currentView && onViewChange && (
            <button
              onClick={() => {
                playKeySound('digital', false)
                onViewChange(currentView === 'hub' ? 'game' : 'hub')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-bold border transition-all duration-200 ml-2
                bg-apex-violet/5 text-apex-violet border-apex-violet/15 hover:bg-apex-violet/10 hover:border-apex-violet/25 hover:shadow-[0_0_8px_var(--apex-glow)]"
            >
              {currentView === 'hub' ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Simulador</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Tech Hub</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Center: Glassmorphic Mode Toggle */}
        <div className="flex items-center gap-1 bg-apex-s2/40 border border-white/[0.04] backdrop-blur-md rounded-xl p-[3px] shadow-inner">
          <ModeBtn
            active={mode === 'code'}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Código"
            onClick={() => onModeChange('code')}
          />
          <ModeBtn
            active={mode === 'prose'}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Lectura"
            onClick={() => onModeChange('prose')}
          />
        </div>

        {/* Right Section: HUD Settings, Stats & Level */}
        <div className="flex items-center gap-4">
          
          {/* Controls: Theme, Sound, Focus */}
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-1.5 backdrop-blur-sm">
            {/* Theme Picker */}
            <div className="flex items-center gap-1.5 border-r border-white/[0.06] pr-3">
              <ThemeDot color="bg-[#a78bfa]" active={theme === 'violet'} tooltip="Apex Violet" onClick={() => onThemeChange('violet')} />
              <ThemeDot color="bg-[#fbbf24]" active={theme === 'amber'} tooltip="Cyberpunk Gold" onClick={() => onThemeChange('amber')} />
              <ThemeDot color="bg-[#34d399]" active={theme === 'emerald'} tooltip="Matrix Green" onClick={() => onThemeChange('emerald')} />
              <ThemeDot color="bg-[#f43f5e]" active={theme === 'ruby'} tooltip="Crimson Ruby" onClick={() => onThemeChange('ruby')} />
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center gap-1 border-r border-white/[0.06] pr-3">
              <SoundBtn
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                }
                active={sound === 'none'}
                tooltip="Sonido: Desactivado"
                onClick={() => onSoundChange('none')}
              />
              <SoundBtn
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                active={sound === 'digital'}
                tooltip="Sonido: Digital"
                onClick={() => onSoundChange('digital')}
              />
              <SoundBtn
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
                active={sound === 'mech'}
                tooltip="Sonido: Mecánico"
                onClick={() => onSoundChange('mech')}
              />
            </div>

            {/* Focus Mode Toggle */}
            <button
              onClick={() => onFocusModeChange(!focusMode)}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center relative group
                ${focusMode 
                  ? 'text-apex-violet bg-apex-violet/10 border border-apex-violet/20 shadow-[0_0_8px_var(--apex-glow)]' 
                  : 'text-apex-muted border border-transparent hover:text-apex-text'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-apex-black border border-white/[0.06] text-apex-text text-[0.6rem] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {focusMode ? 'Desactivar Enfoque' : 'Modo Enfoque'}
              </span>
            </button>
          </div>

          {/* HUD Stats */}
          <div className="flex items-center gap-4">
            <LiveStat label="WPM"  value={wpm} />
            <div className="w-[1px] h-7 bg-white/[0.05]" />
            <LiveStat label="ACC"  value={`${accuracy}%`} />
            <div className="w-[1px] h-7 bg-white/[0.05]" />
            <LevelBadge level={level} xpPct={xpPct} />
          </div>
        </div>

      </div>


    </header>
  )
}

function ModeBtn({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-[0.78rem] font-semibold
        transition-all duration-300 ease-out whitespace-nowrap
        ${active 
          ? 'bg-apex-violet/10 text-apex-violet border border-apex-violet/15 shadow-[0_2px_10px_var(--apex-glow)] scale-[1.02]' 
          : 'text-apex-muted border border-transparent hover:text-apex-text'}`}
    >
      <span className="text-sm leading-none">{icon}</span>
      {label}
    </button>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-[0.72rem] font-medium border transition-all duration-200
        ${active
          ? 'bg-apex-violet/10 text-apex-violet border-apex-violet/25 shadow-[0_0_8px_var(--apex-glow)]'
          : 'text-apex-muted hover:text-apex-text hover:bg-white/[0.02] border-transparent'}`}
    >
      {label}
    </button>
  )
}

function LiveStat({ label, value }) {
  return (
    <div className="flex flex-col items-end justify-center">
      <span className="text-[0.55rem] font-bold text-apex-muted tracking-[1.5px] uppercase leading-none mb-1">{label}</span>
      <span className="font-code text-[1.25rem] font-bold text-apex-text leading-none tracking-tight">{value}</span>
    </div>
  )
}

function LevelBadge({ level, xpPct }) {
  return (
    <div className="flex items-center gap-2.5 bg-apex-s2 border border-white/[0.04] rounded-xl px-3 py-1.5 shadow-sm">
      <span className="text-[0.68rem] font-extrabold text-apex-violet tracking-wider">Lvl {level}</span>
      <div className="w-16 h-[4px] bg-white/[0.05] rounded-full overflow-hidden relative shadow-inner">
        <div
          className="h-full bg-apex-violet transition-all duration-500 rounded-full shadow-[0_0_8px_var(--apex-violet)]"
          style={{ width: `${xpPct}%` }}
        />
      </div>
      <span className="text-[0.62rem] text-apex-muted font-code font-semibold">{xpPct}%</span>
    </div>
  )
}

function ThemeDot({ color, active, tooltip, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full ${color} transition-all duration-200 hover:scale-125 relative group
        ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-apex-black scale-110 shadow-[0_0_10px_currentColor]' : 'opacity-60 hover:opacity-100'}`}
    >
      <span className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-apex-black border border-white/[0.06] text-apex-text text-[0.6rem] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {tooltip}
      </span>
    </button>
  )
}

function SoundBtn({ icon, active, tooltip, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-0.5 rounded text-xs transition-all duration-200 hover:scale-110 relative group
        ${active ? 'bg-white/[0.06] border border-white/10 opacity-100 scale-105' : 'opacity-40 hover:opacity-80'}`}
    >
      {icon}
      <span className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-apex-black border border-white/[0.06] text-apex-text text-[0.6rem] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {tooltip}
      </span>
    </button>
  )
}

