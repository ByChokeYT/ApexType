import { useState, useEffect } from 'react'
import { playKeySound } from '../../utils/sound.js'
import codeSnippets from '../../data/code_snippets.json'

const CODE_PHASES = [
  {
    id: 1,
    title: 'Fase 1: Sintaxis Básica',
    desc: 'Variables, condicionales y funciones iniciales en JS, Python y PHP.',
    reqLvl: 1,
    badge: 'Codificador Iniciado',
    config: { mode: 'code', difficulty: 'basico', filter: 'all' }
  },
  {
    id: 2,
    title: 'Fase 2: Listas y Estructuras',
    desc: 'Arreglos asociativos, compresión de listas y mapeo de colecciones.',
    reqLvl: 2,
    badge: 'Desarrollador Jr.',
    config: { mode: 'code', difficulty: 'medio', filter: 'all' }
  },
  {
    id: 3,
    title: 'Fase 3: POO y Clases',
    desc: 'Declaración de estructuras, clases encapsuladas, métodos y getters.',
    reqLvl: 3,
    badge: 'Desarrollador Ssd.',
    config: { mode: 'code', difficulty: 'medio', filter: 'java' }
  },
  {
    id: 4,
    title: 'Fase 4: Concurrencia y API',
    desc: 'Promesas asíncronas de red, hilos concurrentes y comunicación.',
    reqLvl: 4,
    badge: 'Ingeniero Sr.',
    config: { mode: 'code', difficulty: 'profesional', filter: 'all' }
  }
]

const PROSE_PHASES = [
  {
    id: 1,
    title: 'Fase 1: Citas y Frases Cortas',
    desc: 'Citas y reflexiones breves en español e inglés para calentar dedos.',
    reqLvl: 1,
    badge: 'Lector Principiante',
    config: { mode: 'prose', difficulty: 'all', filter: 'all', proseGenre: 'citas' },
    preview: { title: 'Citas célebres y famosas', lang: 'Español / Inglés' }
  },
  {
    id: 2,
    title: 'Fase 2: Curiosidades Tecnológicas',
    desc: 'Hechos divertidos y curiosidades sobre el desarrollo de software y la informática.',
    reqLvl: 2,
    badge: 'Lector Intermedio',
    config: { mode: 'prose', difficulty: 'all', filter: 'all', proseGenre: 'curiosidades' },
    preview: { title: 'Datos curiosos de software', lang: 'Español' }
  },
  {
    id: 3,
    title: 'Fase 3: Historias de Lenguajes',
    desc: 'Explora los orígenes e historias de lenguajes como JS, Python, Go y Java.',
    reqLvl: 3,
    badge: 'Cronista Tech',
    config: { mode: 'prose', difficulty: 'all', filter: 'all', proseGenre: 'historias' },
    preview: { title: 'Historia de los lenguajes', lang: 'Historias' }
  },
  {
    id: 4,
    title: 'Fase 4: Textos Extensos',
    desc: 'Ensayos y fragmentos literarios largos en español e inglés para resistencia.',
    reqLvl: 4,
    badge: 'Lector Elite',
    config: { mode: 'prose', difficulty: 'all', filter: 'all', proseGenre: 'all' },
    preview: { title: 'Historias avanzadas', lang: 'Español / Inglés' }
  }
]

