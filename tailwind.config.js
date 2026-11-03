/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15803d',
          dark: '#14532d',
          light: '#ecfdf5',
          hover: '#166534',
          subtle: '#dcfce7',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        dairy: {
          green: '#107c41',
          gold: '#d97706',
          blue: '#0284c7',
          dark: '#0f172a'
        }
      },
      borderRadius: {
        lg: '16px',
        md: '10px',
        sm: '6px'
      }
    },
  },
  plugins: [],
};
