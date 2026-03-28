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
        brand: {
          dark: '#0A0A0B',
          surface: '#121214',
          surfaceHover: '#1A1A1E',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#FAFAFA',
          muted: '#A1A1AA',
        },
        wine: {
          50: '#fdf2f2',
          500: '#9c1b1e',
          600: '#8b0000',
          700: '#7a0f12',
          900: '#2d0a0c'
        },
        charcoal: '#0A0A0B',
        gold: '#D4AF37',
        emerald: {
          DEFAULT: '#10B981',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        ruby: '#E0115F',
        slate: {
          ...require('tailwindcss/colors').slate,
          950: '#020617',
        },
        'dark-grey': {
          '100': '#1C1C1E',
          '300': '#2C2C2E',
          '500': '#3A3A3C',
          '700': '#48484A',
          '900': '#1C1C1E'
        },
        black: '#000000'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-dark': 'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%)',
        'mesh-emerald': 'radial-gradient(at 40% 20%, hsla(160,100%,50%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(200,100%,56%,0.15) 0px, transparent 50%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '.8', filter: 'brightness(1.5)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
