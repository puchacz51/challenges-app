/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'label-up': 'up .5s linear forward  ',
      },
      keyframes: {
        up: {
          0: { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(3rem)' },
        },
      },
    },
  },
  plugins: [],
};
