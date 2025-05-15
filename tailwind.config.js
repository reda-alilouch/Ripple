/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4545",
      },
      width: {
        34: "8.5rem",
        22: "5.5rem",
        "1/20": "5%",
      },
      boxShadow: {
        customdark :  "0px 1px 3px 0px rgba(255,255,255,0.75)",
      }
    },
  },
  plugins: [],
};
