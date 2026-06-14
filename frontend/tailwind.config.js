/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        'cafe-bg-deep':    'var(--color-bg-deep)',
        'cafe-bg-card':    'var(--color-bg-card)',
        'cafe-bg-surface': 'var(--color-bg-surface)',
        'cafe-bg-input':   'var(--color-bg-input)',
        'cafe-bg-hover':   'var(--color-bg-hover)',

        /* Green accents */
        'cafe-green-dark':  'var(--color-green-dark)',
        'cafe-green-mid':   'var(--color-green-mid)',
        'cafe-green-light': 'var(--color-green-light)',
        'cafe-green-pale':  'var(--color-green-pale)',

        /* Beige / Gold (primary brand) */
        'cafe-beige-dark':  'var(--color-beige-dark)',
        'cafe-beige-mid':   'var(--color-beige-mid)',
        'cafe-beige-warm':  'var(--color-beige-warm)',
        'cafe-beige-light': 'var(--color-beige-light)',
        'cafe-beige-pale':  'var(--color-beige-pale)',

        /* Borders */
        'cafe-border':       'var(--color-border)',
        'cafe-border-light': 'var(--color-border-light)',

        /* Text */
        'cafe-text-primary':   'var(--color-text-primary)',
        'cafe-text-secondary': 'var(--color-text-secondary)',
        'cafe-text-muted':     'var(--color-text-muted)',

        /* Semantic */
        'cafe-danger':  'var(--color-danger)',
        'cafe-warning': 'var(--color-warning)',
        'cafe-success': 'var(--color-success)',
        'cafe-info':    'var(--color-info)',

        /* Legacy aliases for backwards compatibility */
        'cafe-bg-dark': 'var(--color-bg-deep)',
        'cafe-pos-bg':  'var(--color-bg-deep)',
      },
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"',  'serif'],
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
        'xl4': '1.5rem',
      },
      backgroundImage: {
        'gradient-gold':  'linear-gradient(135deg, var(--color-beige-warm) 0%, var(--color-beige-mid) 100%)',
        'gradient-green': 'linear-gradient(135deg, var(--color-green-mid) 0%, var(--color-green-dark) 100%)',
        'gradient-card':  'linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg-surface) 100%)',
      },
      boxShadow: {
        'glow-gold':  '0 0 20px -4px rgba(201, 151, 58, 0.30)',
        'glow-green': '0 0 20px -4px rgba(58, 140, 94, 0.30)',
        'card-lift':  '0 8px 32px rgba(0,0,0,0.35)',
        'deep':       '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'float':      'floatY 3.5s ease-in-out infinite',
        'kds-in':     'kdsTicketIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
