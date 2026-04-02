import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0D0D0D',
          surface: '#141414',
          elevated: '#1A1A1A',
        },
        border: {
          DEFAULT: '#2A2A2A',
          subtle: '#1F1F1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#888888',
          muted: '#555555',
        },
        accent: {
          DEFAULT: '#FFFFFF',
          dim: '#E0E0E0',
        },
        score: {
          high: '#22C55E',
          mid: '#EAB308',
          low: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        ng: '2px',
        sm: '4px',
        DEFAULT: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [],
}

export default config
