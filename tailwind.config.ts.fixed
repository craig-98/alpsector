import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  screens: {
    'xs': '475px',
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Orbitron", "var(--font-inter)", ...fontFamily.sans]
      },
      fontSize: {
        '5.5xl': '3.75rem',
        '6.5xl': '4.5rem',
        '7.5xl': '6rem'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      colors: {
        wine: {
          50: '#fdf2f2',
          500: '#9c1b1e',
          600: '#8b0000',
          700: '#7a0f12',
          900: '#2d0a0c'
        },
        charcoal: '#0f0f23',
        gold: '#D4AF37',
        emerald: '#10B981',
        ruby: '#E0115F',
        slate: '#1e293b',
        'dark-grey': {
          '100': '#f5f5f5',
          '300': '#d1d5db',
          '500': '#6b7280',
          '700': '#374151',
          '900': '#111827'
        },
        black: '#000000'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [],
}

export default config
