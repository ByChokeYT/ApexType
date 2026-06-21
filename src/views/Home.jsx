import { useEffect, useCallback, useState } from 'react'
import Navbar     from '../components/Navbar/Navbar.jsx'
import TypingArea from '../components/TypingArea/TypingArea.jsx'
import StatsBoard from '../components/StatsBoard/StatsBoard.jsx'
import { useTypingEngine } from '../hooks/useTypingEngine.js'
import { useTimer }        from '../hooks/useTimer.js'

import codeSnippets from '../data/code_snippets.json'
import textsEs      from '../data/texts_es.json'
import textsEn      from '../data/texts_en.json'

function loadStats() {
  return JSON.parse(localStorage.getItem('apexTypeStats')) || { xp: 0, level: 1 }
}
function saveStats(s) {
  localStorage.setItem('apexTypeStats', JSON.stringify(s))
}

function pickSnippet(mode, filter) {
  if (mode === 'code') {
    const pool = filter === 'all'
      ? codeSnippets
      : codeSnippets.filter(s => s.language === filter)
    const s = (pool.length ? pool : codeSnippets)[Math.floor(Math.random() * (pool.length || codeSnippets.length))]
    return { text: s.code, badge: s.language }
  }

  const esPool = textsEs.filter(t => filter === 'all' || filter === 'español' || t.category === filter)
  const enPool = textsEn.filter(t => filter === 'all' || filter === 'english' || t.category === filter)

  let pool = filter === 'español' ? esPool : filter === 'english' ? enPool : [...esPool, ...enPool]
  if (!pool.length) pool = [...textsEs, ...textsEn]

  const t = pool[Math.floor(Math.random() * pool.length)]
  return { text: t.text, badge: `${t.title} · ${t.category}` }
}

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                    flex items-center gap-2
                    bg-apex-s2 text-apex-amber border border-apex-amber/20
                    px-5 py-2.5 rounded-xl text-[0.78rem] font-medium
                    animate-fade-up shadow-lg">
      <span>⚠️</span> Bloq Mayús activado
    </div>
  )
}

export default function Home() {
  const [mode,       setMode]       = useState('code')
  const [filter,     setFilter]     = useState('all')
  const [current,    setCurrent]    = useState(() => pickSnippet('code', 'all'))
  const [userStats,  setUserStats]  = useState(loadStats)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [capsLock,    setCapsLock]    = useState(false)

  const engine = useTypingEngine()
  const timer  = useTimer(engine.isActive, engine.isFinished, engine.currentIndex, engine.errors)

  const startNew = useCallback((m = mode, f = filter) => {
    const sample = pickSnippet(m, f)
    setCurrent(sample)
    engine.reset(sample.text)
    timer.reset()
  }, [mode, filter, engine, timer])

  // Init
  useEffect(() => { engine.reset(current.text) }, []) // eslint-disable-line

  const handleModeChange   = (m) => { setMode(m);   setFilter('all'); startNew(m, 'all') }
  const handleFilterChange = (f) => { setFilter(f); startNew(mode, f) }

  // XP on finish
  useEffect(() => {
    if (!engine.isFinished) return
    const xpGain = Math.round((timer.wpm * timer.accuracy) / 100)
    setUserStats(prev => {
      let { xp, level } = prev
      xp += xpGain
      if (xp >= level * 100) {
        xp -= level * 100
        level++
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

  const xpPct = Math.round((userStats.xp / (userStats.level * 100)) * 100)

  return (
    <>
      <div className="relative z-10 w-full min-h-screen flex flex-col">

        {/* ── Main content area ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col max-w-[860px] w-full mx-auto px-8 pt-8 pb-6 gap-10">

          {/* Navbar */}
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

          {/* Game area */}
          <main className="flex-1 flex items-center justify-center py-8">
            {engine.isFinished ? (
              <StatsBoard
                wpm={timer.wpm}
                accuracy={timer.accuracy}
                errors={engine.errors}
                elapsed={timer.elapsed}
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
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.04] py-4">
          <div className="max-w-[860px] mx-auto px-8 flex items-center justify-between text-[0.7rem] text-apex-dim">

            {/* Left: shortcuts */}
            <div className="flex items-center gap-4">
              <ShortcutHint keys={['Tab']}        label="nuevo fragmento" />
              <ShortcutHint keys={['Backspace']}  label="borrar" />
            </div>

            {/* Center: branding */}
            <span className="tracking-widest font-code uppercase text-[0.6rem]">
              <span className="text-apex-violet/60">apex</span>
              <span>Type</span>
            </span>

            {/* Right: mode indicator + session info */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-apex-emerald" />
                {mode === 'code' ? 'Modo Código' : 'Modo Lectura'}
              </span>
              <span className="text-apex-dim/40">·</span>
              <span>
                {engine.currentIndex}/{current.text.length} chars
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
