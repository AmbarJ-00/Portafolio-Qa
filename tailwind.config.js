/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Light Mode Semantic Tokens ─────────────────────────
        surface: 'var(--bg-global)',
        card: 'var(--bg-card)',
        foreground: 'var(--color-text)',
        border: 'var(--color-border)',
        primary: 'var(--color-button)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',

        // ─── Light Mode Named Palette (QA Portfolio) ─────────────
        burlywood: {
          DEFAULT: '#D68880',
          light: '#E5ABA5',
          dark: '#A56560',
        },
        yankees: {
          DEFAULT: '#182A3A',
          light: '#24415A',
          dark: '#0F1E2A',
        },
        deepspace: {
          DEFAULT: '#425B6F',
          light: '#597588',
          dark: '#2E4254',
        },
        darktan: {
          DEFAULT: '#A08348',
          light: '#C4A461',
          dark: '#7A6430',
        },
        smoke: {
          DEFAULT: '#7A7E74',
          light: '#9EA29A',
          dark: '#565950',
        },

        // ─── Dark Mode Named Palette (Royal Purple) ───────────────
        royalpurple: {
          DEFAULT: '#4F3179',
          light: '#6A4B9E',
          dark: '#3B2358',
        },
        royaldark: {
          DEFAULT: '#231537',
          light: '#341F50',
          dark: '#16102B',
        },
        darkgold: {
          DEFAULT: '#966D33',
          light: '#B5884A',
          dark: '#725027',
        },
        brightgold: {
          DEFAULT: '#CAA46E',
          light: '#DBBF90',
          dark: '#A07D4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'spin-slow': 'spin 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px var(--color-button)' },
          '50%': { boxShadow: '0 0 20px var(--color-button)' },
        }
      },
    },
  },
  plugins: [],
}
