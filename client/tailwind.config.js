/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ninja: {
          red: '#BE2E3E',
          black: '#222222',
          yellow: '#FFF3CD',
          brown: '#856404',
          grey: '#F2F2F2',
          card_yellow: '#FBB03B', // A vibrant yellow for the middle card
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
