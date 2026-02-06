/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // These map the Tailwind classes (e.g., bg-surface) to your CSS variables
        background: "var(--background)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)", // Added this one
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
      },
    },
  },
  plugins: [],
};