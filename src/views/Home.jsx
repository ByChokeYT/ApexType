import { useEffect, useCallback, useState } from 'react'
import Navbar     from '../components/Navbar/Navbar.jsx'
import TypingArea from '../components/TypingArea/TypingArea.jsx'
import StatsBoard from '../components/StatsBoard/StatsBoard.jsx'
import { useTypingEngine } from '../hooks/useTypingEngine.js'
import { useTimer }        from '../hooks/useTimer.js'

import codeSnippets from '../data/code_snippets.json'
import textsEs      from '../data/texts_es.json'
import textsEn      from '../data/texts_en.json'

// ── XP / Level helpers ──────────────────────────────────────────
function loadStats() {
  return JSON.parse(localStorage.getItem('apexTypeStats')) || { xp: 0, level: 1 }
}
function saveStats(s) {
  localStorage.setItem('apexTypeStats', JSON.stringify(s))
}

// ── Snippet selectors ───────────────────────────────────────────
function pickSnippet(mode, filter) {
  if (mode === 'code') {
    const pool = filter === 'all'
      ? codeSnippets
      : codeSnippets.filter(s => s.language === filter)
    const s = pool[Math.floor(Math.random() * pool.length)] ?? codeSnippets[0]
    return { text: s.code, badge: s.language }
  }

  const esPool = textsEs.filter(t =>
    filter === 'all'   ? true :
    filter === 'español' ? true :
    t.category === filter
  )
  const enPool = textsEn.filter(t =>
    filter === 'all'    ? true :
    filter === 'english' ? true :
    t.category === filter
  )

  let pool
  if (filter === 'español')       pool = esPool
  else if (filter === 'english')  pool = enPool
  else                            pool = [...esPool, ...enPool]

  if (!pool.length) pool = [...textsEs, ...textsEn]
  const t = pool[Math.floor(Math.random() * pool.length)]
  return { text: t.text, badge: `${t.title} · ${t.category}` }
}

// ── LevelUp Popup ───────────────────────────────────────────────
function LevelUpPopup({ level }) {
  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2
                    bg-apex-s2 border border-white/[0.06] text-apex-violet
                    px-12 py-6 rounded-2xl font-bold tracking-[3px] uppercase text-lg
                    shadow-[0_0_40px_rgba(167,139,250,0.1)] animate-level-pop pointer-events-none">
      ¡Nivel {level} Alcanzado!
    </div>
  )
}

// ── CapsLock Warning ────────────────────────────────────────────
function CapsWarning() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                    bg-apex-s2 text-apex-amber border border-apex-amber/20
                    px-5 py-2 rounded-xl text-[0.78rem] font-medium tracking-wide
                    animate-fade-up">
      ⚠️ Bloq Mayús Activado
    </div>
  )
}

// ── Home View ───────────────────────────────────────────────────
export default function Home() {
  const [mode,   setMode]   = useState('code')
  const [filter, setFilter] = useState('all')
  const [current, setCurrent] = useState(() => pickSnippet('code', 'all'))
  const [userStats, setUserStats] = useState(loadStats)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [capsLock,    setCapsLock]    = useState(false)

  const engine = useTypingEngine()
  const timer  = useTimer(engine.isActive, engine.isFinished, engine.currentIndex, engine.errors)

  // Load a new snippet
  const startNew = useCallback((m = mode, f = filter) => {
    const sample = pickSnippet(m, f)
    setCurrent(sample)
    engine.reset(sample.text)
    timer.reset()
  }, [mode, filter, engine, timer])

  // Init on mount
  useEffect(() => { engine.reset(current.text) }, []) // eslint-disable-line

  // Handle mode/filter change
  const handleModeChange = (m) => { setMode(m); setFilter('all'); startNew(m, 'all') }
  const handleFilterChange = (f) => { setFilter(f); startNew(mode, f) }

  // XP on finish
  useEffect(() => {
    if (!engine.isFinished) return
    const xpGain = Math.round((timer.wpm * timer.accuracy) / 100)
    setUserStats(prev => {
      let { xp, level } = prev
      xp += xpGain
      if (xp >= level * 100) { xp -= level * 100; level++; setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 2200) }
      const next = { xp, level }
      saveStats(next)
      return next
    })
  }, [engine.isFinished]) // eslint-disable-line

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      setCapsLock(e.getModifierState?.('CapsLock') ?? false)
      if (e.key === 'Tab') { e.preventDefault(); startNew() }
      if (e.key === 'Enter' && engine.isFinished) startNew()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [startNew, engine.isFinished])

  const xpPct = Math.round((userStats.xp / (userStats.level * 100)) * 100)

  return (
    <>
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-10 py-12 flex flex-col gap-12">
        <Navbar
          mode={mode}
          filter={filter}
          wpm={timer.wpm}
          accuracy={timer.accuracy}
          level={userStats.level}
          xpPct={xpPct}
          onModeChange={handleModeChange}
          onFilterChange={handleFilterChange}
        />

        <main className="relative min-h-[240px] flex items-center">
          {engine.isFinished ? (
            <StatsBoard
              wpm={timer.wpm}
              accuracy={timer.accuracy}
              errors={engine.errors}
              onRestart={startNew}
            />
          ) : (
            <TypingArea
              snippet={current.text}
              charStates={engine.charStates}
              currentIndex={engine.currentIndex}
              badge={current.badge}
              onInput={engine.handleInput}
              onBackspace={engine.handleBackspace}
            />
          )}
        </main>

        <footer className="text-center text-[0.72rem] text-apex-dim tracking-wide">
          Pulsa <kbd className="font-code text-[0.68rem] text-apex-muted border border-white/[0.06] border-b-2 px-1 py-px rounded bg-apex-s2 mx-0.5">Tab</kbd> para un nuevo fragmento
        </footer>
      </div>

      {showLevelUp && <LevelUpPopup level={userStats.level} />}
      {capsLock     && <CapsWarning />}
    </>
  )
}
