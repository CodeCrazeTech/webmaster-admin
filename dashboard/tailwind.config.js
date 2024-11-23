/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor:{
        'main-bg': '#F7F8FA',
        'div-bg': '#FFFFFF',
        'dark-main-bg': '#1C2B3E',
        'dark-div-bg': '#172437',
      }
    },
  },
  plugins: [],
}