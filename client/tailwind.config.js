/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#CC0000',
        'primary-dark': '#990000',
        secondary: '#003366',
        'secondary-dark': '#002244',
        accent: '#FFD700',
        ice: '#E8F4F8',
        'ice-white': '#F5F9FC',
        boards: '#2C1810',
        surface: '#1A1A2E',
        'surface-light': '#25253E',
        background: '#0F0F1E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0C0',
        'goal-light': '#FF0000',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        scoreboard: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
