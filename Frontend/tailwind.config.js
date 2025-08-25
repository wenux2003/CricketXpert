/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#072679",       // dark navy
        secondary: "#42ADF5",     // sky blue
        secondaryBtn: "#D88717",  // orange-brown
        lightBg: "#F1F2F7",       // light gray
        body: "#36516C",           // steel blue
        heading: "#000000",        // black
        secondaryBtnHover: "#B37211",
        primaryHover: "#2C8ED1",
      },
    },
  },
  plugins: [],
};
