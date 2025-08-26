/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#072679',    // Dark navy for main theme
        secondary: '#42ADF5',  // Sky blue for accents/buttons
        accent: '#D88717',     // Orange-brown for highlights/buttons
        bgLight: '#F1F2F7',    // Light gray for backgrounds
        textDark: '#000000',   // Black for headings
        textSoft: '#36516C',   // Steel blue for body text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};