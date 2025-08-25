/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#072679",
        primaryHover: "#050f48",
        secondary: "#42ADF5",
        secondaryBtn: "#42ADF5",
        secondaryBtnHover: "#2C8ED1",
        lightBg: "#F1F2F7",
        heading: "#000000",
        body: "#36516C"
      },
      borderRadius: { xl: "1rem" },
      boxShadow: { soft: "0 6px 24px rgba(0,0,0,0.06)" }
    },
  },
  plugins: [],
};
