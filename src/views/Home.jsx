import { useEffect, useCallback, useState } from 'react'
import Navbar     from '../components/Navbar/Navbar.jsx'
import TypingArea from '../components/TypingArea/TypingArea.jsx'
import StatsBoard from '../components/StatsBoard/StatsBoard.jsx'
import LoginView  from '../components/LoginView/LoginView.jsx'
import HubView    from '../components/HubView/HubView.jsx'
import { useTypingEngine } from '../hooks/useTypingEngine.js'
import { useTimer }        from '../hooks/useTimer.js'

import codeSnippets from '../data/code_snippets.json'
import textsEs      from '../data/texts_es.json'
import textsEn      from '../data/texts_en.json'
import textsLangs   from '../data/texts_langs.json'   // ← historias de lenguajes

const LANG_IDS = ['javascript', 'php', 'python', 'golang', 'java', 'css']

function loadStats() {
  return JSON.parse(localStorage.getItem('apexTypeStats')) || { xp: 0, level: 1 }
}
function saveStats(s) {
  localStorage.setItem('apexTypeStats', JSON.stringify(s))
}

/**
 * pickSnippet — selects a random text based on mode, filter and secondary filter
 *
 * Code mode:   filter = language | 'all',  difficulty = 'basico'|'medio'|'profesional'|'all'
 * Prose mode:  filter = language | 'all'   → pulls from textsLangs when a language is selected
 *              proseGenre = category | 'all' → further filters textsEs/textsEn general texts
 */
function pickSnippet(mode, filter, difficulty = 'all', proseGenre = 'all') {
  // ── Code mode ────────────────────────────────────────────────
  if (mode === 'code') {
    let pool = codeSnippets
    if (filter !== 'all')     pool = pool.filter(s => s.language === filter)
    if (difficulty !== 'all') pool = pool.filter(s => s.difficulty === difficulty)
    if (!pool.length) pool = codeSnippets

    const s = pool[Math.floor(Math.random() * pool.length)]
    return {
      text: s.code,
      badge: s.language,
      metadata: { language: s.language, difficulty: s.difficulty, output: s.output },
    }
  }

  // ── Prose mode ───────────────────────────────────────────────
  // If a specific language is selected → show history of that language
  if (filter !== 'all' && LANG_IDS.includes(filter)) {
    let pool = textsLangs.filter(t => t.language === filter)
    if (!pool.length) pool = textsLangs
    const t = pool[Math.floor(Math.random() * pool.length)]
    return {
      text: t.text,
      badge: `Historia · ${t.language.toUpperCase()} · ${t.title}`,
      metadata: null,
    }
  }

  // Generic prose — blend ES/EN with genre filter
  const esPool = textsEs.filter(t =>
    proseGenre === 'all' || proseGenre === 'español' || t.category === proseGenre
  )
  const enPool = textsEn.filter(t =>
    proseGenre === 'all' || proseGenre === 'english' || t.category === proseGenre
  )

  let pool
  if (proseGenre === 'español')      pool = esPool
  else if (proseGenre === 'english') pool = enPool
  else                               pool = [...esPool, ...enPool, ...textsLangs]

  if (!pool.length) pool = [...textsEs, ...textsEn]
  const t = pool[Math.floor(Math.random() * pool.length)]
  return {
    text: t.text,
    badge: t.title ? `${t.language?.toUpperCase() ?? t.category} · ${t.title}` : `${t.category} · ${t.title}`,
    metadata: null,
  }
}

// ── Overlays ─────────────────────────────────────────────────────
function LevelUpPopup({ level }) {
  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2
                    bg-apex-s2 border border-apex-violet/20 text-apex-violet
                    px-14 py-8 rounded-2xl font-bold tracking-[3px] uppercase text-xl
                    shadow-[0_0_60px_rgba(167,139,250,0.15)] animate-level-pop pointer-events-none">
      ⚡ Nivel {level} Alcanzado
    </div>
  )
}

