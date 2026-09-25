/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#142521',
        muted: '#65766f',
        green: '#075c49',
        lime: '#d9f67e',
        cream: '#f8f8f2',
        line: '#e1e8df',
        orange: '#f2ab64',
      },
      fontFamily: {
        sans: ['DM Sans', 'Arial', 'sans-serif'],
        display: ['Manrope', 'Arial', 'sans-serif'],
      },
      screens: {
        tablet: { max: '850px' },
        phone: { max: '550px' },
      },
    },
  },
};
