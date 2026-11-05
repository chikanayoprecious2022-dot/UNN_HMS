/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#008080',
          dark: '#006666',
          light: '#e0f2f1',
          bg: '#ebf1f1',
        },
      },
    },
  },
  plugins: [],
};

