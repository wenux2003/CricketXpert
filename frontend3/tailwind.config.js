/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        'dark-navy': '#072679',
        'sky-blue': '#42ADF5',
        'steel-blue': '#36516C',
        'orange-brown': '#D88717',
        'light-gray': '#F1F2F7',
      },
    },
  },
  plugins: [],
};
