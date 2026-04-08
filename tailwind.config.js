/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'uber-black': '#000000',
        'uber-white': '#ffffff',
        'body-gray': '#4b4b4b',
        'muted-gray': '#afafaf',
        'chip-gray': '#efefef',
        'hover-gray': '#e2e2e2',
      },
      borderRadius: {
        'pill': '999px',
      },
      boxShadow: {
        'card': 'rgba(0,0,0,0.12) 0px 4px 16px 0px',
        'card-md': 'rgba(0,0,0,0.16) 0px 4px 16px 0px',
        'float': 'rgba(0,0,0,0.16) 0px 2px 8px 0px',
      },
    },
  },
  plugins: [],
}
