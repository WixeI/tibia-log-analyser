/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.amber,
        secondary: colors.red,
        neutral: colors.stone
      },
      backgroundImage: {
        "stone-pattern": "url('/stone-pattern.png')"
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.9)"
      }
    }
  },
  variants: {
    scrollbar: ["rounded"]
  },
  plugins: ["prettier-plugin-tailwindcss", require("tailwind-scrollbar")]
};
