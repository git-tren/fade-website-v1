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
        sans: ['Prompt', 'sans-serif'],
        headline: ['Commissioner', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      keyframes: {
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      },
      animation: {
        'marquee-right': 'marquee-right 80s linear infinite',
      }
    },
  },
  plugins: [],
}
