/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#121212',
        onSurface: '#1D1D1D',
      }
    },
  },
  plugins: [],
}

