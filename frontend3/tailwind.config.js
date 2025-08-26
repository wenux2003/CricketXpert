/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this covers TestTailwind.jsx
  ],
  theme: {
    extend: {
      colors: {
        primary: '#072679',    // Dark navy
        secondary: '#42ADF5',  // Sky blue
        accent: '#D88717',     // Orange-brown
        bgLight: '#F1F2F7',    // Light gray
        textDark: '#000000',   // Black
        textSoft: '#36516C',   // Steel blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};