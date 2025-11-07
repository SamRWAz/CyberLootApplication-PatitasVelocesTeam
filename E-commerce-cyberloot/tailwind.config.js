/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cyber-dark': '#1D1D1B',
        'cyber-gray': '#2a2a2a',
        'cyber-light': '#d1d5db',
        'cyber-blue': '#65BEE3',
        'cyber-purple': '#9D9DCC',
      }
    },
  },
  plugins: [],
}
