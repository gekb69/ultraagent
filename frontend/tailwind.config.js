/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        g: { 50:'#f0fdf4', 400:'#4ade80', 500:'#22c55e' },
        cyan: { 400:'#22d3ee', 500:'#06b6d4' },
        violet: { 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed' },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          hover: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      backgroundImage: {
        'grad-green': 'linear-gradient(135deg,#00ff87,#00d4aa)',
        'grad-blue':  'linear-gradient(135deg,#00c6ff,#0072ff)',
        'grad-violet':'linear-gradient(135deg,#a78bfa,#6d28d9)',
        'grad-multi': 'linear-gradient(135deg,#00ff87 0%,#00c6ff 50%,#a78bfa 100%)',
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], mono: ['JetBrains Mono','monospace'] },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'slide-up':   'slideUp .35s ease',
        'slide-in':   'slideIn .3s ease',
      },
      keyframes: {
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-8px)' } },
        glow:    { '0%':{ opacity:.6 }, '100%':{ opacity:1 } },
        slideUp: { from:{ opacity:0, transform:'translateY(12px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideIn: { from:{ opacity:0, transform:'translateX(-10px)' }, to:{ opacity:1, transform:'translateX(0)' } },
      },
      boxShadow: {
        'neon-g': '0 0 20px rgba(0,255,135,.25), 0 0 60px rgba(0,255,135,.1)',
        'neon-b': '0 0 20px rgba(0,198,255,.25), 0 0 60px rgba(0,198,255,.1)',
        'neon-v': '0 0 20px rgba(167,139,250,.25), 0 0 60px rgba(167,139,250,.1)',
        'card':   '0 4px 24px rgba(0,0,0,.4)',
        'modal':  '0 24px 80px rgba(0,0,0,.6)',
      }
    }
  },
  plugins: []
}
