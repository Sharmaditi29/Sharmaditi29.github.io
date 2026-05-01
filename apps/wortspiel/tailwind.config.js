/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fbf4e8',
        paper: '#fffaf1',
        ink: '#213547',
        notebook: '#6f7d89',
        sun: '#f5c55c',
        apricot: '#f29f6b',
        blush: '#db6b5f',
        leaf: '#7bb26a',
        sky: '#88a8d8',
        line: '#eadbc5',
      },
      boxShadow: {
        card: '0 20px 40px rgba(33, 53, 71, 0.08)',
        soft: '0 10px 24px rgba(33, 53, 71, 0.08)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      backgroundImage: {
        rulebook:
          'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.65)), repeating-linear-gradient(180deg, transparent 0, transparent 34px, rgba(234,219,197,0.65) 34px, rgba(234,219,197,0.65) 35px)',
      },
    },
  },
  plugins: [],
}
