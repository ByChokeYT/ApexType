/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'apex-black':   'var(--apex-black)',
        'apex-surface': 'var(--apex-surface)',
        'apex-s2':      'var(--apex-s2)',
        'apex-s3':      'var(--apex-s3)',
        'apex-text':    'var(--apex-text)',
        'apex-muted':   'var(--apex-muted)',
        'apex-dim':     'var(--apex-dim)',
        'apex-violet':  'var(--apex-violet)',
        'apex-emerald': 'var(--apex-emerald)',
        'apex-amber':   'var(--apex-amber)',
        'apex-glow':    'var(--apex-glow)',
      },
      fontFamily: {
        ui:   ['Outfit', 'system-ui', 'sans-serif'],
        code: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.06)',
      },
      animation: {
        'caret-blink': 'caret-blink 1.1s ease infinite',
        'fade-up':     'fade-up 0.35s ease',
        'level-pop':   'level-pop 2s ease forwards',
      },
      keyframes: {
        'caret-blink': {
          '0%, 45%':   { opacity: '1' },
          '55%, 100%': { opacity: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'level-pop': {
          '0%':   { opacity: '0', transform: 'translate(-50%, -50%) scale(0.9)' },
          '15%':  { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          '80%':  { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
