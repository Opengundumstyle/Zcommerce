/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       gridTemplateColumns:{
          fluid:'repeat(auto-fit,minmax(14rem,1fr))',
       },
       fontFamily:{
         lobster:['var(--font-lobster)'],
         roboto:['var(--font-roboto)'],
       },
       colors: {
        midnight: {
          900: '#013D61ff',
          600: '#11527Cff',
        },
        night: {
          600: '#001939',
          900:'#002d4d',
        },
      },
    },
  },
  plugins: [require("daisyui")], 
  daisyui:{
    themes:['light','dark']
  }
}

