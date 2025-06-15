/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a192f',
        secondary: '#64ffda',
        tertiary: '#112240',
        navy: {
          light: '#233554',
          DEFAULT: '#0a192f',
          dark: '#020c1b',
        },
        slate: {
          light: '#ccd6f6',
          DEFAULT: '#8892b0',
          dark: '#495670',
        },
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(100, 255, 218, 0.6), 0 0 25px rgba(100, 255, 218, 0.4)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.8), 0 0 50px rgba(100, 255, 218, 0.5)'
          },
        },
      },
      screens: {
        'xs': '480px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      }
    },
  },
  plugins: [],
} 