/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#072679",       // dark navy
        secondary: "#42ADF5",     // sky blue
        heading: "#000000",       // black
        body: "#36516C",          // steel blue
        lightBg: "#F1F2F7",      // light gray
        buttonHover: "#2C8ED1",
        secondaryBtn: "#D88717",
      },
    },
  },
  plugins: [],
};
