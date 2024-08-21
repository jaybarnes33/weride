/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orangeFade: "#FEF1EE",
        primary: "#FF5733",
      },
    },
  },
  plugins: [],
};
