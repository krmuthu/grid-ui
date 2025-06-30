const { createTheme } = require('fun-tailwindcss-ui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./public/index.html",
    // Include the UI library components,
    "node_modules/fun-tailwindcss-ui/dist/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    createTheme({
      colors: {
        primary: '#0066ff',
        secondary: '#ff00ff',
        blue: {
          50: '#ff00ff',
          100: '#ff0000',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
      },
      borderRadius: {
        md: '0.4rem',
      }
    }),
  ],
}