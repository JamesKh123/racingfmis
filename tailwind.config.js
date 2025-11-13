/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans', 'system-ui', 'sans-serif'],
        'khmer': ['Noto Sans Khmer', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 1s infinite',
        'pulse-car': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