function CapsWarning() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                    bg-apex-s2 text-apex-amber border border-apex-amber/20
                    px-5 py-2.5 rounded-xl text-[0.78rem] font-medium animate-fade-up shadow-lg">
      <span>⚠️</span> Bloq Mayús activado
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────
export default function Home() {
  const [mode,        setMode]        = useState('code')
  const [filter,      setFilter]      = useState('all')
  const [difficulty,  setDifficulty]  = useState('all')
  const [proseGenre,  setProseGenre]  = useState('all')
  const [current,     setCurrent]     = useState(() => pickSnippet('code', 'all'))
  const [userStats,   setUserStats]   = useState(loadStats)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [capsLock,    setCapsLock]    = useState(false)

  // Premium Custom States
  const [theme, setTheme] = useState(() => localStorage.getItem('apexTypeTheme') || 'violet')
  const [sound, setSound] = useState(() => localStorage.getItem('apexTypeSound') || 'mech')
  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('apexTypeFocusMode') === 'true')

  // Routing and Username states
  const [username, setUsername] = useState(() => localStorage.getItem('apexTypeUsername') || '')
  const [currentView, setCurrentView] = useState(() => username ? 'hub' : 'login')

  const engine = useTypingEngine()
  const timer  = useTimer(engine.isActive, engine.isFinished, engine.currentIndex, engine.errors)

  // Synchronize theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('apexTypeTheme', theme)
  }, [theme])

  // Synchronize focusMode storage
  useEffect(() => {
    localStorage.setItem('apexTypeFocusMode', focusMode)
  }, [focusMode])

  // Synchronize sound storage
  useEffect(() => {
    localStorage.setItem('apexTypeSound', sound)
  }, [sound])

  const startNew = useCallback((m = mode, f = filter, d = difficulty, pg = proseGenre) => {
    const sample = pickSnippet(m, f, d, pg)
    setCurrent(sample)
    engine.reset(sample.text)
    timer.reset()
  }, [mode, filter, difficulty, proseGenre, engine, timer])

  useEffect(() => { engine.reset(current.text) }, []) // eslint-disable-line

  const handleModeChange = (m) => {
    setMode(m); setFilter('all'); setDifficulty('all'); setProseGenre('all')
    startNew(m, 'all', 'all', 'all')
  }
  const handleFilterChange      = (f)  => { setFilter(f);     startNew(mode, f, difficulty, proseGenre) }
  const handleDifficultyChange  = (d)  => { setDifficulty(d); startNew(mode, filter, d, proseGenre) }
  const handleProseGenreChange  = (pg) => { setProseGenre(pg); startNew(mode, filter, difficulty, pg) }

  // XP on finish
  useEffect(() => {
    if (!engine.isFinished) return
    const xpGain = Math.round((timer.wpm * timer.accuracy) / 100)
    setUserStats(prev => {
      let { xp, level } = prev
      xp += xpGain
      if (xp >= level * 100) {
        xp -= level * 100; level++
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 2400)
      }
      const next = { xp, level }
      saveStats(next)
      return next
    })
  }, [engine.isFinished]) // eslint-disable-line

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      setCapsLock(e.getModifierState?.('CapsLock') ?? false)
      if (e.key === 'Tab') { e.preventDefault(); startNew() }
      if (e.key === 'Enter' && engine.isFinished) startNew()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [startNew, engine.isFinished])

  const handleLogin = (user) => {
    setUsername(user)
    localStorage.setItem('apexTypeUsername', user)
    setCurrentView('hub')
  }

  const handleStartTraining = (config) => {
    setMode(config.mode)
    setDifficulty(config.difficulty)
    setFilter(config.filter)
    startNew(config.mode, config.filter, config.difficulty)
    setCurrentView('game')
  }

  const xpPct = Math.round((userStats.xp / (userStats.level * 100)) * 100)
  
  if (currentView === 'login') {
    return (
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-6">
        <LoginView onLogin={handleLogin} />
      </div>
    )
  }

  const isTypingActive = engine.isActive && !engine.isFinished
  const hideOuter = focusMode && isTypingActive && currentView === 'game'

  return (
    <>
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col max-w-[860px] w-full mx-auto px-8 pt-8 pb-6 gap-10">

          <div className={`transition-all duration-[600ms] ease-in-out transform ${
            hideOuter ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}>
            <Navbar
              mode={mode}
              filter={filter}
              proseGenre={proseGenre}
              difficulty={difficulty}
              wpm={timer.wpm}
              accuracy={timer.accuracy}
              level={userStats.level}
              xpPct={xpPct}
              theme={theme}
              onThemeChange={setTheme}
              sound={sound}
              onSoundChange={setSound}
              focusMode={focusMode}
              onFocusModeChange={setFocusMode}
              currentView={currentView}
              onViewChange={setCurrentView}
              onModeChange={handleModeChange}
              onFilterChange={handleFilterChange}
              onDifficultyChange={handleDifficultyChange}
              onProseGenreChange={handleProseGenreChange}
            />
          </div>

          <main className="flex-1 flex items-start justify-center py-4">
            {currentView === 'hub' ? (
              <HubView
                username={username}
                level={userStats.level}
                xpPct={xpPct}
                onStartTraining={handleStartTraining}
              />
            ) : engine.isFinished ? (
              <StatsBoard
                wpm={timer.wpm}
                accuracy={timer.accuracy}
                errors={engine.errors}
                elapsed={timer.elapsed}
                snippet={current.metadata}
                onRestart={() => startNew()}
              />
            ) : (
              <TypingArea
                snippet={current.text}
                charStates={engine.charStates}
                currentIndex={engine.currentIndex}
                badge={current.badge}
                soundMode={sound}
                onInput={engine.handleInput}
                onBackspace={engine.handleBackspace}
              />
            )}
          </main>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className={`border-t border-white/[0.04] py-4 transition-all duration-[600ms] ease-in-out transform ${
          hideOuter ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}>
          <div className="max-w-[860px] mx-auto px-8 flex items-center justify-between text-[0.7rem] text-apex-dim">
            <div className="flex items-center gap-4">
              <ShortcutHint keys={['Tab']}       label="nuevo fragmento" />
              <ShortcutHint keys={['Backspace']} label="borrar" />
            </div>
            <div className="flex flex-col items-center">
              <span className="tracking-widest font-code uppercase text-[0.6rem] transition-colors duration-300 hover:text-apex-violet">
                <span className="text-apex-violet/60">apex</span>Type
              </span>
              <span className="text-[0.52rem] text-apex-muted mt-0.5 font-medium tracking-wide">
                Creado por <span className="text-apex-violet/80 font-bold hover:text-apex-violet transition-colors">ByChokeYT</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-apex-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-apex-emerald animate-pulse" />
                {currentView === 'hub' ? 'Tech Hub' : mode === 'code' ? 'Modo Código' : 'Modo Lectura'}
              </span>
              <span className="text-white/10">·</span>
              <span className="font-code text-apex-muted">
                {currentView === 'hub' ? 'Nivel de Progreso' : `${engine.currentIndex}/${current.text.length} chars`}
              </span>
            </div>
          </div>
        </footer>
      </div>

      {showLevelUp && <LevelUpPopup level={userStats.level} />}
      {capsLock     && <CapsWarning />}
    </>
  )
}

function ShortcutHint({ keys, label }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map(k => (
        <kbd key={k} className="font-code text-[0.6rem] text-apex-muted border border-white/[0.06] border-b-2 px-1.5 py-0.5 rounded bg-apex-s2">
          {k}
        </kbd>
      ))}
      <span className="text-apex-dim">{label}</span>
    </span>
  )
}
