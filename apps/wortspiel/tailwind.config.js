/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fff1dc',
        paper: '#fffafc',
        ink: '#24324a',
        notebook: '#6a7294',
        sun: '#ffcd5c',
        apricot: '#ff9e68',
        blush: '#ff5d8f',
        leaf: '#57b971',
        sky: '#7ab6ff',
        bubble: '#8d7cff',
        mint: '#90ead8',
        peach: '#ffd7b8',
        splash: '#5d5fef',
        line: '#f1d8ea',
      },
      boxShadow: {
        card: '0 22px 48px rgba(93, 95, 239, 0.12)',
        soft: '0 12px 28px rgba(255, 93, 143, 0.12)',
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
