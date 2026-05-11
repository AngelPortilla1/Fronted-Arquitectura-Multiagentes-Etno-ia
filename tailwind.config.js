/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agro-green': '#2D5A27',     
        'agro-light': '#E9F0E6',     
        'agro-earth': '#593D2B',     
        'agro-warm': '#E58C05',      
        'agro-bg': '#F8F7F4',        
      },
      boxShadow: {
        'solid': '4px 4px 0px 0px rgba(45, 90, 39, 0.2)', 
      }
    },
  },
  plugins: [],
}