const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Primary accent — refined periwinkle. Also remaps `indigo`, so any
        // legacy `indigo-*` utility inherits the same professional accent.
        brand: {
          50: '#f1f0fe',
          100: '#e7e5fd',
          200: '#d1cdfb',
          300: '#b0a9f8',
          400: '#9fa3fc',
          500: '#7065f0',
          600: '#5b50e0',
          700: '#4a3fc7',
          800: '#3d35a3',
          900: '#342e82',
          950: '#201c4f',
        },
        indigo: {
          50: '#f1f0fe',
          100: '#e7e5fd',
          200: '#d1cdfb',
          300: '#b0a9f8',
          400: '#9fa3fc',
          500: '#7065f0',
          600: '#5b50e0',
          700: '#4a3fc7',
          800: '#3d35a3',
          900: '#342e82',
          950: '#201c4f',
        },
        // Secondary — muted violet, kept close to the accent so gradients read
        // as one restrained family rather than a rainbow.
        purple: {
          50: '#f5f4ff',
          100: '#ecebfe',
          200: '#dbd9fd',
          300: '#c0bbfa',
          400: '#a396f5',
          500: '#8a76ee',
          600: '#7a5ee3',
          700: '#6849c9',
          800: '#563ea3',
          900: '#483684',
          950: '#2b1f50',
        },
        // True neutral greys for light surfaces.
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0e0e11',
        },
        // Dark surfaces tuned to a deep, editorial canvas.
        slate: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#2a2a2e',
          800: '#1c1c1f',
          900: '#121214',
          950: '#0b0b0d',
        },
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        md: '0 2px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 8px 24px -8px rgb(0 0 0 / 0.10), 0 3px 8px -4px rgb(0 0 0 / 0.05)',
        xl: '0 16px 40px -12px rgb(0 0 0 / 0.14)',
        '2xl': '0 24px 60px -16px rgb(0 0 0 / 0.18)',
        'inner': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
