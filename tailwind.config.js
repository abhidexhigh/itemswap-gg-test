/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Define a custom utility for auto-filling columns
        "auto-fill-minmax-64": "repeat(auto-fill, minmax(64px, 1fr))",
      },
      transitionProperty: {
        height: "height, max-height, opacity, visibility",
      },
      maxHeight: {
        expanded: "3000px", // Customize this value based on your content size
      },
    },
  },
  plugins: [require("daisyui")],
};
