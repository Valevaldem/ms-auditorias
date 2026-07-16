/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#A8842B", light: "#C9A84C", faint: "#F5EDD6" },
        ms:   { dark: "#1A1A1A", mid: "#6B6B6B", light: "#D9D9D5", bg: "#F3F3F1" },
      },
      fontFamily: { sans: ["var(--font-poppins)", "sans-serif"] },
    },
  },
  plugins: [],
}
