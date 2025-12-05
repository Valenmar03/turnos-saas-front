/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Outfit: ["Outfit"]
      },
      colors: {
        orchid: {
            '50': '#fcf5fe',
            '100': '#f9ebfc',
            '200': '#f2d5f9',
            '300': '#eab4f3',
            '400': '#d974e7',
            '500': '#cc59dc',
            '600': '#b23abf',
            '700': '#952d9e',
            '800': '#7c2682',
            '900': '#68246b',
            '950': '#430c46',
        },
        'jordy-blue': {
            '50': '#f1f6fd',
            '100': '#dfecfa',
            '200': '#c7def6',
            '300': '#a0c9f0',
            '400': '#78aee8',
            '500': '#528ddf',
            '600': '#3d71d3',
            '700': '#345ec1',
            '800': '#304d9d',
            '900': '#2b437d',
            '950': '#1e2b4d',
        },


      }
    },
  },
  plugins: [],
};


