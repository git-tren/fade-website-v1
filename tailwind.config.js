/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D0D0D",      // Preto Profundo
        accent: "#C1BBAE",       // Variação do bege pra dar acento/highlight
        background: "#0D0D0D",
        surface: "#1A1A1A",
        textMain: "#FAF6DF"      // Bege Suave
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Inter como Gilroy substituta
        serif: ['Playfair Display', 'serif'], // Dramatic Italic Serif
        mono: ['Space Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
