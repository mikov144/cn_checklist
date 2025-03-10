// tailwind.config.js

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synth: {
          primary: '#FF007F', // Hot pink
          secondary: '#00FFFF', // Cyan
          background: '#1A1A2E', // Dark blue
          accent: '#FF6F61', // Coral
          text: '#FFFFFF', // White
          glow: '#FF00FF', // Magenta
        },
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'], // Retro pixel font
        neon: ['"Teko"', 'sans-serif'], // Neon-style font
      },
    },
  },
  plugins: [],
}