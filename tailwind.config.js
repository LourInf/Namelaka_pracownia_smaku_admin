/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-bg": "url('/background.jpg')",
      },
      colors: {
        // "creamy-beige": "#F5F0E6",
        // "light-grey": "#E8E8E8",
        "custom-green": "#D4E2D4",
        "custom-dark-green": "#B4C0B4",
        // "custom-background-green": "#f0fff4",
        gold: "#BFA760",
        // "dark-grey": "#424242",
        // "soft-grey": "#C4C4C4",
        "custom-pink": "#fbe9e5",
        "custom-magenta": "#a22f6b",
        "custom-dark-magenta": "#812555",
      },
    },
  },
  plugins: [],
};
