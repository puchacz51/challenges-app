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
        stepUp: 'up .4s linear forward ',
      },
      keyframes: {
        up: {
          0: { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(3rem)' },
        },
        slideUp: {
          0: { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(3rem)' },
        },
      },
    },
  },

  plugins: [],
  darkMode: 'class',
};
