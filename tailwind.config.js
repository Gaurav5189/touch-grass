/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f8faf6',
          100: '#eaf2e8',
          200: '#d6e6d1',
          300: '#b8d4b3',
          400: '#96bc91',
          500: '#78a375',
          600: '#5e8460',
          700: '#4b6b4e',
          800: '#3f5742',
          900: '#1b5e20',
        },
        earth: {
          50: '#f7f5f0',
          900: '#3e2723',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
