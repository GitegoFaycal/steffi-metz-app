export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },

      colors: {
        olive: '#4a6741',
        'olive-dark': '#2d3f1e',
        bordeaux: '#8c1c3a',
        cream: '#faf7f2',
        linen: '#f0ebe0',
        ink: '#1e1a14',
      },

      keyframes: {
        marquee: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
      },

      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },

  plugins: [],
};