import { useState } from 'react'
import { playKeySound } from '../../utils/sound.js'

export default function LoginView({ onLogin }) {
  const [name, setName] = useState('')

  const handleInput = (e) => {
    setName(e.target.value)
    // Play keystroke sound for extra immersion!
    playKeySound('mech', false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = name.trim() || 'ByChokeYT'
    playKeySound('digital', false)
    onLogin(username)
  }

  return (
    <div className="w-full max-w-[450px] mx-auto my-auto flex flex-col gap-6 animate-fade-up bg-apex-s2/25 border border-white/[0.04] backdrop-blur-md rounded-2xl p-8 shadow-[0_12px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Background glow flare */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-apex-glow opacity-30 rounded-full blur-2xl pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="flex items-center gap-1.5 pb-4 border-b border-white/[0.04]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.3)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2.5 text-[0.62rem] text-apex-muted font-code font-bold tracking-widest uppercase">
          terminal — autenticación
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <span className="font-code text-[0.72rem] text-apex-violet font-semibold tracking-wider">
            $ apex-type --initialize-session
          </span>
          <p className="text-xs text-apex-muted leading-relaxed">
            Ingresa tu alias de desarrollador para iniciar el simulador de mecanografía y cargar el Hub de Progreso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Custom Input */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[0.58rem] font-bold text-apex-muted tracking-[2px] uppercase">
              Developer Nickname
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-apex-violet font-code text-xs font-bold font-mono">
                &gt;_
              </span>
              <input
                type="text"
                value={name}
                onChange={handleInput}
                placeholder="ByChokeYT"
                className="w-full bg-apex-black/40 border border-white/[0.05] focus:border-apex-violet/40 focus:shadow-[0_0_10px_var(--apex-glow)] rounded-xl py-3 pl-9 pr-4 text-sm text-apex-text font-code placeholder-apex-dim transition-all duration-300 outline-none"
                maxLength={18}
                autoFocus
              />
            </div>
          </div>

          {/* Glowing Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase
                       bg-apex-violet/10 text-apex-violet border border-apex-violet/25 hover:bg-apex-violet/20 hover:border-apex-violet/40 hover:shadow-[0_0_15px_var(--apex-glow-strong)]
                       transition-all duration-300 transform active:scale-[0.98] group"
          >
            <span>Inicializar Terminal</span>
            <svg className="w-4 h-4 text-apex-violet group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="text-center text-[0.55rem] text-apex-dim font-code tracking-wide">
        v1.0.0 · CONEXIÓN SEGURA SSL
      </div>
    </div>
  )
}
