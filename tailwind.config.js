/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'apex-black':   '#000000',
        'apex-surface': '#0d0d0d',
        'apex-s2':      '#141414',
        'apex-s3':      '#1c1c1c',
        'apex-text':    '#e4e4e7',
        'apex-muted':   '#52525b',
        'apex-dim':     '#27272a',
        'apex-violet':  '#a78bfa',
        'apex-emerald': '#6ee7b7',
        'apex-amber':   '#fbbf24',
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
