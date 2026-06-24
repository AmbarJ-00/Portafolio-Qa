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
        // Brand color palette: Ash Gray, Navy, Electric Blue, Lilac, White, Black
        brand: {
          ash: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0', // Ash Gray light boundary
            300: '#cbd5e1', // Ash Gray base
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          navy: {
            50: '#f0f4f8',
            100: '#d9e2ec',
            200: '#bcccdc',
            300: '#9fb3c8',
            400: '#829ab1',
            500: '#627d98',
            600: '#486581',
            700: '#334e68',
            800: '#102a43', // Deep Navy base
            900: '#091c2c', // Super Dark Navy
            950: '#030d16',
          },
          electric: {
            100: '#e0f7ff',
            300: '#82e1ff',
            500: '#00bfff', // Electric Blue base
            600: '#0099cc',
            700: '#007399',
            800: '#005266',
          },
          lilac: {
            100: '#f3e8ff',
            300: '#d8b4fe',
            500: '#a855f7', // Lilac base
            600: '#9333ea',
            700: '#7e22ce',
            800: '#581c87',
          }
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
        }
      }
    },
  },
  plugins: [],
}