export default function HubView({ username, level, xpPct, onStartTraining }) {
  const [activeCategory, setActiveCategory] = useState(null) // 'code' | 'prose' | null
  const [selectedPhaseId, setSelectedPhaseId] = useState(1)
  const [selectedLang, setSelectedLang] = useState('all')

  const phases = activeCategory === 'code' ? CODE_PHASES : PROSE_PHASES
  const activePhase = phases.find(p => p.id === selectedPhaseId) || phases[0]
  const isSelectedLocked = level < activePhase.reqLvl

  // Reset selected language filter on phase or category change
  useEffect(() => {
    setSelectedLang('all')
  }, [selectedPhaseId, activeCategory])

  // Get available programming languages dynamically for the selected phase's difficulty
  const availableLangs = activeCategory === 'code' 
    ? ['all', ...new Set(
        codeSnippets
          .filter(s => s.difficulty === activePhase.config.difficulty)
          .map(s => s.language)
      )]
    : []

  // Resolve recommended preview snippet based on selections
  const getPreviewSnippet = () => {
    if (activeCategory === 'prose') {
      return activePhase.preview
    }
    const filtered = codeSnippets.filter(s => 
      s.difficulty === activePhase.config.difficulty && 
      (selectedLang === 'all' || s.language === selectedLang)
    )
    if (!filtered.length) return null
    const sample = filtered[0] // take first as preview
    
    // Extract first line of code as preview title
    const firstLine = sample.code.split('\n')[0]
    const shortTitle = firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine
    
    return {
      title: shortTitle,
      lang: sample.language.toUpperCase()
    }
  }

  const preview = getPreviewSnippet()

  const handleSelectCategory = (category) => {
    playKeySound('digital', false)
    setActiveCategory(category)
    setSelectedPhaseId(1)
  }

  const handleSelectPhase = (id) => {
    playKeySound('digital', false)
    setSelectedPhaseId(id)
  }

  const handleStart = () => {
    playKeySound('digital', false)
    onStartTraining({
      ...activePhase.config,
      filter: activeCategory === 'code' ? selectedLang : activePhase.config.filter
    })
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-up max-w-[800px] mx-auto">
      
      {/* ── Welcome Banner / Profile Header ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-apex-s2/20 border border-white/[0.04] backdrop-blur-md rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-apex-glow opacity-25 rounded-full blur-2xl pointer-events-none" />
        
        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-apex-violet flex items-center justify-center bg-apex-violet/5 shadow-[0_0_15px_var(--apex-glow)] relative">
            <span className="font-code text-lg font-black text-apex-violet">{username[0].toUpperCase()}</span>
            <span className="w-3 h-3 rounded-full bg-apex-emerald border-2 border-apex-black absolute bottom-0 right-0 animate-pulse shadow-[0_0_6px_var(--apex-emerald)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[0.52rem] font-bold text-apex-muted tracking-[2px] uppercase">Identidad Registrada</span>
            <h2 className="font-ui text-[1.2rem] font-extrabold text-apex-text leading-tight">{username}</h2>
            <span className="text-[0.62rem] text-apex-violet font-code font-bold mt-0.5">
              Rango: {phases.filter(p => level >= p.reqLvl).slice(-1)[0]?.badge || 'Iniciado'}
            </span>
          </div>
        </div>

        {/* Level Stats Bar */}
        <div className="flex flex-col gap-1.5 md:items-end justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[0.58rem] font-bold text-apex-muted tracking-[2px] uppercase">Progreso Global</span>
            <span className="text-[0.7rem] font-bold text-apex-violet border border-apex-violet/20 bg-apex-violet/5 px-2 py-0.5 rounded">NVL {level}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48 h-2 bg-white/[0.04] rounded-full overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-apex-violet rounded-full shadow-[0_0_8px_var(--apex-violet)] transition-all duration-500" 
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <span className="text-[0.65rem] font-code text-apex-text font-bold">{xpPct}% XP</span>
          </div>
        </div>
      </div>

      {/* ── Landing view: Category Selection ─────────────────────── */}
      {activeCategory === null ? (
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center flex flex-col gap-1">
            <span className="text-[0.58rem] font-bold text-apex-violet tracking-[3px] uppercase">Selector de Entrenamiento</span>
            <h3 className="font-ui text-[1.4rem] font-black text-apex-text leading-tight">¿Qué deseas practicar hoy?</h3>
            <p className="text-xs text-apex-muted max-w-[450px] mx-auto mt-1">
              Elige tu disciplina. Cada categoría cuenta con su propia ruta de progreso dividida en niveles de dificultad y fases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
            {/* Card 1: Code Mode */}
            <button
              onClick={() => handleSelectCategory('code')}
              className="bg-apex-s2/25 border border-white/[0.04] hover:border-apex-violet/25 hover:shadow-[0_0_20px_var(--apex-glow)] rounded-2xl p-7 flex flex-col items-center gap-4 transition-all duration-300 text-center group transform hover:scale-[1.02]"
            >
              <div className="w-16 h-16 rounded-2xl bg-apex-violet/5 border border-apex-violet/15 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-8 h-8 text-apex-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-ui text-sm font-extrabold text-apex-text group-hover:text-apex-violet transition-colors">Código / Programación</h4>
                <p className="text-[0.72rem] text-apex-muted leading-relaxed">
                  Entrena con sintaxis de código real en Javascript, Python, Go, Java, PHP y CSS. Organizado en 4 fases de dificultad.
                </p>
              </div>
              <span className="text-[0.62rem] font-extrabold text-apex-violet tracking-[2.5px] uppercase mt-2 bg-apex-violet/5 px-3 py-1 rounded-lg border border-apex-violet/10">
                Iniciar Código
              </span>
            </button>

            {/* Card 2: Prose Mode */}
            <button
              onClick={() => handleSelectCategory('prose')}
              className="bg-apex-s2/25 border border-white/[0.04] hover:border-apex-violet/25 hover:shadow-[0_0_20px_var(--apex-glow)] rounded-2xl p-7 flex flex-col items-center gap-4 transition-all duration-300 text-center group transform hover:scale-[1.02]"
            >
              <div className="w-16 h-16 rounded-2xl bg-apex-violet/5 border border-apex-violet/15 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-8 h-8 text-apex-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-ui text-sm font-extrabold text-apex-text group-hover:text-apex-violet transition-colors">Letras / Modo Lectura</h4>
                <p className="text-[0.72rem] text-apex-muted leading-relaxed">
                  Practica textos completos, datos curiosos, citas famosas e historias de lenguajes. Mejora tu velocidad en prosa.
                </p>
              </div>
              <span className="text-[0.62rem] font-extrabold text-apex-violet tracking-[2.5px] uppercase mt-2 bg-apex-violet/5 px-3 py-1 rounded-lg border border-apex-violet/10">
                Iniciar Letras
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Roadmap view: Levels Tree ────────────────────────────── */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleSelectCategory(null)}
              className="flex items-center gap-1.5 text-[0.65rem] font-bold text-apex-muted hover:text-apex-violet transition-colors uppercase tracking-[1.5px]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Modos
            </button>
            <span className="text-[0.65rem] text-apex-dim font-code font-bold uppercase tracking-wider">
              {activeCategory === 'code' ? 'Árbol de Código' : 'Árbol de Letras'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Col: Roadmap nodes */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-[0.58rem] font-bold text-apex-muted tracking-[2px] uppercase">
                {activeCategory === 'code' ? 'Fases de Nivel de Código' : 'Fases de Nivel de Letras'}
              </span>

              <div className="flex flex-col gap-3">
                {phases.map(p => {
                  const isUnlocked = level >= p.reqLvl
                  const isSelected = selectedPhaseId === p.id

                  return (
                    <button
                      key={p.id}
                      onClick={() => isUnlocked && handleSelectPhase(p.id)}
                      disabled={!isUnlocked}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 relative group
                        ${isSelected
                          ? 'bg-apex-violet/10 border-apex-violet/25 shadow-[0_0_12px_var(--apex-glow)]'
                          : isUnlocked
                          ? 'bg-apex-s2/20 border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08] cursor-pointer'
                          : 'bg-apex-s2/5 border-white/[0.02] opacity-40 cursor-not-allowed'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center font-code text-xs font-bold
                          ${isSelected
                            ? 'bg-apex-violet/25 border-apex-violet text-apex-violet'
                            : isUnlocked
                            ? 'bg-white/[0.04] border-white/[0.1] text-apex-text'
                            : 'bg-transparent border-white/[0.05] text-apex-dim'}`}>
                          {p.id}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-apex-text leading-tight group-hover:text-apex-violet transition-colors">{p.title}</span>
                          <span className="text-[0.62rem] text-apex-muted font-medium mt-0.5">Mínimo Lvl {p.reqLvl}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isUnlocked ? (
                          <span className="text-xs text-apex-emerald font-bold font-code opacity-85">Desbloqueado</span>
                        ) : (
                          <span className="text-xs text-apex-amber font-bold font-code flex items-center gap-1">
                            🔒 Lvl {p.reqLvl}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Col: Active Phase Detail Card */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-[0.58rem] font-bold text-apex-muted tracking-[2px] uppercase">Fase Seleccionada</span>

              <div className="flex-1 flex flex-col justify-between bg-apex-s2/25 border border-white/[0.04] backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden min-h-[220px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-apex-glow opacity-15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col gap-3.5 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-apex-violet shadow-[0_0_6px_var(--apex-violet)]" />
                    <span className="text-[0.68rem] font-extrabold text-apex-violet tracking-[1px] uppercase font-code">
                      Fase {activePhase.id} · {activeCategory === 'code' ? 'Código' : 'Letras'}
                    </span>
                  </div>
                  <h3 className="font-ui text-sm font-bold text-apex-text leading-tight">{activePhase.title}</h3>
                  <p className="text-[0.72rem] text-apex-muted leading-relaxed">{activePhase.desc}</p>

                  {/* Language Selector for Code category */}
                  {activeCategory === 'code' && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-[0.55rem] font-bold text-apex-muted tracking-[1.5px] uppercase">Lenguaje de Preferencia</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {availableLangs.map(lang => (
                          <button
                            key={lang}
                            onClick={() => {
                              playKeySound('digital', false)
                              setSelectedLang(lang)
                            }}
                            className={`px-2 py-0.5 rounded text-[0.62rem] font-bold border transition-all duration-200 uppercase font-code
                              ${selectedLang === lang
                                ? 'bg-apex-violet/10 text-apex-violet border-apex-violet/20 shadow-[0_0_6px_var(--apex-glow)]'
                                : 'bg-transparent border-transparent text-apex-muted hover:text-apex-text hover:bg-white/[0.02]'}`}
                          >
                            {lang === 'all' ? 'Todos' : lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview recommended card */}
                  {preview && (
                    <div className="border-t border-white/[0.04] pt-3 mt-1 flex flex-col gap-1.5">
                      <span className="text-[0.55rem] font-bold text-apex-dim tracking-[1px] uppercase">Próximo Reto Recomendado</span>
                      <div className="bg-apex-black/40 border border-white/[0.03] rounded-lg p-2.5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[0.68rem] font-bold text-apex-text leading-tight">{preview.title}</span>
                          <span className="text-[0.58rem] text-apex-muted font-code mt-0.5">{preview.lang}</span>
                        </div>
                        <span className="text-xs">{activeCategory === 'code' ? '💻' : '✍️'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 z-10">
                  {isSelectedLocked || !preview ? (
                    <div className="w-full py-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-center gap-2 text-[0.75rem] font-bold text-apex-muted select-none">
                      {isSelectedLocked ? `🔒 Nivel ${activePhase.reqLvl} Requerido` : 'Ningún fragmento'}
                    </div>
                  ) : (
                    <button
                      onClick={handleStart}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase
                                 bg-apex-violet/10 text-apex-violet border border-apex-violet/25 hover:bg-apex-violet/20 hover:border-apex-violet/40 hover:shadow-[0_0_15px_var(--apex-glow-strong)]
                                 transition-all duration-300 transform active:scale-[0.98] group"
                    >
                      <span>Iniciar Entrenamiento</span>
                      <svg className="w-4 h-4 text-apex-violet group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[0.62rem] text-apex-muted font-code mt-2">
        Al completar entrenamientos en el simulador, ganarás **XP** para subir de nivel y desbloquear las siguientes fases.
      </div>
    </div>
  )
}
