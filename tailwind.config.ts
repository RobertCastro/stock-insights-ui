import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        upgrade: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
        downgrade: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        neutral: {
          light: '#f3f4f6',
          DEFAULT: '#9ca3af',
          dark: '#4b5563',
        },
        // Colores para acciones específicas
        action: {
          upgraded: '#10b981',
          downgraded: '#ef4444',
          maintained: '#6366f1',
          initiated: '#f59e0b',
          reiterated: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
