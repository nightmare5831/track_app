/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Use 'class' strategy instead of 'media' to fix the dark mode error
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
