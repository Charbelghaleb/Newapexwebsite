/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        void: '#0A0A0F',
        steel: '#12121E',
        panel: '#161625',
        plasma: '#00E5FF',
        fire: '#FF6B00',
        'fire-hot': '#FFAA00',
        text: '#E0E0EC',
        'text-dim': '#6A6A8A',
        border: '#252540',
      },
    },
  },
  plugins: [],
}
