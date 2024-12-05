const withMT = require("@material-tailwind/react/utils/withMT");
// /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'signup-background': "url('/src/assets/signup_background.png')",
      },
      colors: {
        'navlink-active-color': "#f0f7ff",
        'btn-color': "#4678ee",
        'background': "#f0f0f0",
        'label-color': "#4b5563"
      },
      fontFamily: {
        "regular": ["Roboto", "sans-serif"],
      }
    },
  },
  plugins: [
  ]
}

