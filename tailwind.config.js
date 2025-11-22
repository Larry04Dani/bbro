/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bbro-element-dark': '#241d16', 
        'bbro-element-light': '#C99334', 
        'bbro-foreground': '#4b4237', 
        'bbro-background': '#F7F5E4', 
      },
      fontFamily: {
        // Ecco la tua lista esatta:
        sans: [
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
};