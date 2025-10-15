import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        foreground: '#E6E8F0',
        primary: '#6E56CF',
        muted: '#111827',
        card: '#0F1629'
      }
    }
  },
  plugins: []
} satisfies Config


